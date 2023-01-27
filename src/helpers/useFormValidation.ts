import {
  isEmpty,
  minLength,
  alphanumericValueForNames,
  alphanumericValue,
  maxLength,
  alphabeticValue,
  emailFormat,
  alphanumericAndPunctuation,
  futureDate,
  sizeBiggerThan,
  notImageExtension,
  authorFullName,
} from "./useValidators";

export const validate =
  (errors: { [key: string]: boolean }) =>
  <T = string>(
    validators: ((s: T) => boolean)[],
    fieldName: string,
    fieldVa1ue: T
  ) =>
    (errors[fieldName] = validators.some((test) => test(fieldVa1ue)));

export const validatorsName = [
  isEmpty,
  alphabeticValue,
  minLength(3),
  maxLength(30),
];

export const validatorsUsername = [
  isEmpty,
  alphanumericValueForNames,
  minLength(3),
  maxLength(30),
];

export const validatorsPassword = [
  isEmpty,
  alphanumericValue,
  minLength(3),
  maxLength(30),
];

export const validatorsTitle = [
  isEmpty,
  minLength(1),
  maxLength(70),
  alphanumericAndPunctuation,
];

export const validatorsEmail = [emailFormat];

export const validatorsNewAuthor = [
  minLength(7),
  maxLength(61),
  authorFullName,
];

export const validatorsPublicationDate = [isEmpty, futureDate];

export const validatorsUploadImage = [
  notImageExtension,
  sizeBiggerThan(2000000),
];

export const areInputsValid = (errors: { [key: string]: boolean }) =>
  !Object.values(errors).some((error) => error);

export const validatorsAuthorName = [
  isEmpty,
  alphabeticValue,
  minLength(3),
  maxLength(100),
];
