<template>
  <div id="app">
    <div class="container">
      <div class="navi-wrap">
        <main-navi></main-navi>
      </div>
      <div class="main-wrap">
        <router-view/>
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

<style>
:root, body {
  margin: 0;
  height: 100%;
  font-size: 14px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  box-sizing: border-box;
}
#app, .container, .page {
  width: 100%;
  height: 100%;
}
</style>
<style scoped>
.container {
  display: flex;
  .navi-wrap {
    width: 150px;
  }
  .main-wrap {
    flex: 1;
  }
}
</style>
