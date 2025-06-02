import { isFunction } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import type { Dep } from "./dep";
import { trackRefValue, triggerRefValue } from "./ref";

export type ComputedGetter<T> = (oldValue?: T) => T;
export type ComputedSetter<T> = (newValue: T) => void;

declare const ComputedRefSymbol: unique symbol;

export interface ComputedRef<T = any> extends WritableComputedRef<T> {
  readonly value: T;
  [ComputedRefSymbol]: true;
}

export interface WritableComputedRef<T> {
  value: T;
  readonly effect: ReactiveEffect;
}

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>;
  set: ComputedSetter<T>;
}

export function computed<T>(
  options: WritableComputedOptions<T>
): WritableComputedRef<T>;
export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>;

export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
) {
  let getter: ComputedGetter<T>;
  let setter: ComputedSetter<T>;

  const onlyGetter = isFunction(getterOrOptions);

  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {};
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  const cRef = new ComputedRefImpl(getter, setter, onlyGetter);

  return cRef as WritableComputedRef<T> | ComputedRef<T>;
}

class ComputedRefImpl<T> {
  public effect: ReactiveEffect;
  private _value!: T;
  dep?: Dep;
  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean
  ) {
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => {
        this.effect.fn();
        // triggerRefValue(this);
      }
    );
  }

  get value() {
    if (this.effect.dirty) {
      const newValue = this.effect.run();
      if (newValue !== this._value) {
        this._value = newValue;
        trackRefValue(this);
      }
    }

    return this._value;
  }

  set value(v: T) {
    this._setter(v);
  }
}
