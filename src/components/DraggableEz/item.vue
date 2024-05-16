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
    @dragenter.self.prevent="onDragEnter"
    @dragleave.self.prevent="onDragLeave"
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
      root: null,
      related: this.$parent.related,
      cache: {
        curr: {},
        opacity: null
      }
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
      return this.getItemProp(this.cache.curr, 'itemw')
    },
    itemh() {
      const h = this.getItemProp(this.cache.curr, 'itemh')
      if (this.wrapData.heightMode === 'screen') return h
      else return Kit.ifEmpty(h, 300)
    },
    gridx() {
      return this.getItemProp(this.cache.curr, 'gridx')
    },
    gridy() {
      return this.getItemProp(this.cache.curr, 'gridy')
    },
    gridw() {
      return this.getItemProp(this.cache.curr, 'gridw')
    },
    gridh() {
      return this.getItemProp(this.cache.curr, 'gridh')
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
      this.root = this.$refs.layoutItem
      this.cache.curr = this.wrapData.moveAble ? this.item : Kit.deepClone(this.item)
    },
    onDragStart(evt) {
      // console.log(this.index, evt)
      evt.dataTransfer.effectAllowed = 'copy'

      if (!this.wrapData.moveAble && Kit.notNull(this.wrapData.clone)) {
        this.cache.curr = this.wrapData.clone(this.item)
      }

      this.setItemProp(this.cache.curr, 'gridx', 1, false)
      this.setItemProp(this.cache.curr, 'gridy', 1, false)
      this.setItemProp(this.cache.curr, 'gridw', this.wrapData.gridColsDef, false)
      this.setItemProp(this.cache.curr, 'gridh', this.wrapData.gridRowsDef, false)

      const localBeforeData = {
        rootId: this.wrapData.roots.id,
        item: this.cache.curr,
        index: this.index,
        eventType: 'move'
      }

      Kit.setLocal(Common.LOCAL_KEY_DATA, localBeforeData)
      const localAfterData = { rootId: this.wrapData.roots.id, moved: false }
      Kit.setLocal(Common.LOCAL_KEY_STAT, localAfterData)
      if (this.wrapData.moveAble) {
        const img = new Image()
        img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><path /></svg>"
        evt.dataTransfer.setDragImage(img, 0, 0)
        this.cache.opacity = this.root.style.opacity
        setTimeout(() => (this.root.style.opacity = 0.5), 0)
      }
    },
    onDragEnd(evt) {
      if (this.wrapData.moveAble) {
        const ret = Kit.getLocal(Common.LOCAL_KEY_STAT)
        if (ret && ret.moved && ret.rootId !== this.wrapData.roots.id) {
          this.wrapData.list.splice(this.index, 1)
        }
        this.root.style.opacity = this.cache.opacity
      }
      this.related.dragging = false
    },
    onDragEnter(evt) {},
    onDragLeave(evt) {},
    onResizeStart(evt) {
      evt.dataTransfer.effectAllowed = 'move'
      const localBeforeData = {
        rootId: this.wrapData.roots.id,
        item: this.item,
        index: this.index,
        eventType: 'resize'
      }
      Kit.setLocal(Common.LOCAL_KEY_DATA, localBeforeData)
      this.$parent.setCache()
      this.$parent.resetHolderArea()
      this.cache.opacity = this.root.style.opacity
      setTimeout(() => (this.root.style.opacity = 0.5), 0)
    },
    onResizeEnd(evt) {
      this.root.style.opacity = this.cache.opacity
      this.related.dragging = false
    },
    onResizeEnter(evt) {
      this.related.dragging = true
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
