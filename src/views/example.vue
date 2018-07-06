<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleCreate">添加</el-button>
        <el-input @keyup.enter.native="$handleFilter" v-model="name" class="filter-item" placeholder="素材名称"></el-input>
        <el-input @keyup.enter.native="$handleFilter" v-model="cashBackNo" class="filter-item" placeholder="素材编号"></el-input>
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
        <el-table-column class-name="ktx-operate" align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-button v-if="$has('')" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="$has('')" size="mini" plain type="success" @click="handleExport(scope.row)">导出</el-button>
            <el-button v-if="$has('')" size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="cashBackNo" label="素材编号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="素材名称" width="180">
        </el-table-column>
        <el-table-column label="返现金额(元)" width="130">
          <template slot-scope="scope">
            {{ scope.row.cashBackAmount | money }}
          </template>
        </el-table-column>
        <el-table-column prop="cashBackMonth" label="返现月数" width="130">
        </el-table-column>
        <el-table-column label="已返现金额" width="130">
          <template slot-scope="scope">
            {{ scope.row.alreadyAmountTotal | money }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="剩余返现金额" width="130">
          <template slot-scope="scope">
            {{ scope.row.remainAmountTotal | money }}
          </template>
        </el-table-column>
        <el-table-column prop="times" label="参与人数" width="130">
        </el-table-column>
        <el-table-column prop="activityNo" label="关联活动" width="180">
        </el-table-column>
      </el-table>
      <div class="ktx-page-block">
        <el-pagination @size-change="$handleSizeChange" @current-change="$handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="返现素材" :visible.sync="dialogFormVisible">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="130px" style='width: 500px; margin-left:50px;'>
        <el-form-item label="素材名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="返现总金额(元)" prop="cashBackAmount">
          <el-input v-model="temp.cashBackAmount"></el-input>
        </el-form-item>
        <el-form-item label="返现月数" prop="cashBackMonth">
          <el-input v-model="temp.cashBackMonth"></el-input>
        </el-form-item>
        <el-form-item label="使用说明">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="temp.description"></el-input>
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
export default {
  data() {
    return {
      listLoading: true,
      tableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,
      name: null,
      cashBackNo: null,

      formLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {},
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        cashBackAmount: [
          { required: true, message: '必填' }
        ],
        cashBackMonth: [
          { required: true, message: '必填' }
        ]
      }
    }
  },
  methods: {
    async getTableList() {
      var params = {
        name: this.name,
        cashBackNo: this.cashBackNo,
        page: this.currentPage,
        rows: this.pageSize
      }
      this.listLoading = true
      const response = await this.$http.get('/activity_cashback/queryByPage.json', params)
      this.tableData = response.data.rows
      this.total = response.data.total
      this.listLoading = false
    },
    handleCreate() {
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
      params.cashBackAmount = (this.temp.cashBackAmount * 100).toFixed(0)
      const response = await this.$http.post('/activity_cashback/insert.json', params)
      this.formLoading = false
      this.dialogFormVisible = false
      this.getTableList()
      this.$msg(response)
    },
    async handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.formLoading = false

      await this.$resetFields('editForm')
      this.resetTemp()
      const temp = this.temp
      for (const key in temp) {
        temp[key] = row[key]
      }
      this.temp.cashBackAmount = (this.temp.cashBackAmount / 100).toFixed(2)
    },
    async update() {
      await this.$validate('editForm')

      this.formLoading = true
      const params = { ...this.temp }
      params.cashBackAmount = (this.temp.cashBackAmount * 100).toFixed(0)
      const response = await this.$http.post('/activity_cashback/update.json', params)
      this.formLoading = false
      this.dialogFormVisible = false
      this.getTableList()
      this.$msg(response)
    },
    async handleDelete(data) {
      await this.$myConfirm('是否删除数据?')

      const id = data.id
      const response = await this.$http.post('/activity_cashback/delete.json', { id })
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
        name: null,
        cashBackAmount: null,
        cashBackMonth: null,
        description: null
      }
    }
  },
  mounted() {
    this.getTableList()
  }
}
</script>
