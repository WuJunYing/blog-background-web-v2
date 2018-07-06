<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <!-- <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleCreateOther">添加其它类型产品</el-button>
        <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleCreate">添加土地产品</el-button> -->
        <el-input @keyup.enter.native="$handleFilter" v-model="goodsNo" class="filter-item" placeholder="产品编号"></el-input>
        <el-input @keyup.enter.native="$handleFilter" v-model="merchantName" class="filter-item" placeholder="所属商家"></el-input>
        <el-input @keyup.enter.native="$handleFilter" v-model="goodsName" class="filter-item" placeholder="产品名称"></el-input>
        <!-- <el-input @keyup.enter.native="$handleFilter" v-model="abc" class="filter-item" placeholder="养殖方案"></el-input> -->
        <el-select
              clearable
              class="filter-item"
              v-model="goodsType"
              placeholder="产品类型">
              <el-option v-for="(value, key) in goodsTypeCode" :key="key" :label="value" :value="key"></el-option>
        </el-select>
        <el-select
              clearable
              class="filter-item"
              v-model="isSale"
              placeholder="产品状态">
              <el-option v-for="(value, key) in isSaleCode" :key="key" :label="value" :value="key"></el-option>
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
            <el-button v-if="$has('') && scope.row.goodsType === 5" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="$has('') && scope.row.goodsType !== 5" size="mini" @click="handleUpdateOther(scope.row)">修改</el-button>
            <!-- <el-button v-if="$has('') && scope.row.goodsType !== 5" size="mini" @click="handleCreateIssue(scope.row)">发布</el-button> -->
            <el-button v-if="$has('') && scope.row.isSale === 1" size="mini" @click="handleUpdateSale(scope.row)">下架</el-button>
            <el-button v-if="$has('') && scope.row.isSale === 0" size="mini" @click="handleUpdateIsSale(scope.row)">上架</el-button>
            <!-- <el-button v-if="$has('')" size="mini" @click="handleUpdate(scope.row)">发布</el-button> -->
            <el-button v-if="$has('')" size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="goodsNo" label="产品编号" width="180">
        </el-table-column>
        <el-table-column prop="merchantName" label="所属商家" width="180">
        </el-table-column>
        <el-table-column prop="goodsName" label="产品名称" width="180">
        </el-table-column>
        <el-table-column prop="goodsType" label="类型" width="150">
          <template slot-scope="scope">
                <span>{{ goodsTypeCode[scope.row.goodsType] }}</span>
           </template>
        </el-table-column>
        <el-table-column prop="isSale" label="状态" width="100">
          <template slot-scope="scope">
                <span>{{ isSaleCode[scope.row.isSale] }}</span>
           </template>
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
    </div>
    <!-- 其他类型产品 -->
    <el-dialog title="产品详情" :visible.sync="dialogFormVisibleOther">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="130px" style='width: 500px; margin-left:50px;'>
        <el-form-item label="产品类型" required="true" prop="goodsType">
          <el-select
            class="w-input-235"
            v-model="temp.goodsType"
            placeholder="产品类型">
            <el-option v-for="(value, key) in goodsTypeCodeExLand" :key="key" :label="value" :value="+key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="goodsName">
          <el-input class="el-input__goodsName" v-model="temp.goodsName"></el-input>
        </el-form-item>

        <!-- 图片组件 -->
        <oss-image-upload
          ref="imageUploadProduct"
          :imageLimit="9"
          :isUploadNecessary="true"
          :imageFileType="2"
          :maxSize="3"></oss-image-upload><br>
        <!-- end -->

        <el-form-item
        label="产品标签"
        prop="labelIdListArray"
        :rules="[{ type: 'array' }]"
        >
          <el-select
            filterable
            multiple-limit='3'
            multiple
            class="w-input-235"
            v-model="temp.labelIdListArray"
            placeholder="不能超过3个">
            <el-option v-for="goodsLabel in goodsLabelList" :key="goodsLabel.id" :label="goodsLabel.labelName" :value="goodsLabel.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
        label="产品额外服务"
        prop="appreciationServiceArray"
        :rules="[{ type: 'array' }]"
        >
          <el-select
            filterable
            multiple-limit='3'
            multiple
            class="w-input-235"
            v-model="temp.appreciationServiceArray"
            placeholder="不能超过3个">
            <el-option v-for="appreciationService in appreciationServiceList" :key="appreciationService.id" :label="appreciationService.serviceName" :value="appreciationService.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支持农场自提" prop="isSelfPick">
          <el-radio class="radio" v-model="temp.isSelfPick" :label="0">否</el-radio>
          <el-radio class="radio" v-model="temp.isSelfPick" :label="1">是</el-radio>
        </el-form-item>
        <el-form-item label="农场配送模板" prop="expressTemplateId">
          <el-select
            filterable
            clearable
            class="w-input-235"
            v-model="temp.expressTemplateId"
            placeholder="配送模板">
            <el-option v-for="expressTemplate in expressTemplateList" :key="expressTemplate.id" :label="expressTemplate.name" :value="expressTemplate.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品认养说明" prop="description">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="temp.description"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoadingOther">
        <el-button @click="dialogFormVisibleOther = false">取 消</el-button>
        <el-button v-if="dialogStatusOther=='createOther'" type="primary" @click="createOther">确 定</el-button>
        <el-button v-else type="primary" @click="updateOther">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 土地产品 -->
    <el-dialog title="土地详情" :visible.sync="dialogFormVisible">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="130px" style='width: 500px; margin-left:50px;'>
        <el-form-item label="土地名称" prop="goodsName">
          <el-input v-model="temp.goodsName"></el-input>
        </el-form-item>

        <!-- 图片组件 -->
        <oss-image-upload
          ref="imageUploadLand"
          :imageLimit="9"
          :isUploadNecessary="true"
          :imageFileType="2"
          :maxSize="3"></oss-image-upload><br>
        <!-- end -->

        <el-form-item label="认领周期(天)" prop="employPeriod">
          <el-input v-model="temp.employPeriod" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"></el-input>
        </el-form-item>
        <el-form-item
        label="产品标签"
        prop="labelIdListArray"
        :rules="[{ type: 'array' }]"
        >
          <el-select
            filterable
            multiple-limit='3'
            multiple
            class="w-input-235"
            v-model="temp.labelIdListArray"
            placeholder="不能超过3个"
            >
            <el-option v-for="goodsLabel in goodsLabelList" :key="+goodsLabel.id" :label="goodsLabel.labelName" :value="+goodsLabel.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可种植品种" prop="employIntroduction">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="temp.employIntroduction"></el-input>
        </el-form-item>
        <el-form-item label="土地认养说明" prop="description">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="temp.description"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoading">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 发布认养 -->
    <el-dialog title="发布认养" :visible.sync="dialogFormVisibleIssue">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="right" label-width="150px" style='width: 500px; margin-left:150px;'>
        <el-form-item label="产品类型" prop="goodsType">
          <el-select
            disabled
            class="w-input-235"
            v-model="temp.goodsType"
            placeholder="产品类型">
            <el-option v-for="(value, key) in goodsTypeCodeExLand" :key="key" :label="value" :value="+key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="goodsName">
          <el-input v-model="temp.goodsName" disabled></el-input>
        </el-form-item>
        <el-form-item label="接受认养开始时间" prop="startTime">
            <el-date-picker
              v-model="temp.startTime"
              type="datetime"
              placeholder="选择日期时间"
              @change="startTimeChange">
            </el-date-picker>
            <span style="color: red;">开始时间精确到小时</span>
          </el-form-item>
          <el-form-item label="接受认养结束时间" prop="endTime">
            <el-date-picker
              v-model="temp.endTime"
              type="datetime"
              placeholder="选择日期时间"
              @change="endTimeChange">
            </el-date-picker>
            <span style="color: red;">结束时间精确到小时</span>
          </el-form-item>
          <span style="color: red">#产品方案</span>
          <hr>
          <el-table
              :rules="rules"
              ref="multipleTable"
              :data="schemeTableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="schemeName" label="方案名称" width="120"></el-table-column>
            <el-table-column prop="price" label="价格(元)" width="160">
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.price" placeholder="元"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="数量(发布的认养份数)" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.count" placeholder="份数"></el-input>
              </template>
            </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoadingIssue">
        <el-button @click="dialogFormVisibleIssue = false">取 消</el-button>
        <el-button v-if="dialogStatusIssue=='createIssue'" type="primary" @click="createIssue">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ossImageUpload from 'views/components/ossImageUpload'

