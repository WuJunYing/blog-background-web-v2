<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-select
          clearable
          class="filter-item"
          v-model="finance.financeType"
          placeholder="流水类型"
          @change="changeFinanceType">
          <el-option v-for="(value, key) in financeTypes" :key="key" :label="value" :value="key"></el-option>
        </el-select>
        <el-select
          clearable
          class="filter-item"
          v-model="finance.fundChangeType"
          placeholder="财务类型"
          @change="$handleFilter">
          <el-option v-for="(value, key) in fundChangeTypes" :key="key" :label="value" :value="key"></el-option>
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
        <el-table-column class-name="ktx-operate" align="center" label="操作" fixed="left" width="100">
          <template slot-scope="scope">
            <el-button size="mini" @click="showDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="170"></el-table-column>
        <el-table-column prop="financialNo" label="流水号" width="170"></el-table-column>
        <el-table-column prop="fundChangeTypeStr" label="流水类型" width="100"></el-table-column>
        <el-table-column prop="financeTypeStr" label="财务类型" width="100"></el-table-column>
        <el-table-column prop="merchantName" label="所属商家" width="150"></el-table-column>
        <el-table-column prop="transactionAmount" label="交易金额" width="120"></el-table-column>
        <el-table-column prop="balanceBefore" label="交易前金额" width="120"></el-table-column>
        <el-table-column prop="balanceAfter" label="交易后金额" width="120"></el-table-column>
      </el-table>
      <div class="ktx-page-block">
        <el-pagination @size-change="$handleSizeChange" @current-change="$handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <!-- 详情dialog -->
      <el-dialog
        title="资金流水详情"
        :visible.sync="detailVisible"
        width="800px"
        center>
        <div v-loading="detailLoading">
          <h3>资金明细</h3>
          <div v-if="detail.fundChangeType + '' !== '5'">
            <el-row>
              <el-col :span="8" class="detail-item">
                <span>流水号：</span>
                <span>{{ detail.financialNo }}</span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>流水类型：</span>
                <span>{{ detail.fundChangeTypeStr }}</span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>财务类型：</span>
                <span>{{ detail.financeTypeStr }}</span>
              </el-col>
            </el-row>
            <el-row v-if="detail.financeType !== '3'">
              <el-col :span="8" class="detail-item">
                <span v-if="detail.financeType === '1'">
                  <span v-if="detail.goodsType !== '5'">产品首款（元）：</span>
                  <span v-else>土地首款（元）：</span>
                  <span>{{ detail.amount }}</span>
                </span>
                <span v-if="detail.financeType === '2'">
                  <span v-if="detail.goodsType !== '5'">产品尾款（元）：</span>
                  <span v-else>土地尾款（元）：</span>
                  <span>{{ detail.amount }}</span>
                </span>
                <span v-if="detail.financeType === '4'">退款金额（元）：<span>{{ detail.amount }}</span></span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>平台佣金（元）：<span>{{ detail.commission }}</span></span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span v-if="detail.financeType !== '4' && detail.financeType !== '5'">收入（元）：<span>{{ detail.transactionAmount }}</span></span>
                <span v-else>支出（元）：<span>{{ detail.transactionAmount }}</span></span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>到账时间：<span>{{ detail.createTime }}</span></span>
              </el-col>
            </el-row>
            <el-row v-else>
              <el-col :span="16" class="detail-item">
                <span v-if="detail.financeType === '3'">
                  额外服务：
                  <span v-for="(record, key) in detail.service.records" :key="key" style="margin-right: 5px;">
                    {{ record.serviceName }}({{ record.price }}元)
                  </span>
                </span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>服务金额（元）：<span>{{ detail.amount }}</span></span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>平台佣金（元）：<span>{{ detail.commission }}</span></span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>收入（元）：<span>{{ detail.transactionAmount }}</span></span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>到账时间：<span>{{ detail.createTime }}</span></span>
              </el-col>
            </el-row>
            <h3>订单信息</h3>
            <el-row>
              <el-col :span="8" class="detail-item">
                <span>发布号：</span><span>{{ detail.schemeBatchNo }}</span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>订单号：</span><span>{{ detail.schemeOrderNo }}</span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>下单时间：</span><span>{{ detail.orderTime }}</span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>订单状态：</span><span>{{ detail.orderStatusStr }}</span>
              </el-col>
            </el-row>
            <hr>
            <el-row>
              <el-col :span="8" class="detail-item">
                <span>买家姓名：</span><span>{{ detail.buyerName }}</span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>联系方式 ：</span><span>{{ detail.buyerMobile }}</span>
              </el-col>
            </el-row>
            <br/>
            <div>
              <el-table v-if="detail.goodsType !== '5'"
                :data="detail.goods"
                style="width: 100%"
                border
                fit>
                <el-table-column prop="goodsNo" label="产品编号" width="150"></el-table-column>
                <el-table-column prop="goodsName" label="产品信息" width="130" align="center">
                  <template slot-scope="scope">
                    <div style="text-align: center;">
                      <div v-if="scope.row.goodsImage.url !== ''" style="cursor: pointer;" @click="imagePreview(scope.row.goodsImage.url)">
                        <img :src="scope.row.goodsImage.url" class="goods-image"/>
                      </div>
                      <span>{{ scope.row.goodsName }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="schemeName" label="套餐名称" width="150"></el-table-column>
                <el-table-column prop="price" label="单价（元）" width="120"></el-table-column>
                <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
                <el-table-column prop="paidAmount" label="定金（元）" width="120"></el-table-column>
                <el-table-column prop="paymentRemain" label="余款（元）" width="120"></el-table-column>
                <el-table-column prop="totalPrice" label="总价（元）" width="120"></el-table-column>
              </el-table>
              <el-table v-else
                :data="detail.goods"
                style="width: 100%"
                border
                fit>
                <el-table-column prop="goodsNo" label="产品编号" width="180"></el-table-column>
                <el-table-column prop="goodsName" label="产品信息" width="150" align="center">
                  <template slot-scope="scope">
                    <div style="text-align: center;">
                      <div style="cursor: pointer;" @click="imagePreview(scope.row.goodsImage.url)">
                        <img :src="scope.row.goodsImage.url" class="goods-image"/>
                      </div>
                      <span>{{ scope.row.goodsName }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="schemeName" label="规格" width="150"></el-table-column>
                <el-table-column prop="employPeriod" label="周期(天)" width="145"></el-table-column>
                <el-table-column prop="totalPrice" label="订单价格" width="120"></el-table-column>
              </el-table>
            </div>
          </div>
          <div v-else>
            <el-row>
              <el-col :span="8" class="detail-item">
                <span>流水号：</span>
                <span>{{ detail.financialNo }}</span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>流水类型：</span>
                <span>{{ detail.fundChangeTypeStr }}</span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>提交时间：</span>
                <span>{{ detail.submitTime }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" class="detail-item">
                <span>提交金额（元）：</span>
                <span>{{ detail.amount }}</span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>提交到：</span>
                <span>{{ detail.account.accountBank }}({{ detail.account.accountBankNoOshio }})&nbsp;&nbsp;{{ detail.account.accountBankUsername }}</span>
              </el-col>
              <el-col :span="8" class="detail-item">
                <span>是否到账：</span>
                <span>{{ detail.account.arrived }}</span>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-dialog>

      <!-- 预览图片 -->
      <el-dialog :visible.sync="goodsImageVisible" :append-to-body="true">
        <img width="100%" :src="goodsImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { financeApi } from 'api/finance'
import { merchantApi } from 'api/merchant'

/**
 * 财务类型
 */
const fundChangeTypes = {
  '1': '产品首款',
  '2': '产品尾款',
  '3': '额外服务',
  '4': '订单退款',
  '5': '提现'
}

/**
 * 流水类型
 */
const financeTypes = {
  '1': '收入',
  '2': '支出'
}

/**
 * 订单状态
 */
const orderStatuses = {
  '1': '待支付',
  '2': '已支付(等待养殖)',
  '3': '待成团',
  '4': '已取消',
  '5': '养殖成长中',
  '6': '已成熟',
  '99': '已完成'
}

export default {
  data() {
    return {
      listLoading: true,
      tableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,

      fundChangeTypes,
      financeTypes,
      finance: {
        userType: 2,
        financeType: null,
        fundChangeType: null,
        merchantId: null,
        startTime: null,
        endTime: null
      },
      merchants: [],

      detailVisible: false,
      detailLoading: false,
      detail: {
        financialNo: null,
        fundChangeType: null,
        fundChangeTypeStr: null,
        financeTypeStr: null,
        amount: null,
        commission: null,
        transactionAmount: null,
        createTime: null,
        submitTime: null,

        schemeBatchNo: null,
        schemeOrderNo: null,
        orderTime: null,
        orderStatusStr: null,
        buyerName: null,
        buyerMobile: null,

        service: null,

        goodsType: '1',
        goods: [],

        account: {
          accountBank: null,
          accountBankNo: null,
          accountBankNoOshio: null,
          accountBankUsername: null,
          // 有了明细记录的就是已经到账了的
          arrived: '是'
        }
      },

      goodsImageUrl: null,
      goodsImageVisible: false
    }
  },
  methods: {
    async getTableList() {
      this.listLoading = true
      this.finance.page = this.currentPage
      this.finance.rows = this.pageSize
      this.tableData = []
      const response = await financeApi.getMechantFinanceDetail(this.finance)
      this.tableData = response.data.result.rows
      this.total = response.data.result.total
      if (this.tableData) {
        this.tableData.forEach(row => {
          row.createTime = this.$toDataStr(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          row.submitTime = this.$toDataStr(row.submitTime, '{y}-{m}-{d} {h}:{i}:{s}')
          row.transactionAmount = this.$convertMoney(Math.abs(row.balanceBefore - row.balanceAfter))
          row.balanceBefore = this.$convertMoney(row.balanceBefore)
          row.balanceAfter = this.$convertMoney(row.balanceAfter)
          row.preferentialAmount = this.$convertMoney(row.preferentialAmount)
          row.commission = this.$convertMoney(row.commission)
          row.amount = parseFloat(parseFloat(row.transactionAmount) + parseFloat(row.commission)).toFixed(2)

          if (row.fundChangeType + '' === '1' || row.fundChangeType + '' === '2' || row.fundChangeType + '' === '3') {
            row.financeType = '1'
          } else if (row.fundChangeType + '' === '4' || row.fundChangeType + '' === '5'){
            row.financeType = '2'
          }
          row.financeTypeStr = financeTypes[row.financeType]
          row.fundChangeTypeStr = fundChangeTypes[row.fundChangeType]
        })
      }
      this.listLoading = false
    },
    async showDetail(row) {
      this.detailVisible = true
      this.detailLoading = true
      // 获取详细信息
      const params = {
        fundChangeType: row.fundChangeType,
        serviceOrderId: row.serviceOrderId,
        shemeOrderId: row.shemeOrderId,
        merchantId: row.merchantId
      }
      const response = await financeApi.getDetail(params)
      if (!response.data.success) {
        this.$msg(response)
      }
      this.detailLoading = false
      this.detail = {
        financialNo: row.financialNo,
        fundChangeType: row.fundChangeType + '',
        fundChangeTypeStr: row.fundChangeTypeStr,
        financeType: row.financeType + '',
        financeTypeStr: row.financeTypeStr,
        amount: row.amount,
        commission: row.commission,
        transactionAmount: row.transactionAmount,
        createTime: row.createTime,
        submitTime: row.submitTime,

        service: null,

        goods: [],

        account: {
          accountBank: null,
          accountBankNo: null,
          accountBankNoOshio: null,
          accountBankUsername: null,
          arrived: '是'
        }
      }

      // 订单信息
      const order = response.data.result.order
      if (order) {
        this.detail.schemeBatchNo = order.schemeBatchNo,
          this.detail.schemeOrderNo = order.schemeOrderNo,
          this.detail.orderTime = this.$toDataStr(order.createTime, '{y}-{m}-{d} {h}:{i}:{s}'),
          this.detail.orderStatusStr = orderStatuses[order.status],
          this.detail.buyerName = order.buyerName,
          this.detail.buyerMobile = order.buyerMobile
      }

      // 服务信息
      if (response.data.result.service) {
        this.detail.service = response.data.result.service
        this.detail.service.records.forEach(record => {
          record.price = this.$convertMoney(record.price)
        })
      }
      // 产品，方案信息
      if (response.data.result.scheme) {
        const scheme = response.data.result.scheme
        const goods = {
          goodsNo: scheme.goodsNo,
          goodsName: scheme.goodsName,
          schemeName: scheme.schemeName,
          totalPrice: this.$convertMoney(order.totalPrice),
          goodsImage: {
            url: ''
          }
        }
        if (scheme.goodsType) {
          // 产品
          this.detail.goodsType = scheme.goodsType + ''

          goods.price =  this.$convertMoney(order.price)
          goods.quantity = order.quantity
          goods.paidAmount = this.$convertMoney(order.paidAmount)
          goods.paymentRemain = this.$convertMoney(order.paymentRemain)
        } else {
          // 土地
          this.detail.goodsType = '5'
          goods.employPeriod = row.employPeriod
        }
        if (response.data.result.goodsImage) {
          goods.goodsImage = response.data.result.goodsImage
        }
        this.detail.goods.push(goods)
      }
      // 提现账户信息
      if (response.data.result.account) {
        const account = response.data.result.account
        this.detail.account = {
          accountBank: account.accountBank,
          accountBankNo: account.accountBankNo,
          accountBankNoOshio: account.accountBankNo.length > 4 ? account.accountBankNo.substring(account.accountBankNo.length - 4, account.accountBankNo.lenth) : account.accountBankNo,
          accountBankUsername: account.accountBankUsername,
          arrived: '是'
        }
      }
    },
    imagePreview(url) {
      this.goodsImageUrl = url
      this.goodsImageVisible = true
    },
    changeFinanceType(value) {
      if (value + '' === '1') {
        this.fundChangeTypes = {
          '1': '产品首款',
          '2': '产品尾款',
          '3': '额外服务'
        }
      } else if (value + '' === '2') {
        this.fundChangeTypes = {
          '4': '订单退款',
          '5': '提现'
        }
      } else {
        this.fundChangeTypes = fundChangeTypes
      }
      this.finance.fundChangeType = ''
      this.currentPage = 1
      this.getTableList()
    }
  },
  computed: {
    exportResult() {
      return this.$baseApi() + financeApi.exportMechantFinanceDeatil(this.finance)
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

<style scoped>
.detail-item {
  padding: 5px 5px 5px 0
}
.goods-image {
  width: 60px;
  height: 60px;
}
</style>
