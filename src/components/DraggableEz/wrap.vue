<!--
 * @Author: Z.MingYu
 * @Date: 2024-05-06 08:22:40
 * @Description: 拖拽布局组件：容器
-->

<template>
  <component
    :is="tag"
    :class="layoutClass"
    :style="layoutStyle"
    ref="layoutRoot"
    class="ez-drag-layout-root"
    @dragenter.stop.prevent="onDragEnter"
    @dragleave.self.stop.prevent="onDragLeave"
    @dragover.self.stop="onDragOver"
    @drop.self.stop.prevent="onDrop"
  >
    <slot></slot>
    <template v-if="pushAble || moveAble">
      <div class="holder-mask" :style="maskStyle"></div>
      <div class="holder-area" :style="areaStyle" :class="holderClass"></div>
    </template>
  </component>
</template>

<script>
import Kit from './kit'
import Common from './common'
import elementResizeDetectorMaker from 'element-resize-detector'
export default {
  name: 'draggable-ez-wrap',
  props: Common.getWrapProps(),
  data() {
    return Common.getWrapData()
  },
  mounted() {
    this.roots.id = Kit.genUUID()
    this.roots.el = this.$refs.layoutRoot
    this.rootResizeListen()
  },
  beforeDestroy() {
    if (Kit.notNull(this.roots.erd)) this.roots.erd.uninstall(this.roots.el)
  },
  computed: {
    gridColw() {
      return parseFloat(this.roots.width / this.gridCols).toFixed(3)
    },
    gridRowh() {
      return parseFloat(this.roots.height / this.gridRows).toFixed(3)
    },
    gridGap() {
      if (this.itemMargin * this.gridCols > this.roots.width) return 0
      if (this.itemMargin * this.gridRows > this.roots.height) return 0
      return this.itemMargin
    },
    layoutClass() {
      return [
        `layout-${this.layout}`,
        `flex-dir-${this.flexDir}`,
        this.gridLines ? 'grid-lines-on' : 'grid-lines-off',
        this.related.dragging ? 'dragging-on' : 'dragging-off'
      ]
    },
    layoutStyle() {
      return {
        '--ez-grid-cols': this.gridCols,
        '--ez-grid-rows': this.gridRows,
        '--ez-grid-col-width': this.gridColw + 'px',
        '--ez-grid-row-height': this.gridRowh + 'px',
        '--ez-grid-gap': this.gridGap + 'px',
        '--ez-flex-dir': this.flexDir,
        '--ez-flex-main-align': this.flexMainAlign,
        '--ez-flex-item-align': this.flexItemAlign,
        '--ez-item-margin': this.itemMargin + 'px'
      }
    },
    holderClass() {
      return [this.holder.vali ? 'holder-able' : 'holder-deny']
    },
    maskStyle() {
      return {
        width: `${this.holder.mask.w}px`,
        height: `${this.holder.mask.h}px`,
        transform: `translate(${this.holder.mask.x}px, ${this.holder.mask.y}px)`
      }
    },
    areaStyle() {
      return {
        width: `${this.holder.area.w}px`,
        height: `${this.holder.area.h}px`,
        transition: `all ${this.holder.area.trsi}s`,
        transform: `translate(${this.holder.area.x}px, ${this.holder.area.y}px)`
      }
    },
    inside() {
      return this.curr.rootId === this.roots.id
    },
    gridUseful() {
      let map = Array(this.gridRows)
        .fill()
        .map(() => Array(this.gridCols).fill(0))
      this.list.forEach((item, i) => {
        if (!this.inside || this.curr.index !== i) {
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
    },
    wrapData() {
      return {
        list: this.list,
        clone: this.clone,
        moveAble: this.moveAble,
        resizeAble: this.resizeAble,
        layout: this.layout,
        heightMode: this.heightMode,
        idPath: this.idPath,
        gridXPath: this.gridXPath,
        gridYPath: this.gridYPath,
        gridWPath: this.gridWPath,
        gridHPath: this.gridHPath,
        gridColsDef: this.gridColsDef,
        gridRowsDef: this.gridRowsDef,
        itemWPath: this.itemWPath,
        itemHPath: this.itemHPath,
        flexDir: this.flexDir,
        roots: this.roots,
        related: this.related
      }
    }
  },
  methods: {
    rootResizeListen() {
      this.roots.erd = elementResizeDetectorMaker()
      this.roots.erd.listenTo(this.roots.el, elm => {
        this.roots.width = elm.offsetWidth
        this.roots.height = elm.offsetHeight
        this.$emit('rootResize', {
          width: this.roots.width,
          height: this.roots.height
        })
      })
    },
    rootPositionListen() {
      const rect = this.roots.el.getBoundingClientRect()
      this.roots.x = rect.left + window.scrollX
      this.roots.y = rect.top + window.scrollY
    },
    onDragEnter(evt) {
      if (!this.moveAble && !this.pushAble) return
      this.rootPositionListen()
      this.initFlexRects()
      this.setCache()
      this.resetHolderArea()
      this.related.dragging = true
    },
    onDragOver(evt) {
      if (this.curr.eventType === 'move') {
        if (this.pushAble) {
          evt.preventDefault()
          if (this.layout === 'grid') this.placeholderGrid(evt)
          else this.placeholderFlex(evt)
        }
      } else if (this.curr.eventType === 'resize') {
        if (this.inside) {
          evt.preventDefault()
          if (this.layout === 'grid') this.resizeholderGrid(evt)
          else this.resizeholderFlex(evt)
        }
      }
    },
    onDragLeave(evt) {
      this.related.dragging = false
    },
    onDrop(evt) {
      this.related.dragging = false
      if (!this.holder.vali) return

      let item = this.inside ? this.list[this.curr.index] : this.curr.item
      this.setItemProp(item, 'gridx', this.holder.gridx, true)
      this.setItemProp(item, 'gridy', this.holder.gridy, true)
      this.setItemProp(item, 'gridw', this.holder.gridw, true)
      this.setItemProp(item, 'gridh', this.holder.gridh, true)
      if (this.curr.eventType === 'move') {
        if (this.inside) {
          if (this.cache.index !== this.curr.index) {
            this.list.splice(this.curr.index, 1)
            if (this.curr.index < this.cache.index) this.cache.index -= 1
            this.list.splice(this.cache.index, 0, item)
          }
        } else {
          if (this.layout === 'grid') {
            this.list.push(item)
          } else {
            if (this.cache.index === this.list.length) {
              this.list.push(item)
            } else {
              this.list.splice(this.cache.index, 0, item)
            }
          }
          Kit.setLocal(Common.LOCAL_KEY_STAT, {
            rootId: this.roots.id,
            moved: true
          })
        }
      } else if (this.curr.eventType === 'resize') {
        if (this.layout !== 'grid') {
          this.setItemProp(item, 'itemw', this.holder.itemw, true)
          this.setItemProp(item, 'itemh', this.holder.itemh, true)
        }
      }
    },
    setCache() {
      const localBeforeData = Kit.getLocal(Common.LOCAL_KEY_DATA)
      this.curr = { ...localBeforeData }
      this.cache.gridx = this.getItemProp(this.curr.item, 'gridx')
      this.cache.gridy = this.getItemProp(this.curr.item, 'gridy')
      this.cache.gridw = this.getItemProp(this.curr.item, 'gridw')
      this.cache.gridh = this.getItemProp(this.curr.item, 'gridh')
      this.cache.itemw = this.getItemProp(this.curr.item, 'itemw')
      this.cache.itemh = this.getItemProp(this.curr.item, 'itemh')
      if (this.layout === 'grid') {
        this.holder.itemw = this.cache.itemw
        this.holder.itemh = this.cache.itemh
      } else {
        this.holder.gridx = this.cache.gridx
        this.holder.gridy = this.cache.gridy
        this.holder.gridw = this.cache.gridw
        this.holder.gridh = this.cache.gridh
      }
    },
    resetHolderArea() {
      if (!this.inside) return
      this.holder.area.trsi = 0
      if (this.layout === 'grid') {
        this.holder.area.x = (this.cache.gridx - 1) * this.gridColw
        this.holder.area.y = (this.cache.gridy - 1) * this.gridRowh
        this.holder.area.w = this.cache.gridw * this.gridColw
        this.holder.area.h = this.cache.gridh * this.gridRowh
      } else {
        let index = this.curr.index
        let rect = this.cache.flexRects[index]
        this.holder.mask.x = this.holder.area.x = rect.left
        this.holder.mask.y = this.holder.area.y = rect.top
        this.holder.mask.w = this.holder.area.w = rect.box.width
        this.holder.mask.h = this.holder.area.h = rect.box.height
      }
      this.holder.area.trsi = 0.3
    },
    initFlexRects() {
      if (this.layout !== 'grid') {
        const items = [...this.roots.el.querySelectorAll('.ez-drag-layout-item')]
        let rects = items.map((item, ind) => {
          const box = item.getBoundingClientRect()
          if (box.width === 0 && box.height === 0) return null
          const top = item.offsetTop
          const left = item.offsetLeft
          const x = parseInt(item.offsetLeft - this.itemMargin / 2)
          const y = parseInt(item.offsetTop - this.itemMargin / 2)
          const w = parseInt(box.width + this.itemMargin)
          const h = parseInt(box.height + this.itemMargin)
          return {
            ind,
            box,
            top,
            left,
            fx: x,
            fy: y,
            tx: x + w,
            ty: y + h,
            ox: parseInt(x + w / 2),
            oy: parseInt(y + h / 2)
          }
        })
        this.cache.flexRects = [...rects.filter(r => r !== null)]
      }
    },
    placeholderFlex(evt) {
      this.holder.vali = true
      let pre = this.holder.pre
      let mousePos = [evt.clientX - this.roots.x, evt.clientY - this.roots.y]
      let holderw, holderh, diff
      if (this.layout === 'flex' && this.flexDir === 'row') {
        const mou = mousePos[0]
        holderw = pre
        holderh = this.roots.height
        diff = Math.max(0, Math.min(this.roots.width - pre, mou - pre / 2))
        this.holder.mask.x = diff
        this.holder.mask.y = this.holder.area.y = 0
        const len = this.cache.flexRects.length
        if (len == 0) {
          this.cache.index = 0
          this.holder.area.x = 0
        } else {
          let rect
          if (mou < this.cache.flexRects[0].fx) rect = this.cache.flexRects[0]
          else if (mou > this.cache.flexRects[len - 1].tx) rect = this.cache.flexRects[len - 1]
          else rect = this.cache.flexRects.find(r => mou >= r.fx && mou <= r.tx)
          if (mou < rect.ox) {
            this.holder.area.x = Math.max(0, rect.fx - pre / 2)
            if (this.inside && this.curr.index === rect.ind - 1) this.cache.index = rect.ind - 1
            else this.cache.index = rect.ind
          } else if (mou >= rect.ox) {
            this.holder.area.x = Math.min(this.roots.width - pre, rect.tx - pre / 2)
            if (this.inside && this.curr.index === rect.ind) this.cache.index = rect.ind
            else this.cache.index = rect.ind + 1
          }
        }
      } else {
        const mou = mousePos[1]
        holderw = this.roots.width
        holderh = pre
        diff = Math.max(0, Math.min(this.roots.height - pre, mou - pre / 2))
        this.holder.mask.x = this.holder.area.x = 0
        this.holder.mask.y = diff
        const len = this.cache.flexRects.length
        if (len == 0) {
          this.cache.index = 0
          this.holder.area.y = 0
        } else {
          let rect
          if (mou < this.cache.flexRects[0].fy) rect = this.cache.flexRects[0]
          else if (mou > this.cache.flexRects[len - 1].ty) rect = this.cache.flexRects[len - 1]
          else rect = this.cache.flexRects.find(r => mou >= r.fy && mou <= r.ty)
          if (mou < rect.oy) {
            this.holder.area.y = Math.max(0, rect.fy - pre / 2)
            if (this.inside && this.curr.index === rect.ind - 1) this.cache.index = rect.ind - 1
            else this.cache.index = rect.ind
          } else if (mou >= rect.oy) {
            this.holder.area.y = Math.min(this.roots.height - pre, rect.ty - pre / 2)
            if (this.inside && this.curr.index === rect.ind) this.cache.index = rect.ind
            else this.cache.index = rect.ind + 1
          }
        }
      }
      this.holder.mask.w = this.holder.area.w = holderw
      this.holder.mask.h = this.holder.area.h = holderh
    },
    resizeholderFlex(evt) {
      let index = this.curr.index
      let rect = this.cache.flexRects[index]
      let mousePos = [evt.clientX - this.roots.x, evt.clientY - this.roots.y]
      let width = Math.max(1, Math.min(this.roots.width - rect.left, mousePos[0] - rect.left))
      let height = Math.max(1, Math.min(this.roots.height - rect.top, mousePos[1] - rect.top))
      this.holder.itemw = this.holder.mask.w = this.holder.area.w = width
      this.holder.itemh = this.holder.mask.h = this.holder.area.h = height
    },
    placeholderGrid(evt) {
      let insGridw = this.cache.gridw
      let insGridh = this.cache.gridh
      let insRectw = insGridw * this.gridColw
      let insRecth = insGridh * this.gridRowh
      let mousePos = [evt.clientX - this.roots.x, evt.clientY - this.roots.y]
      let rectPos = [mousePos[0] - insRectw / 2, mousePos[1] - insRecth / 2]
      rectPos[0] = Math.max(0, Math.min(this.roots.width - insRectw, rectPos[0]))
      rectPos[1] = Math.max(0, Math.min(this.roots.height - insRecth, rectPos[1]))

      let areaGridx = Math.round(rectPos[0] / this.gridColw) + 1
      let areaGridy = Math.round(rectPos[1] / this.gridRowh) + 1

      let matrixRect = this.getMatrixRect(areaGridx, areaGridy, insGridw, insGridh)
      let autoRect = this.getMatrixMax(matrixRect)

      this.holder.mask.x = rectPos[0]
      this.holder.mask.y = rectPos[1]
      this.holder.mask.w = insRectw
      this.holder.mask.h = insRecth

      let item = this.inside ? this.list[this.curr.index] : this.curr.item
      if (autoRect.w === 0 && autoRect.h === 0) {
        this.holder.vali = false
        this.holder.gridx = areaGridx
        this.holder.gridy = areaGridy
        this.holder.gridw = insGridw
        this.holder.gridh = insGridh
        this.holder.area.x = (areaGridx - 1) * this.gridColw
        this.holder.area.y = (areaGridy - 1) * this.gridRowh
        this.holder.area.w = insGridw * this.gridColw
        this.holder.area.h = insGridh * this.gridRowh
      } else {
        this.holder.vali = true
        this.holder.gridx = areaGridx + autoRect.x
        this.holder.gridy = areaGridy + autoRect.y
        this.holder.gridw = autoRect.w
        this.holder.gridh = autoRect.h
        this.holder.area.x = (areaGridx + autoRect.x - 1) * this.gridColw
        this.holder.area.y = (areaGridy + autoRect.y - 1) * this.gridRowh
        this.holder.area.w = autoRect.w * this.gridColw
        this.holder.area.h = autoRect.h * this.gridRowh
      }
    },
    resizeholderGrid(evt) {
      let insGridx = this.cache.gridx
      let insGridy = this.cache.gridy
      let mousePos = [evt.clientX - this.roots.x, evt.clientY - this.roots.y]
      let insPosx = (insGridx - 1) * this.gridColw
      let insPosy = (insGridy - 1) * this.gridRowh
      let insRectw = mousePos[0] - insPosx
      let insRecth = mousePos[1] - insPosy
      insRectw = Math.max(this.gridColw, insRectw)
      insRecth = Math.max(this.gridRowh, insRecth)
      let areaGridw = Math.round(insRectw / this.gridColw)
      let areaGridh = Math.round(insRecth / this.gridRowh)
      let matrixRect = this.getMatrixRect(insGridx, insGridy, areaGridw, areaGridh)
      this.holder.vali = !matrixRect.some(row => row.includes(1))
      this.holder.mask.x = insPosx
      this.holder.mask.y = insPosy
      this.holder.mask.w = insRectw
      this.holder.mask.h = insRecth
      this.holder.gridx = insGridx
      this.holder.gridy = insGridy
      this.holder.gridw = areaGridw
      this.holder.gridh = areaGridh
      this.holder.area.x = (insGridx - 1) * this.gridColw
      this.holder.area.y = (insGridy - 1) * this.gridRowh
      this.holder.area.w = areaGridw * this.gridColw
      this.holder.area.h = areaGridh * this.gridRowh
    },
    getMatrixRect(x, y, w, h) {
      return this.gridUseful.slice(y - 1, y - 1 + h).map((sub, i) => sub.slice(x - 1, x - 1 + w))
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
      if (Kit.isNull(item)) return null
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
      if (propName === 'id') return this.idPath
      else if (propName === 'itemw') return this.itemWPath
      else if (propName === 'itemh') return this.itemHPath
      else if (propName === 'gridx') return this.gridXPath
      else if (propName === 'gridy') return this.gridYPath
      else if (propName === 'gridw') return this.gridWPath
      else if (propName === 'gridh') return this.gridHPath
      else return null
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('./index.css');
</style>
