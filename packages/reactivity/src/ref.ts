import { createDep, type Dep } from "./dep";
import { activeEffect, trackEffect, triggerEffect } from "./effect";
import { toReactive } from "./reactive";

export const ref = <T>(v: T) => {
  return new RefImpl(v, false);
};

class RefImpl<T = any> {
  private _value: T;
  public dep?: Dep = undefined;
  constructor(value: T, readonly __v_isShallow: boolean) {
    this._value = toReactive(value as any);
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(v: T) {
    if (v !== this._value) {
      this._value = v;
      triggerRefValue(this);
    }
  }
}

const trackRefValue = (ref: RefImpl) => {
  if (!ref.dep) {
    ref.dep = createDep(() => (ref.dep = undefined), "ref");
  }

  trackEffect(activeEffect, ref.dep);
};

const triggerRefValue = (ref: RefImpl) => {
  if (ref.dep) {
    triggerEffect(ref.dep);
  }
};

class ObjectRefImpl<
  T extends object = object,
  K extends keyof T = keyof T,
  V extends T[K] = T[K]
> {
  constructor(private obj: T, private key: K) {}

  get value() {
    return this.obj[this.key] as V;
  }
  set value(newValue: V) {
    this.obj[this.key] = newValue;
  }
}
export const toRef = <T extends object>(obj: T, key: keyof T) => {
  return new ObjectRefImpl(obj, key);
};
