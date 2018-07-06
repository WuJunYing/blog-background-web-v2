<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleCreate">添加</el-button>
        <el-input @keyup.enter.native="$handleFilter" v-model="communityName" class="filter-item" placeholder="社区名称"></el-input>
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
        <el-table-column class-name="ktx-operate" align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button v-if="$has('') && scope.row.status === 1" size="mini" @click="handleClose(scope.row)">关闭</el-button>
            <el-button v-if="$has('') && scope.row.status === 2" size="mini" @click="handleOpen(scope.row)">开启</el-button>
            <el-button v-if="$has('')" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="$has('')" size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="communityName" label="社区名称" width="180">
        </el-table-column>
        <el-table-column prop="communityNo" label="外联识别码" width="130">
        </el-table-column>
        <el-table-column prop="street" label="地址" width="180">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="70">
              <template slot-scope="scope">
                <span>{{ statusCode[scope.row.status] }}</span>
              </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="170">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="ktx-page-block">
        <el-pagination @size-change="$handleSizeChange" @current-change="$handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 社区新增修改 -->
    <el-dialog title="社区编辑" :visible.sync="dialogFormVisible" width="850px">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        open="init"
        label-position="left" label-width="110px" style='margin:0 20px;'>
        <el-form-item label="社区名称" prop="communityName">
          <el-input v-model="temp.communityName"></el-input>
        </el-form-item>
        <el-form-item label="外联识别码" prop="communityNo">
          <el-input v-model="temp.communityNo" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"></el-input>
        </el-form-item>
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
          <el-form-item label="社区地址" prop="street">
            <el-input class="el-input__street" v-model="temp.street" id="street" placeholder="请输入关键字搜索"></el-input>
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
                    <td class="column2">
                        <label style="color: red">*请左击获取经纬度：</label>
                    </td>
                </tr>
                <tr>
                    <td class="column2">
                        <input type="text" readonly="true" name="lnglat" v-model="temp.lnglat">
                    </td>
                </tr>
            </table>
          </div>
        </el-row>
          <el-input type="hidden" v-model="temp.longitude" name="longitude"></el-input>
          <el-input type="hidden" v-model="temp.latitude" name="latitude"></el-input>
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
import AMap from 'AMap'

const statusCode = {
  '1': '开启',
  '2': '关闭'
}
export default {
  data() {
    return {
      listLoading: true,
      tableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,
      statusCode,
      status: null,
      communityName: null,

      formLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {},
      rules: {
        communityName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        communityNo: [
          { required: true, message: '必填' }
        ],
        address: [
          { required: true, message: '必填' }
        ],
        street: [
          { required: true, message: '必填' }
        ],
        lnglat: [
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
        AMap.event.addListener(auto, 'select', select)//  注册监听，当选中某条记录时会触发
        function select(e) {
          debugger
          that.temp.street = e.poi.name
          that.temp.address = that.temp.provinceName + '省' + that.temp.cityName + '市' + that.temp.districtName + '区' + e.poi.name
          if (e.poi && e.poi.location) {
            map.setZoom(18)
            map.setCenter(e.poi.location)
          }
        }
      }, 3000)
    },
    async getTableList() {
      var params = {
        status: this.status || 99,
        communityName: this.communityName,
        page: this.currentPage,
        rows: this.pageSize
      }
      this.listLoading = true
      const response = await this.$http.post('/baseCommunity/queryByPage.json', params)
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
    },
    async create() {
      await this.$validate('editForm')
      this.formLoading = true
      const params = { ...this.temp }
      params.provinceId = this.temp.provinceNo
      params.cityId = this.temp.cityNo
      params.districtId = this.temp.areaNo
      if (params.longitude === null || params.latitude === null) {
        this.$tip('经纬度不能为空,请左击地图!')
        this.formLoading = false
        return false
      }
      const response = await this.$http.post('/baseCommunity/save.json', params)
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
    },
    async update() {
      await this.$validate('editForm')

      this.formLoading = true
      const params = { ...this.temp }
      params.provinceId = this.temp.provinceNo
      params.cityId = this.temp.cityNo
      params.districtId = this.temp.areaNo
      params.longitude = this.temp.longitude
      params.latitude = this.temp.latitude
      const response = await this.$http.post('/baseCommunity/save.json', params)
      this.formLoading = false
      this.dialogFormVisible = false
      this.getTableList()
      this.$msg(response)
    },
    async handleClose(data) {
      await this.$myConfirm('是否关闭?')
      const id = data.id
      const status = 2
      const response = await this.$http.post('/baseCommunity/save.json', { id, status })
      this.getTableList()
      this.$msg(response)
    },
    async handleOpen(data) {
      await this.$myConfirm('是否开启?')
      const id = data.id
      const status = 1
      const response = await this.$http.post('/baseCommunity/save.json', { id, status })
      this.getTableList()
      this.$msg(response)
    },
    async handleDelete(data) {
      await this.$myConfirm('是否删除数据?')
      const id = data.id
      const isDeleted = 1
      const response = await this.$http.post('/baseCommunity/save.json', { id, isDeleted })
      this.getTableList()
      this.$msg(response)
    },
    handleExport(row) {
      const params = {
        id: row.id,
        activityId: row.activityId
      }
      location.href = this.$baseApi() + '/activity_cashback/exportCashBackDetail.json?' +
                        this.$toQueryString(params)
    },
    resetTemp() {
      this.temp = {
        id: null,
        communityNo: null,
        communityName: null,
        cashBackMonth: null,
        description: null,
        longitude: null,
        latitude: null,
        lnglat: null,
        // 临时
        parentId: '',
        provinceNo: '',
        cityNo: '',
        areaNo: '',
        area: [],

        provinceId: null,
        provinceName: null,
        cityId: null,
        cityName: null,
        districtId: null,
        districtName: null,
        street: null,
        address: null
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
.el-input__street {
  width: 100%;
}
</style>
