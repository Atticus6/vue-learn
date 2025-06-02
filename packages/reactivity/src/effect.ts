import type { Dep } from "./dep";

export const effect = (fn: () => any, options?: any) => {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });

  _effect.run();
};

export let activeEffect: ReactiveEffect;

const postRuning = (e: ReactiveEffect) => {
  if (e._depsLength < e.deps.length) {
    for (let i = e._depsLength; i < e.deps.length; i++) {
      const dep = e.deps[i];
      if (dep) {
        clearDepEffect(e, dep);
      }
    }
    e.deps.length = e._depsLength;
  }
};

export class ReactiveEffect {
  active = true;
  _trackId = 0;
  _depsLength = 0;
  deps: Dep[] = [];
  _rounings = 0;
  constructor(public fn: () => any, public scheduler: () => any) {}

  run() {
    if (!this.active) {
      return this.fn();
    }

    const lastEffect = this;
    try {
      activeEffect = this;
      this._rounings++;
      this._trackId++;
      this._depsLength = 0;

      return this.fn();
    } finally {
      postRuning(this);
      this._rounings--;
      activeEffect = lastEffect;
    }
  }
}

const clearDepEffect = (effect: ReactiveEffect, dep: Dep) => {
  const trackId = dep.get(effect);
  if (trackId !== undefined && effect._trackId !== trackId) {
    dep.delete(effect);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
};

export const trackEffect = (effect: ReactiveEffect, dep: Dep) => {
  if (dep.get(effect) !== effect._trackId) {
    dep.set(effect, effect._trackId);
    const old = effect.deps[effect._depsLength];
    if (old !== dep) {
      if (old) {
        clearDepEffect(effect, old);
      }

      effect.deps[effect._depsLength++] = dep;
    } else {
      effect._depsLength++;
    }
  }
};

export const triggerEffect = (dep: Dep) => {
  for (const effect of dep.keys()) {
    if (!effect._rounings) {
      effect.scheduler();
    }
  }
};
