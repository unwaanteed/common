export const noop = () => {};

export const identity = (x: any) => x;

export const truly = () => true;

export const falsely = () => false;

export const arrify = (val: any) => (val === undefined ? [] : !Array.isArray(val) ? [val] : val);
