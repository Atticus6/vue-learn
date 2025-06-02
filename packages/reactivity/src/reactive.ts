import { isObject } from "@vue/shared";
import { ReactiveFlags } from "./constants";
import { mutableHandler } from "./baseHandlers";
import { isRef, type RefImpl } from "./ref";

const reactiveMap = new WeakMap();

export const reative = <T extends object>(target: T) => {
  return createReactiveObject(target);
};

const createReactiveObject = <T extends object>(target: T) => {
  if (!isObject(target)) {
    return target;
  }
  if (Reflect.get(target, ReactiveFlags.IS_REACTIVE)) {
    return target;
  }
  const existProxy = reactiveMap.get(target);
  if (existProxy) {
    return existProxy as T;
  }
  const proxy = new Proxy<T>(target, mutableHandler);
  reactiveMap.set(target, proxy);
  return proxy;
};

export const toReactive = <T extends object>(v: T) => {
  return isObject(v) ? reative(v) : v;
};
export const isReactive = (v: any) => {
  if (!isObject(v)) {
    return false;
  }
  return v[ReactiveFlags.IS_REACTIVE];
};
