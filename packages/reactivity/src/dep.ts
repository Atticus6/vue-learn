import type { ReactiveEffect } from "./effect";

export type Dep = Map<ReactiveEffect, number> & {
  cleanup: () => void;
  name: string;
};
export const createDep = (cleanup: () => void, name: string): Dep => {
  const dep = new Map() as Dep;
  dep.cleanup = cleanup;
  dep.name = name;

  return dep;
};
