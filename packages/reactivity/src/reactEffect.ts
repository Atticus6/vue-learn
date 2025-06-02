import { createDep, type Dep } from "./dep";
import { activeEffect, trackEffect, triggerEffect } from "./effect";

type KeyToDepMap = Map<any, Dep>;

const targetMap = new WeakMap<object, KeyToDepMap>();

export const track = (target: object, key: string | symbol) => {
  if (!activeEffect) {
    return;
  }

  let depsMap = targetMap.get(target)!;
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(
      key,
      (dep = createDep(() => depsMap.delete(key), key as string))
    );
  }

  trackEffect(activeEffect, dep);
};

export const trigger = (
  target: object,
  key: string | symbol,
  oldValue: any,
  newValue: any
) => {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }

  const dep = depsMap.get(key);
  if (!dep) {
    return;
  }

  triggerEffect(dep);
};
