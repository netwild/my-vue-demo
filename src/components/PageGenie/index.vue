<template>
  <div class="page paged">
    <div class="side-wrap side-left-wrap" :style="{ width: sizes.sideWidthLeft + 'px' }">
      <div class="header-wrap side-header-wrap">
        <icon-text icon="navi-page" text="页面设计器" theme="title" />
      </div>
      <div class="side-body-wrap">
        <div
          class="side-box page-struct-container"
          :style="{ height: sizes.pageStructHeight + 'px' }"
        >
          <page-struct :scope="scopeCurrent" />
        </div>
        <div class="side-box comp-box-container">
          <comp-box :scope="scopeCurrent" :lib="lib" :designer="designer"/>
        </div>
        <drag-line
          dir="v"
          mode="top"
          :min="0"
          :max="sizes.pageStructMax"
          :pos="sizes.pageStructHeight"
          @drag="sideTopDrag"
        />
      </div>
      <drag-line
        dir="h"
        mode="left"
        :min="0"
        :max="sizes.sideWidthLeftMax"
        :pos="sizes.sideWidthLeft + 1"
        @drag="sideLeftDrag"
      />
    </div>
    <div class="main-wrap">
      <div class="header-wrap main-header-wrap">
        <div class="main-header-inner">
          <div class="left-tools-bar">
            <icon-text
              :icon="sideDisplayLeft ? 'paged-2left' : 'paged-2right'"
              :text="sideDisplayLeft ? '拓宽' : '收起'"
              theme="tool"
              @click.native="
                sideDisplayLeft
                  ? (sizes.sideWidthLeft = 0)
                  : (sizes.sideWidthLeft = sizes.sideWidthLeftDef)
              "
            />
            <icon-text
              icon="paged-db"
              text="数据"
              theme="tool"
              :active="expCurrent == 'db'"
              @click.native="expWin('db')"
            />
            <icon-text
              icon="paged-theme"
              text="主题"
              theme="tool"
              :active="expCurrent == 'theme'"
              @click.native="expWin('theme')"
            />
            <icon-text
              icon="paged-layout"
              text="布局"
              theme="tool"
              :active="expCurrent == 'layout'"
              @click.native="expWin('layout')"
            />
          </div>
          <div class="center-tools-bar">
            <scope-tab :current="scopeCurrent" @scopeTabChg="scopeTabChg" />
          </div>
          <div class="right-tools-bar">
            <icon-text
              icon="paged-preview"
              text="预览"
              theme="tool"
              :active="!design"
              @click.native="design = !design"
            />
            <icon-text icon="paged-import" text="导入" theme="tool" />
            <icon-text icon="paged-export" text="导出" theme="tool" />
            <icon-text
              :icon="sideDisplayRight ? 'paged-2right' : 'paged-2left'"
              :text="sideDisplayRight ? '拓宽' : '收起'"
              theme="tool"
              @click.native="
                sideDisplayRight
                  ? (sizes.sideWidthRight = 0)
                  : (sizes.sideWidthRight = sizes.sideWidthRightDef)
              "
            />
          </div>
        </div>
      </div>
      <div class="main-body-wrap">
        <div
          v-show="expCurrent != ''"
          class="main-tab-container"
          :style="{ height: sizes.expWinHeight + 'px' }"
        >
          <div v-if="expCurrent == 'db'" class="main-tab-wrap">数据集</div>
          <div v-if="expCurrent == 'theme'" class="main-tab-wrap">页面主题</div>
          <div v-if="expCurrent == 'layout'" class="main-tab-wrap">常用布局</div>
        </div>
        <div class="main-body" :style="{ 'margin-top': expCurrent != '' ? '9px' : 0 }">
          <main-stage ref="mainStage" :scope="scopeCurrent" :design="design" :designer="designer"/>
          <div v-show="design" class="stage-size-monitor">
            舞台：{{ sizes.mobileStageWidth }} × {{ sizes.mobileStageHeight }}
          </div>
        </div>
        <drag-line
          v-show="expCurrent != ''"
          dir="v"
          mode="top"
          :min="40"
          :pos="sizes.expWinHeight"
          @drag="expWinDrag"
        />
      </div>
    </div>
    <div class="side-wrap side-right-wrap" :style="{ width: sizes.sideWidthRight + 'px' }">
      <div class="header-wrap side-header-wrap">
        <icon-text icon="paged-save" text="保存" theme="navi" />
        <router-link to="/">
          <icon-text icon="paged-back" text="返回" theme="navi" />
        </router-link>
      </div>
      <div class="side-box side-body-wrap">
        <property-box :scope="scopeCurrent" />
      </div>
      <drag-line
        dir="h"
        mode="right"
        :min="0"
        :max="sizes.sideWidthRightMax"
        :pos="sizes.sideWidthRight + 1"
        @drag="sideRightDrag"
      />
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
import groupDef from './pageComps/GroupDefine'
import {createDesigner} from './designer.js'
export default {
  components: {
    IconText,
    ScopeTab,
    DragLine,
    PageStruct,
    CompBox,
    PropertyBox,
    MainStage
  },
  data() {
    return {
      scopeCurrent: 'common',
      design: true,
      lib: null,
      expCurrent: '',
      designer: createDesigner(this),
      sizes: {
        rootWidth: 0,
        rootHeight: 0,
        sideWidthLeft: 0,
        sideWidthLeftDef: 0,
        sideWidthLeftMax: 0,
        sideWidthRight: 0,
        sideWidthRightDef: 0,
        sideWidthRightMax: 0,
        pageStructHeight: 0,
        pageStructMax: 0,
        expWinHeight: 200,
        mobileStageWidth: 0,
        mobileStageHeight: 0
      }
    }
  },
  computed: {
    sideDisplayLeft() {
      return this.sizes.sideWidthLeft > 0
    },
    sideDisplayRight() {
      return this.sizes.sideWidthRight > 0
    }
  },
  mounted() {
    this.loadCompLib()
    this.initRootSize()
    this.updateRootSize()
    this.observeMainSize()
  },
  methods: {
    loadCompLib() {
      this.lib = groupDef.loadComps()
      const stage = this.compTool('layout', 'stage')
      this.addStage(stage)
    },
    compTool(group, code) {
      const comps = this.lib[group].comps
      return comps.find(c => c.base.code === `${group}-${code}`)
    },
    initRootSize() {
      this.sizes.rootWidth = this.$el.clientWidth
      this.sizes.rootHeight = this.$el.clientHeight
      this.sizes.sideWidthLeft = parseInt(this.sizes.rootWidth / 6)
      this.sizes.sideWidthLeftDef = this.sizes.sideWidthLeft
      this.sizes.sideWidthRight = parseInt(this.sizes.rootWidth / 6)
      this.sizes.sideWidthRightDef = this.sizes.sideWidthRight
      this.sizes.pageStructHeight = parseInt(this.sizes.rootHeight / 3)
      this.sizes.pageStructMax = parseInt((this.sizes.rootHeight * 2) / 3)
    },
    updateRootSize() {
      this.sizes.sideWidthLeftMax = parseInt(this.sizes.rootWidth - 750 - this.sizes.sideWidthRight)
      this.sizes.sideWidthRightMax = parseInt(this.sizes.rootWidth - 750 - this.sizes.sideWidthLeft)
    },
    observeMainSize() {
      const childRoot = this.$refs.mainStage.$el
      const resizeObserver = new ResizeObserver(entries => {
        const rect = entries[0].contentRect
        this.sizes.mobileStageWidth = parseInt(rect.width)
        this.sizes.mobileStageHeight = parseInt(rect.height)
      })
      resizeObserver.observe(childRoot)
    },
    scopeTabChg(curr) {
      this.scopeCurrent = curr
    },
    sideLeftDrag(pos) {
      this.sizes.sideWidthLeft = pos
      this.updateRootSize()
    },
    sideRightDrag(pos) {
      this.sizes.sideWidthRight = pos
      this.updateRootSize()
    },
    sideTopDrag(pos) {
      this.sizes.pageStructHeight = pos
    },
    expWinDrag(pos) {
      this.sizes.expWinHeight = pos
    },
    expWin(key) {
      if (this.expCurrent === key) {
        this.expCurrent = ''
      } else {
        this.expCurrent = key
      }
    },
    addStage(stage) {
      this.$refs.mainStage.addStage(stage)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
