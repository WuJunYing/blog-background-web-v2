<template>
  <div class="ktx-components-container">
    <el-row type="flex" justify="left" :gutter="20">
      <el-col :span="5" :xl="4">
        <el-card class="box-card">
          <div class="card-content">
            <div class="conente-item amount-item">{{ statistics.monthTurnover }}</div>
            <div class="conente-item">总评论数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5" :xl="4">
        <el-card class="box-card">
          <div class="card-content">
            <div class="conente-item amount-item">{{ statistics.totalTurnover }}</div>
            <div class="conente-item">未读评论数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5" :xl="4">
        <el-card class="box-card">
          <div class="card-content">
            <div class="conente-item amount-item">{{ statistics.totalIncome }}</div>
            <div class="conente-item">总留言数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5" :xl="4">
        <el-card class="box-card">
          <div class="card-content">
            <div class="conente-item amount-item">{{ statistics.applyingWithdraw }}</div>
            <div class="conente-item">未读留言数</div>
          </div>
        </el-card>
      </el-col>


        <el-card class="box-card-comment">
          <div class="card-content">
            <div class="conente-item todo-item">
              <i class="el-icon-edit-outline"></i>
              代办事项
            </div>
            <hr style="width: 650px;padding-left: -100px" color="#0099cc">
            <el-row>
              <div
                v-if="todoComment.id"
                v-for="todoComment in todoCommentList"
                :key="todoComment.id"
                class="flex-content">
                <div>
                  <el-tag type="danger">评论</el-tag>
                </div>
                <div class="b-2" :title="todoComment.content">
                  {{ todoComment.content }}
                </div>
                <div class="b-3">{{ todoComment.commentTime }}</div>
              </div>
            </el-row>

            <div
              v-if="todoMessage.todoMessagetId"
              v-for="todoMessage in todoMessageList"
              :key="todoMessage.todoMessageId"
              class="flex-content">
              <div>
                <el-tag type="danger">留言</el-tag>
              </div>
              <div class="b-2" :title="todoMessage.content">
                {{ todoMessage.content }}
              </div>
              <div class="b-3">{{ todoMessage.createTimeOfStatus }}</div>
            </div>
          </div>
        </el-card>



    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <ve-line
          :data="chartData"
          :loading="chartLoading"
          :data-empty="dataEmpty"
          :settings="chartSettings"
          height="400px">
        </ve-line>
      </el-col>


    </el-row>
  </div>
</template>

