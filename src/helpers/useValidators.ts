export const isEmpty = (fieldValue: string) => {
  return !fieldValue;
};

export const minLength = (length: number) => (fieldValue: string) => {
  return fieldValue?.length < length;
};

export const maxLength = (length: number) => (fieldValue: string) => {
  return fieldValue?.length > length;
};

//Contains the additional symbols:spaces,-,'
export const alphanumericValueForNames = (fieldValue: string) => {
  return !/^[A-z0-9' -]+$/.test(fieldValue);
};

export const alphanumericValue = (fieldValue: string) => {
  return !/^[A-z0-9]+$/.test(fieldValue);
};

export const alphanumericAndPunctuation = (fieldValue: string) => {
  return !/^[-A-z0-9\.?!,;:—‒\[\]\(\)\{\}'"… ]+$/.test(fieldValue);
};

export const alphabeticValue = (fieldValue: string) => {
  return !/^[A-z' -]+$/.test(fieldValue);
};

export const emailFormat = (fieldValue: string) => {
  return !/^[\w\.]+@([\w]+\.)+[\w\.]+$/g.test(fieldValue);
};

export const notImageExtension = (fieldValue: File) =>
  !/^.*(\.jpg|\.png|\.bmp)$/i.test(fieldValue.name);

export const sizeBiggerThan = (value: number) => (fieldValue: File) =>
  fieldValue.size > value;

export const futureDate = (fieldValue: string) => {
  const inputedDate = new Date(fieldValue);
  const now = new Date();
  return inputedDate > now;
};

export const authorFullName = (fieldValue: string) => {
  return !/^[A-z]+ [A-z ]+$/.test(fieldValue);
};
