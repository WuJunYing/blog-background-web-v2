import fetch from 'utils/fetch'
import qs from 'qs'

/**
 * 财务接口
 */
export const businessApi = {
  // 获取平台财务列表
  getAllNodes() {
    return fetch({
      url: '/basePaymentNode/getAllNodes',
      method: 'post'
    })
  },
  // 导出平台财务列表
  updateNodes(data) {
    return fetch({
      url: '/basePaymentNode/updateNodes',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
