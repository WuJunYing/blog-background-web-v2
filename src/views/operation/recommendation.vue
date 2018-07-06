<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleCreateFarm">新增农场推广</el-button>
        <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleCreateGoods">新增产品推广</el-button>
        <!-- <el-input @keyup.enter.native="$handleFilter" v-model="abc" class="filter-item" placeholder="模块名称"></el-input>
        <el-input @keyup.enter.native="$handleFilter" v-model="abc" class="filter-item" placeholder="日期"></el-input> -->
        <el-select
              clearable
              class="filter-item"
              v-model="moduleType"
              placeholder="模块名称">
              <el-option v-for="(value, key) in moduleTypeCode" :key="key" :label="value" :value="key"></el-option>
        </el-select>
        <el-select
              clearable
              class="filter-item"
              v-model="type"
              placeholder="推广类型">
              <el-option v-for="(value, key) in typeCode" :key="key" :label="value" :value="key"></el-option>
        </el-select>
        <el-select
              clearable
              class="filter-item"
              v-model="isShow"
              placeholder="是否显示">
              <el-option v-for="(value, key) in isShowCode" :key="key" :label="value" :value="key"></el-option>
        </el-select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span>开始时间:</span>
        <el-date-picker
          v-model="startTimeParam"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <span>-</span>
        <el-date-picker
          v-model="endTimeParam"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
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
            <el-button v-if="$has('') && scope.row.type === 1" size="mini" @click="handleUpdateFarm(scope.row)">修改</el-button>
            <el-button v-if="$has('') && scope.row.type === 1" size="mini" @click="handleDetailFarm(scope.row)">详情</el-button>
            <el-button v-if="$has('') && scope.row.type === 2" size="mini" @click="handleUpdateGoods(scope.row)">修改</el-button>
            <el-button v-if="$has('') && scope.row.type === 2" size="mini" @click="handleDetailGoods(scope.row)">详情</el-button>
            <el-button v-if="$has('')" size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="推广类型" width="180">
          <template slot-scope="scope">
                <span>{{ typeCode[scope.row.type] }}</span>
           </template>
        </el-table-column>
        <el-table-column prop="merchantName" label="农场名称" width="180">
        </el-table-column>
        <el-table-column prop="goodsName" label="产品名称" width="180">
        </el-table-column>
        <el-table-column prop="moduleType" label="模块名称" width="180">
          <template slot-scope="scope">
                <span>{{ moduleTypeCode[scope.row.moduleType] }}</span>
           </template>
        </el-table-column>
        <el-table-column prop="isShow" label="是否显示" width="100">
          <template slot-scope="scope">
                <span>{{ isShowCode[scope.row.isShow] }}</span>
           </template>
        </el-table-column>
        <el-table-column prop="sort" label="优先级" width="100">
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="170">
          <template slot-scope="scope">
            <span>{{scope.row.startTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="170">
          <template slot-scope="scope">
            <span>{{scope.row.endTime | parseTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="ktx-page-block">
        <el-pagination @size-change="$handleSizeChange" @current-change="$handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 农场推广详情 -->
    <el-dialog title="农场推广详情" :visible.sync="dialogFormVisibleFarmDetail" width="580px">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="120px" style="margin:0 30px;">
        <el-form-item label="农场" prop="fromId" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            disabled
            class="w-input-235"
            v-model="temp.fromId"
            placeholder="请选择"
            >
            <el-option v-for="merchant in merchantList" :key="merchant.id" :label="merchant.merchantName" :value="merchant.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块名称" prop="moduleType" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            disabled
            class="w-input-235"
            v-model="temp.moduleType"
            placeholder="请选择">
            <el-option v-for="(value, key) in moduleTypeCodeOne" :key="key" :label="value" :value="+key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-date-picker
            disabled
            v-model="temp.startTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-date-picker
            disabled
            v-model="temp.endTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="优先级" prop="sort">
          <el-input disabled class="el-input__sort" type="number" v-model="temp.sort"></el-input>
          <span style="color: red;">数字越大优先级越高</span>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            disabled
            class="w-input-235"
            v-model="temp.isShow"
            placeholder="请选择">
            <el-option v-for="(value, key) in isShowCode" :key="key" :label="value" :value="+key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoadingFarmDetail">
      </div>
    </el-dialog>
    <!-- 农场推广 -->
    <el-dialog title="农场推广" :visible.sync="dialogFormVisibleFarm" width="580px">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="120px" style="margin:0 30px;">
        <el-form-item label="农场" prop="fromId" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            class="w-input-235"
            v-model="temp.fromId"
            placeholder="请选择"
            >
            <el-option v-for="merchant in merchantList" :key="merchant.id" :label="merchant.merchantName" :value="merchant.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块名称" prop="moduleType" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            class="w-input-235"
            v-model="temp.moduleType"
            placeholder="请选择">
            <el-option v-for="(value, key) in moduleTypeCodeOne" :key="key" :label="value" :value="+key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-date-picker
            v-model="temp.startTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-date-picker
            v-model="temp.endTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="优先级" prop="sort">
          <el-input class="el-input__sort" type="number" v-model="temp.sort"></el-input>
          <span style="color: red;">数字越大优先级越高</span>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            class="w-input-235"
            v-model="temp.isShow"
            placeholder="请选择">
            <el-option v-for="(value, key) in isShowCode" :key="key" :label="value" :value="+key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoadingFarm">
        <el-button @click="dialogFormVisibleFarm = false">取 消</el-button>
        <el-button v-if="dialogStatusFarm=='createFarm'" type="primary" @click="createFarm">确 定</el-button>
        <el-button v-else type="primary" @click="updateFarm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 产品推广 -->
    <el-dialog title="产品推广" :visible.sync="dialogFormVisibleGoods" width="580px">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="120px" style="margin:0 30px;">
        <el-form-item label="所属农场" prop="merchantId" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            class="w-input-235"
            v-model="temp.merchantId"
            placeholder="请选择"
            @change="getGoodListBymerchanId"
            >
            <el-option v-for="merchant in merchantList" :key="+merchant.id" :label="merchant.merchantName" :value="+merchant.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="goodsId" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            class="w-input-235"
            v-model="temp.goodsId"
            placeholder="请选择"
            >
            <el-option v-for="goods in goodsList" :key="goods.id" :label="goods.goodsName" :value="goods.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块名称" prop="moduleType" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            class="w-input-235"
            v-model="temp.moduleType"
            placeholder="请选择">
            <el-option v-for="(value, key) in moduleTypeCodeTwo" :key="key" :label="value" :value="+key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-date-picker
            v-model="temp.startTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-date-picker
            v-model="temp.endTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="优先级" prop="sort">
          <el-input class="el-input__sort" type="number" v-model="temp.sort"></el-input>
          <span style="color: red;">数字越大优先级越高</span>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            class="w-input-235"
            v-model="temp.isShow"
            placeholder="请选择">
            <el-option v-for="(value, key) in isShowCode" :key="key" :label="value" :value="+key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoadingGoods">
        <el-button @click="dialogFormVisibleGoods = false">取 消</el-button>
        <el-button v-if="dialogStatusGoods=='createGoods'" type="primary" @click="createGoods">确 定</el-button>
        <el-button v-else type="primary" @click="updateGoods">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 产品推广详情 -->
    <el-dialog title="产品推广详情" :visible.sync="dialogFormVisibleGoodsDetail"  width="580px">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="120px" style="margin:0 30px;">
        <el-form-item label="所属农场" prop="merchantId" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            disabled
            class="w-input-235"
            v-model="temp.merchantId"
            placeholder="请选择"
            @change="getGoodListBymerchanId"
            >
            <el-option v-for="merchant in merchantList" :key="+merchant.id" :label="merchant.merchantName" :value="+merchant.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="goodsId" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            disabled
            class="w-input-235"
            v-model="temp.goodsId"
            placeholder="请选择"
            >
            <el-option v-for="goods in goodsList" :key="goods.id" :label="goods.goodsName" :value="goods.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块名称" prop="moduleType" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            disabled
            class="w-input-235"
            v-model="temp.moduleType"
            placeholder="请选择">
            <el-option v-for="(value, key) in moduleTypeCodeTwo" :key="key" :label="value" :value="+key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-date-picker
            disabled
            v-model="temp.startTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-date-picker
            disabled
            v-model="temp.endTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="优先级" prop="sort">
          <el-input disabled class="el-input__sort" type="number" v-model="temp.sort"></el-input>
          <span style="color: red;">数字越大优先级越高</span>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            disabled
            class="w-input-235"
            v-model="temp.isShow"
            placeholder="请选择">
            <el-option v-for="(value, key) in isShowCode" :key="key" :label="value" :value="+key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoadingGoodsDetail">
      </div>
    </el-dialog>
  </div>
</template>

<script>
const moduleTypeCode = {
  '1': '首页底部',
  '2': '产品底部'
}
const moduleTypeCodeOne = {
  '1': '首页底部'
}

const moduleTypeCodeTwo = {
  '2': '产品底部'
}

const typeCode = {
  '1': '农场推广',
  '2': '产品推广'
}

const isShowCode = {
  '0': '否',
  '1': '是'
}
export default {
  data() {
    return {
      listLoading: true,
      tableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,

      merchantList: null,
      goodsList: null,
      merchantNo: null,
      moduleTypeCode,
      moduleTypeCodeOne,
      moduleTypeCodeTwo,
      moduleType: null,
      isShowCode,
      isShow: null,
      typeCode,
      type: null,

      startTimeParam: null,
      endTimeParam: null,

      formLoadingGoodsDetail: false,
      dialogFormVisibleGoodsDetail: false,

      formLoadingGoods: false,
      dialogFormVisibleGoods: false,
      dialogStatusGoods: '',

      formLoadingFarmDetail: false,
      dialogFormVisibleFarmDetail: false,

      formLoadingFarm: false,
      dialogFormVisibleFarm: false,
      dialogStatusFarm: '',
      temp: {},
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        cashBackAmount: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getTableList() {
      var params = {
        startTimeParam: this.startTimeParam,
        endTimeParam: this.endTimeParam,
        moduleType: this.moduleType || 99,
        isShow: this.isShow || 99,
        type: this.type || 99,
        page: this.currentPage,
        rows: this.pageSize
      }
      params.startTimeParam = this.$toDataStr(this.startTimeParam, '{y}-{m}-{d} {h}:{i}:{s}')
      params.endTimeParam = this.$toDataStr(this.endTimeParam, '{y}-{m}-{d} {h}:{i}:{s}')
      this.listLoading = true
      const response = await this.$http.post('/operationRecommendation/queryByPage.json', params)
      this.tableData = response.data.rows
      this.total = response.data.total
      this.listLoading = false
    },
    //  获取不等于0的所有商家
    async getMerchantList() {
      if (this.merchantList != null) return
      const merchantRs = await this.$http.get('/merchant/queryAllMerchantList.json')
      this.merchantList = merchantRs.data.rows
    },
    //  农场推广详情
    async handleDetailFarm(row) {
      this.dialogFormVisibleFarmDetail = true
      this.formLoadingFarmDetail = false
      this.getMerchantList()
      await this.$resetFields('editForm')
      this.resetTemp()
      const temp = this.temp
      for (const key in temp) {
        temp[key] = row[key]
      }
    },
    //  产品推广详情
    async handleDetailGoods(row) {
      this.dialogFormVisibleGoodsDetail = true
      this.formLoadingGoodsDetail = false
      this.getMerchantList()
      //  通过产品id 查出商家id
      //  赋值商家id 回显页面
      //  再通过商家di  查出产品
      const id = row.fromId
      const rs = await this.$http.post('/goods/queryGoodsById.json', { id })
      this.getGoodListBymerchanId(rs.data.rows.merchantId)
      await this.$resetFields('editForm')
      this.resetTemp()
      const temp = this.temp
      for (const key in temp) {
        temp[key] = row[key]
      }
      this.temp.merchantId = rs.data.rows.merchantId
      this.temp.goodsId = row.fromId
    },
    //  新增农场推广
    handleCreateFarm() {
      this.resetTemp()
      this.getMerchantList()
      this.dialogStatusFarm = 'createFarm'
      this.dialogFormVisibleFarm = true
      this.formLoadingFarm = false

      this.$resetFields('editForm')
    },
    async createFarm() {
      await this.$validate('editForm')
      this.formLoadingFarm = true
      const params = { ...this.temp }
      params.startTime = this.$toDataStr(this.temp.startTime, '{y}-{m}-{d} {h}:{i}:{s}')
      params.endTime = this.$toDataStr(this.temp.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
      params.type = 1
      const response = await this.$http.post('/operationRecommendation/save.json', params)
      this.formLoadingFarm = false
      this.dialogFormVisibleFarm = false
      this.getTableList()
      this.$msg(response)
    },
    //  新增产品推广
    handleCreateGoods() {
      this.resetTemp()
      this.getMerchantList()
      this.dialogStatusGoods = 'createGoods'
      this.dialogFormVisibleGoods = true
      this.formLoadingGoods = false
      this.$resetFields('editForm')
    },
    async createGoods() {
      await this.$validate('editForm')
      this.formLoadingGoods = true
      const params = { ...this.temp }
      params.startTime = this.$toDataStr(this.temp.startTime, '{y}-{m}-{d} {h}:{i}:{s}')
      params.endTime = this.$toDataStr(this.temp.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
      params.type = 2
      params.fromId = this.temp.goodsId
      const response = await this.$http.post('/operationRecommendation/save.json', params)
      this.formLoadingGoods = false
      this.dialogFormVisibleGoods = false
      this.getTableList()
      this.$msg(response)
    },
    //  农场推广修改
    async handleUpdateFarm(row) {
      this.dialogStatusFarm = 'updateFarm'
      this.dialogFormVisibleFarm = true
      this.formLoadingFarm = false
      this.getMerchantList()
      await this.$resetFields('editForm')
      this.resetTemp()
      const temp = this.temp
      for (const key in temp) {
        temp[key] = row[key]
      }
    },
    async updateFarm() {
      await this.$validate('editForm')
      this.formLoadingFarm = true
      const params = { ...this.temp }
      params.startTime = this.$toDataStr(this.temp.startTime, '{y}-{m}-{d} {h}:{i}:{s}')
      params.endTime = this.$toDataStr(this.temp.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
      const response = await this.$http.post('/operationRecommendation/save.json', params)
      this.formLoadingFarm = false
      this.dialogFormVisibleFarm = false
      this.getTableList()
      this.$msg(response)
    },
    //  产品推广修改
    async handleUpdateGoods(row) {
      this.dialogStatusGoods = 'updateGoods'
      this.dialogFormVisibleGoods = true
      this.formLoadingGoods = false
      this.getMerchantList()
      //  通过产品id 查出商家id
      //  赋值商家id 回显页面
      //  再通过商家di  查出产品
      const id = row.fromId
      const rs = await this.$http.post('/goods/queryGoodsById.json', { id })
      this.getGoodListBymerchanId(rs.data.rows.merchantId)
      await this.$resetFields('editForm')
      this.resetTemp()
      const temp = this.temp
      for (const key in temp) {
        temp[key] = row[key]
      }
      this.temp.merchantId = rs.data.rows.merchantId
      this.temp.goodsId = row.fromId
    },
    async updateGoods() {
      await this.$validate('editForm')
      this.formLoadingGoods = true
      const params = { ...this.temp }
      params.startTime = this.$toDataStr(this.temp.startTime, '{y}-{m}-{d} {h}:{i}:{s}')
      params.endTime = this.$toDataStr(this.temp.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
      params.fromId = this.temp.goodsId
      params.type = 2
      const response = await this.$http.post('/operationRecommendation/save.json', params)
      this.formLoadingGoods = false
      this.dialogFormVisibleGoods = false
      this.getTableList()
      this.$msg(response)
    },
    async getGoodListBymerchanId(merchantId) {
      this.temp.goodsId = ''
      const response = await this.$http.post('/goods/getGoodListByMerchantId.json', { merchantId })
      this.goodsList = response.data.rows
    },
    async handleDelete(data) {
      await this.$myConfirm('是否删除数据?')
      const id = data.id
      const isDeleted = 1
      const response = await this.$http.post('/operationRecommendation/save.json', { id, isDeleted })
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
        type: null,
        // goodsName: null,
        moduleType: null,
        fromId: null,
        goodsId: null,
        startTime: null,
        endTime: null,
        isShow: null,
        sort: null
      }
    }
  },
  watch: {
    isShow(val) {
      this.$handleFilter()
    },
    type(val) {
      this.$handleFilter()
    },
    moduleType(val) {
      this.$handleFilter()
    }
  },
  mounted() {
    this.getTableList()
  }
}
</script>

<style lang="scss" scoped>
.el-input__sort {
  width: 61%;
}
</style>
