<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-row :gutter="10">
          <el-col :sm="24" :xl="9" style="margin-bottom: 10px;">
            <el-input @keyup.enter.native="$handleFilter" @change="changeOrderNo" v-model="order.schemeOrderNo" class="filter-item" placeholder="订单号"></el-input>
            <el-input @keyup.enter.native="$handleFilter" @change="changeGoodsNo" v-model="order.goodsNo" class="filter-item" placeholder="产品号"></el-input>
            <el-input @keyup.enter.native="$handleFilter" v-model="order.goodsName" class="filter-item" placeholder="产品名称"></el-input>
            <el-select
                clearable
                class="filter-item"
                v-model="order.goodsType"
                placeholder="产品类型"
                @change="$handleFilter">
                <el-option v-for="(value, key) in goodsTypes" :key="key" :label="value" :value="key"></el-option>
            </el-select>
            <el-select
                clearable
                class="filter-item"
                v-model="order.status"
                placeholder="订单状态"
                @change="$handleFilter">
                <el-option v-for="(value, key) in orderStatuses" :key="key" :label="value" :value="key"></el-option>
            </el-select>
          </el-col>
          <el-col :sm="24" :xl="12">
            <span style="font-size: 14px;">下单时间</span>
            <el-date-picker v-model="order.startTime" type="date" @change="$handleFilter" placeholder="下单起始时间"></el-date-picker>
            &nbsp;&nbsp;-&nbsp;&nbsp;
            <el-date-picker v-model="order.endTime" type="date" @change="$handleFilter" placeholder="下单结束时间"></el-date-picker>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="$handleFilter">搜索</el-button>
          </el-col>
        </el-row>
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
            <el-button size="mini" @click="showDetail(scope.row)">订单详情</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="schemeOrderNo" label="订单号" width="180"></el-table-column>
        <el-table-column prop="goodsNo" label="产品号" width="180"></el-table-column>
        <el-table-column prop="goodsName" label="产品名称" width="130"></el-table-column>
        <el-table-column prop="schemeName" label="套餐名称" width="150"></el-table-column>
        <el-table-column prop="totalPrice" label="订单金额（元）" width="120"></el-table-column>
        <el-table-column prop="preferentialAmount" label="优惠金额（元）" width="120"></el-table-column>
        <el-table-column prop="merchantName" label="所属农场" width="150"></el-table-column>
        <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
        <el-table-column prop="buyerName" label="买方名称" width="120"></el-table-column>
        <el-table-column prop="statusStr" label="订单状态" width="140"></el-table-column>
        <el-table-column prop="goodsTypeStr" label="产品类型" width="100"></el-table-column>
        <el-table-column prop="buyerMobile" label="联系电话" width="120"></el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="170"></el-table-column>
      </el-table>
      <div class="ktx-page-block">
        <el-pagination @size-change="$handleSizeChange" @current-change="$handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <el-dialog
        title="订单详情"
        :visible.sync="detailVisible"
        center>
        <div v-loading="detailLoading">
          <h3>领用信息</h3>
          <div v-show="showEmptyServices">
            <span>无领用信息</span>
          </div>
          <div style="max-height: 300px;overflow-y: auto;">
            <div v-show="!showEmptyServices" v-for="service in services" :key="service.id">
            <div class="detail-item"><label>申请领用时间：</label><span>{{ service.createTime }}</span></div>
            <div class="detail-item"><label>领用数量：</label><span>{{ service.enjoyAmount }}{{ service.enjoyUnitStr }}</span></div>
            <div class="detail-item"><label>额外服务：</label>
              <span v-if="service.records.length">
                <div v-for="(record, key) in service.records" :key="key" style="display: inline-block;">
                  <span style="margin-right: 15px;">{{ record.serviceName }}({{ record.price }}元)</span>
                </div>
              </span>
              <span v-else>
                无
              </span>
            </div>
            <div class="detail-item"><label>领用状态：</label><span>{{ service.statusStr }}({{ service.updateTime }})</span></div>
            <div class="detail-item"><label>配送方式：</label><span>{{ service.distributionTypeStr }}</span></div>
            <div class="detail-item" v-if="service.distributionType == 1">
              <label>自提时间：</label><span>{{ service.reservationTime }}</span>
            </div>
            <div class="detail-item" v-else-if="service.distributionType == 2">
              <label>配送时间：</label><span>{{ service.reservationTime }}</span>
            </div>
            <div class="detail-item"><label>手机号：</label><span>{{ service.recipientMobile }}</span></div>
            <div class="detail-item"><label>姓名/昵称：</label><span>{{ service.recipientName }}</span></div>
            <div class="detail-item" v-if="service.distributionType == 2">
              <label>地址：</label><span>{{ service.recipientAddress }}</span>
            </div>
            <div class="detail-item"><label>备注：</label><span>{{ service.remark }}</span></div>
            <hr>
          </div>
          </div>
          <br/>
          <h3>订单信息</h3>
          <div>
            <el-row>
              <el-col :span="8" class="detail-item"><span>发布号：</span><span>{{ detail.schemeBatchNo }}</span></el-col>
              <el-col :span="8" class="detail-item"><span>订单号：</span><span>{{ detail.schemeOrderNo }}</span></el-col>
              <el-col :span="8" class="detail-item"><span>下单时间：</span><span>{{ detail.orderTime }}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="8" class="detail-item"><span>订单状态：</span><span>{{ detail.stauts }}</span></el-col>
            </el-row>
            <hr>
            <el-row>
              <el-col :span="8" class="detail-item"><span>买家名称：</span><span>{{ detail.buyerName }}</span></el-col>
              <el-col :span="8" class="detail-item"><span>联系方式：</span><span>{{ detail.buyerMobile }}</span></el-col>
            </el-row>
          </div>
          <br/>
          <div>
            <el-table
              :data="goods"
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
          </div>
        </div>
      </el-dialog>

      <!-- 预览图片 -->
      <el-dialog :visible.sync="imageVisible" :append-to-body="true">
        <img width="100%" :src="imageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { productOrderApi } from 'api/order'

