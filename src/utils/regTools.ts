export const EmailRegex: RegExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

export const NumberRegex: RegExp = /^[0-9]+$/;

export const StringRegex: RegExp = /^[A-Za-z ]+$/;

export const DateRegex: RegExp = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

export const PhoneRegex: RegExp = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{1,20})$/;

export const GeneralLangRegex: RegExp = /([\p{L}-]+)/gu;

export const WordRegex: RegExp = /^\D*$/;

export const UppercaseRegex: RegExp = /[A-Z]+/;

export const LowercaseRegex: RegExp = /[a-z]+/;

export const NumberSpecialCharRegex: RegExp = /[^A-Za-z]/g;

export const StepPathRegex: RegExp = /\/app\/candidate\/[a-zA-Z0-9_.-]*\/application\/[a-zA-Z0-9_.-]*\/[a-zA-Z]/g;

export const UrlRegex: RegExp = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;

export const CountryCode: RegExp = /^(\+?\d{1,3}|\d{1,4})$/;

export const UpperCaseRegex = /[A-Z]+/;

export const LowerCaseRegex = /[a-z]+/;

export const SpecialCharRegex = /[!@#$%^&*(),.?":{}|<>~0-9]+/;
