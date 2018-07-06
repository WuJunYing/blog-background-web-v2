<template>
  <div class="ktx-components-container" style="margin: 10px 30px;">
    <el-form :inline="true" ref="nodesForm" :model="nodes" :rules="rules" label-position="right" label-width="220px" style="width: 460px;">
      <h4>买家支付</h4>
      <el-card class="box-card">
        <el-form-item label="土地：">
          <span>全款支付</span>
        </el-form-item>
        <br/>
        <el-form-item label="其他产品首款占比：" prop="userProductFirst">
          <el-input class="node-inp" v-model.number="nodes.userProductFirst">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="其他产品尾款占比：" prop="userProductLast">
          <el-input class="node-inp" v-model.number="nodes.userProductLast">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <div v-if="userProcutError" class="node-error">首款占比 + 尾款占比 必须等于100%</div>
      </el-card>
      <h4>卖家收入</h4>
      <el-card class="box-card">
        <el-form-item label="土地首款占比：" prop="merchantLandFirst">
          <el-input class="node-inp" v-model.number="nodes.merchantLandFirst">
            <template slot="append">%</template>
          </el-input>
          <div class="node-tips">商家确认开始使用土地即到账</div>
        </el-form-item>
        <br/>
        <el-form-item label="土地尾款占比：" prop="merchantLandLast">
          <el-input class="node-inp" v-model.number="nodes.merchantLandLast">
            <template slot="append">%</template>
          </el-input>
          <div class="node-tips">土地周期结束即到账</div>
        </el-form-item>
        <div v-if="merchantLandError" class="node-error">首款占比 + 尾款占比 必须等于100%</div>
      </el-card>
      <br/>
      <el-card class="box-card">
        <el-form-item label="其他产品首款：">
          <div>全首款到账</div>
          <div class="node-tips" style="margin-top: -10px;">商家确认开始认养即到账</div>
        </el-form-item>
        <br/>
        <el-form-item label="其他产品尾款占比（第一期）：" prop="merchantProductLastFirst">
          <el-input class="node-inp" v-model.number="nodes.merchantProductLastFirst">
            <template slot="append">%</template>
          </el-input>
          <div class="node-tips">买家第一次确认领用</div>
        </el-form-item>
        <br/>
        <el-form-item label="其他产品尾款占比（第二期）：" prop="merchantProductLastSecond">
          <el-input class="node-inp" v-model.number="nodes.merchantProductLastSecond">
            <template slot="append">%</template>
          </el-input>
          <div class="node-tips">本订单产品全部领用完</div>
        </el-form-item>
        <div v-if="merchantProductError" class="node-error">尾款占比（第一期） +  尾款占比（第二期） 必须等于100%</div>
      </el-card>
      <br/>
      <el-card class="box-card">
        <el-form-item label="服务款：">
          <div>全款到账</div>
          <div class="node-tips" style="margin-top: -10px;">买家确认领用之后到账</div>
        </el-form-item>
      </el-card>
      <br/>
      <div style="text-align: center;margin-bottom: 50px;">
        <div style="margin-bottom: 10px;font-size: .8em">注：修改保存后，在农场新订单中生效</div>
        <el-button type="primary" size="small" @click="updateNoes">保存修改</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { businessApi } from 'api/business'

