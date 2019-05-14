<template>
  <div class="app-top-navigation" :style="sizeStyle">
    <div class="logo-area">
      <img src="@/../static/theme/default/images/logo.png"/>
      <p>{{$t('system.platform.name')}}</p>
    </div>
    <div style="margin-left: 20px" v-if="false">
      <div class="btn">
        <div>
          {{lang}}<i class="el-icon-arrow-down el-icon-right"></i>
          <ul class="popup">
            <li v-for="(item,key) in languages" :key="key" @click="switchLanguage(item.value)">{{item.name}}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <ul class="menu"></ul>
    <ul class="flex-row">
      <router-link tag="li" :title="item.menuName" v-for="(item, key) in menuList" :to="item.url" active-class="active" class="nav-item" :key="key" @click.native="menuClick(item)">
        <i :class="item.icon"></i>
      </router-link>
    </ul>
    <div class="user">
      <label>{{$t('system.common.message.hello') + userInfo.userName}}</label>
      <div class="photo"><img src="@/../static/theme/default/images/photo.png"/></div>
    </div>
    <div class="nav-item" :title="$t('system.common.message.logout')" @click="userLogout"><i class="platform icon-logout"></i></div>
  </div>
</template>
<script>
import appConfig from '@/utils/appConfig'
export default {
  inject: ['reload'],
  props: {
    menuList: {
      type: Array,
      default: function() {
        return []
      }
    },
    sizeStyle: {
      type: String,
      default: 'height: 50px;'
    }
  },
  data() {
    return {}
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    languages() {
      return this.$i18n.LANGUAGES
    },
    lang() {
      return this.$i18n.locale === 'zh_CN' ? '简体中文' : 'English';
    }
  },
  mounted() {},
  methods: {
    userLogout() {
      this.$confirm('您确认要退出当前系统吗？', '退出登录', {
        type: 'warning'
      }).then(_ => {
        this.$fetch(this.$api.platform.userLogout, {}).then((response) => {
          if (response.success) {
            this.$store.dispatch('clearUserCache');
            this.$router.push({ path: appConfig.LOGIN_PAGE });
          } else {
            self.$message.error(this.$t('common.Foradministrator'))
          }
        })
      }).catch(_ => {});
    },
    switchLanguage(language) {
      this.$i18n.saveLocale(language);
      this.reload();
    },
    menuClick(menu) {
      this.$router.push({ path: menu.children[0].url });
    }
  }
}

</script>
<style>
</style>
