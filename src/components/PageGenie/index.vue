<template>
  <div class="page paged">
    <div class="side-wrap side-left-wrap" :style="{ 'width': sideLeftWidth + 'px' }">
      <div class="header-wrap side-header-wrap">
        <icon-text icon="navi-page" text="页面设计器" theme="title" />
      </div>
      <div class="side-body-wrap"></div>
      <drag-line dir="h" mode="left" :pos="sideLeftWidth" @drag="sideLeftDrag"></drag-line>
    </div>
    <div class="main-wrap">
      <div class="header-wrap main-header-wrap">
        <div class="main-header-inner">
          <div class="left-tools-bar">
            <scope-tab :current="scopeCurrent" @scopeTabChg="scopeTabChg"></scope-tab>
          </div>
          <div class="right-tools-bar">
            <icon-text icon="paged-preview" text="预览" theme="tool" />
            <icon-text icon="paged-import" text="导入" theme="tool" />
            <icon-text icon="paged-export" text="导出" theme="tool" />
            <icon-text icon="paged-save" text="保存" theme="tool" />
          </div>
        </div>
      </div>
      <div class="main-body-wrap"></div>
    </div>
    <div class="side-wrap side-right-wrap" :style="{ 'width': sideRightWidth + 'px' }">
      <div class="header-wrap side-header-wrap">
        <router-link to="/">
          <icon-text icon="paged-back" text="返回" theme="navi" />
        </router-link>
      </div>
      <div class="side-body-wrap"></div>
      <drag-line dir="h" mode="right" :pos="sideRightWidth" @drag="sideRightDrag"></drag-line>
    </div>
  </div>
</template>

<script>
import IconText from './components/IconText'
import ScopeTab from './components/ScopeTab'
import DragLine from './components/DragLine.vue'
export default {
  components: {
    IconText, ScopeTab, DragLine
  },
  data () {
    return {
      scopeCurrent: 'common',
      sideLeftWidth: 260,
      sideRightWidth: 260
    }
  },
  methods: {
    scopeTabChg (curr) {
      this.scopeCurrent = curr
    },
    sideLeftDrag (pos) {
      this.sideLeftWidth = pos
    },
    sideRightDrag (pos) {
      this.sideRightWidth = pos
    }
  }
}
</script>

<style scoped>
@import "./index.scss";
</style>
