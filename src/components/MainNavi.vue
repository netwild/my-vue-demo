<template>
  <div class="page">
    <router-link v-for="(navi, ind) in navis" :key="ind" :to="navi.path">
      <svg-icon :iconClass="navi.icon"></svg-icon>
      <auto-scroll>{{navi.caption}}</auto-scroll>
    </router-link>
  </div>
</template>

<script>
import AutoScroll from '@/components/AutoScroll'
export default {
  name: 'MainNavi',
  components: {
    AutoScroll
  },
  data () {
    return {
      navis: [
        { icon: 'navi-home', path: '/', caption: '首页' },
        { icon: 'navi-page', path: '/paged/design', caption: '页面设计器' },
        { icon: 'navi-about', path: '/about', caption: '关于' }
      ]
    }
  }
}
</script>

<style scoped>
.page {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #161821;
  a {
    height: 50px;
    padding: 0 0.8rem;
    color: #ddd;
    text-decoration: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: color,background .3s;
    display: flex;
    align-items: center;
    &.router-link-exact-active {
      color: #fff !important;
      background: linear-gradient(to right, #0080eb, #003866) !important;
    }
    &:hover {
      color: #5ab5ff;
    }
    .svg-icon {
      width: 2rem;
      height: 2rem;
      margin-right: 0.5rem;
    }
  }
}
</style>
