<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleCreate">添加</el-button>
        <!-- <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleAddMerchant">添加</el-button> -->
        <el-input @keyup.enter.native="$handleFilter" v-model="merchantNo" class="filter-item" placeholder="商家编号"></el-input>
        <el-input @keyup.enter.native="$handleFilter" v-model="merchantName" class="filter-item" placeholder="商家名称"></el-input>
        <el-input @keyup.enter.native="$handleFilter" v-model="contactName" class="filter-item" placeholder="商家联系人"></el-input>
        <el-select
              clearable
              class="filter-item"
              v-model="status"
              placeholder="状态">
              <el-option v-for="(value, key) in statusCode" :key="key" :label="value" :value="key"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="$handleFilter">搜索</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        element-loading-text="加载中"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column class-name="ktx-operate" align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-button v-if="$has('')" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
            <!-- <el-button v-if="$has('')" size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button> -->
            <el-button v-if="$has('') && scope.row.status === 1" size="small" :plain="true" type="warning" @click="handleLock(scope.row)">关闭店铺</el-button>
            <el-button v-if="$has('') && scope.row.status === 2" size="small" :plain="true" type="success" @click="handleUnlock(scope.row)">启用店铺</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="merchantNo" label="商家编号" width="180">
        </el-table-column>
        <el-table-column prop="merchantName" label="商家名称" width="180">
        </el-table-column>
        <el-table-column prop="contactName" label="商家联系人" width="130">
        </el-table-column>
        <el-table-column prop="mobile" label="移动电话" width="150">
        </el-table-column>
        <el-table-column prop="weight" label="权重" width="100">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
              <template slot-scope="scope">
                <span>{{ statusCode[scope.row.status] }}</span>
              </template>
        </el-table-column>
        <el-table-column prop="balance" label="可提现余额（元）" width="150">
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="170">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="建档时间" width="170">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="ktx-page-block">
        <el-pagination @size-change="$handleSizeChange" @current-change="$handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <!-- <div id="container"></div> -->
    </div>

    <el-dialog title="商家详情" :visible.sync="dialogFormVisible" width="800px">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        open="init"
        label-position="left" label-width="100px" style='margin:0 10px;'>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="商家名称" prop="merchantName">
            <el-input v-model="temp.merchantName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商家联系人" prop="contactName">
            <el-input v-model="temp.contactName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系人电话" prop="mobile">
            <el-input type="number" v-model="temp.mobile"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="固定电话" prop="telephone">
            <el-input v-model="temp.telephone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="可提现余额" prop="balance">
            <el-input readonly type="number" v-model="temp.balance" placeholder="元"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权重" prop="weight">
            <el-input type="number" v-model="temp.weight"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="是否推荐" prop="isRecommend" :rules="[
                  { required: true, message: '请选择' }
                  ]">
            <el-select
                clearable
                filterable
                class="w-input"
                v-model="temp.isRecommend"
                placeholder="请选择">
                <el-option v-for="(value, key) in isRecommendCode" :key="+key" :label="value" :value="+key">
                </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="抽成百分比" prop="commissionPercent">
            <el-input type="number" v-model="temp.commissionPercent" placeholder="%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- 图片组件 -->
          <oss-image-upload
            ref="imageUpload"
            :imageLimit="9"
            :isUploadNecessary="true"
            :imageFileType="1"
            :maxSize="3"></oss-image-upload><br>
          <!-- end -->
        </el-col>
      </el-row>
      <!-- <el-row :gutter="20">
          <el-form-item label="商家描述" prop="description">
              <div>
                <quill-editor v-model="temp.description"
                        ref="myQuillEditor"
                        :options="editorOption" @ready="onEditorReady($event)">
                </quill-editor>
              </div>
          </el-form-item>
      </el-row> -->

      <div>
        <!-- 图片上传组件辅助-->
        <el-upload
          class="avatar-uploader"
          action=""
          name="img"
          :http-request="uploadImage"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeUpload">
        </el-upload>
        <!--富文本编辑器组件-->
       <el-row v-loading="quillUpdateImg" :gutter="20">
         <el-form-item label="商家描述" prop="description">
          <quill-editor
            v-model="temp.description"
            ref="myQuillEditor"
            :options="editorOption"
            @change="onEditorChange($event)"
            @ready="onEditorReady($event)"
          >
          </quill-editor>
        </el-form-item>
       </el-row>
    </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="签约开始" prop="signStartTime" :rules="[
                  { required: true, message: '请选择' }
                  ]">
            <el-date-picker
              v-model="temp.signStartTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="签约结束" prop="signEndTime" :rules="[
                  { required: true, message: '请选择' }
                  ]">
            <el-date-picker
              v-model="temp.signEndTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
      <el-form-item label="所属区域" prop="area">
          <el-cascader
            :options="topAreaOption"
            @active-item-change="handleItemChange"
            @change="handleValueChange"
            :props="props"
            v-model="temp.area"
            style="width: 230px;"
          ></el-cascader>
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="街道地址" prop="street">
            <el-input v-model="temp.street" id="street" placeholder="请输入关键字搜索"></el-input>
          </el-form-item>
        </el-col>
        </el-row>
        <el-form-item label="详细地址" prop="address">
            <el-input v-model="temp.address" placeholder="包括省份到街道"></el-input>
          </el-form-item>
        <el-row :gutter="20">
          <div id="container" style="width: 100%; height: 300px;position: inherit;margin-bottom:0px;"></div>
          <div id="myPageTop">
    <table>
        <tr>
            <!-- <td>
                <label>按关键字搜索：</label>
            </td> -->
            <td class="column2">
                <label style="color: red">*请左击获取经纬度：</label>
            </td>
        </tr>
        <tr>
            <!-- <td>
                <input type="text" placeholder="请输入关键字进行搜索" id="tipinput">
            </td> -->
            <td class="column2">
                <input type="text" readonly="true" name="lnglat" v-model="temp.lnglat">
            </td>
        </tr>
    </table>
