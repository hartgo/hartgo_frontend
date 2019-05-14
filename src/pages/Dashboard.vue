<template>
  <div class="app-container">
    <app-left-navigation :menuList="mainMenuList"></app-left-navigation>
    <section class="main-view-section">
      <app-top-navigation :menuList="topMenuList"></app-top-navigation>
      <app-sub-navigation></app-sub-navigation>
      <app-leaf-navigation></app-leaf-navigation>
      <div class="main-container" :style="'height: calc(100vh - ' + containerHeight + 'px);'">
        <router-view></router-view>
      </div>
    </section>
  </div>
</template>
<script>
import appTopNavigation from '@/components/app/app-top-navigation'
import appSubNavigation from '@/components/app/app-sub-navigation'
import appLeftNavigation from '@/components/app/app-left-navigation'
import appLeafNavigation from '@/components/app/app-leaf-navigation'

export default {
  components: {
    appTopNavigation,
    appSubNavigation,
    appLeftNavigation,
    appLeafNavigation
  },
  data() {
    return {}
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    mainMenuList() {
      let tempList = this.$store.getters.userMenu || [];
      return tempList.filter(item => item.visible);
    },
    topMenuList() {
      let tempList = this.$store.getters.userMenu || [];
      return tempList.filter(item => !item.visible);
    },
    containerHeight() {
      return (this.$store.getters.leafMenu || []).length ? 148 : ((this.$store.getters.subMenu || []).length ? 90 : 50);
    }
  },
  mounted() {},
  methods: {}
}

</script>
<style>
</style>
