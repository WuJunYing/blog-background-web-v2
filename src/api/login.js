import fetch from '@/utils/fetch'

export function loginByUsername(userName, password) {
  return fetch({
    url: '/system/login',
    method: 'post',
    params: {
      userName: userName,
      password: password,
      type: 1
    }
  })
}

export function valLogin(userName, password) {
  return fetch({
    url: '/system/valLogin',
    method: 'post',
    params: {
      userName: userName,
      password: password,
      type: 1
    }
  })
}

export function logout() {
  return fetch({
    url: '/system/loginOut',
    method: 'post'
  })
}

export function getUserInfo(data) {
  return fetch({
    url: '/system/getUserInfo',
    method: 'post',
    params: data
  })
}

