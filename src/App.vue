<template>
  <div id="app">
    <div class="container">
      <div class="side-wrap">
        <router-link to="/"><auto-scroll>首页</auto-scroll></router-link>
        <router-link to="/page-genie"><auto-scroll>页面设计器</auto-scroll></router-link>
        <router-link to="/about"><auto-scroll>关于</auto-scroll></router-link>
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
    width: 120px;
    display: flex;
    flex-direction: column;
    background-color: #e7e7e7;
    border-right: 1px solid #7bafdb;
    a {
      padding: 0.8rem;
      color: #333;
      text-decoration: none;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      transition: background-color .3s;
      &.router-link-exact-active {
          color: #0080eb;
          background-color: #f0f0f0;
          border-right: 5px solid #0080eb;
      }
      &:hover {
          color: #0080eb;
      }
    }
  }
  .main-wrap {
    flex: 1;
  }
}
</style>
