<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleCreate">添加</el-button>
        <el-input @keyup.enter.native="$handleFilter" v-model="accountBankUsername" class="filter-item" placeholder="持卡人"></el-input>
        <el-input @keyup.enter.native="$handleFilter" v-model="accountBank" class="filter-item" placeholder="开户行名称"></el-input>
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
        <el-table-column class-name="ktx-operate" align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button v-if="$has('')" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="$has('')" size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="merchantName" label="商家名称" width="180">
        </el-table-column>
        <el-table-column prop="accountBankUsername" label="持卡人" width="110">
        </el-table-column>
        <el-table-column prop="accountBank" label="开户行名称" width="180">
        </el-table-column>
        <el-table-column prop="accountBankNo" label="银行账号" width="180">
        </el-table-column>
        <el-table-column prop="accountAddress" label="开户地" width="130">
        </el-table-column>
        <el-table-column prop="accountBranch" label="支行名称" width="150">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="150">
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

    <el-dialog title="商家账户详情" :visible.sync="dialogFormVisible">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="130px" style='width: 500px; margin-left:50px;'>
        <el-form-item label="所属商家" prop="merchantId">
          <el-select
            class="w-input-235"
            v-model="temp.merchantId"
            placeholder="请选择商家"
            @change="handleMerchantChange">
            <el-option v-for="merchant in merchantList" :key="merchant.id" :label="merchant.merchantName" :value="merchant.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户行名称" prop="accountBank">
          <el-input v-model="temp.accountBank"></el-input>
        </el-form-item>
        <el-form-item label="开户地" prop="accountAddress">
          <el-input v-model="temp.accountAddress"></el-input>
        </el-form-item>
        <!-- <el-form-item label="地区">
          <template>
              <area-select type='all' v-model="selected"></area-select>
          </template>
        </el-form-item> -->
        <el-form-item label="支行名称" prop="accountBranch">
          <el-input v-model="temp.accountBranch"></el-input>
        </el-form-item>
        <el-form-item label="银行卡账号" prop="accountBankNo">
          <el-input v-model="temp.accountBankNo" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="持卡人" prop="accountBankUsername">
          <el-input v-model="temp.accountBankUsername"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile"></el-input>
        </el-form-item>
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
// import { AreaSelect } from 'vue-area-linkage'
export default {
  // components: {
  //   'area-select': AreaSelect
  // },
  data() {
    return {
      listLoading: true,
      tableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,
      accountBankUsername: null,
      accountBank: null,

      // selected: [
      //   '1001', '广东'
      // ],

      merchantName: null,
      merchantNo: null,
      // id: null,
      merchantList: null,

      formLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {},
      rules: {
        accountBank: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        merchantId: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        accountAddress: [
          { required: true, message: '必填' }
        ],
        accountBankNo: [
          { required: true, message: '必填' }
        ],
        accountBankUsername: [
          { required: true, message: '必填' }
        ],
        mobile: [
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
    async getMerchantList() {
      if (this.merchantList != null) return
      const merchantRs = await this.$http.get('/merchant/queryAllMerchantList.json')
      this.merchantList = merchantRs.data.rows
    },
    async getTableList() {
      var params = {
        accountBankUsername: this.accountBankUsername,
        accountBank: this.accountBank,
        page: this.currentPage,
        rows: this.pageSize
      }
      this.listLoading = true
      const response = await this.$http.post('/merchantAccount/queryByPage.json', params)
      this.tableData = response.data.rows
      this.total = response.data.total
      this.listLoading = false
    },
    handleFilter() {
      this.currentPage = 1
      this.getTableList()
    },
    handleCreate() {
      this.getMerchantList()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.formLoading = false

      this.$resetFields('editForm')
    },
    async create() {
      await this.$validate('editForm')

      this.formLoading = true
      const params = { ...this.temp }
      const response = await this.$http.post('/merchantAccount/insertMerchantAccount.json', params)
      this.formLoading = false
      this.dialogFormVisible = false
      this.getTableList()
      this.$msg(response)
    },
    async handleUpdate(row) {
      await this.getMerchantList()
      await this.handleMerchantChange(row.merchantNo)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.formLoading = false

      await this.$resetFields('editForm')
      this.resetTemp()
      const temp = this.temp
      for (const key in temp) {
        temp[key] = row[key]
      }
    },
    async update() {
      await this.$validate('editForm')
      this.formLoading = true
      const params = { ...this.temp }
      const response = await this.$http.post('/merchantAccount/updateMerchantAccount.json', params)
      this.formLoading = false
      this.dialogFormVisible = false
      this.getTableList()
      this.$msg(response)
    },
    async handleDelete(data) {
      await this.$myConfirm('是否删除数据?')
      const id = data.id
      const response = await this.$http.post('/merchantAccount/deleteById.json', { id })
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
        // selected: [],
        merchantId: null,
        merchantNo: null,
        merchantName: null,
        accountBank: null,
        mobile: null,
        accountAddress: null,
        accountBankUsername: null,
        accountBranch: null,
        accountBankNo: null,
        isDeleted: null,
        updateTime: null,
        createTime: null
      }
    },
    handleMerchantChange(merchantNo, isUpdate) {
      this.merchantList.forEach(item => {
        if (+item.merchantNo === merchantNo) {
          this.temp.merchantName = item.merchantName
          // this.temp.price = item.price
          // this.temp.type = item.itemType
          // this.temp.period = item.chargePeriod
        }
      })
    }
  },
  mounted() {
    this.getTableList()
  }
}
</script>
