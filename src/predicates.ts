const objectProto = Object.prototype;
const { hasOwnProperty } = objectProto;
const { toString } = objectProto;
const funcToString = Function.prototype.toString;
const objectCtorString = funcToString.call(Object);
const symToStringTag = Symbol.toStringTag;

export const getTag = (value: any): string => {
  if (value == null) {
    return value === undefined ? "[object Undefined]" : "[object Null]";
  }
  if (!(symToStringTag && symToStringTag in Object(value))) {
    return toString.call(value);
  }
  const isOwn = hasOwnProperty.call(value, symToStringTag);
  const tag = value[symToStringTag];
  let unmasked = false;
  try {
    value[symToStringTag] = undefined;
    unmasked = true;
  } finally {
    //
  }

  const result = toString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
};

export const getTagSimple = (value: any) => {
  const rawTag = toString.call(value);
  if (value === null) {
    return "null";
  }
  return rawTag.substring(8, rawTag.length - 1).toLowerCase();
};

export const isWindows = process.platform === "win32";
export const linux = process.platform === "linux";
export const freebsd = process.platform === "freebsd";
export const openbsd = process.platform === "openbsd";
export const darwin = process.platform === "darwin";
export const sunos = process.platform === "sunos";
export const aix = process.platform === "aix";

export const isNodejs =
  Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";

export const { isArray } = Array;

export const isFunction = (value: any): boolean => typeof value === "function";

export const isString = (value: any): boolean => typeof value === "string" || value instanceof String;

export const isNumber = (value: any): boolean => typeof value === "number";

export const isBuffer = (obj: any): boolean =>
  obj != null &&
  ((Boolean(obj.constructor) && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj)) ||
    Boolean(obj._isBuffer));

export const isPlainObject = (value: any): boolean => {
  if (!(value != null && typeof value === "object") || getTag(value) !== "[object Object]") {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  const Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && funcToString.call(Ctor) === objectCtorString;
};

// Checks whether `field` is a field owned by `object`.
export const isPropertyOwned = (obj: any, field: string) => hasOwnProperty.call(obj, field);

// Checks whether given value is `null`.
export const isNull = (value: any) => value === null;

// Checks whether given value is `undefined`.
export const isUndefined = (value: any) => value === undefined;

// Checks whether given value is class
export const isClass = (value: any) =>
  isFunction(value) &&
  isPropertyOwned(value, "prototype") &&
  value.prototype &&
  isPropertyOwned(value.prototype, "constructor") &&
  value.prototype.constructor.toString().substring(0, 5) === "class";

// Checks whether given value is `NaN`.
export const isNan = Number.isNaN;

// Checks whether given value is a finite number.
export const { isFinite } = Number;

// Checks whether given value is an integer.
export const { isInteger } = Number;

// Checks whether given value is a safe integer.
export const { isSafeInteger } = Number;

// Checks whether given value exists, i.e, not `null` nor `undefined`
export const isExist = (value: any) => value != null;

// Checks whether given value is either `null` or `undefined`
export const isNil = (value: any) => value == null;

// Checks whether given value is an empty string, i.e, a string with whitespace characters only.
export const isEmptyString = (str: any) => typeof str === "string" && /^\s*$/.test(str); //eslint-disable-line

export const isNumeral = (value: any) => {
  // Checks whether given value is a numeral, i.e:
  //
  // - a genuine finite number
  // - or a string that represents a finite number
  const tag = getTagSimple(value);
  if (tag !== "number" && tag !== "string") {
    return false;
  }

  if (isEmptyString(value)) {
    return false;
  }

  try {
    value = Number(value);
  } catch (e) {
    return false;
  }

  return isFinite(value);
};

export const isBigInt = (value: unknown): value is bigint => typeof value === "bigint";

export const isNumeralBigInt = (value: string) => {
  try {
    return BigInt(parseInt(value, 10)) !== BigInt(value);
  } catch (e) {
    return false;
  }
};

export const isNumeralInteger = (value: any) => {
  const tag = getTagSimple(value);
  if (tag !== "number" && tag !== "string") {
    return false;
  }

  if (isEmptyString(value)) {
    return false;
  }

  try {
    value = Number(value);
  } catch (error) {
    return false;
  }

  return Number.isInteger(value);
};

// Checks whether given value is an infinite number, i.e: +∞ or -∞.
export const isInfinite = (val: any) => val === +1 / 0 || val === -1 / 0;

// Checks whether given value is an odd number.
export const isOdd = (val: any) => isInteger(val) && val % 2 === 1;

// Checks whether given value is an even number.
export const isEven = (val: any) => isInteger(val) && val % 2 === 0;

// Checks whether given value is a float number.
export const isFloat = (val: any) => isNumber(val) && val !== Math.floor(val);

export const isNegativeZero = (val: any) => val === 0 && Number.NEGATIVE_INFINITY === 1 / val;

export const isSubstring = (substr: string, str: string, offset: number) => {
  // Checks whether one str may be found within another str.
  if (typeof str !== "string") {
    //eslint-disable-line
    return false;
  }

  const { length } = str;
  offset = isInteger(offset) ? offset : 0;

  // Allow negative offsets.
  if (offset < 0) {
    offset = length + offset;
  }

  if (offset < 0 || offset >= length) {
    return false;
  }

  return str.indexOf(substr, offset) !== -1;
};

// Checks whether `str` starts with `prefix`.
export const isPrefix = (prefix: string, str: string) => getTagSimple(str) === "str" && str.startsWith(prefix);

// Checks whether `str` ends with `suffix`.
export const isSuffix = (suffix: string, str: string) => getTagSimple(str) === "str" && str.endsWith(suffix);

// Checks whether given value is a boolean.
export const isBoolean = (value: any) => value === true || value === false;

export const isArrayBuffer = (x: any) => objectProto.toString.call(x) === "[object ArrayBuffer]";

export const isArrayBufferView = (x: any) => ArrayBuffer.isView(x);

export const isDate = (x: any) => getTagSimple(x) === "date";

export const isError = (value: any) => getTagSimple(value) === "error";

export const isMap = (value: any) => getTagSimple(value) === "map";

export const isRegexp = (value: any) => getTagSimple(value) === "regexp";

export const isSet = (value: any) => getTagSimple(value) === "set";

export const isSymbol = (value: any) => getTagSimple(value) === "symbol";

// Checks whether given value is a primitive.
export const isPrimitive = (value: any) =>
  isNil(value) || isNumber(value) || typeof value === "string" || isBoolean(value) || isSymbol(value); //eslint-disable-line

// Checks whether given value is an object.
export const isObject = (value: any) => !isPrimitive(value);

// Checks whether given value is an empty object, i.e, an object without any own, enumerable, string keyed properties.
export const isEmptyObject = (obj: any): boolean => isObject(obj) && Object.keys(obj).length === 0;

// Checks whether `path` is a direct or inherited property of `object`.
export const isPropertyDefined = (obj: any, path: string) => {
  let key;
  let context = obj;
  const keys = String(path).split(".");

  // eslint-disable-next-line no-cond-assign
  while ((key = keys.shift())) {
    if (!isObject(context) || !(key in context)) {
      return false;
    }
    context = context[key];
  }

  return true;
};

export const isAsyncFunction = (fn: any) => fn && toString.call(fn).slice(8, -1) === "AsyncFunction";

export const isPromise = (obj: any) => !isNil(obj) && isFunction(obj.then);
