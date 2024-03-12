<template>
  <div class="page paged">
    <div class="side-wrap side-left-wrap" :style="{ 'width': sideLeftWidth + 'px' }">
      <div class="header-wrap side-header-wrap">
        <icon-text icon="navi-page" text="页面设计器" theme="title" />
      </div>
      <div class="side-body-wrap">
        <div class="side-box page-struct-container" :style="{ 'height': pageStructHeight + 'px' }">
          <page-struct :scope="scopeCurrent"></page-struct>
        </div>
        <div class="side-box comp-box-container">
          <comp-box :scope="scopeCurrent"></comp-box>
        </div>
        <drag-line dir="v" mode="top" :min="0" :max="800" :pos="pageStructHeight" @drag="sideTopDrag"></drag-line>
      </div>
      <drag-line dir="h" mode="left" :min="0" :max="500" :pos="sideLeftWidth" @drag="sideLeftDrag"></drag-line>
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
      <div class="side-box side-body-wrap">
        <property-box :scope="scopeCurrent"></property-box>
      </div>
      <drag-line dir="h" mode="right" :min="0" :max="500" :pos="sideRightWidth" @drag="sideRightDrag"></drag-line>
    </div>
  </div>
</template>

<script>
import IconText from './components/IconText'
import ScopeTab from './components/ScopeTab'
import DragLine from './components/DragLine'
import PageStruct from './components/PageStruct'
import CompBox from './components/CompBox'
import PropertyBox from './components/PropertyBox'
export default {
  components: {
    IconText, ScopeTab, DragLine, PageStruct, CompBox, PropertyBox
  },
  data () {
    return {
      scopeCurrent: 'common',
      sideLeftWidth: 260,
      sideRightWidth: 260,
      pageStructHeight: 350
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
    },
    sideTopDrag (pos) {
      this.pageStructHeight = pos
    }
  }
}
</script>

<style scoped>
@import "./index.css";
</style>