export default {
  data() {
    var checkNumber = (rule, value, callback) => {
      const num = parseFloat(value)
      if (isNaN(num)) {
        if (value.length) {
          callback(new Error('必须为数字'))
        } else {
          callback(new Error('不能为空'))
        }
      } else {
        if (num > 100) {
          callback(new Error('不能超过100'))
        } else if (num < 0) {
          callback(new Error('必须大于0'))
        }
      }
      callback()
    }
    return {
      nodes: {
        userProductFirst: null,
        userProductLast: null,
        merchantLandFirst: null,
        merchantLandLast: null,
        merchantProductLastFirst: null,
        merchantProductLastSecond: null
      },
      tempNodes: null,
      rules: {
        userProductFirst: [
          { required: true, validator: checkNumber, trigger: 'blur' }
        ],
        userProductLast: [
          { required: true, validator: checkNumber, trigger: 'blur' }
        ],
        merchantLandFirst: [
          { required: true, validator: checkNumber, trigger: 'blur' }
        ],
        merchantLandLast: [
          { required: true, validator: checkNumber, trigger: 'blur' }
        ],
        merchantProductLastFirst: [
          { required: true, validator: checkNumber, trigger: 'blur' }
        ],
        merchantProductLastSecond: [
          { required: true, validator: checkNumber, trigger: 'blur' }
        ]
      },
      userProcutError: false,
      merchantLandError: false,
      merchantProductError: false
    }
  },
  methods: {
    async getAllNodes() {
      const response = await businessApi.getAllNodes()
      if (response.data.success) {
        const nodes = response.data.result
        // type: 1定金 2尾款 3全款
        // userType: 1买家 2卖家
        // nodeType: 1其他产品 2土地
        nodes.forEach(node => {
          const type = node.type + ''
          // 非全款支付的可修改
          if (type !== '3') {
            const userType = node.userType + ''
            const nodeType = node.nodeType + ''
            // 买家的其他产品
            if (userType === '1' && nodeType === '1') {
              if (type === '1') {
                // 首款
                this.nodes.userProductFirst = node.percent
              } else if (type === '2') {
                // 尾款
                this.nodes.userProductLast = node.percent
              }
            }
            if (userType === '2') {
              if (nodeType === '2') {
                // 卖家土地
                if (type === '1') {
                  // 首款
                  this.nodes.merchantLandFirst = node.percent
                } else if (type === '2') {
                  // 尾款
                  this.nodes.merchantLandLast = node.percent
                }
              } else {
                // 卖家产品
                // *** 首款是全付的，尾款分为第一期、第二期 ***
                if (type === '1') {
                  // 尾款一期
                  this.nodes.merchantProductLastFirst = node.percent
                } else if (type === '2') {
                  // 尾款二期
                  this.nodes.merchantProductLastSecond = node.percent
                }
              }
            }
          }
        })
        this.tempNodes = Object.assign({}, this.nodes)
      } else {
        this.$msg(response)
      }
    },
    async updateNoes() {
      await this.$validate('nodesForm')
      this.nodes = {
        userProductFirst: this.convertNumber(this.nodes.userProductFirst),
        userProductLast: this.convertNumber(this.nodes.userProductLast),
        merchantLandFirst: this.convertNumber(this.nodes.merchantLandFirst),
        merchantLandLast: this.convertNumber(this.nodes.merchantLandLast),
        merchantProductLastFirst: this.convertNumber(this.nodes.merchantProductLastFirst),
        merchantProductLastSecond: this.convertNumber(this.nodes.merchantProductLastSecond)
      }
      if (this.nodes.userProductFirst + this.nodes.userProductLast !== 100) {
        this.userProcutError = true
        this.$tip('请检查首款占比 + 尾款占比 是否等于100%')
        return
      } else {
        this.userProcutError = false
      }
      if (this.nodes.merchantLandFirst + this.nodes.merchantLandLast !== 100) {
        this.merchantLandError = true
        this.$tip('请检查首款占比 + 尾款占比 是否等于100%')
        return
      } else {
        this.merchantLandError = false
      }
      if (this.nodes.merchantProductLastFirst + this.nodes.merchantProductLastSecond !== 100) {
        this.merchantProductError = true
        this.$tip('请检查首款占比 + 尾款占比 是否等于100%')
        return
      } else {
        this.merchantProductError = false
      }
      const nodes = []
      this.tempNodes = {
        userProductFirst: this.convertNumber(this.tempNodes.userProductFirst),
        userProductLast: this.convertNumber(this.tempNodes.userProductLast),
        merchantLandFirst: this.convertNumber(this.tempNodes.merchantLandFirst),
        merchantLandLast: this.convertNumber(this.tempNodes.merchantLandLast),
        merchantProductLastFirst: this.convertNumber(this.tempNodes.merchantProductLastFirst),
        merchantProductLastSecond: this.convertNumber(this.tempNodes.merchantProductLastSecond)
      }
      if (this.tempNodes.userProductFirst !== this.nodes.userProductFirst ||
          this.tempNodes.userProductLast !== this.nodes.userProductLast) {
        // 买家，其他产品首款
        nodes.push({
          type: 1,
          userType: 1,
          nodeType: 1,
          percent: this.nodes.userProductFirst
        })
        // 买家，其他产品尾款
        nodes.push({
          type: 2,
          userType: 1,
          nodeType: 1,
          percent: this.nodes.userProductLast
        })
      }
      if (this.tempNodes.merchantLandFirst !== this.nodes.merchantLandFirst ||
          this.tempNodes.merchantLandLast !== this.nodes.merchantLandLast) {
        // 卖家，土地首款
        nodes.push({
          type: 1,
          userType: 2,
          nodeType: 2,
          percent: this.nodes.merchantLandFirst
        })
        // 卖家，土地尾款
        nodes.push({
          type: 2,
          userType: 2,
          nodeType: 2,
          percent: this.nodes.merchantLandLast
        })
      }
      if (this.tempNodes.merchantProductLastFirst !== this.nodes.merchantProductLastFirst ||
          this.tempNodes.merchantProductLastSecond !== this.nodes.merchantProductLastSecond) {
        // 卖家，其他产品尾款占比（第一期）
        nodes.push({
          type: 1,
          userType: 2,
          nodeType: 1,
          percent: this.nodes.merchantProductLastFirst
        })
        // 卖家，其他产品尾款占比（第二期）
        nodes.push({
          type: 2,
          userType: 2,
          nodeType: 1,
          percent: this.nodes.merchantProductLastSecond
        })
      }
      if (nodes.length > 0) {
        const response = await businessApi.updateNodes({ nodesStr: JSON.stringify(nodes) })
        this.$msg(response)
        this.getAllNodes()
      } else {
        this.$tip('无需保存修改')
      }
    },
    convertNumber(value) {
      const num = parseFloat(value + '')
      if (isNaN(num)) {
        return null
      } else {
        return parseFloat(num.toFixed(2))
      }
    }
  },
  mounted() {
    this.getAllNodes()
  }
}
</script>
<style scoped>
  .node-inp {
    width: 180px;
  }
  .node-tips {
    font-weight: bold;
    font-size: 12px;
    line-height: 1;
    padding-top: 8px;
  }
  .node-error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    text-align: center;
  }
</style>
