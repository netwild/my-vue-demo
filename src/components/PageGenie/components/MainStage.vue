<!--
 * @Author: lzz
 * @Date: 2024-03-15 13:55:54
 * @LastEditTime: 2024-03-28 08:22:32
-->
<!--
 * @Author: lzz
 * @Date: 2024-03-15 13:55:54
 * @LastEditTime: 2024-03-22 15:41:49
-->
<template>
  <div class="main-stage" :class="'scope-' + scope">
    <!-- <comp-proxy v-if="stage" :comp="stage" :scope="scope" :design="design" /> -->
    <draggable :list="designer.widgetList" ghostClass="ghostClass" v-bind="{group:'dragGroup', animation: 300}" >
      <transition-group name="fade" tag="div" class="widget-list">
        <template v-for="(widget, index) in designer.widgetList">
          <comp-proxy :key="widget.id" :widget="widget" :scope="scope" :design="design" :designer="designer" :index="index"/>
          <!-- <template v-if="'container' === widget.category">
            <component :is="getWidgetName(widget)" :widget="widget" :designer="designer" :key="widget.id"
              :parent-list="designer.widgetList" :index-of-parent-list="index" :parent-widget="null"></component>
          </template>
          <template v-else>
            <component :is="getWidgetName(widget)" :field="widget" :designer="designer" :key="widget.id"
              :parent-list="designer.widgetList" :index-of-parent-list="index" :parent-widget="null"
              :design-state="true"></component>
          </template> -->
        </template>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import CompProxy from './CompProxy'
export default {
  name: 'MainStage',
  components: {
    draggable,
    CompProxy
  },
  props: {
    scope: {
      type: String,
      default: 'common'
    },
    design: {
      type: Boolean,
      default: true
    },
    designer: Object
  },
  data() {
    return {
      stage: null
    }
  },
  methods: {
    onDragEnd(evt) {
      //console.log('drag end000', evt)
    },

    onDragAdd(evt) {
      console.log("add",evt)
      console.log(this.designer)
      // const newIndex = evt.newIndex
      // if (!!this.designer.widgetList[newIndex]) {
      //   this.designer.setSelected(this.designer.widgetList[newIndex])
      // }

      // this.designer.emitHistoryChange()
      // this.designer.emitEvent('field-selected', null)
    },

    onDragUpdate() {  /* 在VueDraggable内拖拽组件发生位置变化时会触发update，未发生组件位置变化不会触发！！ */
      // this.designer.emitHistoryChange()
    },

    checkMove(evt) {
      return this.designer.checkWidgetMove(evt)
    },
    addStage(stage) {
      this.stage = stage
    }
  }
}
</script>

<style lang="scss">
.ghostClass {
  background-color:#0080eb !important;
  height: 5px;
  *{
    display: none;
  }
}
.main-stage {
  position: relative;
  background-color: #edf7ff;
  border-color: #fff;
  border-style: solid;
  transition: all .3s;
  >div,.widget-list{
    height: 100%;
  }
  &.scope-mobile {
    width: 400px;
    height: calc(100% - 5rem);
    border-width: 3px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, .1);
    border-radius: 10px;
  }

  &:not([class*="scope-mobile"]) {
    width: 100%;
    height: 100%;
    border-width: 0;
  }
}
</style>
