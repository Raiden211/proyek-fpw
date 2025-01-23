import Cookies from 'js-cookie';

export const setCookie = (key, value, expiresInHours = 6, path = "/") => {
    const expirationDate = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
    Cookies.set(key, value, { expires: expirationDate, path });
};

export const getCookie = (key) => {
    return Cookies.get(key);
};

export const removeCookie = (key) => {
    Cookies.remove(key, { path: "/" });
};