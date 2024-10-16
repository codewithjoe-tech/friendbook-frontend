
import Cookies from 'js-cookie';

export const getCookie = (name) => {
  return Cookies.get(name);
};

export const setCookie = (name, value, options = {}) => {
  Cookies.set(name, value, options);
};

export const deleteCookie = (name) => {
  Cookies.remove(name);
};

export const updateCookie = (name, value, options = {}) => {
  if (Cookies.get(name)) {
    Cookies.set(name, value, options);
  }
};
