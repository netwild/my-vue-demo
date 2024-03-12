<template>
  <div class="page paged">
    <div class="side-wrap side-left-wrap" :style="{ 'width': sizes.sideWidthLeft + 'px' }">
      <div class="header-wrap side-header-wrap">
        <icon-text icon="navi-page" text="页面设计器" theme="title" />
      </div>
      <div class="side-body-wrap">
        <div class="side-box page-struct-container" :style="{ 'height': sizes.pageStructHeight + 'px' }">
          <page-struct :scope="scopeCurrent"></page-struct>
        </div>
        <div class="side-box comp-box-container">
          <comp-box :scope="scopeCurrent"></comp-box>
        </div>
        <drag-line dir="v" mode="top" :min="0" :max="sizes.pageStructMax" :pos="sizes.pageStructHeight" @drag="sideTopDrag"></drag-line>
      </div>
      <drag-line dir="h" mode="left" :min="0" :max="sizes.sideWidthMax" :pos="sizes.sideWidthLeft + 1" @drag="sideLeftDrag"></drag-line>
    </div>
    <div class="main-wrap">
      <div class="header-wrap main-header-wrap">
        <div class="main-header-inner">
          <div class="left-tools-bar">
            <scope-tab :current="scopeCurrent" @scopeTabChg="scopeTabChg"></scope-tab>
            <div class="stage-size-monitor">
              {{ sizes.mobileStageWidth }} × {{ sizes.mobileStageHeight }}
            </div>
          </div>
          <div class="right-tools-bar">
            <icon-text icon="paged-preview" text="预览" theme="tool" />
            <icon-text icon="paged-import" text="导入" theme="tool" />
            <icon-text icon="paged-export" text="导出" theme="tool" />
            <icon-text icon="paged-save" text="保存" theme="tool" />
          </div>
        </div>
      </div>
      <div class="main-body-wrap">
        <div class="main-body">
          <main-stage ref="mainStage" :scope="scopeCurrent"></main-stage>
        </div>
      </div>
    </div>
    <div class="side-wrap side-right-wrap" :style="{ 'width': sizes.sideWidthRight + 'px' }">
      <div class="header-wrap side-header-wrap">
        <router-link to="/">
          <icon-text icon="paged-back" text="返回" theme="navi" />
        </router-link>
      </div>
      <div class="side-box side-body-wrap">
        <property-box :scope="scopeCurrent"></property-box>
      </div>
      <drag-line dir="h" mode="right" :min="0" :max="sizes.sideWidthMax" :pos="sizes.sideWidthRight + 1" @drag="sideRightDrag"></drag-line>
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
import MainStage from './components/MainStage'
export default {
  components: {
    IconText, ScopeTab, DragLine, PageStruct, CompBox, PropertyBox, MainStage
  },
  data () {
    return {
      scopeCurrent: 'common',
      sizes: {
        rootWidth: 0,
        rootHeight: 0,
        sideWidthLeft: 0,
        sideWidthRight: 0,
        sideWidthMax: 0,
        pageStructHeight: 0,
        pageStructMax: 0,
        mobileStageWidth: 0,
        mobileStageHeight: 0
      }
    }
  },
  mounted () {
    this.updateRootSize()
    this.observeMainSize()
  },
  methods: {
    updateRootSize () {
      this.sizes.rootWidth = this.$el.clientWidth
      this.sizes.rootHeight = this.$el.clientHeight
      this.sizes.sideWidthLeft = parseInt(this.sizes.rootWidth / 6)
      this.sizes.sideWidthRight = parseInt(this.sizes.rootWidth / 6)
      this.sizes.sideWidthMax = parseInt(this.sizes.rootWidth * 3 / 10)
      this.sizes.pageStructHeight = parseInt(this.sizes.rootHeight / 3)
      this.sizes.pageStructMax = parseInt(this.sizes.rootHeight * 2 / 3)
    },
    observeMainSize () {
      const childRoot = this.$refs.mainStage.$el
      const resizeObserver = new ResizeObserver(entries => {
        const rect = entries[0].contentRect
        this.sizes.mobileStageWidth = parseInt(rect.width)
        this.sizes.mobileStageHeight = parseInt(rect.height)
      })
      resizeObserver.observe(childRoot)
    },
    scopeTabChg (curr) {
      this.scopeCurrent = curr
    },
    sideLeftDrag (pos) {
      this.sizes.sideWidthLeft = pos
    },
    sideRightDrag (pos) {
      this.sizes.sideWidthRight = pos
    },
    sideTopDrag (pos) {
      this.sizes.pageStructHeight = pos
    }
  }
}
</script>

<style scoped>
@import "./index.css";
</style>
