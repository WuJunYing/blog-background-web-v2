<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-input @keyup.enter.native="$handleFilter" @change="changeOrderNo" v-model="finance.schemeOrderNo" class="filter-item" placeholder="订单号"></el-input>
        <el-select
          clearable
          class="filter-item"
          v-model="finance.financeType"
          placeholder="财务类型"
          @change="$handleFilter">
          <el-option v-for="(value, key) in financeTypes" :key="key" :label="value" :value="key"></el-option>
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
      </div>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        element-loading-text="加载中"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column prop="createTime" label="时间" width="170"></el-table-column>
        <el-table-column prop="schemeOrderNo" label="订单号" width="180"></el-table-column>
        <el-table-column prop="merchantName" label="所属商家" width="150"></el-table-column>
        <el-table-column prop="buyerName" label="客户名称" width="150"></el-table-column>
        <el-table-column prop="buyerMobile" label="手机号" width="180"></el-table-column>
        <el-table-column prop="financeType" label="财务类型" width="120"></el-table-column>
        <el-table-column prop="financialNo" label="流水号" width="170"></el-table-column>
        <el-table-column prop="payTypeStr" label="支付方式" width="120"></el-table-column>
        <el-table-column prop="paySerialNumber" label="第三方支付号" width="180"></el-table-column>
        <el-table-column prop="amount" label="金额" width="120"></el-table-column>
        <el-table-column prop="preferentialAmount" label="优惠金额" width="120"></el-table-column>
        <el-table-column prop="merchantIncome" label="商家收入" width="120"></el-table-column>
        <el-table-column prop="arrivaled" label="是否到账" width="120"></el-table-column>
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

/**
 * 财务类型
 */
const financeTypes = {
  '1': '产品首款',
  '2': '产品尾款',
  '3': '额外服务',
  '4': '订单退款',
  '5': '土地订单'
}

/**
 * 支付方式, 1支付宝2.微信 3余额
 */
const payTypes = {
  '1': '支付宝',
  '2': '微信',
  '3': '余额'
}

export default {
  data() {
    return {
      listLoading: true,
      tableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,

      financeTypes,
      finance: {
        schemeOrderNo: null,
        // 这里查的是用户记录
        userType: 1,
        financeType: null,
        merchantId: null,
        startTime: null,
        endTime: null
      },
      merchants: []
    }
  },
  methods: {
    async getTableList() {
      this.listLoading = true
      this.finance.page = this.currentPage
      this.finance.rows = this.pageSize
      this.tableData = []
      const response = await financeApi.getMechantFinanceList(this.finance)
      this.tableData = response.data.result.rows
      this.total = response.data.result.total
      if (this.tableData) {
        this.tableData.forEach(row => {
          row.createTime = this.$toDataStr(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          row.amount = this.$convertMoney(row.amount)
          row.preferentialAmount = this.$convertMoney(row.preferentialAmount)
          row.commission = this.$convertMoney(row.commission)
          row.merchantIncome = parseFloat(row.amount - row.preferentialAmount + '').toFixed(2)

          row.payTypeStr = payTypes[row.payType]

          if (row.transferWay + '' === '2') {
            // 订单退款
            row.financeType = financeTypes['4']
          } else {
            if (row.orderType + '' === '1') {
              if (row.schemeOrderNodeId + '' === '0') {
                // 土地订单
                row.financeType = financeTypes['5']
              } else {
                if (row.paymentNodeId + '' === '1') {
                  // 产品首款
                  row.financeType = financeTypes['1']
                } else if (row.paymentNodeId + '' === '2') {
                  // 产品尾款
                  row.financeType = financeTypes['2']
                }
              }
            } else {
              // 服务订单
              row.financeType = financeTypes['3']
            }
          }

          row.arrivaled = row.status + '' === '1' ? '是' : '否'
        })
      }
      this.listLoading = false
    },
    changeOrderNo() {
      const num = parseInt(this.finance.schemeOrderNo + '')
      if (isNaN(num)) {
        this.finance.schemeOrderNo = null
      } else {
        this.finance.schemeOrderNo = num
      }
    }
  },
  computed: {
    /* 导出相关 */
    exportResult() {
      const url = this.$baseApi() + financeApi.exportMechantOrderFinance(this.finance)
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
    // 初始化时间，起始时间为当前月1号0点，结束时间为当前时间
    // const now = Date.now()
    // this.finance.endTime = this.$toDataStr(now, '{y}-{m}-{d} {h}:{i}:{s}')
    // this.finance.startTime = this.finance.endTime.substring(0, 7) + '-01 00:00:00'
    this.getTableList()
  }
}
</script>
