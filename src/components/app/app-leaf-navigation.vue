<template>
  <div v-if="leafMenuList && leafMenuList.length" class="app-leaf-navigation flex-between">
    <div v-if="position !== 'left'" class="space-menu-area"></div>
    <ul class="flex-row no-padding no-margin right-menu-area">
      <router-link :to="item.url" tag="li" class="menu-item" active-class="active" v-for="(item, index) in leafMenuList" :key="index">
        <p class="text-ellipse">{{item.menuName}}</p>
      </router-link>
    </ul>
    <div v-if="position !== 'right'" class="space-menu-area"></div>
  </div>
</template>
<script>
export default {
  props: {
    position: {
      type: String,
      default: () => {
        return 'left'
      }
    },
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
    return {}
  },
  computed: {
    leafMenuList() {
      return this.$store.getters.leafMenu || []
    }
  },
  mounted() {},
  methods: {}
}

</script>
<style>
</style>
