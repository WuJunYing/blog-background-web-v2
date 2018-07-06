<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-row :gutter="10">
          <el-col :sm="24" :xl="7" style="margin-bottom: 10px;">
            <el-input @keyup.enter.native="$handleFilter" @change="changeOrderNo" v-model="order.schemeOrderNo" class="filter-item" placeholder="订单号"></el-input>
            <el-input @keyup.enter.native="$handleFilter" @change="changeGoodsNo" v-model="order.goodsNo" class="filter-item" placeholder="产品号"></el-input>
            <el-input @keyup.enter.native="$handleFilter" v-model="order.goodsName" class="filter-item" placeholder="产品名称"></el-input>
            <el-select
              clearable
              class="filter-item"
              v-model="order.status"
              placeholder="订单状态"
              @change="$handleFilter">
              <el-option v-for="(value, key) in statuses" :key="key" :label="value" :value="key"></el-option>
            </el-select>
          </el-col>
          <el-col :sm="24" :xl="12">
            <span style="font-size: 14px;">下单时间</span>
            <el-date-picker v-model="order.startTime" type="date" @change="$handleFilter" placeholder="下单起始日期"></el-date-picker>
            &nbsp;&nbsp;-&nbsp;&nbsp;
            <el-date-picker v-model="order.endTime" type="date" @change="$handleFilter" placeholder="下单结束日期"></el-date-picker>
            <span style="font-size: 14px;margin-left: 10px;">30天内到期</span>
            <el-switch v-model="expire" @change="$handleFilter"></el-switch>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="$handleFilter" style="margin-left: 10px;">搜索</el-button>
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
        <el-table-column class-name="ktx-operate" align="center" label="操作" width="180" fixed="left">
          <template slot-scope="scope">
            <el-button size="mini" @click="showDetail(scope.row)">订单详情</el-button>
            <el-button v-if="scope.row.status === 2" size="mini" @click="handleUsing(scope.row)">确认使用</el-button>
            <el-button v-if="scope.row.status === 5 && scope.row.isReleaseRenewal === 0 && scope.row.batchStatus !== 5" size="mini" @click="releaseRenewal(scope.row)">发布续期</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="schemeOrderNo" label="订单号" width="180"></el-table-column>
        <el-table-column prop="goodsNo" label="产品号" width="180"></el-table-column>
        <el-table-column prop="goodsName" label="产品名称" width="130"></el-table-column>
        <el-table-column prop="merchantName" label="所属商家" width="130"></el-table-column>
        <el-table-column prop="schemeName" label="规格" width="150"></el-table-column>
        <el-table-column prop="totalPrice" label="订单金额(元)" width="120"></el-table-column>
        <el-table-column prop="preferentialAmount" label="优惠金额（元）" width="120"></el-table-column>
        <el-table-column prop="buyerName" label="买方名称" width="120"></el-table-column>
        <el-table-column prop="statusStr" label="订单状态" width="140"></el-table-column>
        <el-table-column prop="buyerMobile" label="联系电话" width="120"></el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="170"></el-table-column>
        <el-table-column prop="employEndTime" label="预计到期时间" width="170"></el-table-column>
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
          <h3>续期信息</h3>
          <div v-show="showEmptyRenewal">
            <span>无续期信息</span>
          </div>
          <div v-show="!showEmptyRenewal" v-for="renewal in renewals" :key="renewal.id">
            <!--<div class="detail-item"><label>发布续期时间：</label><span>{{ renewal.releaseTime }}</span></div>-->
            <div class="detail-item"><label>续期下单时间：</label><span>{{ renewal.createTime }}</span></div>
            <div class="detail-item"><label>续期价格：</label><span>{{ renewal.totalPrice }}</span></div>
            <div class="detail-item"><label>续期周期：</label><span>{{ renewal.employPeriod }}天</span></div>
            <div class="detail-item"><label>手机号：</label><span>{{ renewal.buyerMobile }}</span></div>
            <div class="detail-item"><label>姓名/昵称：</label><span>{{ renewal.buyerName }}</span></div>
            <hr>
          </div>
          <br/>
          <h3>订单信息</h3>
          <div>
            <el-row>
              <el-col :span="8" class="detail-item"><span>订单号：</span><span>{{ detail.schemeOrderNo }}</span></el-col>
              <el-col :span="8" class="detail-item"><span>下单时间：</span><span>{{ detail.orderTime }}</span></el-col>
              <el-col :span="8" class="detail-item"><span>订单状态：</span><span>{{ detail.stauts }}</span></el-col>
            </el-row>
            <el-row>
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
              <el-table-column prop="schemeName" label="规格" width="150"></el-table-column>
              <el-table-column prop="employPeriod" label="周期" width="100"></el-table-column>
              <el-table-column prop="totalPrice" label="订单价格" width="100"></el-table-column>
            </el-table>
          </div>
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

      <!-- 预览图片 -->
      <el-dialog :visible.sync="imageVisible" :append-to-body="true">
        <img width="100%" :src="imageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { landOrderApi } from 'api/order'

const statuses = {
  '1': '待支付',
  '2': '已支付(待确认)',
  // '3': '待成团',
  '4': '已取消',
  '5': '使用中',
  '6': '待续期',
  '99': '已完成'
}

const usingBtnCode = {
  '1': '开始使用',
  '2': '驳回使用'
}

