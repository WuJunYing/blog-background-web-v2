<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-input @keyup.enter.native="$handleFilter" v-model="batch.goodsName" class="filter-item" placeholder="产品名称"></el-input>
        <el-input @keyup.enter.native="$handleFilter" @change="changeBatchNo" v-model="batch.schemeBatchNo" class="filter-item" placeholder="发布编号"></el-input>
        <el-select
            clearable
            class="filter-item"
            v-model="batch.goodsType"
            placeholder="产品类型"
            @change="$handleFilter">
            <el-option v-for="(value, key) in goodsTypes" :key="key" :label="value" :value="key"></el-option>
        </el-select>
        <el-select
            clearable
            class="filter-item"
            v-model="batch.status"
            placeholder="养殖状态"
            @change="$handleFilter">
            <el-option v-for="(value, key) in cultivationStatuses" :key="key" :label="value" :value="key"></el-option>
        </el-select>
        <el-select
            clearable
            class="filter-item"
            v-model="batch.inspectionTimes"
            placeholder="例检次数"
            @change="$handleFilter">
            <el-option v-for="(value, key) in inspectionData" :key="key" :label="value" :value="key"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="$handleFilter">搜索</el-button>
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
        <el-table-column class-name="ktx-operate" align="center" label="操作" width="240" fixed="left">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.row)">详情</el-button>
            <el-button v-if="(scope.row.status === 1 || scope.row.status === 2) && scope.row.isSale === 1 && scope.row.isDeleted === 0" size="mini" type="danger" plain @click="cancelRelease(scope.row)">取消发布</el-button>
            <el-button v-if="(scope.row.status === 2 || scope.row.status === 3) && scope.row.isDeleted === 0" size="mini" type="primary" plain @click="startCultivate(scope.row)">开始养殖</el-button>
            <el-button v-if="scope.row.status === 3 && scope.row.isDeleted === 0" size="mini" type="danger" plain @click="handleCancelCultivate(scope.row)">取消养殖</el-button>
            <el-button v-if="scope.row.status == 4 && scope.row.isDeleted === 0" size="mini" type="primary" plain @click="inspectionUpload(scope.row)">例检上传</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="schemeBatchNo" label="发布编号" width="180"></el-table-column>
        <el-table-column prop="goodsNo" label="产品编号" width="180"></el-table-column>
        <el-table-column prop="goodsName" label="产品名称" width="130"></el-table-column>
        <el-table-column prop="schemeName" label="套餐名称" width="150"></el-table-column>
        <el-table-column prop="merchantName" label="所属农场" width="150"></el-table-column>
        <el-table-column prop="goodsTypeStr" label="类型" width="100"></el-table-column>
        <el-table-column prop="startTime" label="生效时间" width="170"></el-table-column>
        <el-table-column prop="endTime" label="截止时间" width="170"></el-table-column>
        <el-table-column prop="adoptedNum" label="已认养人数" width="100"></el-table-column>
        <el-table-column prop="isSaleStr" label="状态" width="100"></el-table-column>
        <el-table-column prop="statusStr" label="养殖状态" width="100"></el-table-column>
        <!--<el-table-column prop="isDeletedStr" label="是否删除" width="100"></el-table-column>-->
      </el-table>
      <div class="ktx-page-block">
        <el-pagination @size-change="$handleSizeChange" @current-change="$handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <!-- 详情dialog -->
      <el-dialog
        title="养殖详情"
        :visible.sync="detailVisible"
        width="800px"
        center>
        <div v-loading="detailLoading">
          <div v-if="cultivateLogs.length > 0">
            <h3>代养记录</h3>
            <div style="max-height: 300px;overflow-y: auto;">
              <el-row>
                <el-col :span="12" class="detail-item">
                  <span>总周期：</span>
                  <span v-if="detail.adoptionPeriodMonth > 0">{{ detail.adoptionPeriodMonth }}个月</span>
                  <span v-if="detail.adoptionPeriodDay > 0">{{ detail.adoptionPeriodDay }}日</span>
                </el-col>
                <el-col :span="12" class="detail-item">
                  <span>当前已养：</span>
                  <span v-if="detail.cultivatedPeriodMonth > 0">{{ detail.cultivatedPeriodMonth }}个月</span>
                  <span>{{ detail.cultivatedPeriodDay }}日</span>
                </el-col>
              </el-row>
              <hr>
              <div v-for="log in cultivateLogs" :key="log.id">
                <span v-if="log.avatar != null"><img v-bind:src="log.avatar"/></span>
                <span>{{ log.createTime }}</span>
                <div v-if="log.type == 2">
                  <el-row>
                    <el-col :span="8" class="detail-item"><span>平均重量：</span><span>{{ log.averageWeight }}kg</span></el-col>
                    <el-col :span="8" class="detail-item"><span>一天喂养次数：</span><span>{{ log.feedTimes }}</span></el-col>
                    <el-col :span="8" class="detail-item"><span>一累计疫苗次数：</span><span>{{ log.vaccinesTimes }}</span></el-col>
                    <el-col :span="12" class="detail-item"><span>备注：</span><span>{{ log.remark }}</span></el-col>
                    <el-col :span="12" class="detail-item"><span>预期重量：</span><span>{{ log.expectedWeight }}kg</span></el-col>
                  </el-row>
                </div>
                <div v-if="log.type == 1">
                  <el-row>
                    <el-col :span="8" class="detail-item"><span>平均重量：</span><span>{{ log.averageWeight }}kg</span></el-col>
                    <el-col :span="8" class="detail-item"><span>产品质量：</span><span>{{ log.qualityLevelStr }}</span></el-col>
                    <el-col :span="8" class="detail-item"><span>进度：</span><span>{{ log.processLevelStr }}</span></el-col>
                    <el-col :span="12" class="detail-item"><span>备注：</span><span>{{ log.remark }}</span></el-col>
                  </el-row>
                </div>
                <br>
                <span v-for="img in log.images" :key="img.id" style="cursor: pointer;margin-right: 10px;" @click="imagePreview(img.url)">
                  <img v-bind:src="img.url" width="100" height="100"/>
                </span>
                <hr>
              </div>
            </div>
          </div>
          <h3>发布信息</h3>
          <el-row>
            <el-col :span="16" class="detail-item"><span>发布编号：</span><span>{{ detail.schemeBatchNo }}</span></el-col>
            <el-col :span="8" class="detail-item"><span>发布时间：</span><span>{{ detail.createTime }}</span></el-col>
            <el-col :span="16" class="detail-item"><span>接受买家认养时间：</span><span>{{ detail.startTime }} ~ {{ detail.endTime }}</span></el-col>
            <el-col :span="8" class="detail-item"><span>状态：</span><span>{{ detail.statusStr }}</span></el-col>
          </el-row>
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
              <el-table-column prop="schemeName" label="套餐" width="150" align="center"></el-table-column>
              <el-table-column label="单价（元）" width="120">
                <template slot-scope="scope">
                  <div style="text-align: center">
                    <div>{{ scope.row.price }}</div>
                    <el-button type="primary" plain v-if="editingRow != null && (editingRow.status === 1 || editingRow.status === 2)" size="mini" @click="modifyPrice()" :key="editingRow.id">修改价格</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="count" label="发布数量" width="100"></el-table-column>
              <el-table-column prop="adoptedNum" label="已认养数量" width="98"></el-table-column>
            </el-table>
          </div>
          <h3>套餐信息</h3>
          <el-row>
            <el-col :span="12" class="detail-item"><span>套餐名称：</span><span>{{ detail.schemeName }}</span></el-col>
            <el-col :span="12" class="detail-item"><span>代养品种：</span><span>{{ detail.variety }}</span></el-col>
            <el-col :span="12" class="detail-item"><span>价格：</span><span>{{ detail.schemePrice }}元</span></el-col>
            <el-col :span="12" class="detail-item"><span>养殖饲料：</span><span>{{ detail.feed }}</span></el-col>
            <el-col :span="12" class="detail-item">
              <span>成品：</span><span>{{ detail.productAmount }}{{ detail.productUnitStr }}</span>
              <span v-if="(detail.productUnit == 1 || detail.productUnit == 4) && detail.unitWeight != null">({{ detail.unitWeight }}KG/{{ detail.productUnitStr }})</span>
            </el-col>
            <el-col :span="12" class="detail-item"><span>代养周期：</span><span>{{ detail.adoptionPeriod }}天</span></el-col>
          </el-row>
          <el-table
            :data="plans"
            style="width: 100%"
            border
            fit
            v-if="plans.length > 0">
            <el-table-column prop="stageName" label="阶段" width="120" header-align="center"></el-table-column>
            <el-table-column prop="periodStr" label="时间" width="120" header-align="center"></el-table-column>
            <el-table-column prop="description" label="描述" width="508" header-align="center"></el-table-column>
          </el-table>
        </div>
      </el-dialog>

      <!-- 取消养殖dialog -->
      <el-dialog
        title="取消原因"
        :visible.sync="cancelCultivateVisible"
        width="300px">
        <el-select
          v-model="reason.reasonId"
          placeholder="取消原因"
          style="width: 260px">
          <el-option v-for="(value, key) in cancelReasons" :key="key" :label="value" :value="key"></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelCultivateVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="submitCancelReason">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 开始养殖、例检上传 dialog -->
      <el-dialog
        v-bind:title="cultivateLogTitle"
        :visible.sync="addCultivationVisible"
        width="700px"
        @close="cultivateDialogClose">
        <el-form :inline="true" :model="cultivateLog" ref="cultivateLog" :rules="logRules" size="small">
          <el-input v-model="cultivateLog.goodsId" v-show="false"></el-input>
          <el-input v-model="cultivateLog.goodsType" v-show="false"></el-input>
          <el-input v-model="cultivateLog.schemeId" v-show="false"></el-input>
          <el-input v-model="cultivateLog.schemeBatchId" v-show="false"></el-input>
          <el-form-item label="平均重量：" prop="averageWeight">
            <el-input v-model.number="cultivateLog.averageWeight" placeholder="KG" style="width: 105px;"></el-input>
          </el-form-item>
          <el-form-item v-if="!isInspection" v-bind:label="timesLabel" prop="feedTimes">
            <el-input v-model.number="cultivateLog.feedTimes" placeholder="次" style="width: 105px;"></el-input>
          </el-form-item>
          <el-form-item v-if="!isInspection" label="累计疫苗次数：" prop="vaccinesTimes">
            <el-input v-model.number="cultivateLog.vaccinesTimes" placeholder="次" style="width: 105px;"></el-input>
          </el-form-item>
          <el-form-item v-if="isInspection" label="产品质量：" prop="qualityLevel">
            <el-select
              v-model="cultivateLog.qualityLevel"
              placeholder="" style="width: 126px;">
              <el-option v-for="(value, key) in qualityLevels" :key="key" :label="value" :value="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isInspection" label="进度等级：" prop="processLevel">
            <el-select
              v-model="cultivateLog.processLevel"
              placeholder="" style="width: 126px;">
              <el-option v-for="(value, key) in processLevels" :key="key" :label="value" :value="key"></el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="cultivateLog.remark" placeholder="不超过20个字符" style="width: 578px;"></el-input>
          </el-form-item>
          <el-form-item v-if="!isInspection" label="预期重量：" prop="expectedWeight">
            <el-input v-model.number="cultivateLog.expectedWeight" placeholder="KG" style="width: 105px;"></el-input>
          </el-form-item>
          <!--<el-form-item v-if="!isInspection" label="成长百分比：" prop="growthPercent">
            <el-input-number v-model.number="cultivateLog.growthPercent" controls-position="right" :min="0" :max="100" :precision="2" placeholder="KG" style="width: 105px;"></el-input-number>
            <label><b>%</b></label>
          </el-form-item>-->
          <!-- 上传组件 -->
          <oss-image-upload
            ref="imageUpload"
            :imageLimit="imageLimit"
            :isUploadNecessary="true"
            :imageFileType="6"
            :maxSize="3"></oss-image-upload>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCultivationVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="submitAddlog" size="small">提 交</el-button>
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

