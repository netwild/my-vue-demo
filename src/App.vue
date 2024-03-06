<template>
  <div id="app">
    <div class="container">
      <div class="side-wrap">
          <router-link v-for="(navi, ind) in navis" :key="ind" :to="navi.path">
            <svg-icon :iconClass="navi.icon"></svg-icon>
            <auto-scroll>{{navi.caption}}</auto-scroll>
          </router-link>
      </div>
      <div class="main-wrap">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import AutoScroll from '@/components/AutoScroll'
export default {
  components: {
    AutoScroll
  },
  data() {
    return {
      navis: [
        { icon: "navi-home", path: "/", caption: "首页" },
        { icon: "navi-page", path: "/page-genie", caption: "页面设计器" },
        { icon: "navi-about", path: "/about", caption: "关于" }
      ]
    }
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
.container {
  display: flex;
  .side-wrap {
    width: 100px;
    display: flex;
    flex-direction: column;
    background-color: #e7e7e7;
    border-right: 1px solid #989595;
    a {
      padding: 0.8rem;
      color: #333;
      text-decoration: none;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      transition: color,background-color .3s;
      display: flex;
      align-items: center;
      &.router-link-exact-active {
          color: #0080eb;
          background-color: #f8f8f8 !important;
          border-right: 5px solid #989595;
      }
      &:hover {
          color: #0080eb;
          background-color: #f0f0f0;
      }
      .svg-icon {
        width: 2rem;
        height: 2rem;
        margin-right: 0.5rem;
      }
    }
  }
  .main-wrap {
    flex: 1;
  }
}
</style>
