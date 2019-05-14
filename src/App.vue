<template>
  <div id="app">
    <router-view class="router-view" v-if="isRouterAlive" />
  </div>
</template>
<script>
export default {
  name: 'App',
  data: () => {
    return {
      isRouterAlive: true
    }
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  created() {
    // 根据语种设置页面标题
    document.title = this.$t('system.platform.name');
    document.body.className = 'default-theme';
  },
  mounted() {},
  methods: {
    reload() {
      this.isRouterAlive = false;
      // 刷新用户菜单信息
      // this.$fetch(this.$api.platform.getUserMenu).then((response) => {
      //   if (response.success) {
      //     let userMenus = response.userMenus;
      //     this.$log.info('用户菜单刷新成功');
      //     this.$store.dispatch('setUserMainMenu', userMenus);
      //   } else {
      //     this.$log.error('用户菜单刷新失败');
      //   }
      // })
      /* ---------------------- 临时代码，将服务器的路由地址进行转换 ---------------------- */
      let userMenus = [];
      if (this.$i18n.locale === 'zh_CN') {
        userMenus = require('@/../static/testData/userMenu_CN.json');
      } else {
        userMenus = require('@/../static/testData/userMenu_EN.json');
      }
      this.$store.dispatch('setUserMainMenu', userMenus);
      /* ---------------------- 临时代码，将服务器的路由地址进行转换 ---------------------- */
      this.$nextTick(() => {
        // 根据语种设置页面标题
        document.title = this.$t('system.platform.name');
        document.body.className = 'default-theme';
        this.isRouterAlive = true
      })
    }
  }
}

</script>
<style>
</style>
