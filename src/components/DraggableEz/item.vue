<!--
 * @Author: Z.MingYu
 * @Date: 2024-05-06 08:23:01
 * @Description: 拖拽布局组件：项目
-->

<template>
  <component
    :is="tag"
    :class="classes"
    :style="styles"
    ref="layoutItem"
    draggable="enable && wrapData.moveAble"
    class="ez-drag-layout-item"
    @dragstart.self.stop="onDragStart"
    @dragend.self.stop.prevent="onDragEnd"
    @dragenter.self.prevent
    @dragleave.self.prevent
    @dragover.self.stop.prevent
  >
    <slot></slot>
    <div
      v-if="enable && wrapData.resizeAble"
      class="ez-drag-resize-handle"
      draggable="true"
      @dragstart.self.stop="onResizeStart"
      @dragend.self.prevent.stop="onResizeEnd"
      @dragenter.self.prevent.stop="onResizeEnter"
    ></div>
  </component>
</template>

<script>
import Common from './common'
import Kit from './kit'
export default {
  name: 'draggable-ez-item',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    index: {
      type: Number,
      required: true
    },
    enable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      el: null,
      opacity: null,
      display: null
    }
  },
  mounted() {
    this.initData()
  },
  updated() {},
  beforeDestroy() {},
  computed: {
    wrapData() {
      return this.$parent.wrapData
    },
    item() {
      return this.wrapData.list[this.index]
    },
    itemw() {
      return this.getItemProp(this.item, 'itemw')
    },
    itemh() {
      const h = this.getItemProp(this.item, 'itemh')
      if (this.wrapData.heightMode === 'screen') return h
      else return Kit.ifEmpty(h, 300)
    },
    gridx() {
      return this.getItemProp(this.item, 'gridx')
    },
    gridy() {
      return this.getItemProp(this.item, 'gridy')
    },
    gridw() {
      return this.getItemProp(this.item, 'gridw')
    },
    gridh() {
      return this.getItemProp(this.item, 'gridh')
    },
    classes() {
      return [this.enable ? 'enable' : 'disable']
    },
    styles() {
      let obj = {}
      if (this.wrapData.layout === 'grid') {
        obj['grid-column'] = `${this.gridx} / span ${this.gridw}`
        obj['grid-row'] = `${this.gridy} / span ${this.gridh}`
      } else if (this.wrapData.layout === 'flex') {
        if (this.wrapData.flexDir === 'row') {
          if (Kit.isEmpty(this.itemw) || this.itemw === 0) obj['flex'] = 1
          else obj['width'] = `${this.itemw}px`
        } else {
          if (Kit.isEmpty(this.itemh) || this.itemh === 0) obj['flex'] = 1
          else obj['height'] = `${this.itemh}px`
        }
      } else {
        if (Kit.notEmpty(this.itemw)) obj['width'] = `${this.itemw}px`
        if (Kit.notEmpty(this.itemh)) obj['height'] = `${this.itemh}px`
      }
      return obj
    }
  },
  methods: {
    initData() {
      this.el = this.$refs.layoutItem
    },
    onDragStart(evt) {
      evt.dataTransfer.effectAllowed = 'copy'

      let curr = this.item
      if (!this.wrapData.moveAble) {
        if (Kit.notNull(this.wrapData.clone)) {
          curr = this.wrapData.clone(curr)
        } else {
          curr = Kit.deepClone(curr)
        }
        this.setItemProp(curr, 'gridx', 1, false)
        this.setItemProp(curr, 'gridy', 1, false)
        this.setItemProp(curr, 'gridw', this.wrapData.gridColsDef, false)
        this.setItemProp(curr, 'gridh', this.wrapData.gridRowsDef, false)
        this.setItemProp(curr, 'itemw', this.itemw, false)
        this.setItemProp(curr, 'itemh', this.itemh, false)
      }
      const localBeforeData = {
        rootId: this.wrapData.roots.id,
        item: curr,
        index: this.index,
        eventType: 'move'
      }
      const localAfterData = { rootId: this.wrapData.roots.id, moved: false }
      Kit.setLocal(Common.LOCAL_KEY_DATA, localBeforeData)
      Kit.setLocal(Common.LOCAL_KEY_STAT, localAfterData)

      if (this.wrapData.moveAble) {
        const img = new Image()
        img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><path /></svg>"
        evt.dataTransfer.setDragImage(img, 0, 0)
        this.display = this.el.style.display
        setTimeout(() => (this.el.style.display = 'none'), 0)
      }
    },
    onDragEnd(evt) {
      if (this.wrapData.moveAble) {
        const ret = Kit.getLocal(Common.LOCAL_KEY_STAT)
        if (ret && ret.moved && ret.rootId !== this.wrapData.roots.id) {
          this.wrapData.list.splice(this.index, 1)
        }
        this.el.style.display = this.display
      }
      // this.$parent.related.dragging = false
    },
    onResizeStart(evt) {
      evt.dataTransfer.effectAllowed = 'move'
      const localBeforeData = {
        rootId: this.wrapData.roots.id,
        item: this.item,
        index: this.index,
        eventType: 'resize'
      }
      Kit.setLocal(Common.LOCAL_KEY_DATA, localBeforeData)
      this.opacity = this.el.style.opacity
      this.$parent.setCache()
      this.$parent.resetHolderArea()
      setTimeout(() => (this.el.style.opacity = 0.5), 0)
    },
    onResizeEnd(evt) {
      this.el.style.opacity = this.opacity
      // this.$parent.related.dragging = false
    },
    onResizeEnter(evt) {
      // this.$parent.related.dragging = true
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
      if (propName === 'id') return this.wrapData.idPath
      else if (propName === 'itemw') return this.wrapData.itemWPath
      else if (propName === 'itemh') return this.wrapData.itemHPath
      else if (propName === 'gridx') return this.wrapData.gridXPath
      else if (propName === 'gridy') return this.wrapData.gridYPath
      else if (propName === 'gridw') return this.wrapData.gridWPath
      else if (propName === 'gridh') return this.wrapData.gridHPath
      else return null
    }
  }
}
</script>