<script>
  import { financeApi } from 'api/finance'
  import { dashboardApi } from 'api/dashboard'

  export default {
    data() {
      this.chartSettings = {
        labelMap: {
          date: '日期',
          turnover: '营业额',
          income: '收入'
        }
      }
      return {
        financial: {
          merchantId: null,
          startDate: null,
          endDate: null
        },



        statistics: {
          monthTurnover: '1',
          totalTurnover: '1',
          totalIncome: '1',
          applyingWithdraw: '1',
          withdrawAmount: '1'
        },

        chartLoading: false,
        dataEmpty: false,
        chartData: {
          columns: ['date', 'turnover', 'income'],
          rows: []
        },
        fillDate: true,
        todoCommentList: [],
        todoMessageList: []
      }
    },
    methods: {
      // 获取统计信息
      async getStatistics() {
        const now = this.$toDataStr(Date.now(), '{y}-{m}')
        const params = { ...this.financial }
        // 取当前月1号
        params.startDate = now + '-01 00:00:00'
        const response = await financeApi.getFinanceStatistics(params)
        if (response.data.success) {
          this.statistics = response.data.result
          if (this.statistics) {
            // 这里不用再转成元了，已经用filter中的money转了
          } else {
            this.statistics = {
              monthTurnover: '1',
              totalTurnover: '1',
              totalIncome: '1',
              applyingWithdraw: '1',
              withdrawAmount: '1'
            }
          }
        } else {
          this.$msg(response)
        }
      },
      // 获取图表数据，每天的营业额，收入
      async getChartsData() {
        const params = { ...this.financial }
        // 取当前月1号
        params.startDate = this.$toDataStr(Date.now(), '{y}-{m}') + '-01'
        params.startDate = '2018-07-01'
        this.chartLoading = true
        const response = await financeApi.getChartsData(params)
        if (response.data.success) {
          this.dataEmpty = false
          const chartData = response.data.result
          let rows = []
          const statisticDates = []
          if (chartData && chartData.length) {
            chartData.forEach(row => {
              rows.push({
                date: row.statisticDate,
                turnover: this.$convertMoney(row.turnover),
                income: this.$convertMoney(row.income)
              })
              statisticDates.push(row.statisticDate)
            })
          }
          // 把没有记录的日期补0
          if (this.fillDate) {
            if (!params.endDate) {
              const now = this.$toDataStr(Date.now(), '{y}-{m}-{d}')
              if (now.substring(now.length - 1) + '' === '1') {
                params.endDate = now
              } else {
                params.endDate = this.$toDataStr(this.dateAdd(now, -1), '{y}-{m}-{d}')
              }
            }
            const dates = []
            dates.push(params.startDate)
            let tempDate = params.startDate
            // 计算出所有日期
            while (tempDate < params.endDate) {
              const tomorrow = this.$toDataStr(this.dateAdd(tempDate, 1), '{y}-{m}-{d}')
              if (tomorrow >= params.endDate) {
                break
              }
              dates.push(tomorrow)
              tempDate = tomorrow
            }
            if (params.startDate != params.endDate) {
              dates.push(params.endDate)
            }
            const tempRow = []
            for (var i = 0; i < dates.length; i++) {
              if (statisticDates.indexOf(dates[i]) !== -1) {
                tempRow.push(rows[statisticDates.indexOf(dates[i])])
              } else {
                tempRow.push({
                  date: dates[i],
                  turnover: 0,
                  income: 0
                })
              }
            }
            rows = tempRow
          } else {
            if (!rows.length) {
              this.chartData.columns = []
              this.dataEmpty = true
            }
          }
          this.chartData.rows = rows
        } else {
          this.$msg(response)
          this.dataEmpty = true
          this.chartData = {
            columns: [],
            rows: []
          }
        }
        setTimeout(() => {
          this.chartLoading = false
        }, 500)
      },
      // 时间相加
      dateAdd(date, day) {
        if (date) {
          var sdate = new Date(date.replace(/-/g, '/'))
          var times = sdate.getTime() + (1000 * 60 * 60 * 24) * day
          return new Date(times)
        }
        return null
      },
      async getTodoCommentList() {
        const response = await this.$http.post('/dashboard/getTodoCommentList.json')
        this.todoCommentList = response.data.rows
      }
    },
    mounted() {
      this.getTodoCommentList()
      // this.getTodoMessageList()
    }
  }
</script>

<style scoped>
  .box-card {
    margin: 10px;
    height: 140px;
    width: 280px;

  }
  .box-card-comment {
    margin: 10px;
    height: 780px;
    width: 540px;

  }
  .card-content {
    padding: 20px;
    text-align: center;
  }
  .conente-item {
    margin: 15px 0;
  }
  .amount-item {
    font-weight: bold;
    font-size: 34px;
    margin-top: -10px;
    color: #ff7974;
  }
  .todo-item {
    font-weight: bold;
    margin-left: -400px;
    font-size: 22px;
    margin-top: -10px;
    color: #0099cc;
  }
  .flex-content {
    display: flex;
    padding: 1px 0;
    border-bottom: 1px dashed #d1dbe5;
  .el-tag {
    margin: 3px 0;
    padding: 0 5px;
    height: 18px;
    line-height: 16px;
  }
  .b-2 {
    margin-left: 5px;
    flex-grow: 1;
    font-size: 14px;
    line-height: 24px;
    cursor: pointer;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

  }
  .b-3 {
    color: #999999;
    font-size: 12px;
    line-height: 24px;
    width: 120px;
    text-align: right;
    flex-shrink: 0;
  }
  }
</style>
