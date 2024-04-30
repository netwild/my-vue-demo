<template>
  <component ref="layoutRoot" :is="tag">
    <slot></slot>
  </component>
</template>

<script>
import Kit from './kit'
import elementResizeDetectorMaker from 'element-resize-detector'
export default {
  name: 'ez-drag-layout',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    list: {
      type: Array,
      default: [],
      required: true
    },
    pullAble: {
      type: Boolean,
      default: true
    },
    pushAble: {
      type: Boolean,
      default: true
    },
    moveAble: {
      type: Boolean,
      default: true
    },
    itemSelector: {
      type: String,
      default: null
    },
    handleSelector: {
      type: String,
      default: null
    },
    layout: {
      type: String,
      default: null
    },
    gridCols: {
      type: Number,
      default: 24
    },
    gridRows: {
      type: Number,
      default: 24
    },
    gridColsDef: {
      type: Number,
      default: 6
    },
    gridRowsDef: {
      type: Number,
      default: 6
    },
    gridGap: {
      type: Number,
      default: 10
    },
    FlexDir: {
      type: String,
      default: 'row'
    },
    FlexMainAlign: {
      type: String,
      default: 'space-between'
    },
    FlexItemAlign: {
      type: String,
      default: 'baseline'
    },
    FlexMargin: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      elements: [],
      erd: null,
      rootWidth: 0,
      rootHeight: 0,
      rootOrigin: [0, 0]
    }
  },
  mounted() {
    this.rootRect()
    this.addEvents()
  },
  beforeDestroy() {
    if (this.erd) {
      this.erd.removeAllListeners()
    }
  },
  methods: {
    rootRect() {
      this.erd = elementResizeDetectorMaker()
      this.erd.listenTo(this.$refs.layoutRoot, element => {
        this.layoutWidth = element.offsetWidth
        this.layoutHeight = element.offsetHeight
        this.layoutOrigin = [element.offsetLeft, element.offsetTop]
      })
    },
    addEvents() {
      const root = this.$refs.layoutRoot
      if (Kit.notEmpty(this.itemSelector)) {
        this.elements = Array.from(root.querySelectorAll(this.itemSelector))
      } else {
        this.elements = Array.from(root.children)
      }
      this.elements.forEach((el, ind) => {
        el.setAttribute('draggable', 'true')
        this.addItemEvent(el, ind, 'dragstart', this.onDragStart)
        this.addItemEvent(el, ind, 'dragend', this.onDragEnd)
        this.addItemEvent(el, ind, 'dragenter', this.onDragEnter)
        this.addItemEvent(el, ind, 'dragover', this.onDragOver)
        this.addItemEvent(el, ind, 'dragleave', this.onDragLeave)
        this.addItemEvent(el, ind, 'drop', this.onDrop)
      })
    },
    addItemEvent(el, ind, evtName, handle) {
      el.addEventListener(
        evtName,
        evt => {
          if (evt.target === el) {
            if (evtName !== 'dragstart') evt.preventDefault()
            handle(evt, ind)
          }
        },
        false
      )
    },
    onDragStart(evt, ind) {
      evt.dataTransfer.effectAllowed = 'copy'
      console.log(evt, ind)
    },
    onDragEnd(evt, ind) {
      console.log(evt, ind)
    },
    onDragEnter(evt, ind) {
      console.log(evt, ind)
    },
    onDragOver(evt, ind) {
      console.log(evt, ind)
    },
    onDragLeave(evt, ind) {
      console.log(evt, ind)
    },
    onDrop(evt, ind) {
      console.log(evt, ind)
    }
  }
}
</script>

<style scoped></style>
