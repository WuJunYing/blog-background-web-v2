<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleCreate">添加</el-button>
        <el-input @keyup.enter.native="$handleFilter" v-model="userFilter.userName" class="filter-item" placeholder="用户名"></el-input>
        <el-select
          clearable
          class="filter-item"
          v-model="userFilter.adminRoleId"
          placeholder="职务"
          @change="$handleFilter">
          <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id"></el-option>
        </el-select>
        <el-select
          clearable
          class="filter-item"
          v-model="userFilter.status"
          placeholder="帐号状态"
          @change="$handleFilter">
          <el-option v-for="(value, key) in userStatuses" :key="key" :label="value" :value="key"></el-option>
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
            <el-button v-if="$has('') && (scope.row.id === 1 || scope.row.id === 2)" size="mini" @click="handleDetail(scope.row)">详情</el-button>
            <el-button v-if="$has('') && scope.row.id !== 1 && scope.row.id !== 2" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="$has('') && scope.row.id !== 1 && scope.row.id !== 2" size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="userName" label="昵称" width="150"></el-table-column>
        <el-table-column prop="adminRoleName" label="职务" width="150"></el-table-column>
        <el-table-column prop="userTypeStr" label="用户类型" width="150"></el-table-column>
        <el-table-column prop="mobile" label="手机" width="150"></el-table-column>
        <el-table-column prop="realName" label="真实名称" width="150"></el-table-column>
        <el-table-column prop="statusStr" label="帐号状态" width="100"></el-table-column>
        <el-table-column prop="isSuperStr" label="是否超级管理员" width="140"></el-table-column>
        <el-table-column prop="lastLoginTime" label="最近登录时间" width="180"></el-table-column>
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
      width="640px">
      <div>
        <el-form ref="user" :rules="rules" :model="user" :inline="true" :disabled="userFormDisabled" status-icon label-width="80px" autocomplete="off">
          <el-form-item label="用户名" prop="userName">
            <el-input class="user-input" v-model="user.userName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="真实名称" prop="realName">
            <el-input class="user-input" v-model="user.realName"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input class="user-input" type="password" v-model="user.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="重复密码" prop="rePassword">
            <el-input class="user-input" type="password" v-model="user.rePassword" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="移动电话" prop="mobile">
            <el-input class="user-input" v-model.number="user.mobile"></el-input>
          </el-form-item>
          <el-form-item label="职务" prop="adminRoleId">
            <el-select
              class="user-input"
              v-model="user.adminRoleId"
              placeholder="职务">
              <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="false" label="用户类型" prop="userType">
            <el-select
              class="user-input"
              v-model="user.userType"
              placeholder="用户类型"
              @change="changeUserType">
              <el-option v-for="(value, key) in userTypes" :key="key" :label="value" :value="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="false" :class="user.userType + '' !== '1'? 'is-required': ''" label="所属商家" prop="merchantId">
            <el-select
              class="user-input"
              filterable
              v-model="user.merchantId"
              placeholder="所属商家"
              :disabled="merchantDisabled">
              <el-option v-for="merchant in merchants" :key="merchant.id" :label="merchant.merchantName" :value="merchant.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              class="user-input"
              v-model="user.status"
              placeholder="状态">
              <el-option v-for="(value, key) in userStatuses" :key="key" :label="value" :value="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否超级管理员" prop="isSuper" label-width="120px">
            <el-switch v-model="user.isSuper"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: right;margin-right: 10px;">
        <el-button size="small" v-waves @click="detailVisible = false">取消</el-button>
        <el-button v-if="!userFormDisabled" type="primary" size="small" v-waves @click="saveUser">保存</el-button>
      </div>
    </el-dialog>
    <!-- end -->
  </div>
</template>

<script>

import { dutyApi } from 'api/duty'
import { employeeApi } from 'api/employee'
import md5 from 'js-md5'

const userTypes = {
  '1': '平台人员',
  '2': '商家人员',
  '3': '自营商家人员'
}

const userStatuses = {
  '1': '正常',
  '2': '禁用'
}

// 1秒检查一次
const checkTimeOut = 1000
var lastCheckTime = null

