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
