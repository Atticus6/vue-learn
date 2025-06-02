export const isObject = (value: any) => {
  return typeof value === "object" && value !== null;
};

export const isFunction = (val: unknown): val is Function =>
  typeof val === "function";