import { cultivationApi } from 'api/cultivation'
import ossImageUpload from 'views/components/ossImageUpload'

const goodsTypes = {
  '1': '家禽',
  '2': '蔬菜',
  '3': '水果',
  '4': '鱼塘'
}

const cultivationStatuses = {
  '1': '发布中',
  '2': '接受认养中',
  '3': '待养殖',
  '4': '养殖中',
  '5': '已完成',
  '6': '已取消'
}

const productUnits = {
  '1': '只',
  '2': '千克',
  '3': '升',
  '4': '头',
  '5': '斤'
}

const inspectionData = {
  '0': '0次',
  '1': '1次',
  '2': '2次',
  '3': '3次',
  '4': '4次',
  '5': '5次及以上',
  '100': '成熟例检'
}

const cancelReasons = {
  '1': '认养人数不足',
  '2': '农场人数不足',
  '99': '其他'
}

const qualityLevels = {
  '1': '不符合标准',
  '2': '符合标准'
}

const processLevels = {
  '1': '符合标准',
  '2': '进度滞后',
  '3': '进度超前',
  '4': '产品成熟'
}

// 每月按30天计算
const monthForDay = 30

export default {
  components: {
    'oss-image-upload': ossImageUpload
  },
  data() {
    return {
      listLoading: true,
      tableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,
      name: null,
      cashBackNo: null,

      goodsTypes,
      cultivationStatuses,
      inspectionData,
      cancelReasons,
      batch: {
        goodsName: null,
        schemeBatchNo: null,
        goodsType: null,
        status: null,
        inspectionTimes: null
      },
      detailVisible: false,
      detailLoading: false,
      cancelCultivateVisible: false,
      addCultivationVisible: false,
      detail: {
        schemeBatchNo: null,
        createTime: null,
        startTime: null,
        endTime: null,
        statusStr: null,

        schemeName: null,
        variety: null,
        schemePrice: null,
        feed: null,
        productAmount: null,
        productUnit: null,
        productUnitStr: null,
        unitWeight: null,
        adoptionPeriod: null,
        adoptionPeriodMonth: null,
        adoptionPeriodDay: null,

        cultivatedPeriod: null,
        cultivatedPeriodMonth: null,
        cultivatedPeriodDay: null
      },
      goods: [],
      cultivateLogs: [],
      plans: [],
      reason: {
        schemeBatchId: null,
        reasonId: '1',
        cancelReason: null
      },
      timesLabel: '日喂养次数：',
      cultivateLogTitle: '开始养殖',
      editingRow: null,
      isInspection: false,
      qualityLevels,
      processLevels,
      cultivateLog: {
        name: '开始养殖',
        averageWeight: 1,
        feedTimes: null,
        vaccinesTimes: null,
        remark: null,
        expectedWeight: null,
        isFirstCultivate: false,
        type: 1,
        goodsType: null,
        schemeId: null,
        goodsId: null,
        schemeBatchId: null,
        qualityLevel: '2',
        processLevel: '1',
        growthPercent: null,
        images: []
      },
      logRules: {
        averageWeight: [
          { required: false, message: '' },
          { type: 'number', message: '必须为数字值' }
        ],
        feedTimes: [
          { required: false, message: '' },
          { type: 'number', message: '必须为数字值' }
        ],
        vaccinesTimes: [
          { required: false, message: '' },
          { type: 'number', message: '必须为数字值' }
        ],
        expectedWeight: [
          { required: true, message: '预期重量不能为空' },
          { type: 'number', message: '必须为数字值' }
        ],
        remark: [
          { required: false, message: '' },
          { min: 0, max: 20, message: '不超过20个字符' }
        ],
        growthPercent: [
          { required: true, message: '' },
          { type: 'number', message: '必须为数字值' }
        ]
      },

      imageLimit: 3,

      imageUrl: null,
      imageVisible: false
    }
  },
  methods: {
    // 计算时间差，天（当前时间-输入参数）
    dateMinus(sDate) {
      if (sDate) {
        var sdate = new Date(sDate.replace(/-/g, '/'))
        var now = new Date()
        var days = now.getTime() - sdate.getTime()
        var day = parseInt(days / (1000 * 60 * 60 * 24) + '')
        return day
      }
      return null
    },
    // 天数转月
    dayToMonth(day) {
      return parseInt(day / monthForDay)
    },
    // 天数转月后剩余的天数
    dayToDay(day) {
      return parseInt(day % monthForDay)
    },
    async getTableList() {
      this.listLoading = true
      this.batch.page = this.currentPage
      this.batch.rows = this.pageSize
      const response = await cultivationApi.getTableList(this.batch)
      this.tableData = response.data.rows
      this.total = response.data.total
      if (this.tableData.length) {
        this.tableData.forEach(row => {
          row.goodsTypeStr = goodsTypes[row.goodsType]
          row.statusStr = cultivationStatuses[row.status]
          row.startTime = this.$toDataStr(row.startTime, '{y}-{m}-{d} {h}') + ':00'
          row.endTime = this.$toDataStr(row.endTime, '{y}-{m}-{d} {h}') + ':00'

          row.isSaleStr = row.isSale ? '上架' : '下架'
          row.isDeletedStr = row.isDeleted ? '是' : '否'
          row.adoptedNum = row.count - row.remaindCount
        })
      }
      this.listLoading = false
    },
    async handleDetail(row) {
      // 获取详细信息
      this.editingRow = row
      this.detailVisible = true
      this.detailLoading = true
      const params = {
        schemeBatchId: row.id,
        status: row.status,
        goodsId: row.goodsId
      }
      const response = await cultivationApi.getCultivationDeatil(params)
      this.detailLoading = false
      if (response.data.code < 0) {
        this.detailVisible = false
        this.$notify.error({
          title: '错误',
          message: response.data.message,
          duration: 2000
        })
        return
      }
      this.plans = response.data.result.plans || []
      this.plans.forEach(plan => {
        // 周期天数转x月x日表示
        plan.periodMonth = this.dayToMonth(plan.period)
        plan.periodDay = this.dayToDay(plan.period)
        plan.periodStr = plan.periodMonth !== 0 ? (plan.periodMonth + '个月') : ''
        plan.periodStr += plan.periodDay !== 0 ? (plan.periodDay + '日') : ''
      })
      this.detail = {
        schemeBatchNo: row.schemeBatchNo,
        createTime: this.$toDataStr(row.createTime, '{y}-{m}-{d} {h}') + ':00',
        startTime: this.$toDataStr(row.startTime, '{y}-{m}-{d} {h}') + ':00',
        endTime: row.endTime,
        statusStr: cultivationStatuses[row.status],
        schemeName: row.schemeName,
        variety: row.variety,
        schemePrice: this.$convertMoney(row.schemePrice),
        feed: row.feed,
        productAmount: row.productAmount,
        productUnit: row.productUnit,
        productUnitStr: productUnits[row.productUnit],
        unitWeight: row.unitWeight,
        adoptionPeriod: row.adoptionPeriod
      }
      this.cultivateLogs = response.data.result.logs || []
      if (this.cultivateLogs.length > 0) {
        // 总周期月数
        this.detail.adoptionPeriodMonth = this.dayToMonth(this.detail.adoptionPeriod)
        // 总周期天数
        this.detail.adoptionPeriodDay = this.dayToDay(this.detail.adoptionPeriod)

        if (row.confirmTime) {
          this.detail.cultivatedPeriod = this.dateMinus(row.confirmTime)
          // 已养月数
          this.detail.cultivatedPeriodMonth = this.dayToMonth(this.detail.cultivatedPeriod)
          // 已养天数
          this.detail.cultivatedPeriodDay = this.dayToDay(this.detail.cultivatedPeriod)
        }
        this.cultivateLogs.forEach(log => {
          log.createTime = this.$toDataStr(log.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          log.qualityLevelStr = qualityLevels[log.qualityLevel]
          log.processLevelStr = processLevels[log.processLevel]
          if (!(log.remark && log.remark.length)) {
            log.remark = ''
          }
        })
      }

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
        price: this.$convertMoney(row.price),
        count: row.count,
        adoptedNum: row.adoptedNum,
        goodsImage: goodsImage
      }]
    },
    async cancelRelease(row) {
      // 状态是发布中取消发布直接下架，状态改成已取消，状态是接受认养的取消发布是把状态改成养殖中
      await this.$myConfirm('确认取消吗？')
      const params = {
        schemeBatchId: row.id,
        status: row.status,
        adoptedNum: row.adoptedNum
      }
      const response = await cultivationApi.cancelRelease(params)
      this.$msg(response)
      this.getTableList()
    },
    cultivateDialogClose() {
      // 养殖dialog关闭时清空form
      this.$resetFields('cultivateLog')
      // 清空图片
      if (this.$refs['imageUpload']) {
        this.$refs['imageUpload'].clearFiles()
      }
    },
    startCultivate(row) {
      if (row.goodsType === 1 || row.goodsType === 4) {
        this.timesLabel = '日喂养次数：'
      } else if (row.goodsType === 2 || row.goodsType === 3) {
        this.timesLabel = '日浇水次数：'
      }
      // 开始养殖
      this.addCultivationVisible = true
      // 标记是第一次开始养殖，后台需修改状态
      this.cultivateLog.isFirstCultivate = true
      this.isInspection = false
      this.editingRow = row
      this.cultivateLog.type = 2
      this.cultivateLog.goodsId = row.goodsId
      this.cultivateLog.goodsType = row.goodsType
      this.cultivateLog.schemeId = row.schemeId
      this.cultivateLog.schemeBatchId = row.id
      this.cultivateLog.images = []
      this.cultivateLog.feedTimes = null
      this.cultivateLog.vaccinesTimes = null

      this.cultivateLog.name = '开始养殖'
      this.cultivateLogTitle = '开始养殖'

      if (this.$refs['imageUpload']) {
        this.$refs['imageUpload'].hideErrorTips()
      }
    },
    inspectionUpload(row) {
      if (row.goodsType === 1 || row.goodsType === 4) {
        this.timesLabel = '日喂养次数：'
      } else if (row.goodsType === 2 || row.goodsType === 3) {
        this.timesLabel = '日浇水次数：'
      }
      // 例检上传，新增养殖记录，无需修改状态
      this.addCultivationVisible = true
      this.cultivateLog.isFirstCultivate = false
      this.isInspection = true
      this.editingRow = row
      this.cultivateLog.type = 1
      this.cultivateLog.goodsId = row.goodsId
      this.cultivateLog.goodsType = row.goodsType
      this.cultivateLog.schemeId = row.schemeId
      this.cultivateLog.schemeBatchId = row.id
      this.cultivateLog.images = []

      this.cultivateLog.qualityLevel = '2'
      this.cultivateLog.processLevel = '1'

      this.cultivateLog.name = '养殖成长中'
      this.cultivateLogTitle = '例检上传'

      if (this.$refs['imageUpload']) {
        this.$refs['imageUpload'].hideErrorTips()
      }
    },
    async submitAddlog() {
      // 提交养殖记录
      await this.$validate('cultivateLog')
      // 转换为保留一位小数
      // 平均重量
      if (Number(this.cultivateLog.averageWeight) > 0) {
        this.cultivateLog.averageWeight = Number(Number(this.cultivateLog.averageWeight).toFixed(1))
        if (this.cultivateLog.averageWeight > 1000) {
          this.cultivateLog.averageWeight = 1000
        }
      } else {
        this.cultivateLog.averageWeight = 1
      }
      // 喂养次数
      if (Number(this.cultivateLog.feedTimes) > 0) {
        this.cultivateLog.feedTimes = parseInt(this.cultivateLog.feedTimes)
      } else {
        this.cultivateLog.feedTimes = null
      }
      // 疫苗次数
      if (Number(this.cultivateLog.vaccinesTimes) > 0) {
        this.cultivateLog.vaccinesTimes = parseInt(this.cultivateLog.vaccinesTimes)
      } else {
        this.cultivateLog.vaccinesTimes = null
      }
      // 预期重量
      if (Number(this.cultivateLog.expectedWeight) > 0) {
        this.cultivateLog.expectedWeight = Number(Number(this.cultivateLog.expectedWeight).toFixed(1))
        if (this.cultivateLog.expectedWeight > 1000) {
          this.cultivateLog.expectedWeight = 1000
        }
      } else {
        this.cultivateLog.expectedWeight = null
      }
      // 验证图片
      if (this.$refs['imageUpload'].validateImage()) {
        const names = this.$refs['imageUpload'].getImageRealNames()
        this.cultivateLog.images = names.join(',')
      } else {
        return
      }
      if (parseInt(this.cultivateLog.type) === 1 && parseInt(this.cultivateLog.processLevel) === 4) {
        this.cultivateLog.name = '产品成熟'
      }

      // 防止乱码
      const log = { ...this.cultivateLog }
      log.name = encodeURI(log.name)
      log.remark = encodeURI(log.remark)

      const response = await cultivationApi.addCultivateLog(log)
      this.$msg(response)
      this.getTableList()
      // if (response.data.code === 0) {
      //   if (parseInt(this.cultivateLog.type) === 1 && parseInt(this.cultivateLog.processLevel) === 4) {
      //     this.editingRow.status = 5
      //     this.editingRow.statusStr = cultivationStatuses[5]
      //   } else {
      //     this.editingRow.status = 4
      //     this.editingRow.statusStr = cultivationStatuses[4]
      //     this.editingRow.confirmTime = new Date()
      //   }
      // }
      this.addCultivationVisible = false
    },
    async handleCancelCultivate(row) {
      // 取消养殖
      await this.$myConfirm('确定取消吗？')
      this.cancelCultivateVisible = true
      this.reason.schemeBatchId = row.id
    },
    async submitCancelReason() {
      this.cancelCultivateVisible = true
      this.reason.cancelReason = cancelReasons[this.reason.reasonId]
      const response = await cultivationApi.cancelCultivate(this.reason)
      this.cancelCultivateVisible = false
      this.$msg(response)
      this.getTableList()
    },

    // 状态是发布中，接受认养中可以修改价格
    modifyPrice() {
      this.$prompt('请输入修改金额（元）', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '请输入数字值',
        inputValue: this.$convertMoney(this.editingRow.price),
        inputValidator: (value) => {
          if (isNaN(value)) {
            return '请输入数字值'
          } else {
            if (value <= 0) {
              return '金额必须大于0'
            } else {
              return true
            }
          }
        }
      }).then(({ value }) => {
        if (value.length <= 0) {
          value = this.$convertMoney(this.editingRow.price)
        }
        // 价格没有修改
        if (value * 100 === this.editingRow.price) {
          return
        }
        // 提交
        const data = {
          schemeBatchId: this.editingRow.id,
          newPrice: value * 100
        }
        cultivationApi.updateBatchPrice(data)
          .then((response) => {
            this.$msg(response)
            this.editingRow.price = value * 100
            this.goods[0].price = value
          }).catch(() => {
            this.$notify.error({
              title: '错误',
              message: '修改失败'
            })
          })
      }).catch(() => {})
    },
    changeBatchNo() {
      const num = parseInt(this.batch.schemeBatchNo + '')
      if (isNaN(num)) {
        this.batch.schemeBatchNo = null
      } else {
        this.batch.schemeBatchNo = num
      }
    },
    imagePreview(url) {
      this.imageUrl = url
      this.imageVisible = true
    }
  },
  computed: {
    /* 导出相关 */
    exportResult() {
      const url = this.$baseApi() + cultivationApi.exportResult(this.batch)
      return url
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