export default {
  data() {
    // 校验用户名
    var checkUserName = (rule, value, callback) => {
      // 打开dialog时不发起校验
      if (!this.needCheckName) {
        this.needCheckName = !this.needCheckName
        return callback()
      }
      if (!value) {
        return callback(new Error('用户名称不能为空'))
      }
      if (value.length > 50) {
        return callback(new Error('用户名称长度不能大于50个字符'))
      }
      if (value.length < 6) {
        return callback(new Error('用户名称长度必须大于6个字符'))
      }
      const params = {
        userId: this.user.id,
        userName: value
      }
      let flag = false
      if (lastCheckTime === null) {
        lastCheckTime = new Date().getTime()
        flag = true
      } else {
        const checkInterval = new Date().getTime() - lastCheckTime
        if (checkInterval > checkTimeOut) {
          flag = true
          lastCheckTime = new Date().getTime()
        }
      }
      if (flag) {
        employeeApi.checkUserName(params).then((response) => {
          if (response.data.code === -1) {
            return callback(new Error('用户名称已存在'))
          }
          return callback()
        }).catch(() => {
          this.$notify.error({
            title: '错误',
            message: '检查用户名称错误',
            duration: 2000
          })
        })
      } else {
        return callback()
      }
    }
    // 校验手机
    var checkMobile = (rule, value, callback) => {
      // 打开dialog时不发起校验
      if (!this.needCheckMobile) {
        this.needCheckMobile = !this.needCheckMobile
        return callback()
      }
      if ((value + '').length) {
        const regex = /^((\+)?86|((\+)?86)?)0?1[34578]\d{9}$/
        if (regex.test(value)) {
          // 判断手机号是否存在
          const params = {
            userId: this.user.id,
            mobile: value
          }
          employeeApi.checkMobile(params).then((response) => {
            if (response.data.code === -1) {
              return callback(new Error('此电话已存在'))
            }
            return callback()
          }).catch(() => {
            this.$notify.error({
              title: '错误',
              message: '检查手机是否存在错误',
              duration: 2000
            })
          })
        } else {
          return callback(new Error('请输入正确的手机号码'))
        }
      } else {
        return callback(new Error('手机号码不能为空'))
      }
    }
    // 校验商家
    var checkMerchant = (rule, value, callback) => {
      if (this.user.userType + '' === '1') {
        return callback()
      } else {
        if (value) {
          return callback()
        }
        return callback(new Error('所属商家不能为空'))
      }
    }
    // 校验密码
    var checkPsw = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('重复密码不能为空'))
      } else {
        if (value !== this.user.password) {
          return callback(new Error('两次密码不一致'))
        }
      }
      return callback()
    }
    return {
      listLoading: true,
      tableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,
      userTypes,
      userStatuses,
      userFilter: {
        name: null,
        adminRoleId: null,
        userType: '1',
        status: null
      },
      user: {
        id: null,
        userName: null,
        realName: null,
        adminRoleId: '',
        merchantId: null,
        userType: '1',
        password: null,
        rePassword: null,
        mobile: null,
        status: '1',
        isSuper: 0
      },
      userFormDisabled: false,
      roles: [],
      allMerchants: [],
      merchants: [],
      detailVisible: false,
      detailTitle: '新增员工',
      merchantDisabled: true,
      // false时是打开dialog时，此时不用发起校验
      needCheckName: true,
      needCheckMobile: true,
      oldPsw: null,
      rules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { validator: checkUserName }
        ],
        userType: [
          { required: true, message: '用户类型不能为空', trigger: 'blur' }
        ],
        adminRoleId: [
          { required: true, message: '职务不能为空', trigger: 'change' }
        ],
        realName: [
          { required: true, message: '真实名称不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        rePassword: [
          { required: true, message: '重复密码不能为空', trigger: 'blur' },
          { validator: checkPsw }
        ],
        mobile: [
          { required: true, message: '电话不能为空', trigger: 'blur' },
          { validator: checkMobile }
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
      this.userFilter.page = this.currentPage
      this.userFilter.rows = this.pageSize
      this.listLoading = true
      const response = await employeeApi.getTableList(this.userFilter)
      this.tableData = response.data.rows
      if (this.tableData.length > 0) {
        this.tableData.forEach(row => {
          for (let i = 0; i < this.roles.length; i++) {
            if ((this.roles[i].id + '') === (row.adminRoleId + '')) {
              row.adminRoleName = this.roles[i].name
              break
            }
          }
          row.userTypeStr = userTypes[row.userType]
          row.statusStr = userStatuses[row.status]
          row.isSuperStr = row.isSuper === 1 ? '是' : '否'
          row.lastLoginTime = this.$toDataStr(row.lastLoginTime, '{y}-{m}-{d} {h}:{i}:{s}')

          row.rePassword = row.password
          if (row.merchantId === 0) {
            row.merchantId = null
          }
        })
      }
      this.total = response.data.total
      this.listLoading = false
    },
    async handleCreate() {
      this.detailTitle = '新增员工'
      this.user = {
        id: null,
        userName: null,
        realName: null,
        adminRoleId: '',
        merchantId: null,
        userType: '1',
        password: null,
        rePassword: null,
        mobile: null,
        status: '1',
        isSuper: 0
      }
      if (this.$refs['user']) {
        this.$refs['user'].resetFields()
      }
      this.userFormDisabled = false
      this.detailVisible = true
    },
    async handleUpdate(row) {
      this.detailTitle = '修改员工'
      if (this.$refs['user']) {
        this.$refs['user'].resetFields()
      }
      this.user = {
        id: row.id,
        userName: row.userName,
        realName: row.realName,
        adminRoleId: row.adminRoleId,
        merchantId: row.merchantId,
        userType: row.userType + '',
        password: row.password,
        rePassword: row.password,
        mobile: row.mobile,
        status: row.status + '',
        isSuper: row.isSuper
      }
      if (this.user.isSuper || (this.user.isSuper + '') === '1') {
        this.user.isSuper = true
      }

      this.needCheckName = false
      this.needCheckMobile = false
      this.changeUserType(this.user.userType, this.user.merchantId)

      this.oldPsw = row.password
      this.userFormDisabled = false
      this.detailVisible = true
    },
    async handleDelete(row) {
      await this.$myConfirm('确定删除吗?')
      const tempRow = {
        id: row.id
      }
      const response = await employeeApi.deleteUser(tempRow)
      this.getTableList()
      this.$msg(response)
    },
    async handleDetail(row) {
      this.handleUpdate(row)
      this.userFormDisabled = true
    },
    async saveUser() {
      lastCheckTime = null
      await this.$validate('user')
      // 后台isSuper是int型的，在这里需转换
      var params = { ...this.user }
      params.isSuper = params.isSuper ? 1 : 0
      if (params.id == null) {
        // 新增
        if (params.password) {
          params.password = md5(params.password)
        }
      } else {
        // 修改
        if (params.password === this.oldPsw) {
          // 没有修改密码，将密码置为null，防止后台更新
          params.password = null
        } else {
          // 有修改秘密的，必须使用md5加密
          params.password = md5(params.password)
        }
      }
      const response = await employeeApi.saveUser(params)
      this.$msg(response)
      this.getTableList()
      this.detailVisible = false
    },
    changeUserType(userType, merchantId) {
      // 当修改时，merchantId 不为空需设置到user里
      this.user.merchantId = null
      if (this.user.userType !== '1') {
        this.merchantDisabled = false
        this.merchants = []
        // 普通商家
        if (this.user.userType + '' === '2') {
          this.allMerchants.forEach(merchant => {
            if (merchant.merchantType + '' === '1') {
              this.merchants.push(merchant)
            }
          })
        } else if (this.user.userType + '' === '3') {
          // 自营商家
          this.allMerchants.forEach(merchant => {
            if (merchant.merchantType + '' === '2') {
              this.merchants.push(merchant)
            }
          })
        }
      } else {
        // TODO merchanItem如果有错误状态的class删除
        this.merchantDisabled = true
      }
      if (merchantId) {
        this.user.merchantId = merchantId
      }
    }
  },
  mounted() {
    // 获取全部职务
    dutyApi.getAllRoles({ roleType: 1 }).then((response) => {
      if (response.data.code === 0) {
        this.roles = response.data.result
        this.getTableList()
      } else {
        this.$msg(response)
      }
    }).catch(() => {
      this.$notify.error({
        title: '错误',
        message: '获取全部职务失败',
        duration: 2000
      })
    })

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

.user-input {
  width: 208px;
}

</style>
