import fetch from '@/utils/fetch'
import qs from 'qs'

export const memApi = {
  getTableList(data) {
    return fetch({
      url: '/mem/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/mem/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/mem/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/mem/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryById(data) {
    return fetch({
      url: '/userAccount/queryById.json',
      method: 'get',
      params: data
    })
  },
  lock(data) {
    return fetch({
      url: '/mem/lock.json',
      method: 'get',
      params: data
    })
  },
  unlock(data) {
    return fetch({
      url: '/mem/unlock.json',
      method: 'get',
      params: data
    })
  },
  auth(data) {
    return fetch({
      url: '/mem/auth.json',
      method: 'get',
      params: data
    })
  },
  cancelAuth(data) {
    return fetch({
      url: '/mem/cancelAuth.json',
      method: 'get',
      params: data
    })
  }
}

export const accountApi = {
  getTableList(data = {}) {
    return fetch({
      url: '/accountlog/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  getRechargeTableList(data = {}) {
    return fetch({
      url: '/recharge/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  getTradelogTableList(data = {}) {
    return fetch({
      url: '/tradelog/queryByPage.json',
      method: 'get',
      params: data
    })
  }
}

export const feedbackApi = {
  getTableList(data) {
    return fetch({
      url: '/feedback/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/feedback/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/feedback/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  deal(data) {
    return fetch({
      url: '/feedback/deal.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/feedback/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