</div>
        </el-row>
          <el-input type="hidden" v-model="temp.longitude" name="longitude"></el-input>
          <el-input type="hidden" v-model="temp.latitude" name="latitude"></el-input>
      <hr>
      <br>
      <br>
      <el-row :gutter="20">
        <el-form-item style="margin-left: 10px;" label="商家类型" prop="merchantType" :rules="[
                  { required: true, message: '请选择', trigger: 'change' }
                  ]">
              <el-select
                disabled
                clearable
                filterable
                class="w-input"
                v-model="temp.merchantType"
                placeholder="商家类型">
                <el-option v-for="(value, key) in merchantTypeCode" :key="+key" :label="value" :value="+key">
                </el-option>
              </el-select>
            </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
          <el-form-item label="登陆账号" prop="userName">
              <el-input v-model="temp.userName"></el-input>
          </el-form-item>
              </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
          <el-form-item label="密码" prop="password">
              <el-input v-model="temp.password" type="password"></el-input>
          </el-form-item>
          </el-col>
      </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoading">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { estateApi } from '@/api/sys'
import { quillEditor } from 'vue-quill-editor'
import router from 'router'
import AMap from 'AMap'
import OSS from 'ali-oss'
import ossApi from 'api/oss'
import ossImageUpload from 'views/components/ossImageUpload'

// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{'header': 1}, {'header': 2}],               // custom button values
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
  [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
  [{'direction': 'rtl'}],                         // text direction

  [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
  [{'header': [1, 2, 3, 4, 5, 6, false]}],

  [{'color': []}, {'background': []}],          // dropdown with defaults from theme
  [{'font': []}],
  [{'align': []}],
  ['link', 'image', 'video'],
  ['clean']                                         // remove formatting button
]

const statusCode = {
  '1': '启用',
  '2': '关闭'
}

const merchantTypeCode = {
  '1': '普通商家',
  '2': '自营商城'
}

const isRecommendCode = {
  '0': '否',
  '1': '是'
}

export default {
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  components: {
    quillEditor,
    'oss-image-upload': ossImageUpload
  },
  data() {
    return {
      //  富文本配合图片上传到oss
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      // serverUrl: 'https://oss-cn-shenzhen.aliyuncs.com/ktx-adoption',  // 这里写你要上传的图片服务器地址
      // header: {token: null},  // 有的图片服务器要求请求头需要有token之类的参数，写在这里
      description: '', // 富文本内容
      // 富文本编辑器配置
      editorOption: {
        placeholder: '',
        theme: 'snow',  // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions,  // 工具栏
            handlers: {
              'image': function (value) {
                if (value) {
                //  触发input框选择图片文件
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },
      // oss
      region: 'oss-cn-shenzhen',
      bucket: 'ktx-adoption',

      listLoading: true,
      tableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,
      status: null,
      merchantName: null,
      merchantNo: null,
      statusCode,
      merchantTypeCode,
      isRecommendCode,
      contactName: null,
      balance: 0,

      // lnglat: null,
      // editorOption: {},
      tipinput: null,
      map: null,

      formLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {},
      rules: {
        merchantName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '必填' }
        ],
        mobile: [
          { required: true, message: '必填' }
        ],
        telephone: [
          { required: true, message: '必填' }
        ],
        balance: [
          { required: true, message: '必填' }
        ],
        weight: [
          { required: true, message: '必填' }
        ],
        commissionPercent: [
          { required: true, message: '必填' }
        ],
        description: [
          { required: true, message: '必填' }
        ],
        street: [
          { required: true, message: '必填' }
        ],
        address: [
          { required: true, message: '必填' }
        ],
        userName: [
          { required: true, message: '必填' }
        ],
        password: [
          { required: true, message: '必填' }
        ],
        area: [
          {
            required: true,
            trigger: 'blur',
            validator(rule, value, callback) {
              if (value.length < 3) {
                callback(new Error('请选择区域'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      topAreaOption: [],
      props: {
        value: 'id',
        label: 'label',
        children: 'cities'
      },

      areaNodeMap: {}
    }
  },
  methods: {
    // 上传图片前
    beforeUpload() {
    // 显示loading动画
      this.quillUpdateImg = true
    },
    // 上传图片成功
    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.res.statusCode === 200 && res.url !== null) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.url)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },
    // 上传图片失败
    uploadError(res, file) {

    // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('图片插入失败')
    },
    // 开始上传，获取token，上传
    uploadImage(params) {
      const file = params.file
      ossApi.generateImageName(1).then(response => {
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
    init() {
      const that = this
      setTimeout(() => {
        const map = new AMap.Map('container', {
          center: [113.339568, 23.176073],
          resizeEnable: true,
          zoom: 18
        })
        map.on('click', (e) => {
          this.temp.lnglat = e.lnglat.getLng() + ',' + e.lnglat.getLat()
          this.temp.longitude = e.lnglat.getLng()
          this.temp.latitude = e.lnglat.getLat()
        })
        //  输入提示
        var autoOptions = {
          city: '广州',
          input: 'street'
        }
        var auto = new AMap.Autocomplete(autoOptions)
        // var placeSearch = new AMap.PlaceSearch({
        //   city: '广州',
        //   map: map
        // }) //  构造地点查询类
        AMap.event.addListener(auto, 'select', select)//  注册监听，当选中某条记录时会触发
        function select(e) {
          that.temp.street = e.poi.name
          that.temp.address = that.temp.provinceName + '省' + that.temp.cityName + '市' + that.temp.districtName + '区' + e.poi.name
          if (e.poi && e.poi.location) {
            map.setZoom(18)
            map.setCenter(e.poi.location)
          }
        }
        // function select(e) {
        //   if (e.poi && e.poi.location) {
        //     map.setZoom(18)
        //     map.setCenter(e.poi.location)
        //   }
        // }
      }, 3000)
    },
    onEditorReady(editor) {
    },
    onEditorChange(editor) {
    },
    $handleSizeChange(val) {
      this.$setPage(val)
      this.pageSize = val
      this.getTableList()
    },
    $handleCurrentChange(val) {
      this.currentPage = val
      this.getTableList()
    },
    async getTableList() {
      var params = {
        merchantNo: this.merchantNo,
        merchantName: this.merchantName,
        contactName: this.contactName,

        status: this.status || 99,

        page: this.currentPage,
        rows: this.pageSize
      }
      this.listLoading = true
      const response = await this.$http.post('/merchant/queryByPage.json', params)
      this.tableData = response.data.rows
      this.total = response.data.total
      this.listLoading = false
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.formLoading = false
      this.topAreaOption.length === 0 && this.getAreaList(1, '')
      this.$resetFields('editForm')
      // 清空图片
      if (this.$refs['imageUpload']) {
        this.$refs['imageUpload'].clearFiles()
      }
    },
    async create() {
      await this.$validate('editForm')
      // 验证图片
      if (this.$refs['imageUpload'].validateImage()) {
        const names = this.$refs['imageUpload'].getImageRealNames()
        this.temp.images = names.join(',')
      } else {
        return
      }
      const params = { ...this.temp }
      params.provinceId = this.temp.provinceNo
      params.cityId = this.temp.cityNo
      params.districtId = this.temp.areaNo
      params.lnglat = this.temp.lnglat
      params.signStartTime = this.$toDataStr(this.temp.signStartTime, '{y}-{m}-{d} {h}:{i}:{s}')
      params.signEndTime = this.$toDataStr(this.temp.signEndTime, '{y}-{m}-{d} {h}:{i}:{s}')
      if (!this.validateDate(params)) return
      if (params.longitude === null || params.latitude === null) {
        this.$tip('经纬度不能为空,请左击地图!')
        this.formLoading = false
        return false
      }
      this.formLoading = true
      const response = await this.$http.post('/merchant/insertMerchant.json', params)
      this.formLoading = false
      this.dialogFormVisible = false
      this.getTableList()
      this.$msg(response)
    },
    async handleUpdate(row) {
      const that = this
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.formLoading = false
      const map = new AMap.Map('container', {
        center: [row.longitude, row.latitude],
        resizeEnable: true,
        zoom: 18
      })
      map.on('click', (e) => {
        this.temp.lnglat = e.lnglat.getLng() + ',' + e.lnglat.getLat()
        this.temp.longitude = e.lnglat.getLng()
        this.temp.latitude = e.lnglat.getLat()
      })
      var autoOptions = {
        city: '广州',
        input: 'street'
      }
      var auto = new AMap.Autocomplete(autoOptions)
      AMap.event.addListener(auto, 'select', select)//  注册监听，当选中某条记录时会触发
      function select(e) {
        that.temp.street = e.poi.name
        that.temp.address = that.temp.provinceName + '省' + that.temp.cityName + '市' + that.temp.districtName + '区' + e.poi.name
        if (e.poi && e.poi.location) {
          map.setZoom(18)
          map.setCenter(e.poi.location)
        }
      }
      await this.$resetFields('editForm')
      // 清空图片
      if (this.$refs['imageUpload']) {
        this.$refs['imageUpload'].clearFiles()
      }
      this.resetTemp()
      const temp = this.temp
      for (const key in temp) {
        temp[key] = row[key]
      }
      this.temp.lnglat = row.longitude + ',' + row.latitude
      temp.area = [temp.provinceId, temp.cityId, temp.districtId]
      if (this.topAreaOption.length === 0) {
        this.getAreaList(1, '').then(() => {
          this.getAreaList(2, temp.provinceId).then(() => {
            this.getAreaList(3, temp.cityId)
          })
        })
      } else {
        this.getAreaList(2, temp.provinceId).then(() => {
          this.getAreaList(3, temp.cityId)
        })
      }
      // 回显图片
      this.$refs['imageUpload'].setDisplayImages(row.images)
    },
    async update() {
      await this.$validate('editForm')
      // 验证图片
      if (this.$refs['imageUpload'].validateImage()) {
        const names = this.$refs['imageUpload'].getImageRealNames()
        this.temp.images = names.join(',')
      } else {
        return
      }

      const params = { ...this.temp }
      params.provinceId = this.temp.provinceNo
      params.cityId = this.temp.cityNo
      params.districtId = this.temp.areaNo
      params.longitude = this.temp.longitude
      params.latitude = this.temp.latitude
      params.signStartTime = this.$toDataStr(this.temp.signStartTime, '{y}-{m}-{d} {h}:{i}:{s}')
      params.signEndTime = this.$toDataStr(this.temp.signEndTime, '{y}-{m}-{d} {h}:{i}:{s}')
      if (!this.validateDate(params)) return
      this.formLoading = true
      const response = await this.$http.post('/merchant/updateMerchant.json', params)
      this.formLoading = false
      this.dialogFormVisible = false
      this.getTableList()
      this.$msg(response)
    },
    async handleDelete(data) {
      await this.$myConfirm('是否删除数据?')

      const id = data.id
      const response = await this.$http.post('/merchant/deleteById.json', { id })
      this.getTableList()
      this.$msg(response)
    },
    async handleLock(data) {
      await this.$myConfirm('确定关闭店铺?')
      const url = '/merchant/updateMerchantStatus.json'
      const id = data.id
      const status = 2
      const response = await this.$http.post(url, { id, status })
      this.getTableList()
      this.$msg(response)
    },
    async handleUnlock(data) {
      await this.$myConfirm('确定启用店铺?')
      const url = '/merchant/updateMerchantStatus.json'
      const id = data.id
      const status = 1
      // if(2 === data.status){
      //   status = 1
      // }
      const response = await this.$http.post(url, { id, status })
      this.getTableList()
      this.$msg(response)
    },
    validateDate(params) {
      if (params.signStartTime > params.signEndTime) {
        this.$tip('签约结束时间必须大于签约开始时间')
        return false
      }
      return true
    },
    // handleUnlock(data) {
    //   this.$confirm('是否解冻数据?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(response => {
    //     const params = {
    //       secondHandNo: data.secondHandNo
    //     }
    //     marketApi.unlock(params).then(response => {
    //       this.getTableList()
    //       this.$notify({
    //         title: '成功',
    //         message: response.data.message,
    //         type: 'success',
    //         duration: 2000
    //       })
    //     })
    //   }).catch(() => {})
    // },
    handleExport(row) {
      const params = {
        id: row.id,
        activityId: row.activityId
      }
      location.href = this.$baseApi() + '/merchant/exportCashBackDetail.json?' +
                        this.$toQueryString(params)
    },
    resetTemp() {
      this.temp = {
        id: null,
        userName: null,
        password: null,
        merchantNo: null,
        merchantName: null,
        contactName: null,
        balance: 0,
        telephone: null,
        mobile: null,
        description: null,
        merchantType: 1,
        commissionPercent: null,
        weight: null,
        signStartTime: null,
        signEndTime: null,
        longitude: null,
        latitude: null,
        lnglat: null,

        // 临时
        parentId: '',
        provinceNo: '',
        cityNo: '',
        areaNo: '',
        // provinceName: '',
        // cityName: '',
        // areaName: '',
        area: [],

        score: null,
        evaluateNum: null,
        status: null,
        isDeleted: null,
        createTime: null,

        provinceId: null,
        provinceName: null,
        cityId: null,
        cityName: null,
        districtId: null,
        districtName: null,
        street: null,
        address: null,
        isRecommend: null
      }
    },
    getAreaList(level, parentNo) {
      const params = {
        parentNo: parentNo,
        areaLevel: level
      }
      return new Promise(resolve => {
        estateApi.getAreaList(params).then(response => {
          const list = response.data
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            item.label = item.name
            if (level !== 3) {
              item.cities = []
            }
            this.areaNodeMap[item.id] = item
          }

          if (level === 1) {
            this.topAreaOption = list
          } else {
            const parentId = parentNo
            this.areaNodeMap[parentId].cities = list
          }
          resolve()
        })
      })
    },
    handleItemChange(val) {
      this.getAreaList(val.length + 1, val[val.length - 1])
    },
    handleValueChange(val) {
      const temp = this.temp
      temp.provinceNo = val[0]
      temp.cityNo = val[1]
      temp.areaNo = val[2]
      temp.provinceName = this.areaNodeMap[temp.provinceNo].name
      temp.cityName = this.areaNodeMap[temp.cityNo].name
      temp.districtName = this.areaNodeMap[temp.areaNo].name
    },
    handleAddMerchant() {
      router.push({ path: '/merchant/addMerchant' })
    }
  },
  watch: {
    status(val) {
      this.$handleFilter()
    }
  },
  mounted() {
    this.getTableList()
    this.init()
  }
}
</script>

<style lang="scss">
.amap-sug-result {
  z-index: 99999;
}
</style>

