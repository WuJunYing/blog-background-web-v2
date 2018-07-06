import fetch from 'utils/fetch'
import qs from 'qs'

/**
 * 获取产品订单
 */
export const cultivationApi = {
  // 获取养殖列表
  getTableList(data) {
    return fetch({
      url: '/cultivation/getCultivationListByPage',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 获取养殖详情
  getCultivationDeatil(data) {
    return fetch({
      url: '/cultivation/getCultivationDeatil',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 取消发布，下架批次
  cancelRelease(data) {
    return fetch({
      url: '/cultivation/cancelRelease',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 取消养殖
  cancelCultivate(data) {
    return fetch({
      url: '/cultivation/cancelCultivate',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 新增养殖记录
  addCultivateLog(data) {
    return fetch({
      url: '/cultivation/addCultivateLog',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 修改金额
  updateBatchPrice(data) {
    return fetch({
      url: '/cultivation/updateBatchPrice',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 导出
  exportResult(params) {
    return '/cultivation/exportResult?' + qs.stringify(params)
  }
}
