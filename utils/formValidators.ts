export const emailValidator = (val: string) => {
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return val.match(validRegex) ? true : false;
};

export const passwordValidator = (val: string) => {
  return val.length >= 8;
};

export const nameValidator = (val: string) => {
  return val.length >= 3;
};

export const charactersValidator = (min: number, max: number) => {
  return (val: string) => {
    return min <= val.length && val.length <= max;
  };
};

export const numberValidator = (min: number, max: number) => {
  return (val: string) => {
    return min <= Number(val) && Number(val) <= max;
  };
};
