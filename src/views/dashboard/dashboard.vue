<template>
  <el-container>
    <!-- 中上-->
    <el-container>
      <el-header style="height: 180px;width: 1150px;padding-top: 30px" >
        <el-row type="flex" justify="left" :gutter="20" style="margin-left: -20px">
          <el-col :span="4" :xl="5" style="padding-left: 10px; padding-right: 0px; height: 160px">
            <el-card class="box-card">
              <div class="card-content">
                <div class="conente-item amount-item">{{ dashboardDetails.totalComment }}</div>
                <div class="conente-item"><i class="el-icon-news"></i>&nbsp;&nbsp;总评论数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4" :xl="6" style="padding-left: 10px; padding-right: 0px; height: 160px">
            <el-card class="box-card">
              <div class="card-content">
                <div class="conente-item amount-item">{{ dashboardDetails.readTotalComment }}</div>
                <div class="conente-item"><i class="el-icon-view"/>&nbsp;&nbsp;未读评论数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4" :xl="5" >
            <el-card class="box-card">
              <div class="card-content">
                <div class="conente-item amount-item">{{ dashboardDetails.totalMessage }}</div>
                <div class="conente-item"><i class="el-icon-news"></i>&nbsp;&nbsp;总留言数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4" :xl="6" style="padding-left: 10px; padding-right: 0px; height: 160px">
            <el-card class="box-card">
              <div class="card-content">
                <div class="conente-item amount-item">{{ dashboardDetails.readTotalMessage }}</div>
                <div class="conente-item"><i class="el-icon-view"></i>&nbsp;&nbsp;未读留言数</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-header>

      <!-- 中下-->
      <el-main style="padding-top: 120px">
        <ve-histogram
          :data="chartData"
          :extend="extend"
          :settings="chartSettings"
          height="500px">
        </ve-histogram>
      </el-main>
    </el-container>

    <!-- 右边-->
    <el-aside style="height: 800px;width: 650px;padding-top: 30px">
      <el-card class="box-card-comment">
        <div class="card-content-todo">
          <div class="conente-item todo-item">
            <i class="el-icon-edit-outline"></i>
            <span style="line-height: 12px;">
            待办事项
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-button v-if="todoCommentList.length > 0" class="batch-read-btn" :plain="true" type="danger" size="mini" @click="handleCommentBatchRead">评论批量已读</el-button>
            <el-button v-if="todoMessageList.length > 0" class="batch-read-btn" :plain="true" type="danger" size="mini" @click="handleMessageBatchRead">留言批量已读</el-button>
          </div>
          <hr style="width: 650px;padding-left: -100px" color="#FF5348">
          <el-row>
            <div
              v-if="todoComment.id"
              v-for="todoComment in todoCommentList"
              :key="todoComment.id"
              class="flex-content">
              <div>
                <el-tag type="success">评论</el-tag>
              </div>
              <div style="width: 75px;margin-top: 5px;color: #84bba9"  >
                  {{ todoComment.userName }}
              </div>
              <div class="fs" style="width: 75px;margin:5px -30px">
                于
              </div>
              <div class="fs" style="width: 240px;margin:5px 0px 0 -50px">
                {{ todoComment.commentTime | parseTime }}
              </div>
              <div class="fs" style="width: 70px;margin:5px 0px 0 -50px">
                发表评论:
              </div>
              <div style="width: 250px;margin:5px 0px 0 0px;color: #84bba9">
                {{ todoComment.content }}
              </div>
            </div>
          </el-row>
          <el-row>
          <div
            v-if="todoMessage.id"
            v-for="todoMessage in todoMessageList"
            :key="todoMessage.id"
            class="flex-content">
            <div>
              <el-tag >留言</el-tag>
            </div>
            <div style="width: 75px;margin-top: 5px;color: #409EFF">
              {{ todoMessage.userName }}
            </div>
            <div class="fs" style="width: 75px;margin:5px -30px">
              于
            </div>
            <div class="fs" style="width: 240px;margin:5px 0px 0 -50px">
              {{ todoMessage.messageTime | parseTime }}
            </div>
            <div class="fs" style="width: 70px;margin:5px 0px 0 -50px">
              发表留言:
            </div>
            <div style="width: 250px;margin:5px 0px 0 0px;color: #409EFF">
              {{ todoMessage.content }}
            </div>
          </div>
          </el-row>
        </div>
      </el-card>
    </el-aside>
  </el-container>
</template>

<script>
  import { dashboardApi } from 'api/dashboard'

  export default {
    data() {
      this.chartSettings = {
        labelMap: {
          date: '日期',
          commentTotal: '评论数',
          messageTotal: '留言数'
        }
      }
      this.extend = {
        series: {
          label: { show: true, position: 'top' }
        }
      }
      return {
        dashboardDetails: {
          totalComment: null,
          readTotalComment: null,
          totalMessage: null,
          readTotalMessage: null
        },
        chartLoading: false,
        dataEmpty: false,
        chartData: {
          columns: ['date', 'commentTotal', 'messageTotal'],
          rows: []
        },
        fillDate: true,
        todoCommentList: [],
        todoMessageList: []
      }
    },
    methods: {
      // 获取未读评论
      async getTodoCommentList() {
        const response = await this.$http.post('/dashboard/getTodoCommentList.json')
        this.todoCommentList = response.data.rows
      },
      // 获取未读留言
      async getTodoMessageList() {
        const response = await this.$http.post('/dashboard/getTodoMessageList.json')
        this.todoMessageList = response.data.rows
      },
      // 获取首页数目  试试
      async getDashboardDetails() {
        const response = await this.$http.post('/dashboard/getDashboardDetails.json')
        const temp = response.data.rows
        this.dashboardDetails = {
          totalComment: temp.totalComment,
          readTotalComment: temp.readTotalComment,
          totalMessage: temp.totalMessage,
          readTotalMessage: temp.readTotalMessage
        }
      },
      // 获取图表数据
      async getChartData() {
        const response = await this.$http.post('/dashboard/getChartData.json')
        const chartData = response.data.result
        let rows = []
        if (chartData && chartData.length) {
          chartData.forEach(row => {
            rows.push({
              date: row.date,
              commentTotal: row.commentTotal,
              messageTotal: row.messageTotal
            })
          })
          this.chartData.rows = rows
        }
      }
    },
    mounted() {
      this.getTodoCommentList()
      this.getTodoMessageList()
      this.getDashboardDetails()
      this.getChartData()
    }
  }
</script>

<style scoped>
  .box-card {
    margin: 0 40px;
    height: 140px;
    width: 220px;
  }
  .box-card-comment {
    margin-left: 10px;
    height: 760px;
    width: 630px;
  }
  .fs {
    font-size: 14px;
  }
  .card-content {
    padding:20px 20px 20px 20px;
    text-align: center;
  }
  .card-content-todo {
    padding:20px 20px 20px 0px;
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
    margin-left: -220px;
    font-size: 20px;
    margin-top: -15px;
    color: #FF5348;
  }
  .flex-content {
    display: flex;
    padding: 2px 0;
    width: 700px;
    border-bottom: 2px dashed #d1dbe5;
  }
  .batch-read-btn {
    float: bottom;
    margin-top: 0px;
  }


</style>
