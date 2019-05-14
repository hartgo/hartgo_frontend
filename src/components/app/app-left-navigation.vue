<template>
  <div class="app-left-navigation" :style="sizeStyle">
    <div class="menu-button" :style="'height: ' + topNavHeight + ';line-height: ' + topNavHeight + ';'">
      <i class="platform icon-menu"></i>
    </div>
    <el-scrollbar class="menu-container">
      <ul class="menu-list">
        <router-link :to="item.url" tag="li" class="menu-item" active-class="active" v-for="(item, index) in menuList" :key="index" :title="item.menuName">
          <p><i :class="item.icon"></i></p>
          <p class="text-ellipse">{{item.menuName}}</p>
        </router-link>
      </ul>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  props: {
    menuList: {
      type: Array,
      default: () => {
        return []
      }
    },
    sizeStyle: {
      type: String,
      default: () => {
        return 'width: 70px; height: 100vh;'
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
    return {}
  },
  computed: {},
  mounted() {},
  methods: {}
}

</script>
<style>
</style>
