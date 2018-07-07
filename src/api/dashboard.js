import fetch from 'utils/fetch'
import qs from 'qs'

/**
 * 首页接口
 */
export const dashboardApi = {
  // 获取未读评论
  getTodoCommentList(data) {
    return fetch({
      url: '/dashboard/getTodoCommentList',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 获取统计信息
  getTodoItems(data) {
    return fetch({
      url: '/dashboard/getTodoItems',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 查询预约
  checkReservation(data) {
    return fetch({
      url: '/dashboard/checkReservation',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
