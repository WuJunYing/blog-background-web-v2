import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const jSessionId = 'JSESSIONID'

export function getJSessionId() {
  return Cookies.get(jSessionId)
}

export function setJSessionId(token) {
  return Cookies.set(jSessionId, token)
}

export function removeJSessionId() {
  return Cookies.remove(jSessionId)
}
