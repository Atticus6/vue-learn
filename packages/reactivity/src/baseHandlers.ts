import { isObject } from "@vue/shared";
import { ReactiveFlags } from "./constants";
import { reative } from "./reactive";
import { track, trigger } from "./reactEffect";

export const mutableHandler: ProxyHandler<object> = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }

    track(target, key);

    let res = Reflect.get(target, key, receiver);

    if (isObject(res)) {
      res = reative(res);
    }

    return res;
  },
  set(target, key, value, receiver) {
    const oldValue = Reflect.get(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (value !== oldValue) {
      trigger(target, key, oldValue, value);
    }

    return result;
  },
};
