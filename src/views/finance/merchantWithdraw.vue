<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-select
          clearable
          class="filter-item"
          v-model="finance.auditStatus"
          placeholder="提现状态"
          @change="$handleFilter">
          <el-option v-for="(status, key) in auditStatuses" :key="key" :label="status" :value="key"></el-option>
        </el-select>
        <el-select
          clearable
          class="filter-item"
          v-model="finance.merchantId"
          placeholder="请选择商家"
          @change="$handleFilter">
          <el-option v-for="(merchant, key) in merchants" :key="key" :label="merchant.merchantName" :value="merchant.id"></el-option>
        </el-select>
        <span style="font-size: 14px;margin-left: 15px;"></span>
        <el-date-picker
          v-model="finance.startTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="$handleFilter"
          placeholder="起始时间"></el-date-picker>
        &nbsp;&nbsp;-&nbsp;&nbsp;
        <el-date-picker
          v-model="finance.endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="$handleFilter"
          placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="$handleFilter" style="margin-left: 10px;">搜索</el-button>
        <a :href="exportResult" target="_blank">
          <el-button class="filter-item" type="default" v-waves>导出</el-button>
        </a>
        <a :href="exportAuditData" target="_blank">
          <el-button class="filter-item" type="default" v-waves>导出审核数据</el-button>
        </a>
      </div>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        element-loading-text="加载中"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column class-name="ktx-operate" align="center" label="操作" width="170" fixed="left">
          <template slot-scope="scope">
            <el-button v-if="scope.row.auditStatus === 2 || scope.row.auditStatus === 4" size="mini" type="primary" plain @click="audit(scope.row, 1)">转账成功</el-button>
            <el-button v-if="scope.row.auditStatus === 2 || scope.row.auditStatus === 4" size="mini" type="danger" plain @click="audit(scope.row, 2)">转账失败</el-button>
            <el-button v-if="scope.row.auditStatus === 3 || scope.row.auditStatus === 5" size="mini" type="primary" plain @click="audit(scope.row, 4)">审核通过</el-button>
            <el-button v-if="scope.row.auditStatus === 3 || scope.row.auditStatus === 5" size="mini" type="danger" plain @click="audit(scope.row, 5)">审核不通过</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请提现时间" width="170"></el-table-column>
        <el-table-column prop="merchantName" label="商家名称" width="150"></el-table-column>
        <el-table-column prop="accountBankUsername" label="姓名" width="120"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="150"></el-table-column>
        <el-table-column prop="accountBankNo" label="银行卡号" width="200"></el-table-column>
        <el-table-column prop="accountBank" label="开户银行" width="170"></el-table-column>
        <el-table-column prop="accountBranch" label="支行信息" width="180"></el-table-column>
        <el-table-column prop="amount" label="提现金额" width="180"></el-table-column>
        <el-table-column prop="financeDate" label="财务时间" width="180"></el-table-column>
        <el-table-column prop="auditStatusStr" label="提现状态" width="120"></el-table-column>
      </el-table>
      <div class="ktx-page-block">
        <el-pagination @size-change="$handleSizeChange" @current-change="$handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { financeApi } from 'api/finance'
import { merchantApi } from 'api/merchant'

const auditStatuses = {
  '1': '转账成功',
  '2': '转账失败',
  '3': '待审核',
  '4': '审核通过',
  '5': '审核不通过'
}

export default {
  data() {
    return {
      listLoading: true,
      tableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,

      auditStatuses,
      finance: {
        userType: 2,
        auditStatus: null,
        merchantId: null,
        startTime: null,
        endTime: null
      },
      merchants: []
    }
  },
  methods: {
    // 日期相加，返回相加后日期
    addDate(date = new Date(), num = 0) {
      var time = date.getTime() + (1000 * 60 * 60 * 24) * num
      return new Date(time)
    },
    async getTableList() {
      this.listLoading = true
      this.finance.page = this.currentPage
      this.finance.rows = this.pageSize
      this.tableData = []
      const response = await financeApi.getMechantWithdraw(this.finance)
      this.tableData = response.data.result.rows
      this.total = response.data.result.total
      if (this.tableData) {
        this.tableData.forEach(row => {
          const createTime = row.createTime
          row.createTime = this.$toDataStr(createTime, '{y}-{m}-{d} {h}:{i}')
          row.amount = this.$convertMoney(row.amount)

          row.auditStatusStr = auditStatuses[row.auditStatus]

          const startDate = this.addDate(new Date(this.$toDataStr(createTime, '{y}/{m}/{d}')), -7)
          const endDate = this.addDate(new Date(this.$toDataStr(createTime, '{y}/{m}/{d}')), -1)
          row.financeDate = this.$toDataStr(startDate, '{y}.{m}.{d}') + ' - ' + this.$toDataStr(endDate, '{y}.{m}.{d}')

        })
      }
      this.listLoading = false
    },
    async audit(row, auditStatus) {
      await this.$myConfirm('确定提交吗？')
      const params = {
        financialId: row.id,
        auditStatus: auditStatus
      }
      const response = await financeApi.auditWithdraw(params);
      this.$msg(response)
      this.getTableList()
    }
  },
  computed: {
    /* 导出相关 */
    exportResult() {
      const url = this.$baseApi() + financeApi.exportMechantWithdraw(this.finance)
      return url
    },
    /* 导出相关 */
    exportAuditData() {
      const url = this.$baseApi() + financeApi.exportAuditData(this.finance)
      return url
    }
  },
  mounted() {
    merchantApi.getAllMerchant().then(response => {
      if (response.data.code < 0) {
        this.$msg(response)
      }
      this.merchants = response.data.rows
    })
    this.getTableList()
  }
}
</script>
