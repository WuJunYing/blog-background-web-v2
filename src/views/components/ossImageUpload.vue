<template>
  <div>
    <div style="line-height: 32px;">
      <label :class="isUploadNecessary ? 'log-image-label':''">图片（最多{{imageLimit}}张图片）</label>
      <span v-if="logImageError" class="log-image-error">必须上传图片</span>
    </div>
    <!-- 服务器回显 -->
    <div style="float: left;">
      <ul class="el-upload-list el-upload-list--picture-card">
        <li v-for="(image, index) in displayImages" :key="index" class="el-upload-list__item is-success">
          <img :src="image.url" alt="" class="el-upload-list__item-thumbnail"/>
          <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{ image.fileName }}</a>
          <label class="el-upload-list__item-status-label">
            <i class="el-icon-upload-success el-icon-check"></i>
          </label>
          <i class="el-icon-close"></i>
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview"><i class="el-icon-zoom-in" @click="onDialpayImagePreview(image.url)"></i></span>
            <span class="el-upload-list__item-delete"><i class="el-icon-delete" @click="onDialpayImageDelete(index)"></i></span>
          </span>
        </li>
      </ul>
    </div>
    <el-upload
      action=""
      list-type="picture-card"
      :limit="remainNum"
      :multiple="true"
      :accept="accept"
      :file-list="imageFileList"
      :http-request="uploadImage"
      :before-upload="beforeUpload"
      :on-success="onUploadSuccess"
      :on-error="onUploadError"
      :on-preview="onPictureCardPreview"
      :on-remove="onRemoveImage"
      :on-exceed="onExceed"
      ref="upload">
      <i class="el-icon-plus"></i>
    </el-upload>
    <div style="clear: both;"></div>
    <el-dialog :visible.sync="logImageVisible" :append-to-body="true">
      <img width="100%" :src="logImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import OSS from 'ali-oss'
import ossApi from 'api/oss'

export default {
  name: 'oss-image-upload',
  data() {
    return {
      logImageVisible: false,
      logImageError: false,
      logImageUrl: '',
      accept: 'image/*',
      imageFileList: [],
      // 服务器回显的图片
      displayImages: [],
      // 剩余最大图片上传数量 = 总数量 - displayImages的数量，初始化之后不会变的
      remainNum: 3,
      // 当前剩余上传数量，会变化
      currentRemainNum: 3,

      // oss
      region: 'oss-cn-shenzhen',
      bucket: 'ktx-adoption'
    }
  },
  props: {
    // 最大图片数量
    imageLimit: Number,
    // 是否必须
    isUploadNecessary: Boolean,
    // 图片名称类型
    imageFileType: Number,
    // 最大多少M
    maxSize: Number
  },
  watch: {
    imageLimit: function() {
      this.remainNum = this.imageLimit - (this.displayImages ? this.displayImages.length : 0)
    },
    displayImages: function() {
      this.remainNum = this.imageLimit - (this.displayImages ? this.displayImages.length : 0)
    }
  },
  mounted() {
    this.remainNum = this.imageLimit
    this.currentRemainNum = this.remainNum
  },
  methods: {
    // 删除图片
    onRemoveImage(file, fileList) {
      this.imageFileList = fileList
      let num = this.imageFileList.length
      if (this.displayImages) {
        num += this.displayImages.length
      }
      if (num <= 0) {
        this.logImageError = true
      }
    },
    // 预览图片
    onPictureCardPreview(file) {
      this.logImageUrl = file.url
      this.logImageVisible = true
    },
    onDialpayImageDelete(index) {
      this.$myConfirm('确认删除吗？').then(() => {
        this.displayImages.splice(index, 1)
      })
    },
    // 服务器回显图片的预览
    onDialpayImagePreview(url) {
      this.logImageUrl = url
      this.logImageVisible = true
    },
    // 上传前判断类型跟大小
    beforeUpload(file) {
      this.logImageError = false
      // 上传之前判断类型跟大小
      // const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isImage = file.type.substring(0, 5) === 'image'
      if (!isImage) {
        this.$message.error('只能上传图片格式，如 .jpg.png 等格式！')
      }
      const isLt = file.size / 1024 / 1024 < this.maxSize
      if (!isLt) {
        this.$message.error('图片大小不能超过 ' + this.maxSize + 'MB!')
      }
      // 数量判断
      const isRemain = this.remainNum > 0
      if (!isRemain) {
        this.$message.error('最多只能上传' + this.imageLimit + '张图片！')
      }
      return isImage && isLt && isRemain
    },
    // 开始上传，获取token，上传
    uploadImage(params) {
      const file = params.file
      ossApi.generateImageName(this.imageFileType).then(response => {
        if (response.data.success) {
          let fileName = response.data.result
          const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length)
          fileName = fileName + suffix
          ossApi.getOssToken().then(tokenResponse => {
            if (tokenResponse.data.success) {
              const token = tokenResponse.data.result
              const client = new OSS.Wrapper({
                region: this.region,
                accessKeyId: token.accessKeyId,
                accessKeySecret: token.accessKeySecret,
                stsToken: token.securityToken,
                bucket: this.bucket
              })
              // 上传oss
              client.put(fileName, file).then(response => {
                if (response.res.statusCode === 200) {
                  // 上传成功
                  params.onSuccess(response)
                } else {
                  // 上传失败
                  this.$message.error('图片上传失败')
                  params.onError(response)
                }
              }).catch(e => {
                this.$message.error('图片上传失败')
                params.onError(response)
              })
            } else {
              this.$msg(response)
              console.error('获取oss临时凭证失败')
            }
          })
        } else {
          this.$msg(response)
        }
      })
    },
    // 上传成功
    onUploadSuccess(response, file, fileList) {
      // 设置正确的名称
      file.realName = response.name
      this.imageFileList = fileList
      this.currentRemainNum = this.remainNum - fileList.length
    },
    // 上传失败
    onUploadError(response, file, fileList) {
      this.imageFileList = fileList
    },
    // 超出限制数量
    onExceed() {
      this.$message.error('最多只能上传' + this.imageLimit + '张图片！')
    },
    // 清空文件
    clearFiles() {
      if (this.$refs['upload']) {
        this.$refs['upload'].clearFiles()
      }
      this.logImageError = false
      this.displayImages = []
      this.currentRemainNum = this.remainNum
    },
    // 显示 必须 上传提示
    showErrorTips() {
      this.logImageError = true
    },
    // 隐藏 必须 上传提示
    hideErrorTips() {
      this.logImageError = false
    },
    // 如果图片不能为空，验证图片
    validateImage() {
      if (this.isUploadNecessary) {
        let num = this.imageFileList.length
        if (this.displayImages) {
          num += this.displayImages.length
        }
        if (num <= 0) {
          this.logImageError = true
          return false
        } else {
          this.logImageError = false
          return true
        }
      }
      return true
    },
    getImageRealNames() {
      const names = []
      this.imageFileList.forEach(image => {
        // 取realName才是上传到oss服务器的真正名称
        names.push(image.realName)
      })
      // 从服务器拿回来的图片
      if (this.displayImages) {
        this.displayImages.forEach(image => {
          names.push(image.fileName)
        })
      }
      return names
    },
    setDisplayImages(displayImages) {
      // 防止修改原对象
      // 用Object.assign跟 ... 拷贝之后都不能只用splice方法
      this.displayImages = JSON.parse(JSON.stringify(displayImages))
    }
  }
}
</script>
<style scoped>
.log-image-label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 2px;
}
.log-image-error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}
</style>
