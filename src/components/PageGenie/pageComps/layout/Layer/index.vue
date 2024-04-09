<template>
  <layoutWrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList"
    :index-of-parent-list="indexOfParentList">
    <div class="paged-layout-layer-wrapper bg-mask" :key="widget.id" :class="{ 'selected': selected }">
      <!-- @click.stop="selectWidget(widget)" -->
      <p>{{ widget.base.subList.length }}</p>
      <draggable :list="widget.base.subList" v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
        handle=".drag-handler">
        <!-- @add="(evt) => onContainerDragAdd(evt, widget.base.subList)" @update="onContainerDragUpdate" :move="checkContainerMove" -->
        <transition-group name="fade" tag="div" class="widget-list">
          <template v-for="item in widget.base.subList">{{ item }}</template>
          <!-- <template v-for="(subWidget, swIdx) in tab.widgetList">
            <template v-if="'container' === subWidget.category">
              <component :is="subWidget.type + '-widget'" :widget="subWidget" :designer="designer" :key="subWidget.id"
                :parent-list="tab.widgetList" :index-of-parent-list="swIdx" :parent-widget="widget"></component>
            </template>
<template v-else>
              <component :is="subWidget.type + '-widget'" :field="subWidget" :designer="designer" :key="subWidget.id"
                :parent-list="tab.widgetList" :index-of-parent-list="swIdx" :parent-widget="widget"
                :design-state="true"></component>
            </template>
</template> -->
        </transition-group>
      </draggable>
    </div>
  </layoutWrapper>

</template>

<script>
import draggable from 'vuedraggable'
import layoutWrapper from "@/components/PageGenie/pageComps/layout-wrapper.vue"
export default {
  name: 'Layer',
  components: {
    layoutWrapper,
    draggable
  },
  computed: {
    selected() {
      return this.widget.id === this.designer.selectedId
    },
  },
  props: {
    scope: {
      type: String,
      default: 'common'
    },
    design: {
      type: Boolean,
      default: false
    },
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
  }
}
</script>

<style lang="scss" scoped>
.paged-layout-layer-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1rem;

  &.bg-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 0;
    //  rgba(255, 255, 255, .3);
    background-color: rgba(235,134,134,0.3);
    backdrop-filter: blur(5px);
    span {
      color: #fff;
      font-size: 3rem;
      transform: rotate(-30deg);
      text-shadow: 0 0 1rem rgba(0, 0, 0, .1);
    }
  }
}
</style>
