import fetch from '@/utils/fetch'

export default {
  // 获取token
  getOssToken() {
    return fetch({
      url: '/oss/getToken',
      method: 'get'
    })
  },
  // 获取图片名称
  generateImageName(imageFileType) {
    return fetch({
      url: '/oss/generateImageName',
      method: 'get',
      params: {
        imageFileType: imageFileType
      }
    })
  }
}
