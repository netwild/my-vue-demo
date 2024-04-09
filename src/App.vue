<template>
  <div id="app">
    <div class="container">
      <div class="navi-wrap">
        <main-navi />
      </div>
      <div class="main-wrap">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import MainNavi from '@/components/MainNavi'
export default {
  components: {
    MainNavi
  }
}
</script>

<style lang="scss">
@import '@/assets/style/common.scss';
</style>

<style scoped>
.container {
  display: flex;
  .navi-wrap {
    width: 3rem;
  }
  .main-wrap {
    flex: 1;
  }
}
</style>