const goodsTypeCode = {
  '1': '家禽',
  '2': '蔬菜',
  '3': '水果',
  '4': '鱼塘',
  '5': '土地'
}

const goodsTypeCodeExLand = {
  '1': '家禽',
  '2': '蔬菜',
  '3': '水果',
  '4': '鱼塘'
}

const isSaleCode = {
  '0': '下架',
  '1': '上架'
}
export default {
  components: {
    'oss-image-upload': ossImageUpload
  },
  data() {
    return {
      listLoading: true,
      tableData: [],
      schemeTableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,

      price: null,
      multipleSelection: [],

      checkList: [],

      goodsName: null,
      goodsNo: null,
      merchantName: null,

      name: null,
      expressTemplateList: null,

      labelName: null,
      goodsLabelList: null,

      serviceName: null,
      appreciationServiceList: null,

      goodsTypeCode,
      goodsTypeCodeExLand,
      goodsType: null,

      isSaleCode,
      isSale: null,

      dialogFormVisibleIssue: false,
      formLoadingIssue: false,
      dialogStatusIssue: '',

      dialogFormVisibleOther: false,
      formLoadingOther: false,
      dialogStatusOther: '',

      formLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {},
      rules: {
        goodsName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        employPeriod: [
          { required: true, message: '必填' }
        ],
        description: [
          { required: true, message: '必填' }
        ],
        sort: [
          { required: true, message: '必填' }
        ],
        isSelfPick: [
          { required: true, message: '必填' }
        ],
        employIntroduction: [
          { required: true, message: '必填' }
        ],
        startTime: [
          { required: true, message: '必填' }
        ],
        endTime: [
          { required: true, message: '必填' }
        ],
        price: [
          { required: true, message: '必填' }
        ],
        count: [
          { required: true, message: '必填' }
        ]
      }
    }
  },
  methods: {
    $handleSizeChange(val) {
      this.$setPage(val)
      this.pageSize = val
      this.getTableList()
    },
    $handleCurrentChange(val) {
      this.currentPage = val
      this.getTableList()
    },
    // 表格行选择
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //  获取非土地产品
    async getGoodsOtherList() {
      if (this.goodsList != null) return
      const goodsRs = await this.$http.get('/goods/queryAllGoodsOtherList.json')
      this.goodsList = goodsRs.data.rows
    },
    // 获取配送模板列表
    async getExpressTemplateList() {
      if (this.expressTemplateList != null) return
      const expressTemplateRs = await this.$http.get('/expressTemplate/queryAllExpressTemplateList.json')
      this.expressTemplateList = expressTemplateRs.data.rows
    },
    // 获取产品标签列表
    async getGoodsLabelList() {
      if (this.goodsLabelList != null) return
      const goodsLabelRs = await this.$http.get('/goodsLabel/queryAllGoodsLabelList.json')
      this.goodsLabelList = goodsLabelRs.data.rows
    },
    // 获取产品增值服务列表
    async getAppreciationServiceList() {
      const appreciationServiceRs = await this.$http.get('/merchantAppreciationSer/queryAllAppreciationServiceList.json')
      this.appreciationServiceList = appreciationServiceRs.data.rows
    },
    async getTableList() {
      var params = {
        merchantName: this.merchantName,
        goodsNo: this.goodsNo,
        goodsName: this.goodsName,
        goodsType: this.goodsType || 99,
        isSale: this.isSale || 99,
        page: this.currentPage,
        rows: this.pageSize
      }
      this.listLoading = true
      const response = await this.$http.post('/goods/queryByPage.json', params)
      this.tableData = response.data.rows
      this.total = response.data.total
      this.listLoading = false
    },
    // 获取该养殖产品下的所有有效方案
    async getSchemeTableList(goodsId) {
      // this.listLoading = true
      // const rs = []
      const response = await this.$http.get('/goodsCultivationScheme/getSchemeByGoodsId.json', { goodsId })
      const array = response.data.rows
      array.map(item => {
        item.price = (item.price / 100).toFixed(2)
        return item
      })
      this.schemeTableData = array
    },
    // 添加其它类型产品
    handleCreateOther() {
      this.getGoodsLabelList()
      this.getAppreciationServiceList()
      this.resetTemp()
      this.getExpressTemplateList()
      this.dialogStatusOther = 'createOther'
      this.dialogFormVisibleOther = true
      this.formLoadingOther = false

      this.$resetFields('editForm')
      // 清空图片
      if (this.$refs['imageUploadProduct']) {
        this.$refs['imageUploadProduct'].clearFiles()
      }
    },
    async createOther() {
      await this.$validate('editForm')
      // 验证图片
      if (this.$refs['imageUploadProduct'].validateImage()) {
        const names = this.$refs['imageUploadProduct'].getImageRealNames()
        this.temp.images = names.join(',')
      } else {
        return
      }
      this.formLoadingOther = true
      const params = { ...this.temp }
      params.isSelfPick = this.temp.isSelfPick
      if (this.temp.expressTemplateId === null || this.temp.expressTemplateId === '') {
        params.expressTemplateId = 0
      }
      const response = await this.$http.post('/goods/insertGoodsOther.json', params)
      this.formLoadingOther = false
      this.dialogFormVisibleOther = false
      this.getTableList()
      this.$msg(response)
    },
    // 添加土地产品
    handleCreate() {
      this.getGoodsLabelList()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.formLoading = false
      this.$resetFields('editForm')
      // 清空图片
      if (this.$refs['imageUploadLand']) {
        this.$refs['imageUploadLand'].clearFiles()
      }
    },
    async create() {
      await this.$validate('editForm')
      // 验证图片
      if (this.$refs['imageUploadLand'].validateImage()) {
        const names = this.$refs['imageUploadLand'].getImageRealNames()
        this.temp.images = names.join(',')
      } else {
        return
      }
      this.formLoading = true
      const params = { ...this.temp }
      params.goodsType = 5
      const response = await this.$http.post('/goods/insertGoods.json', params)
      this.formLoading = false
      this.dialogFormVisible = false
      this.getTableList()
      this.$msg(response)
    },
    // 修改其它类型产品
    async handleUpdateOther(row) {
      row.labelIdListArray = []
      row.appreciationServiceArray = []
      await this.getGoodsLabelList()
      await this.getAppreciationServiceList()
      await this.getExpressTemplateList()
      // await this.handleGoodsLabelChange(row.id)
      this.dialogStatusOther = 'updateOther'
      this.dialogFormVisibleOther = true
      this.formLoadingOther = false

      await this.$resetFields('editForm')
      // 清空图片
      if (this.$refs['imageUploadProduct']) {
        this.$refs['imageUploadProduct'].clearFiles()
      }
      this.resetTemp()
      const temp = this.temp
      for (const key in temp) {
        temp[key] = row[key]
      }
      if (row.expressTemplateId === 0) {
        this.temp.expressTemplateId = null
      }
      const id = row.id
      // 查询该产品下的额外服务 回显给页面
      const respon = await this.$http.post('/merchantAppreciationSer/queryServiceListByGoodsId.json', { id })
      const rs = []
      const list = respon.data.rows
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        rs.push(item.id)
      }
      this.temp.appreciationServiceArray = rs
      // 查询该产品下的所含标签 回显给页面
      const response = await this.$http.post('/goods/queryGoodsById.json', { id })
      this.$refs['imageUploadProduct'].setDisplayImages(response.data.rows.images)
      const labelIdList = response.data.rows.labelIdList
      if (labelIdList === '') {
        this.temp.labelIdListArray = []
        return
      }
      let labelIdListArrays = []
      labelIdListArrays = labelIdList.replace(/\|/g, ',').split(',')
      for (let i = 0; i < labelIdListArrays.length; i++) {
        labelIdListArrays[i] = parseInt(labelIdListArrays[i])
      }
      temp.labelIdListArray = labelIdListArrays
    },
    async updateOther() {
      await this.$validate('editForm')

      // 验证图片
      if (this.$refs['imageUploadProduct'].validateImage()) {
        const names = this.$refs['imageUploadProduct'].getImageRealNames()
        this.temp.images = names.join(',')
      } else {
        return
      }

      this.formLoadingOther = true
      const params = { ...this.temp }
      const response = await this.$http.post('/goods/updateGoodsOther.json', params)
      this.formLoadingOther = false
      this.dialogFormVisibleOther = false
      this.getTableList()
      this.$msg(response)
    },
    // 修改土地产品
    async handleUpdate(row) {
      await this.getGoodsLabelList()
      // await this.handleMerchantChange(row.merchantNo)
      row.labelIdListArray = []
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.formLoading = false
      await this.$resetFields('editForm')
      // 清空图片
      if (this.$refs['imageUploadLand']) {
        this.$refs['imageUploadLand'].clearFiles()
      }
      this.resetTemp()
      const temp = this.temp
      for (const key in temp) {
        temp[key] = row[key]
      }
      const id = row.id
      // 查询该产品下的所含标签 回显给页面
      const response = await this.$http.post('/goods/queryGoodsById.json', { id })
      this.$refs['imageUploadLand'].setDisplayImages(response.data.rows.images)
      const labelIdList = response.data.rows.labelIdList
      if (labelIdList === '') {
        this.temp.labelIdListArray = []
        return
      }
      let labelIdListArrays = []
      labelIdListArrays = labelIdList.replace(/\|/g, ',').split(',')
      for (let i = 0; i < labelIdListArrays.length; i++) {
        labelIdListArrays[i] = parseInt(labelIdListArrays[i])
      }
      temp.labelIdListArray = labelIdListArrays
    },
    async update() {
      await this.$validate('editForm')
      // 验证图片
      if (this.$refs['imageUploadLand'].validateImage()) {
        const names = this.$refs['imageUploadLand'].getImageRealNames()
        this.temp.images = names.join(',')
      } else {
        return
      }
      this.formLoading = true
      const params = { ...this.temp }
      const response = await this.$http.post('/goods/updateGoods.json', params)
      this.formLoading = false
      this.dialogFormVisible = false
      this.getTableList()
      this.$msg(response)
    },
    // 产品上下架
    async handleUpdateIsSale(data) {
      await this.$myConfirm('是否上架产品?')
      const url = '/goods/updateSaleStatus.json'
      const id = data.id
      const isSale = 1
      const response = await this.$http.post(url, { id, isSale })
      this.getTableList()
      this.$msg(response)
    },
    async handleUpdateSale(data) {
      await this.$myConfirm('是否下架产品?')
      const url = '/goods/updateSaleStatus.json'
      const id = data.id
      const isSale = 0
      const response = await this.$http.post(url, { id, isSale })
      this.getTableList()
      this.$msg(response)
    },
    // 发布
    async handleCreateIssue(row) {
      if (row.isSale === 0) {
        this.$tip('下架产品不能发布!')
        return
      }
      await this.getSchemeTableList(row.id)
      this.dialogStatusIssue = 'createIssue'
      this.dialogFormVisibleIssue = true
      this.formLoadingIssue = false
      await this.$resetFields('editForm')
      this.resetTemp()
      const temp = this.temp
      for (const key in temp) {
        temp[key] = row[key]
      }
      this.temp.price = (this.temp.price / 100).toFixed(2)
    },
    // 发布
    async createIssue() {
      await this.$validate('editForm')
      this.formLoading = true
      var list = this.multipleSelection
      if (list.length === 0) {
        this.$tip('请选择需要发布的产品方案!')
        return
      }
      for (let i = 0; i < list.length; i++) {
        if (list[i].count === null || list[i].price === null) {
          this.$tip('价格或数量不能为空!')
          return
        }
      }
      list.map(item => {
        item.price = (item.price * 100).toFixed(0)
        return item
      })
      const params = {
        goodsId: this.temp.id,
        goodsNo: this.temp.goodsNo,
        goodsType: this.temp.goodsType,
        merchantId: this.temp.merchantId,
        goodsName: this.temp.goodsName,
        startTime: this.$toDataStr(this.temp.startTime, '{y}-{m}-{d} {h}:{i}:{s}'),
        endTime: this.$toDataStr(this.temp.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
      }
      if (!this.validateDate(params)) return
      const schemeStr = JSON.parse(JSON.stringify(list))
      params.paramss = JSON.stringify(schemeStr)
      const response = await this.$http.post('/goodsSchemeBatch/insertGoodsCultivationSchemeBatch.json', params)
      this.formLoadingIssue = false
      this.dialogFormVisibleIssue = false
      this.getTableList()
      this.$msg(response)
    },
    async handleDelete(data) {
      await this.$myConfirm('是否删除数据?')
      const id = data.id
      const goodsType = data.goodsType
      const response = await this.$http.post('/goods/deleteById.json', { id, goodsType })
      this.getTableList()
      this.$msg(response)
    },
    handleExport(row) {
      const params = {
        id: row.id,
        activityId: row.activityId
      }
      location.href = this.$baseApi() + '/goods/exportCashBackDetail.json?' +
                        this.$toQueryString(params)
    },
    // 时间
    startTimeChange(val) {
      const formatVal = this.formatDate(val)
      formatVal && (this.temp.startTime = this.dateStrToObj(formatVal))
    },
    endTimeChange(val) {
      const formatVal = this.formatDate(val)
      formatVal && (this.temp.endTime = this.dateStrToObj(formatVal))
    },
    formatDate(val) {
      if (!val) return

      let date = val
      if (!val.getTime) {
        date = this.dateStrToObj(val)
      }
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = date.getHours()
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      if (this.checkIn1hour(date) && !(date.getMinutes() === 0 && date.getSeconds() === 0)) {
        hour = (hour + 1) % 24
      }
      hour = hour < 10 ? '0' + hour : hour

      const newDateStr = year + '-' + month + '-' + day + ' ' + hour + ':00:00'
      return newDateStr
    },
    dateStrToObj(val) {
      val = val.replace(/-/g, '/')
      return new Date(val)
    },
    checkIn1hour(date) {
      const currentData = new Date()
      if (date.getFullYear() === currentData.getFullYear() &&
          date.getMonth() === currentData.getMonth() &&
          date.getDate() === currentData.getDate() &&
          date.getHours() === currentData.getHours()) {
        return true
      }
      return false
    },
    validateDate(params) {
      if (params.startTime < this.formatDate(new Date())) {
        this.$tip('开始时间必须大于当前时间')
        return false
      }
      if (params.startTime > params.endTime) {
        this.$tip('结束时间必须大于开始时间')
        return false
      }
      return true
    },
    resetTemp() {
      this.temp = {
        id: null,
        goodsId: null,
        goodsName: null,
        goodsNo: null,
        paymentSchemeId: null,
        employPeriod: null,
        labelIdList: null,
        labelIdListArray: [],
        employIntroduction: null,
        description: null,
        sort: null,
        goodsType: null,
        merchantId: null,

        isSelfPick: null,
        expressTemplateId: null,

        appreciationServiceArray: []
        // expressTemplateId: 1
      }
    }
    // handleGoodsChange(goodsNo, isUpdate) {
    //   this.goodsList.forEach(item => {
    //     if (+item.goodsNo === goodsNo) {
    //       this.temp.goodsName = item.goodsName
    //     }
    //   })
    // }
  },
  watch: {
    goodsType(val) {
      this.$handleFilter()
    },
    isSale(val) {
      this.$handleFilter()
    }
  },
  mounted() {
    this.getTableList()
  }
}
</script>

<style lang="scss" scoped>
.el-input__goodsName {
  width: 235px;
}
</style>
