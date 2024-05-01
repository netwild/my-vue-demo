<template>
  <component
    :is="tag"
    :class="layoutClass"
    :style="layoutStyle"
    ref="layoutRoot"
    class="ez-drag-layout-root"
  >
    <slot></slot>
  </component>
</template>

<script>
import Kit from './kit'
import elementResizeDetectorMaker from 'element-resize-detector'
const CONSTS = {
  LOCAL_KEY_DATA: 'EZ_DRAG_DATA_TRANSFER',
  LOCAL_KEY_STAT: 'EZ_DRAG_DATA_STAT',
  EL_ATTR_EXIST: 'ezlisten'
}
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
      default: 'normal'
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
      default: 'stretch'
    },
    FlexMargin: {
      type: Number,
      default: 10
    },
    itemGridXPath: {
      type: Array,
      default() {
        return ['props', 'gridx']
      }
    },
    itemGridYPath: {
      type: Array,
      default() {
        return ['props', 'gridy']
      }
    },
    itemGridWPath: {
      type: Array,
      default() {
        return ['props', 'gridw']
      }
    },
    itemGridHPath: {
      type: Array,
      default() {
        return ['props', 'gridh']
      }
    }
  },
  data() {
    return {
      rootWidth: 0,
      rootHeight: 0,
      rootOrigin: [0, 0],
      elements: [],
      dragging: false,
      curr: { ind: 0, data: {} },
      erd: null
    }
  },
  mounted() {
    this.rootRect()
    this.initEvents()
  },
  updated() {
    this.initEvents()
  },
  beforeDestroy() {
    if (this.erd) {
      this.erd.removeAllListeners()
    }
  },
  computed: {
    colWidth() {
      return parseFloat(this.rootWidth / this.gridCols).toFixed(3)
    },
    rowHeight() {
      return parseFloat(this.rootHeight / this.gridRows).toFixed(3)
    },
    layoutClass() {
      return [
        `layout-${this.layout}`,
        `flex-dir-${this.FlexDir}`,
        this.dragging ? 'dragging-on' : 'dragging-off'
      ]
    },
    layoutStyle() {
      return {
        '--ez-grid-cols': this.gridCols,
        '--ez-grid-rows': this.gridRows,
        '--ez-grid-padd': this.gridGap + 'px',
        '--ez-grid-col-width': this.colWidth + 'px',
        '--ez-grid-row-height': this.rowHeight + 'px',
        '--ez-flex-dir': this.FlexDir,
        '--ez-flex-main-align': this.FlexMainAlign,
        '--ez-flex-item-align': this.FlexItemAlign,
        '--ez-flex-margin': this.FlexMargin + 'px'
      }
    },
    gridNodeUseful() {
      let map = Array(this.rowNum)
        .fill()
        .map(() => Array(this.colNum).fill(0))
      this.insList['custom'].forEach(ins => {
        if (ins.base.id !== this.selCurrIns.base.id) {
          for (let y = 0; y < ins.props.gridh; y++) {
            map[ins.props.gridy + y - 1].fill(
              1,
              ins.props.gridx - 1,
              ins.props.gridx + ins.props.gridw - 1
            )
          }
        }
      })
      return map
    }
  },
  methods: {
    rootRect() {
      this.erd = elementResizeDetectorMaker()
      this.erd.listenTo(this.$refs.layoutRoot, element => {
        this.rootWidth = element.offsetWidth
        this.rootHeight = element.offsetHeight
        this.rootOrigin = [element.offsetLeft, element.offsetTop]
      })
    },
    initEvents() {
      const root = this.$refs.layoutRoot
      if (Kit.isEmpty(root.dataset[CONSTS.EL_ATTR_EXIST])) {
        this.addItemEvent(root, null, 'dragenter', this.onDragEnter)
        this.addItemEvent(root, null, 'dragover', this.onDragOver)
        this.addItemEvent(root, null, 'dragleave', this.onDragLeave)
        this.addItemEvent(root, null, 'drop', this.onDrop)
        root.dataset[CONSTS.EL_ATTR_EXIST] = true
      }
      const erdEls = root.getElementsByTagName('object')
      let erdEl = null
      if (erdEls.length > 0) erdEl = root.removeChild(erdEls[0])
      if (Kit.notEmpty(this.itemSelector)) {
        this.elements = Array.from(root.querySelectorAll(this.itemSelector))
      } else {
        this.elements = Array.from(root.children)
      }
      this.elements.forEach((el, ind) => {
        if (Kit.isEmpty(el.dataset[CONSTS.EL_ATTR_EXIST])) {
          el.setAttribute('draggable', 'true')
          el.classList.add('ez-drag-layout-item')
          el.dataset[CONSTS.EL_ATTR_EXIST] = true
          this.addItemEvent(el, ind, 'dragstart', this.onDragStart)
          this.addItemEvent(el, ind, 'dragend', this.onDragEnd)
          this.addItemEvent(el, ind, 'dragenter', null)
          this.addItemEvent(el, ind, 'dragover', null)
          this.addItemEvent(el, ind, 'dragleave', null)
          this.addItemEvent(el, ind, 'drop', null)
        }
      })
      if (erdEl) root.appendChild(erdEl)
    },
    addItemEvent(el, ind, evtName, handle) {
      el.addEventListener(
        evtName,
        evt => {
          if (evt.target === el) {
            if (evtName !== 'dragstart') evt.preventDefault()
            if (Kit.notNull(handle)) handle(evt, ind)
          }
        },
        false
      )
    },
    onDragStart(evt, ind) {
      evt.dataTransfer.effectAllowed = 'copy'
      const item = { ind, data: this.list[ind] }
      Kit.setLocal(CONSTS.LOCAL_KEY_DATA, item)
      // evt.dataTransfer.setData('text', ind)
    },
    onDragEnd(evt, ind) {
      this.dragging = false
      // console.log(evt, ind)
    },
    onDragEnter(evt) {
      const item = Kit.getLocal(CONSTS.LOCAL_KEY_DATA)
      this.curr = { ind: item.ind, data: item.data }
      this.dragging = true
      // console.log(this.curr)
    },
    onDragOver(evt) {
      // console.log(evt)
    },
    onDragLeave(evt) {
      // console.log(evt)
    },
    onDrop(evt) {
      this.list.push(this.curr.data)
      // console.log(evt.dataTransfer.getData('text'))
      // console.log(evt)
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('./index.css');
</style>
