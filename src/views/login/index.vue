<template>
  <div class="login-container">
    <el-form class="card-box login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">后台管理</h3>

      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg aria-hidden="true" class="svg-icon">
            <use xlink:href="#icon-user">
              <svg class="icon" viewBox="0 0 1024 1024" id="icon-user" width="100%" height="100%"><path d="M504.951 511.98c93.49 0 169.28-74.002 169.28-165.26 0-91.276-75.79-165.248-169.28-165.248-93.486 0-169.287 73.972-169.279 165.248-0.001 91.258 75.793 165.26 169.28 165.26z m77.6 55.098H441.466c-120.767 0-218.678 95.564-218.678 213.45V794.3c0 48.183 97.911 48.229 218.678 48.229H582.55c120.754 0 218.66-1.78 218.66-48.229v-13.77c0-117.887-97.898-213.45-218.66-213.45z" p-id="7987"></path></svg>
            </use>
          </svg>
        </span>
        <el-input autofocus name="username" type="text" @keyup.enter.native="handleNext" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg aria-hidden="true" class="svg-icon">
            <use xlink:href="#icon-password">
              <svg class="icon" viewBox="0 0 1024 1024" id="icon-password" width="100%" height="100%"><path d="M780.8 354.579692 665.6 354.579692 665.6 311.689846c0-72.310154-19.849846-193.299692-153.6-193.299692-138.870154 0-153.6 135.049846-153.6 193.299692l0 42.889846L243.2 354.579692 243.2 311.689846C243.2 122.249846 348.790154 0 512 0s268.8 122.249846 268.8 311.689846L780.8 354.579692zM588.8 669.420308C588.8 625.900308 554.220308 590.769231 512 590.769231s-76.8 35.131077-76.8 78.651077c0 29.459692 15.399385 54.468923 38.439385 67.820308l0 89.639385c0 21.740308 17.250462 39.699692 38.4 39.699692s38.4-17.959385 38.4-39.699692l0-89.639385C573.44 723.889231 588.8 698.88 588.8 669.420308zM896 512l0 393.609846c0 65.260308-51.869538 118.390154-115.2 118.390154L243.2 1024c-63.291077 0-115.2-53.129846-115.2-118.390154L128 512c0-65.220923 51.869538-118.390154 115.2-118.390154l537.6 0C844.130462 393.609846 896 446.779077 896 512z" p-id="9230"></path></svg>
            </use>
          </svg>
        </span>
        <el-input name="password" @keyup.enter.native="handleLogin" :type="pwdType" v-model="loginForm.password" autoComplete="on"
                  placeholder="密码" />
        <span class='show-pwd' @click='showPwd'><icon-svg icon-class="eye" /></span>
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>

      <!-- <div class='tips'>账号:admin 密码随便填</div>
      <div class='tips'>账号:editor  密码随便填</div> -->

      <!-- <el-button class='thirdparty-button' type="primary" @click='showDialog=true'>打开第三方登录</el-button> -->
    </el-form>

    <!-- <el-dialog title="第三方验证" :visible.sync="showDialog">
      本地不能模拟，请结合自己业务进行模拟！！！<br/><br/><br/>
      邮箱登录成功,请选择第三方验证<br/>
      <social-sign />
    </el-dialog> -->

  </div>
</template>

<script>
  // import { isvalidUsername } from '@/utils/validate'
  import { valLogin } from '@/api/login'
  import md5 from 'js-md5'

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (!value || value.length < 6) {
          callback(new Error('密码不能小于6位'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: null,
          password: null
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        pwdType: 'password',
        loading: false,
        showDialog: false
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleNext() {
        document.getElementsByTagName('input')[1].focus()
      },
      async handleLogin() {
    await this.$validate('loginForm')
    this.loading = true
    const params = { ...this.loginForm }
    // params.password = md5(params.password)

    const rs = await valLogin(params.username, params.password)
    this.loading = false
    if (rs.data.code === -1005) {
      await this.$myConfirm(rs.data.message + ',您是否继续登录，下线异地用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    } else if (rs.data.code !== 0) {
      this.$notify.error({
        title: '提示',
        message: rs.data.message,
        duration: 2000
      })
      return
    }

    this.loading = true
    try {
      await this.$store.dispatch('LoginByUsername', params)
      this.loading = false
      this.$router.push({ path: '/' })
    } catch (msg) {
      this.loading = false
      this.$notify.error({
        title: '提示',
        message: msg,
        duration: 2000
      })
    }
  }
  }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
  @include relative;
    height: 100vh;
    background-color: $bg;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  &_login {
     font-size: 20px;
   }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
  }
  .thirdparty-button{
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
  }
</style>
