<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <!-- <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleCreate">添加方案</el-button> -->
        <el-input @keyup.enter.native="$handleFilter" v-model="schemeName" class="filter-item" placeholder="方案(规格)"></el-input>
        <el-input @keyup.enter.native="$handleFilter" v-model="goodsName" class="filter-item" placeholder="所属产品"></el-input>
        <el-select
              clearable
              class="filter-item"
              v-model="status"
              placeholder="状态">
              <el-option v-for="(value, key) in statusCode" :key="key" :label="value" :value="key"></el-option>
        </el-select>
        <span style="font-size: 14px;margin-left: 10px;">30天内到期</span>
            <el-switch v-model="expire" @change="$handleFilter"></el-switch>
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
        <el-table-column class-name="ktx-operate" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="$has('')" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="$has('') && scope.row.status === 1 && scope.row.schemeBatchNo === null" size="mini" @click="handleCreateIssue(scope.row)">发布认领</el-button>
            <!-- <el-button v-if="$has('') && scope.row.status === 1 && scope.row.schemeBatchNo !== null" size="mini" @click="handleAgainIssue(scope.row)">重新发布</el-button> -->
            <el-button v-if="$has('') && scope.row.status === 2" size="mini" @click="handleCancel(scope.row)">取消发布</el-button>
            <el-button v-if="$has('') && scope.row.status === 3" size="mini" @click="handleUsing(scope.row)">使用确认</el-button>
            <el-button v-if="$has('') && scope.row.status === 4" size="mini" @click="handleRenewal(scope.row)">发布续期</el-button>
            <!-- <el-button v-if="$has('') && scope.row.status === 5" size="mini" @click="handleUpdate(scope.row)">发布认领</el-button> -->
            <el-button v-if="$has('')" size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="landSchemeNo" label="方案编号" width="180">
        </el-table-column>
        <!-- <el-table-column prop="schemeBatchNo" label="产品发布批次号" width="180">
        </el-table-column> -->
        <el-table-column prop="schemeName" label="土地方案(规格)" width="180">
        </el-table-column>
        <el-table-column prop="goodsName" label="所属产品" width="180">
        </el-table-column>
        <el-table-column label="价格(元)" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.price | money }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="规格状态" width="130">
          <template slot-scope="scope">
                <span>{{ statusCode[scope.row.status] }}</span>
           </template>
        </el-table-column>
        <el-table-column prop="employEndTime" label="认领到期日期" width="170">
          <template slot-scope="scope">
            <span>{{scope.row.employEndTime | parseTime}}</span>
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

    <!-- 土地方案详情 -->
    <el-dialog title="土地方案详情" :visible.sync="dialogFormVisible">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="130px" style='width: 500px; margin-left:50px;'>
        <el-form-item label="所属土地产品" prop="goodsNo" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            disabled
            filterable
            class="w-input-235"
            v-model="temp.goodsNo"
            placeholder="请选择产品"
            @change="handleGoodsChange">
            <el-option v-for="goods in goodsList" :key="goods.goodsNo" :label="goods.goodsName" :value="goods.goodsNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="土地方案(规格)" prop="schemeName">
          <el-input v-model="temp.schemeName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
          <el-input type="number" v-model="temp.price" onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"></el-input>
        </el-form-item>

        <!-- 图片组件 -->
        <oss-image-upload
          ref="imageUpload"
          :imageLimit="1"
          :isUploadNecessary="true"
          :imageFileType="4"
          :maxSize="3">
        </oss-image-upload><br>
        <!-- end -->
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoading">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 发布认领 -->
    <el-dialog title="发布认领" :visible.sync="dialogFormVisibleIssue">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="130px" style='width: 500px; margin-left:50px;'>
        <el-form-item label="产品类型">
          <el-input v-model="type" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属土地产品" prop="goodsNo">
          <el-select
            disabled="true"
            class="w-input-235"
            v-model="temp.goodsNo"
            placeholder="请选择产品"
            @change="handleGoodsChange">
            <el-option v-for="goods in goodsList" :key="goods.goodsNo" :label="goods.goodsName" :value="goods.goodsNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="土地方案(规格)" prop="schemeName">
          <el-input v-model="temp.schemeName" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
          <el-input v-model="temp.price" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="数量(认领份数)">
          <el-input v-model="count" disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoadingIssue">
        <el-button @click="dialogFormVisibleIssue = false">取 消</el-button>
        <el-button v-if="dialogStatusIssue=='createIssue'" type="primary" @click="createIssue">确 定</el-button>
        <!-- <el-button v-else type="primary" @click="update">确 定</el-button> -->
      </div>
    </el-dialog>

    <!-- 过期后的发布认领 -->
    <el-dialog title="发布认领" :visible.sync="dialogFormVisibleIssueByExpire">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="130px" style='width: 500px; margin-left:50px;'>
        <el-form-item label="产品类型">
          <el-input v-model="type" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属土地产品" prop="goodsNo">
          <el-select
            disabled="true"
            class="w-input-235"
            v-model="temp.goodsNo"
            placeholder="请选择产品"
            @change="handleGoodsChange">
            <el-option v-for="goods in goodsList" :key="goods.goodsNo" :label="goods.goodsName" :value="goods.goodsNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="土地方案(规格)" prop="schemeName">
          <el-input v-model="temp.schemeName" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
          <el-input v-model="temp.price" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="数量(认领份数)">
          <el-input v-model="count" disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoadingIssueByExpire">
        <el-button @click="dialogFormVisibleIssueByExpire = false">取 消</el-button>
        <el-button v-if="dialogStatusIssueByExpire=='createIssueByExpire'" type="primary" @click="createIssueByExpire">确 定</el-button>
        <!-- <el-button v-else type="primary" @click="update">确 定</el-button> -->
      </div>
    </el-dialog>

    <!-- 点击确认使用 出现 开始使用和驳回使用按钮 -->
    <el-dialog title="使用确认" :visible.sync="dialogFormVisibleIssueBtn" width="500px">
      <el-form class="small-space"
        :model="using"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="80px" style='margin: 0 20px;'>
        <el-form-item label="请选择" prop="usingBtn">
          <el-select
            class="w-input-235"
            v-model="using.usingBtn"
            >
            <el-option v-for="(value, key) in usingBtnCode" :key="+key" :label="value" :value="+key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="cancelReason" label="驳回原因" v-if="this.using.usingBtn === 2">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="using.cancelReason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoadingIssueBtn">
        <el-button @click="dialogFormVisibleIssueBtn = false">取 消</el-button>
        <el-button v-if="this.using.usingBtn === 1" type="primary" @click="createIssueBtn">确定使用</el-button>
        <el-button v-if="this.using.usingBtn === 2" type="primary" @click="createCancelIssueBtn">驳回使用</el-button>
        <!-- <el-button v-else type="primary" @click="update">确 定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ossImageUpload from 'views/components/ossImageUpload'

