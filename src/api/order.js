import fetch from 'utils/fetch'
import qs from 'qs'

/**
 * 获取产品订单
 */
export const productOrderApi = {
  getTableList(data) {
    return fetch({
      url: '/order/getProductOrderByPage',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getOrderDetail(data) {
    return fetch({
      url: '/order/getProductOrderDetail',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

/**
 * 获取土地订单
 */
export const landOrderApi = {
  getTableList(data) {
    return fetch({
      url: '/order/getLandOrderByPage',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getOrderDetail(data) {
    return fetch({
      url: '/order/getLandOrderDetail',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  confirmReceived(data) {
    return fetch({
      url: '/order/confirmReceived',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  releaseRenewal(data) {
    return fetch({
      url: '/order/releaseRenewal',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  using(data) {
    return fetch({
      url: '/goodsSchemeBatch/using',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
