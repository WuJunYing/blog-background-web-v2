<template>
  <div>
    <div class="ktx-head">
      <router-link class='inlineBlock' to="/">
        <div class="logo">认养管理系统-平台端</div>
      </router-link>
      <div class="top-menu">
        <div
          class="top-menu-item"
          :class="{'on': topMenuActive == menu.path}"
          v-for="(menu) in topMenu"
          @click="click(menu)"
          :key="menu.path">
          <i class="fa" :class="menu.icon" aria-hidden="true"></i>
          {{menu.menuName}}
        </div>
      </div>
      <div class="btn-bar navbar clearfix">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img class="user-avatar" :src="pic">
            <div class="name">{{name}}</div>
            <!-- <i class="el-icon-caret-bottom"></i> -->
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <router-link class='inlineBlock' to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
            <el-dropdown-item>
              <div @click="handlePwd">修改密码</div>
            </el-dropdown-item>
            <el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="btn-content clearfix">
          <!-- <div class="btn-item">
            <router-link to="/dashboard">
              <i class="fa fa-comments" aria-hidden="true"></i>
              <span>任务 ({{ todoNum }}) </span>
            </router-link>
          </div>
          <div class="btn-item" :class="{'active': msgCount > 0}" @click="showMsg">
            <i class="fa fa-commenting-o" aria-hidden="true"></i>
            <span>消息({{msgCount}})</span>
          </div> -->
          <!-- <div class="btn-item" @click="screenfullClick">
            <i class="fa fa-arrows-alt" aria-hidden="true"></i>
            <span>全屏</span>
          </div> -->
        </div>
      </div>
      <div v-if="isMsg" v-show="msgShow" class="msg-box">
        <iframe src="/static/tx-webim/index.html" frameborder="0" width="100%" height="100%"></iframe>
      </div>
    </div>
    <el-dialog title="修改密码" :visible.sync="passwordFormVisible" width="500px">
      <el-form class="small-space"
        :model="temp" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="原密码" prop="oldpass">
          <el-input type="password" v-model="temp.oldpass" ref="oldPswInp" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="temp.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="temp.checkPass" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoading">
        <el-button size="small" @click="passwordFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handlePwdSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import screenfull from 'screenfull'
import pic from 'assets/pic.png'
import md5 from 'js-md5'

export default {
  data() {
    return {
      pic,
      msgShow: false,
      msgCount: 0,
      isMsg: false,
      passwordFormVisible: false,
      temp: {
        oldpass: null,
        pass: null,
        checkPass: null
      },
      rules: {
        oldpass: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 6, message: '最少6位密码', trigger: 'blur' }
        ],
        checkPass: [
          { validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.temp.pass) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur' }
        ]
      },
      formLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'topMenu',
      'topMenuActive',
      'name',
      'avatar',
      'todoNum'
    ])
  },
  methods: {
    showMsg() {
      if (!this.isMsg) {
        this.isMsg = true
      }
      this.msgShow = !this.msgShow
    },
    click(menu) {
      this.$store.dispatch('setActiveMenu', menu.path)
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
    },
    screenfullClick() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    handlePwd() {
      this.passwordFormVisible = true
      this.$resetFields('ruleForm')
    },
    async handlePwdSubmit() {
      await this.$validate('ruleForm')
      const oldPsw = md5(this.temp.oldpass)
      const newPsw = md5(this.temp.pass)
      if (oldPsw === newPsw) {
        this.passwordFormVisible = false
        return
      }
      const response = await this.$http.post('/adminUser/updatePsw', { oldPsw, newPsw })
      if (response.data.code === 0) {
        this.passwordFormVisible = false
      } else if (response.data.code === -3) {
        this.$refs['oldPswInp'].focus()
      }
      this.$msg(response)
    }
  },
  mounted() {
    window.setMsgCount = (count) => {
      this.msgCount = count
    }
    window.setReceiveMsg = () => {
      this.msgShow = true
    }
    window.getPath = () => {
      return process.env.BASE_API
    }
    window.msgWindowClose = () => {
      this.showMsg()
    }
    setTimeout(() => {
      // this.isMsg = true
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
.ktx-head {
  width: 100%;
  min-width: 1280px;
  height: 72px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 22;
  background-color: #f9001f;
  background-image: linear-gradient(143deg, #363b3f 20%, #41494d 81%, #4f5558);
  .logo {
    float: left;
    width: 180px;
    text-align: center;
    font-size: 16px;
    line-height: 72px;
    color: #fff;
  }
  .top-menu {
    float: left;
    margin-left: 40px;
    .top-menu-item {
      float: left;
      position: relative;
      margin-right: 40px;
      height: 72px;
      min-width: 82px;
      text-align: center;
      line-height: 72px;
      font-size: 14px;
      color: #fff;
      opacity: .69;
      cursor: pointer;
      transition: all .2s ease-in-out;
    }
    .top-menu-item:hover {
      color: #fff;
      opacity: 1;
    }
    .on:after {
      content: "";
      display: block;
      width: 100%;
      height: 4px;
      background-color: #4fe3c1;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    .top-menu-item.on {
      color: #fff;
      opacity: 1;
    }
  }
  .btn-bar {
    float: right;
    user-select: none;
  }
}

.navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    position: relative;
    .avatar-container {
      float: right;
      margin-right: 16px;
      .avatar-wrapper {
        cursor: pointer;
        height: 72px;
        position: relative;
        .user-avatar {
            vertical-align: middle;
            width: 40px;
            height: 40px;
            border-radius: 10px;
        }
        .name {
          display: inline-block;
          vertical-align: middle;
          color: #fff;
          font-size: 12px;
          margin-left: 2px;
        }
        .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
        }
      }
      .avatar-wrapper:before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        height: 72px;
        width: 0px;
      }
    }
}

.el-dropdown-menu__item {
  font-size: 14px;
}

.msg-box {
  position: fixed;
  width: 750px;
  height: 662px;
  z-index: 100;
  margin:auto;
  left:0;
  right:0;
  top:0;
  bottom:0;
}
.btn-content {
  float: right;
  margin-right: 16px;
  .btn-item {
    float: left;
    margin-left: 16px;
    line-height: 72px;
    color: #fff;
    opacity: .69;
    cursor: pointer;
    span {
      font-size: 12px;
    }
  }
  .btn-item.active {
    color: #f00000;
    animation: blink .75s linear infinite;
    color: #dd4814;
  }
  .btn-item:hover {
    opacity: 1;
  }
}

@keyframes blink{
  0%{opacity: 1;}
  50%{opacity: 1;}
  50.01%{opacity: 0;}
  100%{opacity: 0;}
}
</style>

