<template>
  <div class="app-container login-page">
    <div class="login-container">
      <div class="login-title">
        <div class="login-logo">
          <img src="@/../static/theme/default/images/logo.png"/>
        </div>
          <div>
            <h4>{{$t('system.platform.name')}}</h4>
          </div>
        </div>
        <div class="form-container">
          <el-form class="login-form" ref="paramForm" :rules="paramRules" :model="paramForm" @keyup.enter.native="userLogin">
            <el-form-item label="" prop="userName">
              <div class="form-item">
                <span class="form-input-icon"><i class="platform icon-username"></i></span>
                <input v-model="paramForm.userName" type="text" class="form-input" :placeholder="$t('login.placeholder.username')" />
              </div>
            </el-form-item>
            <el-form-item label="" prop="password">
              <div class="form-item">
                <span class="form-input-icon"><i class="platform icon-password"></i></span>
                <input v-model="paramForm.password" type="password" class="form-input" :placeholder="$t('login.placeholder.password')" />
              </div>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" @click="userLogin" class="sign-button" :loading="loading">
                {{$t('login.button.submit')}} <i
            class="cam icon-login"></i></el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
</template>
<script>
import utils from '@/utils'
import appConfig from '@/utils/appConfig'
export default {
  components: {},
  data() {
    return {
      loading: false,
      paramForm: {
        loginName: '',
        password: ''
      },
      paramRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      target: { path: appConfig.HOME_PAGE }
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    uuid() {
      return this.$store.getters.getUUID
    }
  },
  mounted() {
    // 获取跳转至登录页面的原始页面
    if (this.$route.query) {
      let params = utils.parseQueryParams(this.$route.query);
      if (params && params.path && params.path.length) {
        this.target = params;
      }
    }
    if (this.userInfo !== null && this.userInfo !== undefined) {
      this.$router.push(this.target);
    }
  },
  methods: {
    userLogin() {
      this.$refs['paramForm'].validate((valid) => {
        if (valid) {
          this.loading = true;
          let param = {
            userName: this.paramForm.userName,
            password: this.$aes.aesEncrypt(this.paramForm.password),
            rememberMe: false
          };
          this.$log.info('用户登录的参数为：', param);
          /* ---------------------- 临时代码，将服务器的路由地址进行转换 ---------------------- */
          let userInfo = require('@/../static/testData/userInfo.json');
          let tempMenu = require('@/../static/testData/userMenu.json');
          userInfo.userMenus = tempMenu;
          this.$store.dispatch('loginSuccess', userInfo)
          if (this.uuid === null) {
            this.$store.dispatch('setUUID', utils.createUUID());
          }
          this.$router.push(this.target);
          /* ---------------------- 临时代码，将服务器的路由地址进行转换 ---------------------- */
          // this.$fetch(this.$api.platform.userLogin, param).then((response) => {
          //   this.loading = false;
          //   if (response.success) {
          //     let userInfo = response.returnObj;
          //     this.$log.info('用户登录成功，用户名为：', userInfo.userName);
          //     // ---------------------- 临时代码，将服务器的路由地址进行转换 ----------------------
          //     let tempMenu = require('@/../static/testData/userMenu.json');
          //     userInfo.userMenus = tempMenu;
          //     // ---------------------- 临时代码，将服务器的路由地址进行转换 ----------------------
          //     this.$store.dispatch('loginSuccess', userInfo)
          //     if (this.uuid === null) {
          //       this.$store.dispatch('setUUID', utils.createUUID());
          //     }
          //     this.$router.push(this.target);
          //   } else {
          //     this.$message({ type: 'error', message: response.msgContent })
          //     this.$log.error('用户登录失败，用户名为：', param.userName, '，响应参数为：', response);
          //   }
          // })
        } else {
          return false
        }
      })
    }
  }
}

</script>
<style>
</style>
