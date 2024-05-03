<template>
  <component
    :is="tag"
    :class="layoutClass"
    :style="layoutStyle"
    ref="layoutRoot"
    class="ez-drag-layout-root"
  >
    <slot></slot>
    <div
      class="drag-holder"
      :class="[holder.used ? 'holder-use' : 'holder-dis']"
      :style="{
        'grid-column': `${holder.gridx} / span ${holder.gridw}`,
        'grid-row': `${holder.gridy} / span ${holder.gridh}`
      }"
    ></div>
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
      erd: null,
      rootWidth: 0,
      rootHeight: 0,
      rootOrigin: [0, 0],
      rootId: Kit.genUUID(),
      elements: [],
      dragging: false,
      curr: { ind: 0, item: {}, rootId: null },
      cache: {
        display: null,
        gridx: null,
        gridy: null,
        gridw: null,
        gridh: null
      },
      holder: {
        used: true,
        gridx: null,
        gridy: null,
        gridw: null,
        gridh: null
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
      let map = Array(this.gridRows)
        .fill()
        .map(() => Array(this.gridCols).fill(0))
      this.list.forEach((item, i) => {
        if (this.curr.rootId !== this.rootId || this.curr.ind !== i) {
          const gx = this.getItemProp(item, 'gridx')
          const gy = this.getItemProp(item, 'gridy')
          const gw = this.getItemProp(item, 'gridw')
          const gh = this.getItemProp(item, 'gridh')
          for (let y = 0; y < gh; y++) {
            map[gy + y - 1].fill(1, gx - 1, gx + gw - 1)
          }
        }
      })
      return map
    }
  },
  methods: {
    rootRect() {
      this.erd = elementResizeDetectorMaker()
      this.erd.listenTo(this.$refs.layoutRoot, elm => {
        this.rootWidth = elm.offsetWidth
        this.rootHeight = elm.offsetHeight
        const rect = elm.getBoundingClientRect()
        this.rootOrigin = [rect.left + window.scrollX, rect.top + window.scrollY]
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
      Kit.setLocal(CONSTS.LOCAL_KEY_STAT, { moved: false })

      if (this.moveAble) {
        const img = new Image()
        img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><path /></svg>"
        evt.dataTransfer.setDragImage(img, 0, 0)

        const el = evt.target
        this.cache.display = el.style.display
        setTimeout(() => {
          el.style.display = 'none'
        }, 0)
      }
    },
    onItemDragEnd(evt, ind) {
      evt.preventDefault()
      this.dragging = false
      if (Kit.isNull(this.clone)) {
        const ret = Kit.getLocal(CONSTS.LOCAL_KEY_STAT)
        if (ret && ret.moved) {
          this.list.splice(this.curr.ind, 1)
        } else {
          evt.target.style.display = this.cache.display
        }
      }
    },
    onItemDragEnter(evt, ind) {
      evt.preventDefault()
      this.dragging = true
    },
    onItemDragOver(evt, ind) {
      evt.preventDefault()
    },
    onItemDragLeave(evt, ind) {
      evt.preventDefault()
    },
    onItemDrop(evt, ind) {
      evt.preventDefault()
    },
    onWrapDragEnter(evt) {
      evt.preventDefault()
      const item = Kit.getLocal(CONSTS.LOCAL_KEY_DATA)
      this.curr = { ...item }
      // if (this.curr.rootId === this.rootId) this.curr.item = this.list[this.curr.ind]
      this.cache.gridx = this.getItemProp(this.curr.item, 'gridx')
      this.cache.gridy = this.getItemProp(this.curr.item, 'gridy')
      this.cache.gridw = this.getItemProp(this.curr.item, 'gridw')
      this.cache.gridh = this.getItemProp(this.curr.item, 'gridh')
      this.dragging = true
    },
    onWrapDragOver(evt) {
      if (this.pushAble) {
        evt.preventDefault()
        if (this.layout === 'grid') this.placeholderGrid(evt)
      }
    },
    onWrapDragLeave(evt) {
      evt.preventDefault()
      this.dragging = false
      if (this.curr.rootId === this.rootId) {
        this.setItemProp(this.curr.item, 'gridx', this.cache.gridx, true)
        this.setItemProp(this.curr.item, 'gridy', this.cache.gridy, true)
        this.setItemProp(this.curr.item, 'gridw', this.cache.gridw, true)
        this.setItemProp(this.curr.item, 'gridh', this.cache.gridh, true)
      }
    },
    onWrapDrop(evt) {
      evt.preventDefault()
      this.dragging = false
      let item = this.curr.rootId === this.rootId ? this.list[this.curr.ind] : this.curr.item
      this.setItemProp(item, 'gridx', this.holder.gridx, true)
      this.setItemProp(item, 'gridy', this.holder.gridy, true)
      this.setItemProp(item, 'gridw', this.holder.gridw, true)
      this.setItemProp(item, 'gridh', this.holder.gridh, true)
      if (this.curr.rootId !== this.rootId) {
        this.list.push(this.curr.item)
        Kit.setLocal(CONSTS.LOCAL_KEY_STAT, { moved: true })
      }
    },
    placeholderGrid(evt) {
      let mousePos = [evt.clientX - this.rootOrigin[0], evt.clientY - this.rootOrigin[1]]
      let insGridw = this.cache.gridw
      let insGridh = this.cache.gridh

      let insRectw = insGridw * this.colWidth
      let insRecth = insGridh * this.rowHeight

      let areaPos = [mousePos[0] - insRectw / 2, mousePos[1] - insRecth / 2]
      let areaGridx = Math.ceil(areaPos[0] / this.colWidth)
      let areaGridy = Math.ceil(areaPos[1] / this.rowHeight)
      areaGridx = Math.max(1, Math.min(this.gridCols - insGridw + 1, areaGridx))
      areaGridy = Math.max(1, Math.min(this.gridRows - insGridh + 1, areaGridy))

      let matrixRect = this.getMatrixRect(areaGridx, areaGridy, insGridw, insGridh)
      let autoRect = this.getMatrixMax(matrixRect)
      if (autoRect.w === 0 && autoRect.h === 0) {
        this.holder.used = false
        this.holder.gridx = areaGridx
        this.holder.gridy = areaGridy
        this.holder.gridw = insGridw
        this.holder.gridh = insGridh
      } else {
        this.holder.used = true
        this.holder.gridx = areaGridx + autoRect.x
        this.holder.gridy = areaGridy + autoRect.y
        this.holder.gridw = autoRect.w
        this.holder.gridh = autoRect.h
      }
    },
    getMatrixRect(x, y, w, h) {
      return this.gridNodeUseful
        .slice(y - 1, y - 1 + h)
        .map((sub, i) => sub.slice(x - 1, x - 1 + w))
    },
    getMatrixMax(matrix) {
      let maxArea = 0
      let maxRect = { x: 0, y: 0, w: 0, h: 0 }
      const rows = matrix.length
      const cols = matrix[0].length
      const lefts = new Array(cols).fill(-1)
      const rights = new Array(cols).fill(cols)
      const heights = new Array(cols).fill(0)
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (matrix[row][col] === 0) {
            heights[col] += 1
          } else {
            heights[col] = 0
          }
        }
        let boundary = -1
        for (let col = 0; col < cols; col++) {
          if (matrix[row][col] === 0) {
            lefts[col] = Math.max(lefts[col], boundary)
          } else {
            lefts[col] = -1
            boundary = col
          }
        }
        boundary = cols
        for (let col = cols - 1; col >= 0; col--) {
          if (matrix[row][col] === 0) {
            rights[col] = Math.min(rights[col], boundary)
          } else {
            rights[col] = cols
            boundary = col
          }
        }
        for (let col = cols - 1; col >= 0; col--) {
          const area = (rights[col] - lefts[col] - 1) * heights[col]
          if (area > maxArea) {
            maxArea = area
            maxRect = {
              x: lefts[col] + 1,
              y: row - heights[col] + 1,
              w: rights[col] - lefts[col] - 1,
              h: heights[col]
            }
          }
        }
      }
      return maxRect
    },
    getItemProp(item, prop) {
      const paths = this.getItemPropPath(prop)
      return this.getItemPropNext(item, paths)
    },
    getItemPropNext(item, paths) {
      if (paths.length === 1) {
        return item[paths[0]]
      } else {
        return this.getItemPropNext(item[paths[0]], paths.slice(1))
      }
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
