import { isObject } from "@vue/shared";
import { createDep, type Dep } from "./dep";
import { activeEffect, trackEffect, triggerEffect } from "./effect";
import { isReactive, toReactive } from "./reactive";

export const ref = <T>(v: T) => {
  return new RefImpl(v, false);
};

export class RefImpl<T = any> {
  private _value: T;
  public readonly __v_isRef = true;
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
  public readonly __v_isRef = true;
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

type ToRefsResult<T extends object> = {
  [K in keyof T]: ObjectRefImpl<T, K, T[K]>;
};
export const toRefs = <T extends object>(obj: T) => {
  const target = Object.keys(obj).reduce((pre, cur) => {
    pre[cur] = toRef(obj, cur as keyof T);
    return pre;
  }, {} as any);

  return target as ToRefsResult<T>;
};

export const isRef = (v: object) => {
  return (v as any)["__v_isRef"] as boolean;
};

type ProxyRefs<T extends object> = {
  [K in keyof T]: T[K] extends { value: infer A } ? A : T[K];
};

export const proxyRefs = <T extends object>(obj: T): ProxyRefs<T> => {
  return new Proxy(obj as any, {
    get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
    set(target, key, value, receiver) {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    },
  });
};

export function unref<T>(ref: { value: T }): T {
  return isRef(ref) ? ref.value : (ref as T);
}
