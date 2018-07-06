import fetch from 'utils/fetch'
import qs from 'qs'

/**
 * 获取系统模块
 */
export const moduleApi = {

  getAllModule(data) {
    return fetch({
      url: '/adminModule/getAllModule',
      method: 'post',
      data: qs.stringify(data)
    })
  }

}

/**
 * 职务api
 */
export const dutyApi = {
  // 获取列表
  getTableList(data) {
    return fetch({
      url: '/adminRole/getRolesByPage',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 获取全部职务
  getAllRoles(data) {
    return fetch({
      url: '/adminRole/getAllRoles',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 保存职务
  saveRole(data) {
    return fetch({
      url: '/adminRole/saveRole',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 检查名称
  checkRoleName(data) {
    return fetch({
      url: '/adminRole/checkRoleName',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 删除职务
  deleteRole(data) {
    return fetch({
      url: '/adminRole/deleteRole',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
