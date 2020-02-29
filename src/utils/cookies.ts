import { ServerEnv } from '../env';

/**
 * @description Creates new cookie with specified name, value and expiration time.
 * @param {string} name
 * @param {string} value
 * @param {number} expires
 * @param {boolean} setDomain
 */
export const setCookie = (name: string, value: string | null, expires: number, setDomain: boolean = true): void => {
  const serverEnv = ServerEnv();
  const domain = serverEnv.cookieDomain;

  const newCookie = [
    name + '=' + (value && encodeURIComponent(value)),
    'path=/',
    'max-age=' + expires,
  ];
  if (setDomain) {
    newCookie.push('domain=' + domain);
  }

  document.cookie = newCookie.join(';');
};

/**
 * @description Returns cookie value by name
 * @param {string} name Cookie name
 * @returns {string} Cookie value
 */
export const getCookie = (name: string): string | undefined => {
  const matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/+^])/g, '\\$1') + '=([^;]*)',
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined
};

/**
 * @description Deletes specified cookie
 * @param {name} name Cookie name
 * @param {boolean} setDomain
 */
export const deleteCookie = (name: string, setDomain: boolean = true): void => {
  setCookie(name, null, -1, setDomain);
};