const expireNum = 31

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

      tempData: null,
      usingBtnCode,
      //  确认使用
      formLoadingIssueBtn: false,
      dialogFormVisibleIssueBtn: false,
      using: {
        usingBtn: 1,
        cancelReason: null
      },

      formLoading: false,
      dialogFormVisible: false,
      expire: false,
      order: {
        schemeOrderNo: null,
        goodsNo: null,
        goodsName: null,
        status: null,
        startTime: null,
        endTime: null,
        expireTime: null,
        page: 1,
        rows: 10
      },
      statuses,

      detailVisible: false,
      detailLoading: false,
      showEmptyRenewal: true,
      orderId: '',
      renewals: [],
      detail: {
        schemeOrderNo: null,
        orderTime: null,
        stauts: null,
        buyerName: null,
        buyerMobile: null
      },
      goods: [],

      imageUrl: null,
      imageVisible: false,
      rules: {
        cancelReason: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 计算时间差，天（输入参数-当前时间）
    dateMinus(sDate) {
      var sdate = new Date(sDate.replace(/-/g, '/'))
      var now = new Date()
      var days = sdate.getTime() - now.getTime()
      var day = parseInt(days / (1000 * 60 * 60 * 24) + '')
      return day
    },
    // 日期相加，返回相加后日期
    addDate(num = expireNum) {
      var time = new Date().getTime() + (1000 * 60 * 60 * 24) * num
      return new Date(time)
    },
    async getTableList() {
      // 转换成正确的时间
      this.order.startTime = this.$toDataStr(this.order.startTime, '{y}-{m}-{d} {h}:{i}:{s}')
      this.order.endTime = this.$toDataStr(this.order.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
      // 分页相关参数
      this.order.page = this.currentPage
      this.order.rows = this.pageSize
      // 30天内到期按钮
      if (this.expire) {
        this.order.expireTime = this.$toDataStr(this.addDate(expireNum), '{y}-{m}-{d}')
      } else {
        this.order.expireTime = null
      }

      this.listLoading = true
      const response = await landOrderApi.getTableList(this.order)
      this.tableData = response.data.rows
      if (this.tableData && this.tableData.length) {
        this.tableData.forEach(row => {
          // 将状态改成中文
          row.statusStr = statuses[row.status]
          // 转换成正确的时间
          row.createTime = this.$toDataStr(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          // 截止时间
          if (row.batchStatus + '' === '1' || row.batchStatus + '' === '2') {
            row.employEndTime = ''
          } else {
            row.employEndTime = this.$toDataStr(row.employEndTime, '{y}-{m}-{d} {h}:{i}:{s}')
          }
          // 价格转换
          row.totalPrice = this.$convertMoney(row.totalPrice)
          row.preferentialAmount = this.$convertMoney(row.preferentialAmount)
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

      // 获取续期信息
      const params = {
        schemeId: row.schemeId,
        goodsId: row.goodsId,
        goodsType: row.goodsType
      }
      const response = await landOrderApi.getOrderDetail(params)
      this.detailLoading = false
      this.renewals = response.data.result.renewals
      // TODO 暂时没有发布时间
      if (this.renewals.length) {
        this.showEmptyRenewal = false
        this.renewals.forEach(renewal => {
          // 格式化时间
          renewal.createTime = this.$toDataStr(renewal.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          renewal.price = this.$convertMoney(renewal.price)
          renewal.totalPrice = this.$convertMoney(renewal.totalPrice)
        })
      } else {
        this.showEmptyRenewal = true
      }

      // 订单信息
      this.detail.schemeBatchNo = row.schemeBatchNo
      this.detail.schemeOrderNo = row.schemeOrderNo
      this.detail.orderTime = this.$toDataStr(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
      this.detail.stauts = statuses[row.status]
      this.detail.buyerName = row.buyerName
      this.detail.buyerMobile = row.buyerMobile

      // 商品信息，价格前面已经转换了，这里不用在转了
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
        employPeriod: row.employPeriod,
        totalPrice: row.totalPrice,
        goodsImage: goodsImage
      }]
    },
    // async confirmReceived(row) {
    //   await this.$myConfirm('确认使用吗？')
    //   // const data = {
    //   //   orderId: row.id,
    //   //   schemeId: row.schemeId,
    //   //   schemeBatchId: row.schemeBatchId
    //   // }
    //   // const response = await landOrderApi.confirmReceived(data)
    //   const data = {
    //     id: row.schemeId,
    //     schemeBatchNo: row.schemeBatchNo,
    //     goodsName: row.goodsName,
    //     goodsNo: row.goodsNo,
    //     goodsType: row.goodsType,
    //     schemeBatchId: row.schemeBatchId
    //   }
    //   const response = await landOrderApi.using(data)
    //   this.$msg(response)
    //   this.getTableList()
    // },
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
      const id = data.schemeId
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
        landSchemeId: data.schemeId,
        schemeBatchNo: data.schemeBatchNo,
        schemeBatchId: data.schemeBatchId,
        cancelReason: this.using.cancelReason
      }
      const response = await this.$http.post('/goodsSchemeBatch/rejectUsing.json', params)
      this.dialogFormVisibleIssueBtn = false
      this.getTableList()
      this.$msg(response)
    },
    async releaseRenewal(row) {
      // const interval = this.dateMinus(row.employEndTime)
      // if (interval < 7) {
      //   this.$alert('需要发布续期请在认领到期日的前七天', '发布续期有效期已过', {
      //     confirmButtonText: '确定'
      //   })
      //   return
      // }
      await this.$myConfirm('确认发布吗？')
      const data = {
        schemeId: row.schemeId,
        batchId: row.schemeBatchId
      }
      const response = await landOrderApi.releaseRenewal(data)
      this.$msg(response)
      if (response.data.code >= 0) {
        row.isReleaseRenewal = 1
      }
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
