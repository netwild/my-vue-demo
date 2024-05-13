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
    draggable="true"
    class="ez-drag-layout-item"
    @dragstart.self.stop="onDragStart"
    @dragend.self.stop.prevent="onDragEnd"
    @dragenter.self.stop.prevent
    @dragleave.self.stop.prevent
    @dragover.self.stop.prevent
  >
    <slot></slot>
    <div
      v-if="wrap.resizeAble"
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
    active: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      root: null,
      wrap: {
        roots: this.$parent.roots,
        list: this.$parent.list,
        clone: this.$parent.clone,
        pushAble: this.$parent.pushAble,
        moveAble: this.$parent.moveAble,
        resizeAble: this.$parent.resizeAble,
        handleSelector: this.$parent.handleSelector,
        layout: this.$parent.layout,
        idPath: this.$parent.idPath,
        gridXPath: this.$parent.gridXPath,
        gridYPath: this.$parent.gridYPath,
        gridWPath: this.$parent.gridWPath,
        gridHPath: this.$parent.gridHPath,
        gridColsDef: this.$parent.gridColsDef,
        gridRowsDef: this.$parent.gridRowsDef,
        itemWPath: this.$parent.itemWPath,
        itemHPath: this.$parent.itemHPath,
        flexDir: this.$parent.flexDir
      },

      cache: {
        curr: {},
        display: null
      }
    }
  },
  mounted() {
    this.initData()
  },
  updated() {},
  beforeDestroy() {},
  computed: {
    item() {
      return this.wrap.list[this.index]
    },
    itemw() {
      return this.getItemProp(this.cache.curr, 'itemw')
    },
    itemh() {
      return this.getItemProp(this.cache.curr, 'itemh')
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
      return [!this.wrap.moveAble || this.active ? 'active-on' : 'active-off']
    },
    styles() {
      let obj = {}
      if (this.wrap.layout === 'grid') {
        obj['grid-column'] = `${this.gridx} / span ${this.gridw}`
        obj['grid-row'] = `${this.gridy} / span ${this.gridh}`
      } else if (this.wrap.layout === 'flex') {
        if (this.wrap.flexDir === 'row') {
          if (Kit.isEmpty(this.itemw) || this.itemw === 0) obj['flex'] = 1
          else obj['width'] = `${this.itemw}px`
        } else {
          if (Kit.isEmpty(this.itemh) || this.itemh === 0) obj['flex'] = 1
          else obj['height'] = `${this.itemh}px`
        }
      } else {
        if (Kit.isEmpty(this.itemw)) obj['width'] = 'auto'
        else if (this.itemw === 0) obj['width'] = '100%'
        else obj['width'] = `${this.itemw}px`
        if (Kit.isEmpty(this.itemh)) obj['height'] = 'auto'
        else if (this.itemh === 0) obj['height'] = '100%'
        else obj['height'] = `${this.itemh}px`
      }
      return obj
    }
  },
  methods: {
    initData() {
      this.root = this.$refs.layoutItem
      this.cache.curr = this.wrap.moveAble ? this.item : Kit.deepClone(this.item)
    },
    onDragStart(evt) {
      // console.log(this.index, evt)
      evt.dataTransfer.effectAllowed = 'copy'

      if (!this.wrap.moveAble && Kit.notNull(this.wrap.clone)) {
        this.cache.curr = this.wrap.clone(this.item)
      }

      this.setItemProp(this.cache.curr, 'gridx', 1, false)
      this.setItemProp(this.cache.curr, 'gridy', 1, false)
      this.setItemProp(this.cache.curr, 'gridw', this.wrap.gridColsDef, false)
      this.setItemProp(this.cache.curr, 'gridh', this.wrap.gridRowsDef, false)

      const localBeforeData = {
        rootId: this.wrap.roots.id,
        item: this.cache.curr,
        index: this.index,
        eventType: 'move'
      }

      Kit.setLocal(Common.LOCAL_KEY_DATA, localBeforeData)
      const localAfterData = { rootId: this.wrap.roots.id, moved: false }
      Kit.setLocal(Common.LOCAL_KEY_STAT, localAfterData)
      if (this.wrap.moveAble) {
        const img = new Image()
        img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><path /></svg>"
        evt.dataTransfer.setDragImage(img, 0, 0)
        this.cache.display = this.root.style.display
        setTimeout(() => (this.root.style.display = 'none'), 0)
      }
    },
    onDragEnd(evt) {
      if (this.wrap.moveAble) {
        const ret = Kit.getLocal(Common.LOCAL_KEY_STAT)
        if (ret && ret.moved && ret.rootId !== this.wrap.roots.id) {
          this.wrap.list.splice(this.index, 1)
        }
        this.root.style.display = this.cache.display
      }
      this.$parent.setOpts({ dragging: false })
    },
    onDragEnter(evt) {},
    onDragLeave(evt) {},
    onResizeStart(evt) {
      evt.dataTransfer.effectAllowed = 'move'
      const localBeforeData = {
        rootId: this.wrap.roots.id,
        item: this.cache.curr,
        index: this.index,
        eventType: 'resize'
      }
      Kit.setLocal(Common.LOCAL_KEY_DATA, localBeforeData)
      this.cache.display = this.root.style.display
      setTimeout(() => (this.root.style.display = 'none'), 0)
    },
    onResizeEnd(evt) {
      this.root.style.display = this.cache.display
      this.$parent.setOpts({ dragging: false })
    },
    onResizeEnter(evt) {
      this.$parent.setOpts({ dragging: true })
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
      if (propName === 'id') return this.wrap.idPath
      else if (propName === 'itemw') return this.wrap.itemWPath
      else if (propName === 'itemh') return this.wrap.itemHPath
      else if (propName === 'gridx') return this.wrap.gridXPath
      else if (propName === 'gridy') return this.wrap.gridYPath
      else if (propName === 'gridw') return this.wrap.gridWPath
      else if (propName === 'gridh') return this.wrap.gridHPath
      else return null
    }
  }
}
</script>
