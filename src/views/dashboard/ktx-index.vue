<template>
  <div class="ktx-dashboard-container">
    <div class="content">
      <el-row :gutter="16">
        <el-col :span="16">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="line-height: 36px;">待办事项</span>
            </div>
            <div
              v-if="repair.repairNo"
              v-for="repair in repairList"
              :key="repair.repairNo"
              @click="showTodoDialog(repair, 1, '报修详情')"
              class="flex-content">
              <div>
                <el-tag type="danger">报修</el-tag>
              </div>
              <div class="b-2" :title="repair.content">
                {{ repair.content }}
              </div>
              <div class="b-3">{{ repair.createTimeOfStatus }}</div>
            </div>
            <div
              v-if="praise.praiseNo"
              v-for="praise in praise1List"
              :key="praise.praiseNo"
              @click="showTodoDialog(praise, 2, '投诉详情')"
              class="flex-content">
              <div>
                <el-tag type="warning">投诉</el-tag>
              </div>
              <div class="b-2" :title="praise.content">{{ praise.content }}</div>
              <div class="b-3">{{ praise.createTimeOfStatus }}</div>
            </div>
            <div
              v-if="praise.praiseNo"
              v-for="praise in praise2List"
              :key="praise.praiseNo"
              @click="showTodoDialog(praise, 3, '建议详情')"
              class="flex-content">
              <div>
                 <el-tag type="success">建议</el-tag>
              </div>
              <div class="b-2" :title="praise.content">{{ praise.content }}</div>
              <div class="b-3">{{ praise.createTimeOfStatus }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="line-height: 36px;">辖区概况</span>
            </div>
            <div class="clearfix">
              <div class="pull-left">管理处数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">占地面积:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">车位数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">房间数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">业主数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">租户数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">入住率(%):</div>
              <div class="pull-right"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="16">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="line-height: 36px;">通告栏</span>
            </div>
            <!-- <div v-for="o in 4" :key="o" class="text item">
              {{'列表内容 ' + o }}
            </div> -->
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="line-height: 36px;">收入概况(今天)</span>
            </div>
            <div class="clearfix">
              <div class="pull-left">收费人次:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">收费笔数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">车位数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">房间数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">业主数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">租户数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">入住率(%):</div>
              <div class="pull-right"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="16">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="line-height: 36px;">我的消息</span>
            </div>
            <!-- <div v-for="o in 4" :key="o" class="text item">
              {{'列表内容 ' + o }}
            </div> -->
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="line-height: 36px;">事务提醒</span>
            </div>
            <div class="clearfix">
              <div class="pull-left">收费人次:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">收费笔数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">车位数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">房间数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">业主数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">租户数:</div>
              <div class="pull-right"></div>
            </div>
            <div class="clearfix">
              <div class="pull-left">入住率(%):</div>
              <div class="pull-right"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
export default {
  name: 'ktxdashboard',
  data() {
    return {
      repairList: [],
      praise1List: [],
      praise2List: [],

      todoDialogisible: false,
      todoView: null,
      todoType: 1,
      todoDialogTitle: null,
      todoFormLoading: false
    }
  },
  methods: {
    async getTodoTask() {
      // TODO 暂时屏蔽
      // const response = await this.$http.get('/dealMatters/queryMatterNums.json')
      // const data = response.data
      //
      // let total = 0
      // const limit = 5
      // while (total < limit) {
      //   let flag = false
      //   for (let i = 0; i < data.length; i++) {
      //     const item = data[i]
      //     const queryLimit = item.queryLimit || (item.queryLimit = 0)
      //     if (item.matterNums > queryLimit) {
      //       total += 1
      //       item.queryLimit += 1
      //       flag = true
      //     }
      //     if (total >= limit) {
      //       break
      //     }
      //   }
      //
      //   if (total >= limit || !flag) {
      //     break
      //   }
      // }
      //
      // let allNum = 0
      // for (let i = 0; i < data.length; i++) {
      //   const item = data[i]
      //   allNum += item.matterNums
      //   if (item.type === 1) {
      //     item.queryLimit > 0 && this.getRepair(item.queryLimit)
      //   } else if (item.type === 2) {
      //     item.queryLimit > 0 && this.getPraise1(item.queryLimit)
      //   } else if (item.type === 3) {
      //     item.queryLimit > 0 && this.getPraise2(item.queryLimit)
      //   }
      // }
      //
      // this.$store.dispatch('setTodoNum', allNum)
    },
    async getRepair(limit) {
      const url = '/dealMatters/queryRepairMatterByPage.json'
      const params = {
        status: 99,
        repairType: 99,
        page: 1,
        rows: limit
      }
      const response = await this.$http.get(url, params)
      this.repairList = response.data.rows
    },
    async getPraise1(limit) {
      const url = '/dealMatters/queryPraiseMattersByPage.json'
      const params = {
        status: 99,
        praiseType: 1,
        page: 1,
        rows: limit
      }
      const response = await this.$http.get(url, params)
      this.praise1List = response.data.rows
    },
    async getPraise2(limit) {
      const url = '/dealMatters/queryPraiseMattersByPage.json'
      const params = {
        status: 99,
        praiseType: 2,
        page: 1,
        rows: limit
      }
      const response = await this.$http.get(url, params)
      this.praise2List = response.data.rows
    },
    showTodoDialog(reparir, type, title) {
      this.todoDialogisible = true
      this.todoView = reparir
      this.todoType = type
      this.todoDialogTitle = title
      this.todoFormLoading = false
    },
    todoSave() {
      this.$refs['todoComponent'].update(this)
    }
  },
  mounted: function() {
    this.getTodoTask()
  }
}
</script>

<style lang="scss">
  .ktx-dashboard-container {
    margin: 10px;
    .content {
      width: 960px;
      margin: 30px auto;
      .el-card {
        margin-bottom: 16px;
        .el-card__header {
          padding: 3px 8px;
        }
        .el-card__body {
          padding: 8px;
          min-height: 150px;
          .clearfix {
            font-size: 12px;
            line-height: 1.5em;
          }
        }
        .pull-left {
          float: left;
        }
        .pull-right {
          float: right;
        }
      }
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
    .flex-content:first-child {
      padding-top: 0;
    }
    .flex-content:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }
  }
</style>

