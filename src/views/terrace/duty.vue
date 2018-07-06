<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleCreate">添加</el-button>
        <el-input @keyup.enter.native="$handleFilter" v-model="dutyFilter.name" class="filter-item" placeholder="职务名称"></el-input>
        <el-select
          v-if="false"
          clearable
          class="filter-item"
          v-model="dutyFilter.roleType"
          placeholder="职务类型"
          @change="$handleFilter">
          <el-option v-for="(value, key) in roleTypes" :key="key" :label="value" :value="key"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="$handleFilter">搜索</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        element-loading-text="加载中"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column class-name="ktx-operate" align="center" label="操作" width="120" fixed="left">
          <template slot-scope="scope">
            <el-button v-if="$has('') && (scope.row.id == 1 || scope.row.id == 2)" size="mini" @click="handleDetail(scope.row)">详情</el-button>
            <el-button v-if="$has('') && scope.row.id != 1 && scope.row.id != 2" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="$has('') && scope.row.id != 1 && scope.row.id != 2" size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="name" label="职务名称" width="280"></el-table-column>
        <el-table-column prop="roleTypeStr" label="职务类型" width="280"></el-table-column>
      </el-table>
      <div class="ktx-page-block">
        <el-pagination @size-change="$handleSizeChange" @current-change="$handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 新增dialog -->
    <el-dialog
      :title="detailTitle"
      :visible.sync="detailVisible"
      width="600px">
      <div>
        <el-form ref="duty" :rules="rules" :model="duty" :inline="true" status-icon label-width="80px">
          <el-form-item label="职务名称" prop="name">
            <el-input v-model="duty.name" :disabled="nameDisabled" style="width: 188px;"></el-input>
          </el-form-item>
          <el-form-item v-if="false" label="职务类型" prop="roleType">
            <el-select
              class="filter-item"
              v-model="duty.roleType"
              placeholder="职务类型"
              @change="changeUserType"
              style="width: 188px;">
              <el-option v-for="(value, key) in roleTypes" :key="key" :label="value" :value="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="false" label="职务描述" prop="description">
            <el-input v-model="duty.description" style="width: 470px;"></el-input>
          </el-form-item>
          <el-form-item v-if="false" :class="duty.roleType + '' !== '1'? 'is-required': ''" label="所属商家" prop="merchantId">
            <el-select
              filterable
              v-model="duty.merchantId"
              placeholder="所属商家"
              :disabled="merchantDisabled"
              style="width: 188px;">
              <el-option v-for="(value, key) in merchants" :key="key" :label="value.merchantName" :value="value.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单权限" prop="permissions" style="max-height: 300px;overflow-y: auto;">
            <!-- Vue 不允许在已经创建的实例上动态添加新的根级响应式属性，所以必须通过$set把属性绑定过来 -->
            <div v-for="(module, index) in modules" :key="index" style="margin-left: 12px;">
              <el-checkbox :indeterminate="moduleIndeterminates[index].value" v-model="moduleAllCheck[index].checked" :disabled="permissionsDisabled" @change="checkModule(index)">
                <span class="module-checkbox">{{ module.name }}</span>
              </el-checkbox>
              <el-checkbox-group class="module-sub-checkbox" v-model="permissions[index].id" :disabled="permissionsDisabled" @change="checkSubModule(index)">
                <el-checkbox v-for="subModule in module.children" :label="subModule.id" :key="subModule.id">{{ subModule.name }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: right;margin-right: 10px;">
        <el-button size="small" v-waves @click="detailVisible = false">取消</el-button>
        <el-button v-if="!nameDisabled" type="primary" size="small" v-waves @click="saveDuty">保存</el-button>
      </div>
    </el-dialog>
    <!-- end -->
  </div>
</template>

<script>

import { dutyApi, moduleApi } from 'api/duty'

const roleTypes = {
  '1': '平台管理员',
  '2': '商家管理员',
  '3': '自营商家管理员'
}

// 1秒检查一次
const checkNameTimeOut = 1000
var lastCheckTime = null

export default {
  data() {
    var checkRoleName = (rule, value, callback) => {
      // 打开dialog时不发起校验
      if (!this.needCheckName) {
        this.needCheckName = !this.needCheckName
        return callback()
      }
      if (!value) {
        return callback(new Error('职务名称不能为空'))
      }
      if (value.length > 50) {
        return callback(new Error('职务名称长度不能大于50个字符'))
      }
      const params = {
        roleId: this.duty.id,
        name: value
      }
      let flag = false
      if (lastCheckTime === null) {
        lastCheckTime = new Date().getTime()
        flag = true
      } else {
        const checkInterval = new Date().getTime() - lastCheckTime
        if (checkInterval > checkNameTimeOut) {
          flag = true
          lastCheckTime = new Date().getTime()
        }
      }
      if (flag) {
        dutyApi.checkRoleName(params).then((response) => {
          if (response.data.code === -1) {
            return callback(new Error('职务名称已存在'))
          }
          return callback()
        }).catch(() => {
          this.$notify.error({
            title: '错误',
            message: '检查职务名称错误',
            duration: 2000
          })
        })
      } else {
        return callback()
      }
    }
    // 校验商家
    var checkMerchant = (rule, value, callback) => {
      if (this.duty.roleType + '' === '1') {
        return callback()
      } else {
        if (value) {
          return callback()
        }
        return callback(new Error('所属商家不能为空'))
      }
    }
    return {
      listLoading: true,
      tableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,
      roleTypes,
      dutyFilter: {
        name: null,
        roleType: '1'
      },
      duty: {
        id: null,
        name: null,
        description: null,
        roleType: '1',
        moduleIdList: null,
        moduleCodeList: null,
        permissions: null,
        merchantId: null
      },

      needCheckName: true,
      allMerchants: [],
      merchants: [],
      merchantDisabled: true,
      permissionsDisabled: false,
      nameDisabled: false,

      // 存放所有模块
      modules: [],
      // 存放模块id，二维数组
      moduleIds: [],
      // 存放模块code，二维数组
      moduleCodes: [],
      // 存放模块id, code对应关系
      moduleRelations: {},

      moduleAllCheck: [],
      moduleIndeterminates: [],
      permissions: [],

      detailVisible: false,
      detailTitle: '新增职务',
      rules: {
        name: [
          { required: true, message: '职务名称不能为空', trigger: 'blur' },
          { validator: checkRoleName }
        ],
        roleType: [
          { required: true, message: '职务类型不能为空', trigger: 'blur' }
        ],
        merchantId: [
          { required: false, message: '所属商家不能为空', trigger: 'change' },
          { validator: checkMerchant }
        ]
      }
    }
  },
  methods: {
    async getTableList() {
      this.dutyFilter.page = this.currentPage
      this.dutyFilter.rows = this.pageSize
      this.listLoading = true
      const response = await dutyApi.getTableList(this.dutyFilter)
      this.tableData = response.data.rows
      if (this.tableData.length > 0) {
        this.tableData.forEach(row => {
          row.roleTypeStr = roleTypes[row.roleType]

          if (row.merchantId === 0) {
            row.merchantId = null
          }
        })
      }
      this.total = response.data.total
      this.listLoading = false
    },
    checkModule(index) {
      this.permissions[index].id = this.moduleAllCheck[index].checked ? this.moduleIds[index] : []
      this.moduleIndeterminates[index].value = false
    },
    checkSubModule(index) {
      const checkedCount = this.permissions[index].id.length
      this.moduleAllCheck[index].checked = checkedCount === this.moduleIds[index].length
      this.moduleIndeterminates[index].value = checkedCount > 0 && checkedCount < this.moduleIds[index].length
    },
    async handleCreate() {
      this.detailTitle = '新增职务'
      this.duty = {
        id: null,
        name: null,
        description: null,
        roleType: '1',
        moduleIdList: null,
        moduleCodeList: null,
        permissions: null,
        merchantId: null
      }
      if (this.$refs['duty']) {
        this.$refs['duty'].resetFields()
      }
      this.moduleAllCheck.forEach(module => {
        module.checked = false
      })
      this.moduleIndeterminates.forEach(module => {
        module.value = false
      })
      this.permissions.forEach(permission => {
        permission.id = []
        permission.code = []
      })
      this.nameDisabled = false
      this.permissionsDisabled = false
      this.detailVisible = true
    },
    async handleUpdate(row) {
      if (this.$refs['duty']) {
        this.$refs['duty'].resetFields()
      }
      this.duty.id = row.id
      this.duty.name = row.name
      this.duty.roleType = row.roleType + ''
      this.duty.moduleCodeList = row.moduleCodeList
      this.duty.moduleIdList = row.moduleIdList
      this.duty.merchantId = row.merchantId

      this.detailTitle = '职务详情'
      this.needCheckName = false

      this.changeUserType(this.duty.roleType, this.duty.merchantId)

      // 权限
      this.moduleAllCheck.forEach(module => {
        module.checked = false
      })
      this.moduleIndeterminates.forEach(module => {
        module.value = false
      })
      this.permissions.forEach(permission => {
        permission.id = []
        permission.code = []
      })

      // 把权限idlist转换成二维数组
      const idArray = this.duty.moduleIdList.split('|')
      this.moduleIds.forEach((ids, index) => {
        const temp = []
        ids.forEach(id => {
          for (let i = 0; i < idArray.length; i++) {
            if ((id + '') === (idArray[i] + '')) {
              // id是int型需转int，不然识别不到
              temp.push(parseInt(idArray[i]))
              break
            }
          }
          if (temp.length === ids.length) {
            this.moduleAllCheck[index].checked = true
            this.moduleIndeterminates[index].value = false
          } else {
            this.moduleAllCheck[index].checked = false
            if (temp.length) {
              this.moduleIndeterminates[index].value = true
            }
          }
          this.$set(this.permissions[index], 'id', temp)
        })
      })
      this.nameDisabled = false
      this.permissionsDisabled = false
      this.detailVisible = true
    },
    async handleDelete(row) {
      await this.$myConfirm('确定删除吗?')
      const tempRow = {
        id: row.id
      }
      const response = await dutyApi.deleteRole(tempRow)
      this.getTableList()
      this.$msg(response)
    },
    async handleDetail(row) {
      this.handleUpdate(row)
      this.nameDisabled = true
      this.permissionsDisabled = true
    },
    async saveDuty() {
      lastCheckTime = null
      await this.$validate('duty')
      const idArray = []
      const codeArray = []
      if (this.permissions.length) {
        this.permissions.forEach(permission => {
          if (permission.id.length) {
            permission.id.forEach(perm => {
              idArray.push(perm)
              codeArray.push(this.moduleRelations[perm])
            })
          }
        })
      }
      var params = { ...this.duty }
      params.moduleIdList = idArray.join('|')
      params.moduleCodeList = codeArray.join('|')
      if (params.merchantId == null) {
        // 没有商家id的必须置为0，然后后台不会更新
        params.merchantId = 0
      }
      const response = await dutyApi.saveRole(params)
      this.$msg(response)
      this.getTableList()
      this.detailVisible = false
    },

    changeUserType(roleType, merchantId) {
      // 当修改时，merchantId 不为空需设置到user里
      this.duty.merchantId = null
      if (this.duty.roleType !== '1') {
        this.merchantDisabled = false
        this.merchants = []
        // 普通商家
        if (this.duty.roleType + '' === '2') {
          this.allMerchants.forEach(merchant => {
            if (merchant.merchantType + '' === '1') {
              this.merchants.push(merchant)
            }
          })
        } else if (this.duty.roleType + '' === '3') {
          // 自营商家
          this.allMerchants.forEach(merchant => {
            if (merchant.merchantType + '' === '2') {
              this.merchants.push(merchant)
            }
          })
        }
      } else {
        // 平台管理
        // TODO merchanItem如果有错误状态的class删除
        this.merchantDisabled = true
      }
      if (merchantId) {
        this.duty.merchantId = merchantId
      }
    }
  },
  created() {
    // 获取系统模块
    moduleApi.getAllModule({ type: 1 }).then((response) => {
      if (response.data.code === 0) {
        this.modules = response.data.result
        if (this.modules.length) {
          this.modules.forEach((module, index) => {
            var codeArray = []
            var idArray = []
            if (module.children.length) {
              module.children.forEach(subModule => {
                codeArray.push(subModule.moduleCode)
                idArray.push(subModule.id)
                this.moduleRelations[subModule.id] = subModule.moduleCode
              })
            }
            // 存放所有模版code，二维数组
            this.moduleCodes.push(codeArray)
            // 存放所有模版id，二维数组
            this.moduleIds.push(idArray)

            // Vue 不允许在已经创建的实例上动态添加新的根级响应式属性
            this.moduleAllCheck.push([])
            this.moduleIndeterminates.push([])
            this.permissions.push([])

            this.$set(this.permissions[index], 'id', [])
            this.$set(this.permissions[index], 'code', [])
            this.$set(this.moduleAllCheck[index], 'checked', false)
            this.$set(this.moduleIndeterminates[index], 'value', false)
          })
        }
      } else {
        this.$msg(response)
      }
    }).catch(() => {
      this.$notify.error({
        title: '错误',
        message: '获取系统模块失败',
        duration: 2000
      })
    })
  },
  mounted() {
    this.getTableList()

    // 获取全部商家
    this.$http.post('/merchant/queryAllMerchantList', {})
      .then((response) => {
        if (response.data.rows) {
          this.allMerchants = response.data.rows
        } else {
          this.$notify.error({
            title: '错误',
            message: '获取全部商家失败',
            duration: 2000
          })
        }
      })
      .catch(() => {
        this.$notify.error({
          title: '错误',
          message: '获取全部商家失败',
          duration: 2000
        })
      })
  }
}
</script>
<style scoped>

.module-checkbox {
  font-weight: bold;
  font-size: 15px;
}

.module-sub-checkbox {
  margin-left: 25px;
}

/* 覆盖原样式 */
.el-checkbox+.el-checkbox {
  margin-left: 0;
}
.el-checkbox {
  margin-right: 30px;
}

</style>
