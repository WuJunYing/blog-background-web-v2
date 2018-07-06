<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <!-- <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleCreate">添加</el-button> -->
        <el-input @keyup.enter.native="$handleFilter" v-model="userName" class="filter-item" placeholder="用户名称"></el-input>
        <el-input @keyup.enter.native="$handleFilter" v-model="goodsName" class="filter-item" placeholder="产品名称"></el-input>
        <el-input @keyup.enter.native="$handleFilter" v-model="merchantName" class="filter-item" placeholder="农场名称"></el-input>
        <!-- <el-input @keyup.enter.native="$handleFilter" v-model="abc" class="filter-item" placeholder="用户昵称"></el-input> -->
        <el-select
              clearable
              class="filter-item"
              v-model="isDisplay"
              placeholder="评论状态">
              <el-option v-for="(value, key) in isDisplayCode" :key="key" :label="value" :value="key"></el-option>
        </el-select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span>评论时间:</span>
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
        <el-table-column class-name="ktx-operate" align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button v-if="$has('')" size="mini" @click="handleDetails(scope.row)">详情</el-button>
            <el-button v-if="$has('') && scope.row.isDisplay === 1" size="mini" @click="handleHidden(scope.row)">隐藏</el-button>
            <el-button v-if="$has('') && scope.row.isDisplay === 2" size="mini" @click="handleDisplay(scope.row)">显示</el-button>
            <!-- <el-button v-if="$has('')" size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户昵称" width="150">
        </el-table-column>
        <el-table-column prop="goodsName" label="产品名称" width="130">
        </el-table-column>
        <el-table-column prop="merchantName" label="所属农场" width="130">
        </el-table-column>
        <el-table-column prop="productName" label="套餐名称" width="150">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="content" label="评论内容" width="180">
        </el-table-column>
        <el-table-column prop="isDisplay" label="是否显示" width="100">
          <template slot-scope="scope">
                <span>{{ isDisplayCode[scope.row.isDisplay] }}</span>
           </template>
        </el-table-column>
        <el-table-column prop="createTime" label="评论时间" width="170">
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

    <!-- 用户评价详情 -->
    <el-dialog title="用户评价"
      :visible.sync="dialogFormVisible"
      width="1155px"
      center>
      <div>
        <el-table
          :data="evaluateList"
          style="width: 700%"
          border
          fit>
    <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="评价用户:">
              <span>{{ props.row.userName }}</span>
            </el-form-item>
            <el-form-item label="评价时间:">
              <span>{{ props.row.createTime | parseTime}}</span>
            </el-form-item>
            <el-form-item label="评分:">
              <span>
                <el-rate
                  v-model="props.row.score"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
                </el-rate>
              </span>
            </el-form-item>
            <el-form-item label="所属商家:">
              <span>{{ props.row.merchantName }}</span>
            </el-form-item>
            <el-form-item label="产品名称:">
              <span>{{ props.row.goodsName }}</span>
            </el-form-item>
            <el-form-item label="评价内容:">
              <span class="el-form-item__content">{{ props.row.content }}</span>
            </el-form-item>
            <el-form-item label="评价图片:">
              <span class="el-form-item__content">
                <img @click="imagePreview(item.url)" v-for="item in props.row.images" :src="item.url" :key="item.id" class="table-img-slot"/>
              </span>
            </el-form-item>
            <!-- <el-form-item label="是否追评:">
              <span>{{ isAddCode[props.row.isAdd] }}</span>
            </el-form-item> -->
            <el-form-item label="商家回复:">
              <span class="el-form-item__content">{{ props.row.reply }}</span>
            </el-form-item>
          </el-form>
        </template>
    </el-table-column>
          <el-table-column prop="userName" label="评价用户" width="120"></el-table-column>
          <el-table-column prop="createTime" label="评价时间" width="155">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | parseTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="评分" width="50"></el-table-column>
          <el-table-column prop="merchantName" label="所属商家" width="100"></el-table-column>
          <el-table-column prop="goodsName" label="产品名称" width="100"></el-table-column>
          <el-table-column prop="content" label="评价内容" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="images" label="评价图片" width="150">
            <template slot-scope="scope">
              <img @click="imagePreview(item.url)" v-for="item in scope.row.images" class="table-img" :src="item.url" :key="item.id"/>
            </template>
          </el-table-column>
          <el-table-column prop="isAdd" label="是否追评" width="80">
            <template slot-scope="scope">
                <span>{{ isAddCode[scope.row.isAdd] }}</span>
           </template>
          </el-table-column>
          <el-table-column prop="reply" label="商家回复" width="150" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 预览图片 -->
      <el-dialog :visible.sync="imageVisible" :append-to-body="true">
        <img width="100%" :src="imageUrl" alt="">
      </el-dialog>
  </div>
</template>

<script>
const isDisplayCode = {
  '1': '显示',
  '2': '隐藏'
}

const isAddCode = {
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
      evaluateList: [],
      isDisplayCode,
      isDisplay: null,
      goodsName: null,
      merchantName: null,
      startTimeParam: null,
      endTimeParam: null,
      userName: null,

      imageUrl: null,
      imageVisible: false,

      isAddCode,

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
    imagePreview(url) {
      this.imageUrl = url
      this.imageVisible = true
    },
    async getTableList() {
      var params = {
        userName: this.userName,
        startTimeParam: this.startTimeParam,
        endTimeParam: this.endTimeParam,
        goodsName: this.goodsName,
        merchantName: this.merchantName,
        isDisplay: this.isDisplay || 99,
        page: this.currentPage,
        rows: this.pageSize
      }
      params.startTimeParam = this.$toDataStr(this.startTimeParam, '{y}-{m}-{d} {h}:{i}:{s}')
      params.endTimeParam = this.$toDataStr(this.endTimeParam, '{y}-{m}-{d} {h}:{i}:{s}')
      this.listLoading = true
      const response = await this.$http.post('/evaluateList/queryByPage.json', params)
      this.tableData = response.data.rows
      this.total = response.data.total
      this.listLoading = false
    },
    //  详情
    async handleDetails(row) {
      this.dialogFormVisible = true
      const params = {
        userId: row.userId,
        merchantId: row.merchantId,
        goodsId: row.goodsId
      }
      const response = await this.$http.post('/evaluateList/getEvaluateList.json', params)
      this.evaluateList = response.data.rows
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
    //  隐藏
    async handleHidden(data) {
      await this.$myConfirm('是否隐藏该评论?')
      const id = data.id
      const isDisplay = 2
      const response = await this.$http.post('/evaluateList/update.json', { id, isDisplay })
      this.getTableList()
      this.$msg(response)
    },
    //  显示
    async handleDisplay(data) {
      await this.$myConfirm('是否显示该评论?')
      const id = data.id
      const isDisplay = 1
      const response = await this.$http.post('/evaluateList/update.json', { id, isDisplay })
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
  watch: {
    isDisplay(val) {
      this.$handleFilter()
    }
  },
  mounted() {
    this.getTableList()
  }
}
</script>
<style scoped>
.demo-table-expand {
    font-size: 0;
  }
.demo-table-expand label {
  width: 80px;
  color: #2772db;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-rate {
  height: 20px;
  line-height: 2.5;
}
.table-img {
  padding: 5px;
  width: 50px;
  height: 30px;
  vertical-align: middle;
}
.table-img-slot {
  width: 100px;
  height: 60px;
}
.el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
    width: 400px;
}
.el-rate {
    height: 20px;
    line-height: 2.5;
    padding: 0 25px;
}
</style>