const goodsTypes = {
  '1': '家禽',
  '2': '蔬菜',
  '3': '水果',
  '4': '鱼塘'
}

const orderStatuses = {
  '1': '待支付',
  '2': '已支付(等待养殖)',
  // '3': '待成团',
  '4': '已取消',
  '5': '养殖成长中',
  '6': '已成熟',
  '99': '已完成'
}

const enjoyUnits = {
  '1': '斤',
  '2': '克',
  '3': '只',
  '4': '条',
  '5': '颗'
}

const serviceStatuses = {
  '1': '未支付',
  '2': '已支付',
  '3': '已领用',
  '4': '已取消'
}

const distributionTypes = {
  '1': '农场自提',
  '2': '农场配送'
}

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

      order: {
        schemeOrderNo: null,
        goodsNo: null,
        goodsType: null,
        goodsName: null,
        status: null,
        startTime: null,
        endTime: null,
        page: 1,
        rows: 10
      },
      goodsTypes,
      orderStatuses,

      detailVisible: false,
      detailLoading: false,
      showEmptyServices: true,
      orderId: '',
      services: [],
      detail: {
        schemeBatchNo: null,
        schemeOrderNo: null,
        orderTime: null,
        stauts: null,
        buyerName: null,
        buyerMobile: null
      },
      goods: [],

      imageUrl: null,
      imageVisible: false
    }
  },
  methods: {
    async getTableList() {
      // 转换成正确的时间
      this.order.startTime = this.$toDataStr(this.order.startTime, '{y}-{m}-{d} {h}:{i}:{s}')
      this.order.endTime = this.$toDataStr(this.order.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
      this.order.page = this.currentPage
      this.order.rows = this.pageSize
      this.listLoading = true
      const response = await productOrderApi.getTableList(this.order)
      this.tableData = response.data.rows
      if (this.tableData && this.tableData.length) {
        this.tableData.forEach(row => {
          row.goodsTypeStr = goodsTypes[row.goodsType]
          row.statusStr = orderStatuses[row.status]
          row.createTime = this.$toDataStr(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          // 价格转换
          row.price = this.$convertMoney(row.price)
          row.totalPrice = this.$convertMoney(row.totalPrice)
          row.preferentialAmount = this.$convertMoney(row.preferentialAmount)
          row.paidAmount = this.$convertMoney(row.paidAmount)
          row.paymentRemain = this.$convertMoney(row.paymentRemain)
        })
      }
      this.total = response.data.total
      this.listLoading = false
    },
    handleFilter() {
      this.currentPage = 1
      this.getTableList()
    },
    async showDetail(row) {
      this.detailVisible = true
      this.detailLoading = true
      // 获取领用信息
      const params = {
        orderId: row.id,
        goodsId: row.goodsId,
        goodsType: row.goodsType
      }
      const response = await productOrderApi.getOrderDetail(params)
      this.detailLoading = false
      this.services = response.data.result.services
      if (this.services.length) {
        this.showEmptyServices = false
        this.services.forEach(service => {
          // 显示中文
          service.statusStr = serviceStatuses[service.status]
          service.enjoyUnitStr = enjoyUnits[service.enjoyUnit]
          service.distributionTypeStr = distributionTypes[service.distributionType]
          // 格式化时间
          service.createTime = this.$toDataStr(service.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          service.updateTime = this.$toDataStr(service.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')

          service.records.forEach(record => {
            record.price = this.$convertMoney(record.price)
          })
        })
      } else {
        this.showEmptyServices = true
      }

      // 订单信息
      this.detail.schemeBatchNo = row.schemeBatchNo
      this.detail.schemeOrderNo = row.schemeOrderNo
      this.detail.orderTime = this.$toDataStr(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
      this.detail.stauts = orderStatuses[row.status]
      this.detail.buyerName = row.buyerName
      this.detail.buyerMobile = row.buyerMobile

      // 商品信息
      let goodsImage = response.data.result.goodsImage
      if (!goodsImage) {
        goodsImage = {
          url: ''
        }
      }
      this.goods = [{
        goodsNo: row.goodsNo,
        goodsName: row.goodsName,
        schemeName: row.schemeName,
        price: row.price,
        quantity: row.quantity,
        paidAmount: row.paidAmount,
        paymentRemain: row.paymentRemain,
        totalPrice: row.totalPrice,
        goodsImage: goodsImage
      }]
    },
    changeOrderNo() {
      const num = parseInt(this.order.schemeOrderNo + '')
      if (isNaN(num)) {
        this.order.schemeOrderNo = null
      } else {
        this.order.schemeOrderNo = num
      }
    },
    changeGoodsNo() {
      const num = parseInt(this.order.goodsNo + '')
      if (isNaN(num)) {
        this.order.goodsNo = null
      } else {
        this.order.goodsNo = num
      }
    },
    imagePreview(url) {
      this.imageUrl = url
      this.imageVisible = true
    }
  },
  mounted() {
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
