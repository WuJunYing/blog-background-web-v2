<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-select
          clearable
          class="filter-item"
          v-model="finance.merchantName"
          placeholder="请选择商家"
          @change="$handleFilter">
          <el-option v-for="(merchant, key) in merchants" :key="key" :label="merchant.merchantName" :value="merchant.id"></el-option>
        </el-select>
        <span style="font-size: 14px;margin-left: 15px;"></span>
        <el-date-picker v-model="finance.startDate" type="date" @change="$handleFilter" placeholder="起始日期"></el-date-picker>
        &nbsp;&nbsp;-&nbsp;&nbsp;
        <el-date-picker v-model="finance.endDate" type="date" @change="$handleFilter" placeholder="结束日期"></el-date-picker>
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
        show-summary
        highlight-current-row
        style="width: 100%">
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="productPumpInto" label="产品抽成" width="120"></el-table-column>
        <el-table-column prop="servicePumpInto" label="服务抽成" width="120"></el-table-column>
        <el-table-column prop="messagePush" label="消息推送" width="120"></el-table-column>
        <el-table-column prop="carouselAd" label="轮播广告" width="120"></el-table-column>
        <el-table-column prop="farmPromotion" label="农场推广" width="120"></el-table-column>
        <el-table-column prop="productPromotion" label="产品推广" width="120"></el-table-column>
        <el-table-column prop="total" label="合计" width="120"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { financeApi } from 'api/finance'
import { merchantApi } from 'api/merchant'

export default {
  data() {
    return {
      listLoading: true,
      tableData: [],
      total: 0,

      finance: {
        merchantName: null,
        startDate: null,
        endDate: null
      },
      merchants: []
    }
  },
  methods: {
    async getTableList() {
      this.listLoading = true
      this.tableData = []
      this.tableData.push({
        date: '2018-06-01',
        productPumpInto: 100,
        servicePumpInto: 87,
        messagePush: 121,
        carouselAd: 1938,
        farmPromotion: 131,
        productPromotion: 1435
      })
      this.tableData.push({
        date: '2018-06-02',
        productPumpInto: 310,
        servicePumpInto: 873,
        messagePush: 421,
        carouselAd: 198,
        farmPromotion: 61,
        productPromotion: 2435
      })
      // const response = await financeApi.getPlatformFinanceList(this.finance)
      // this.tableData = response.data.rows
      // this.total = response.data.total
      if (this.tableData) {
        this.tableData.forEach(row => {
          row.total = row.productPumpInto + row.servicePumpInto + row.messagePush + row.carouselAd +
            row.farmPromotion + row.productPromotion
        })
      }
      this.listLoading = false
    }
  },
  computed: {
    /* 导出相关 */
    exportResult() {
      const url = this.$baseApi() + financeApi.exportPlatformFinance(this.finance)
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
    // 初始化日期
    const now = Date.now()
    this.finance.endDate = this.$toDataStr(now, '{y}-{m}-{d}')
    this.finance.startDate = this.finance.endDate.substring(0, 7) + '-01'

    this.getTableList()
  }
}
</script>
