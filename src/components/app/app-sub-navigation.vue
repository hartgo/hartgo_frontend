<template>
  <div v-if="subMenuList && subMenuList.length" class="app-sub-navigation">
    <div class="flex-between valign-center menu-area">
      <div class="valign-center left-menu-area" :style="sizeStyle">
        <span class="point-arrow left"></span>
        <!-- <span class="point-arrow right"></span> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" :to="{ path: item.url }">{{item.menuName}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="valign-center right-menu-area" :style="sizeStyle">
        <!-- <span class="point-arrow left"></span> -->
        <span class="point-arrow right"></span>
        <ul class="flex-row no-padding no-margin">
          <router-link router :default-active="activeMenu.path" :to="item.url" tag="li" class="menu-item" active-class="active" v-for="(item, index) in subMenuList" :key="index">
            <p class="text-ellipse">{{item.menuName}}</p>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    sizeStyle: {
      type: String,
      default: () => {
        return 'height: 40px;'
      }
    },
    topNavHeight: {
      type: String,
      default: () => {
        return '50px'
      }
    }
  },
  data() {
    return {
      activeMenu: {}
    }
  },
  computed: {
    subMenuList() {
      return this.$store.getters.subMenu || []
    },
    breadcrumbList() {
      return this.$store.getters.breadcrumbList || []
    }
  },
  mounted() {},
  methods: {}
}

</script>
<style>
</style>
