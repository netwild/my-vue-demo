<template>
  <div class="paged-comp-proxy-wrap" :class="classes">
    <component :is="compIns" ref="compIns"  :widget="widget"
      :designer="designer" :key="widget.id" :parent-list="designer.widgetList" :index-of-parent-list="index"
      :parent-widget="null" />
    <!-- <draggable
      :list="subs"
      :options="dragOpts"
      class="paged-comp-sub-wrap"
      ghost-class="ghost"
      @change="onChange"
    /> -->
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'CompProxy',
  components: {
    draggable
  },
  props: {
    widget: {
      type: Object,
      required: true
    },
    scope: {
      type: String,
      default: 'common'
    },
    design: {
      type: Boolean,
      default: true
    },
    designer:Object,
    index:Number
  },
  data() {
    return {
      compIns: null,
      subs: [],
      dragOpts: {
        sort: false,
        group: {
          name: 'comp-container',
          pull: false,
          put: true
        }
      }
    }
  },
  computed: {
    classes() {
      return [
        'scope-' + this.scope,
        'type-' + (this.widget && this.widget.type),
        this.design ? 'design' : ''
      ]
    }
  },
  watch: {
    widget: {
      immediate: true,
      handler(c) {
        this.loadComponent(c)
      }
    }
  },
  methods: {
    async loadComponent(c) {
      const basePath = 'components/PageGenie/pageComps/'
      const compPath = c.path
      try {
        const compModule = await import(/* webpackChunkName: "lazy-comp" */ `@/${basePath}${compPath}`)
        this.compIns = compModule.default
      } catch (error) {
        console.error(`无法在以下路径动态加载组件： ${compPath}`, error)
      }
    },
    onChange(evt) {
      const newComp = evt.added.element
      if (newComp) {
        console.log(newComp)
        this.$refs.compIns.appendComp(newComp)
      }
    }
  }
}
</script>

<style scoped>
.paged-comp-proxy-wrap {
  position: relative;
  padding: 0;
  margin: 0;
  border: 1px dotted #d0d0d0;
  &.type-layer {
    position: absolute;
    top: 0;
    left: 0;
  }

  .paged-comp-sub-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
<style>
.ghost {
  display: none;
}
</style>
