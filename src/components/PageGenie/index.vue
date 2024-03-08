<template>
  <div class="page paged">
    <div class="side-wrap side-left-wrap">
      <div class="header-wrap side-header-wrap">
        <icon-text icon="navi-page" text="页面设计器" theme="title" />
      </div>
      <div class="side-body-wrap"></div>
    </div>
    <div class="main-wrap">
      <div class="header-wrap main-header-wrap">
        <div class="main-header-inner">
          <div class="tools-bar left-tools-bar">1</div>
          <div class="tools-bar center-tools-bar">2</div>
          <div class="tools-bar right-tools-bar">3</div>
        </div>
      </div>
      <div class="main-body-wrap"></div>
    </div>
    <div class="side-wrap side-right-wrap">
      <div class="header-wrap side-header-wrap">
        <router-link to="/" class="marg-right">
          <icon-text icon="back" text="返回" theme="navi" />
        </router-link>
      </div>
      <div class="side-body-wrap"></div>
    </div>
  </div>
</template>

<script>
import IconText from './components/IconText'
export default {
  components: {
    IconText
  }
}
</script>

<style scoped>
@import "./index.scss";
</style>
