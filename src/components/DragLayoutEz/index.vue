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
  EL_ATTR_EXIST: 'ezlisten',
  EL_ATTR_UUID: 'ezid'
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
    clone: {
      type: Function,
      default: null
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
      rootId: Kit.genUUID(),
      elements: [],
      dragging: false,
      curr: { ind: 0, item: {}, rootId: null },
      erd: null,
      holder: {
        cache: {
          display: null,
          gridw: null,
          gridh: null
        },
        used: true,
        gridx: 1,
        gridy: 1,
        gridw: 1,
        gridh: 1
      }
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
    if (Kit.notNull(this.erd)) this.erd.uninstall(this.$refs.layoutRoot)
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
        this.addItemEvent(root, null, 'dragenter', this.onWrapDragEnter)
        this.addItemEvent(root, null, 'dragover', this.onWrapDragOver)
        this.addItemEvent(root, null, 'dragleave', this.onWrapDragLeave)
        this.addItemEvent(root, null, 'drop', this.onWrapDrop)
        root.dataset[CONSTS.EL_ATTR_EXIST] = true
        root.dataset[CONSTS.EL_ATTR_UUID] = this.rootId
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
          this.addItemEvent(el, ind, 'dragstart', this.onItemDragStart)
          this.addItemEvent(el, ind, 'dragend', this.onItemDragEnd)
          this.addItemEvent(el, ind, 'dragenter', this.onItemDragEnter)
          this.addItemEvent(el, ind, 'dragover', this.onItemDragOver)
          this.addItemEvent(el, ind, 'dragleave', this.onItemDragLeave)
          this.addItemEvent(el, ind, 'drop', this.onItemDrop)
        }
      })

      if (erdEl) root.appendChild(erdEl)
    },
    addItemEvent(el, ind, evtName, handle) {
      el.addEventListener(
        evtName,
        evt => {
          if (evt.target === el && Kit.notNull(handle)) handle(evt, ind)
        },
        false
      )
    },
    onItemDragStart(evt, ind) {
      evt.dataTransfer.effectAllowed = 'copy'

      let item = this.list[ind]
      if (Kit.notNull(this.clone)) item = this.clone(item)

      this.setItemProp(item, 'gridx', 1, false)
      this.setItemProp(item, 'gridy', 1, false)
      this.setItemProp(item, 'gridw', this.gridColsDef, false)
      this.setItemProp(item, 'gridh', this.gridRowsDef, false)

      const data = { ind, item, rootId: this.rootId }
      Kit.setLocal(CONSTS.LOCAL_KEY_DATA, data)

      if (this.moveAble) {
        const img = new Image()
        img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><path /></svg>"
        evt.dataTransfer.setDragImage(img, 0, 0)
      }
    },
    onItemDragEnd(evt, ind) {
      evt.preventDefault()
      this.dragging = false
      if (this.moveAble) {
        evt.target.style.opacity = 1
      }
    },
    onItemDragEnter(evt, ind) {
      evt.preventDefault()
      this.dragging = true
      // console.log(evt, ind)
    },
    onItemDragOver(evt, ind) {
      evt.preventDefault()
      // console.log(evt, ind)
    },
    onItemDragLeave(evt, ind) {
      evt.preventDefault()
      // console.log(evt, ind)
    },
    onItemDrop(evt, ind) {
      evt.preventDefault()
      // console.log(evt, ind)
    },
    onWrapDragEnter(evt) {
      evt.preventDefault()
      const item = Kit.getLocal(CONSTS.LOCAL_KEY_DATA)
      this.curr = { ...item }
      this.dragging = true
    },
    onWrapDragOver(evt) {
      if (this.pushAble) {
        evt.preventDefault()
      }
    },
    onWrapDragLeave(evt) {
      evt.preventDefault()
      this.dragging = false
      // console.log(evt)
    },
    onWrapDrop(evt) {
      evt.preventDefault()
      this.dragging = false
      this.list.push(this.curr.item)
      // console.log(evt.dataTransfer.getData('text'))
      // console.log(evt)
    },
    setItemProp(item, prop, val, overwrite) {
      const paths = this.getItemPropPath(prop)
      this.setItemPropNext(item, paths, val, overwrite)
    },
    setItemPropNext(item, paths, val, overwrite) {
      if (paths.length === 1) {
        if (Kit.isNull(item[paths[0]]) || overwrite) this.$set(item, paths[0], val)
      } else {
        if (Kit.isNull(item[paths[0]])) this.$set(item, paths[0], {})
        this.setItemPropNext(item[paths[0]], paths.slice(1), val, overwrite)
      }
    },
    getItemPropPath(propName) {
      if (propName === 'gridx') return this.itemGridXPath
      else if (propName === 'gridy') return this.itemGridYPath
      else if (propName === 'gridw') return this.itemGridWPath
      else if (propName === 'gridh') return this.itemGridHPath
      else return null
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('./index.css');
</style>
