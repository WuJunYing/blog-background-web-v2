<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleCreate">添加</el-button>
        <el-input @keyup.enter.native="$handleFilter" v-model="labelName" class="filter-item" placeholder="标签名称"></el-input>
        <el-select
              clearable
              class="filter-item"
              v-model="is_show"
              placeholder="是否显示">
              <el-option v-for="(value, key) in is_showCode" :key="key" :label="value" :value="key"></el-option>
        </el-select>
        <el-select
              clearable
              class="filter-item"
              v-model="type"
              placeholder="标签类型">
              <el-option v-for="(value, key) in typeCode" :key="key" :label="value" :value="key"></el-option>
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
        <el-table-column class-name="ktx-operate" align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button v-if="$has('')" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="$has('')" size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="编号" width="150">
        </el-table-column>
        <el-table-column prop="labelName" label="标签名称" width="150">
        </el-table-column>
        <el-table-column prop="type" label="标签类型" width="150">
          <template slot-scope="scope">
                <span>{{ typeCode[scope.row.type] }}</span>
           </template>
        </el-table-column>
        <el-table-column prop="is_show" label="是否显示" width="150">
          <template slot-scope="scope">
                <span>{{ is_showCode[scope.row.is_show] }}</span>
           </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="150">
        </el-table-column>
      </el-table>
      <div class="ktx-page-block">
        <el-pagination @size-change="$handleSizeChange" @current-change="$handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="产品标签" :visible.sync="dialogFormVisible">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="130px" style='width: 500px; margin-left:50px;'>
        <el-form-item label="标签名称" prop="labelName">
          <el-input v-model="temp.labelName"></el-input>
        </el-form-item>
        <el-form-item label="标签类型" prop="type">
          <el-select
            class="w-input-235"
            v-model="temp.type"
            placeholder="标签类型">
            <el-option v-for="(value, key) in typeCode" :key="key" :label="value" :value="+key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示" prop="is_show">
          <el-select
            class="w-input-235"
            v-model="temp.is_show"
            placeholder="是否显示">
            <el-option v-for="(value, key) in is_showCode" :key="key" :label="value" :value="+key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" placeholder="默认按数字升序"></el-input>
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
const typeCode = {
  '1': '产品标签',
  '2': '门店标签'
}

const is_showCode = {
  '1': '显示',
  '2': '不显示'
}
export default {
  data() {
    var checkLabelName = (rule, value, callback) => {
      // 打开dialog时不发起校验
      if (!this.needCheckName) {
        this.needCheckName = !this.needCheckName
        return callback()
      }
      if (value.length > 5) {
        return callback(new Error('标签名称长度不能大于5个字符'))
      } else {
        return callback()
      }
    }
    return {
      listLoading: true,
      tableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,

      needCheckName: true,
      typeCode,
      type: null,
      is_showCode,
      is_show: null,
      labelName: null,

      formLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {},
      rules: {
        labelName: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: checkLabelName }
        ],
        type: [
          { required: true, message: '必填' }
        ],
        sort: [
          { required: true, message: '必填' }
        ],
        is_show: [
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
    async getTableList() {
      var params = {
        labelName: this.labelName,

        type: this.type || 99,
        is_show: this.is_show || 99,

        page: this.currentPage,
        rows: this.pageSize
      }
      this.listLoading = true
      const response = await this.$http.post('/goodsLabel/queryByPage.json', params)
      this.tableData = response.data.rows
      this.total = response.data.total
      this.listLoading = false
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.formLoading = false
      this.needCheckName = false
      this.$resetFields('editForm')
    },
    async create() {
      await this.$validate('editForm')

      this.formLoading = true
      const params = { ...this.temp }
      // params.cashBackAmount = (this.temp.cashBackAmount * 100).toFixed(0)
      const response = await this.$http.post('/goodsLabel/insertGoodsLabel.json', params)
      this.formLoading = false
      this.dialogFormVisible = false
      this.getTableList()
      this.$msg(response)
    },
    async handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.formLoading = false
      this.needCheckName = false
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
      const response = await this.$http.post('/goodsLabel/updateGoodsLabel.json', params)
      this.formLoading = false
      this.dialogFormVisible = false
      this.getTableList()
      this.$msg(response)
    },
    async handleDelete(data) {
      await this.$myConfirm('是否删除数据?')

      const id = data.id
      const response = await this.$http.post('/goodsLabel/deleteById.json', { id })
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
        labelName: null,
        type: null,
        is_show: null,
        sort: null
      }
    }
  },
  watch: {
    type(val) {
      this.$handleFilter()
    },
    is_show(val) {
      this.$handleFilter()
    }
  },
  mounted() {
    this.getTableList()
  }
}
</script>
