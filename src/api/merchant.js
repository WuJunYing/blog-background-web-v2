import fetch from 'utils/fetch'
import qs from 'qs'

/**
 * 商家接口
 */
export const merchantApi = {
  // 获取全部商家列表
  getAllMerchant(data) {
    return fetch({
      url: '/merchant/queryAllMerchantList',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
