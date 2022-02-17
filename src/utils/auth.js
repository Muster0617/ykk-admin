import Cookies from "js-cookie";

const TokenKey = "zxksxtAdmin-Token";
const UserInfo = "User-Info";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
export function getUserInfo() {
  return JSON.parse(localStorage.getItem(UserInfo));
}

export function setUserInfo(data) {
  return localStorage.setItem(UserInfo, JSON.stringify(data));
}
export function removeUserInfo() {
  return localStorage.removeItem(UserInfo);
}
export function deepCopy(obj) {
  if (typeof obj !== "object") {
    return;
  }
  let newObj = obj instanceof Array ? [] : {};
  for (const key in obj) {
    newObj[key] = typeof obj[key] == "object" ? deepCopy(obj[key]) : obj[key];
  }
  return newObj;
}