const statusCode = {
  '1': '待售',
  '2': '出售中',
  '3': '已售出',
  '4': '使用中',
  '5': '到期'
}

const usingBtnCode = {
  '1': '开始使用',
  '2': '驳回使用'
}

const expireNum = 31

export default {
  components: {
    'oss-image-upload': ossImageUpload
  },
  data() {
    return {
      count: '1',
      type: '土地',
      listLoading: true,
      tableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,
      goodsList: null,
      goodsName: null,
      goodsNo: null,
      price: null,
      schemeName: null,

      expire: false,
      tempRow: null,
      tempData: null,
      usingBtnCode,

      //  确认使用
      formLoadingIssueBtn: false,
      dialogFormVisibleIssueBtn: false,
      // dialogStatusIssue: '',

      //  过期后的发布认领
      formLoadingIssueByExpire: false,
      dialogFormVisibleIssueByExpire: false,
      dialogStatusIssueByExpire: '',

      statusCode,
      status: null,

      formLoadingIssue: false,
      dialogFormVisibleIssue: false,
      dialogStatusIssue: '',

      formLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {},
      using: {
        usingBtn: 1,
        cancelReason: null
      },
      rules: {
        schemeName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        cancelReason: [
          { required: true, message: '必填', trigger: 'blur' }
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
    async getGoodsList() {
      if (this.goodsList != null) return
      const goodsRs = await this.$http.get('/goods/queryAllGoodsLandList.json')
      this.goodsList = goodsRs.data.rows
    },
    // 日期相加，返回相加后日期
    addDate(num = expireNum) {
      var time = new Date().getTime() + (1000 * 60 * 60 * 24) * num
      return new Date(time)
    },
    async getTableList() {
      var params = {
        schemeName: this.schemeName,
        goodsName: this.goodsName,
        status: this.status || 99,
        page: this.currentPage,
        rows: this.pageSize
      }
      // 30天内到期按钮
      if (this.expire) {
        params.expireTime = this.$toDataStr(this.addDate(expireNum), '{y}-{m}-{d}')
      } else {
        params.expireTime = null
      }
      this.listLoading = true
      const response = await this.$http.post('/goodsLandScheme/queryByPage.json', params)
      this.tableData = response.data.rows
      this.total = response.data.total
      this.listLoading = false
    },
    // 添加土地方案
    handleCreate() {
      this.getGoodsList()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.formLoading = false

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

      this.formLoading = true
      const params = { ...this.temp }
      params.price = (this.temp.price * 100).toFixed(0)
      const response = await this.$http.post('/goodsLandScheme/insertGoodsLandScheme.json', params)
      this.formLoading = false
      this.dialogFormVisible = false
      this.getTableList()
      this.$msg(response)
    },
    // 修改土地方案
    async handleUpdate(row) {
      await this.getGoodsList()
      await this.handleGoodsChange(row.goodsNo)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.formLoading = false

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
      this.temp.price = (this.temp.price / 100).toFixed(2)
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
      this.formLoading = true
      const params = { ...this.temp }
      params.price = (this.temp.price * 100).toFixed(0)
      const response = await this.$http.post('/goodsLandScheme/updateGoodsLandScheme.json', params)
      this.formLoading = false
      this.dialogFormVisible = false
      this.getTableList()
      this.$msg(response)
    },
    // 发布认领
    async handleCreateIssue(row) {
      await this.getGoodsList()
      await this.handleGoodsChange(row.goodsNo)
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
    async createIssue() {
      await this.$validate('editForm')
      this.formLoading = true
      // const params = { ...this.temp }
      const params = {
        landSchemeNo: this.temp.landSchemeNo,
        goodsId: this.temp.goodsId,
        goodsNo: this.temp.goodsNo,
        merchantId: this.temp.merchantId,
        schemeName: this.temp.schemeName,
        count: 1
      }
      params.price = (this.temp.price * 100).toFixed(0)
      const response = await this.$http.post('/goodsSchemeBatch/insertGoodsSchemeBatch.json', params)
      this.formLoadingIssue = false
      this.dialogFormVisibleIssue = false
      this.getTableList()
      this.$msg(response)
    },
    // 取消发布
    async handleCancel(data) {
      await this.$myConfirm('是否取消发布?')
      const schemeBatchNo = data.schemeBatchNo
      const landSchemeNo = data.landSchemeNo
      const id = data.id
      const response = await this.$http.post('/goodsSchemeBatch/cancelIssue.json', { schemeBatchNo, landSchemeNo, id })
      this.getTableList()
      this.$msg(response)
    },
    // 使用确认 弹出框
    async handleUsing(data) {
      this.tempData = data
      this.dialogFormVisibleIssueBtn = true
      this.formLoadingIssueBtn = false
      if (this.$refs['editForm']) {
        this.$refs['editForm'].resetFields()
      }
    },
    // 确认使用
    async createIssueBtn() {
      const data = this.tempData
      const schemeBatchNo = data.schemeBatchNo
      const id = data.id
      const goodsName = data.goodsName
      const goodsNo = data.goodsNo
      const schemeBatchId = data.schemeBatchId
      const response = await this.$http.post('/goodsSchemeBatch/using.json', { schemeBatchNo, id, goodsName, goodsNo, schemeBatchId })
      this.dialogFormVisibleIssueBtn = false
      this.getTableList()
      this.$msg(response)
    },
    // 驳回使用
    async createCancelIssueBtn() {
      const data = this.tempData
      const params = {
        landSchemeId: data.id,
        schemeBatchNo: data.schemeBatchNo,
        schemeBatchId: data.schemeBatchId,
        cancelReason: this.using.cancelReason
      }
      const response = await this.$http.post('/goodsSchemeBatch/rejectUsing.json', params)
      this.dialogFormVisibleIssueBtn = false
      this.getTableList()
      this.$msg(response)
    },
    // 过期后的发布认领
    async handleCreateIssueByExpire(row) {
      this.tempRow = row
      await this.getGoodsList()
      await this.handleGoodsChange(row.goodsNo)
      this.dialogStatusIssueByExpire = 'createIssueByExpire'
      this.dialogFormVisibleIssueByExpire = true
      this.formLoadingIssueByExpire = false

      await this.$resetFields('editForm')
      this.resetTemp()
      const temp = this.temp
      for (const key in temp) {
        temp[key] = row[key]
      }
      this.temp.price = (this.temp.price / 100).toFixed(2)
    },
    async createIssueByExpire() {
      await this.$validate('editForm')
      this.formLoading = true
      const params = {
        schemeId: this.temp.id,
        schemeNo: this.temp.landSchemeNo,
        goodsId: this.temp.goodsId,
        goodsNo: this.temp.goodsNo,
        merchantId: this.temp.merchantId,
        schemeName: this.temp.schemeName,
        count: 1,
        schemeBatchNo: this.tempRow.schemeBatchNo
      }
      params.price = (this.temp.price * 100).toFixed(0)
      const response = await this.$http.post('/goodsSchemeBatch/insertGoodsSchemeBatchByExpire.json', params)
      this.formLoadingIssueByExpire = false
      this.dialogFormVisibleIssueByExpire = false
      this.getTableList()
      this.$msg(response)
    },
    // 发布续期
    async handleRenewal(data) {
      await this.$myConfirm('是否确认发布续期?')
      const schemeBatchNo = data.schemeBatchNo
      const id = data.id
      const response = await this.$http.post('/goodsSchemeBatch/renewal.json', { id, schemeBatchNo })
      this.getTableList()
      this.$msg(response)
    },
    async handleDelete(data) {
      if (data.status === 3 || data.status === 4) {
        this.$tip('只能删除“待售、出售中 、已到期”的 规格!')
        return
      }
      await this.$myConfirm('是否删除数据?不可恢复！')
      const id = data.id
      const response = await this.$http.post('/goodsLandScheme/deleteById.json', { id })
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
        price: null,
        goodsNo: null,
        schemeName: null,
        goodsName: null,
        merchantId: null,
        goodsId: null,
        landSchemeNo: null,
        count: '1'
      }
    },
    handleGoodsChange(goodsNo, isUpdate) {
      this.goodsList.forEach(item => {
        if (+item.goodsNo === goodsNo) {
          this.temp.goodsName = item.goodsName
          // this.temp.price = item.price
          // this.temp.type = item.itemType
          // this.temp.period = item.chargePeriod
        }
      })
    }
  },
  watch: {
    status(val) {
      this.$handleFilter()
    }
  },
  mounted() {
    this.getTableList()
  }
}
</script>
