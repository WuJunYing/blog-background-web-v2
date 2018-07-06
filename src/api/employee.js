import fetch from 'utils/fetch'

/**
 * 职务api
 */
export const employeeApi = {
  getTableList(data) {
    return fetch({
      url: '/adminUser/getUsersByPage',
      method: 'post',
      params: data
    })
  },
  saveUser(data) {
    return fetch({
      url: '/adminUser/saveUser',
      method: 'get',
      params: data
    })
  },
  checkUserName(data) {
    return fetch({
      url: '/adminUser/checkUserName',
      method: 'post',
      params: data
    })
  },
  checkMobile(data) {
    return fetch({
      url: '/adminUser/checkMobile',
      method: 'post',
      params: data
    })
  },
  deleteUser(data) {
    return fetch({
      url: '/adminUser/deleteUser',
      method: 'post',
      params: data
    })
  }
}
