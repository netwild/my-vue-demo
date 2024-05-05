<template>
  <component
    :is="tag"
    :style="styles"
    ref="layoutItem"
    class="ez-drag-layout-item"
    draggable="true"
    @dragstart.self="onDragStart"
    @dragend.self.prevent="onDragEnd"
    @dragenter.self.prevent="onDragEnter"
    @dragleave.self.prevent
    @dragover.self.prevent
    @drop.self.prevent
  >
    <slot></slot>
  </component>
</template>

<script>
import Consts from './consts'
import Kit from './kit'
export default {
  name: 'ez-drag-item',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      root: null,
      rootId: this.$parent.rootId,
      list: this.$parent.list,
      clone: this.$parent.clone,
      moveAble: this.$parent.moveAble,
      handleSelector: this.$parent.handleSelector,
      idPath: this.$parent.idPath,
      gridXPath: this.$parent.gridXPath,
      gridYPath: this.$parent.gridYPath,
      gridWPath: this.$parent.gridWPath,
      gridHPath: this.$parent.gridHPath,
      gridColsDef: this.$parent.gridColsDef,
      gridRowsDef: this.$parent.gridRowsDef,
      curr: {},
      cache: {
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
      return this.list[this.index]
    },
    gridx() {
      return this.getItemProp(this.curr, 'gridx')
    },
    gridy() {
      return this.getItemProp(this.curr, 'gridy')
    },
    gridw() {
      return this.getItemProp(this.curr, 'gridw')
    },
    gridh() {
      return this.getItemProp(this.curr, 'gridh')
    },
    styles() {
      return {
        'grid-column': `${this.gridx} / span ${this.gridw}`,
        'grid-row': `${this.gridy} / span ${this.gridh}`
      }
    }
  },
  methods: {
    initData() {
      this.root = this.$refs.layoutItem
      if (this.moveAble) {
        this.curr = this.item
      } else if (Kit.notNull(this.clone)) {
        this.curr = this.clone(this.item)
      } else {
        this.curr = Kit.deepClone(this.item)
      }
      this.setItemProp(this.curr, 'gridx', 1, false)
      this.setItemProp(this.curr, 'gridy', 1, false)
      this.setItemProp(this.curr, 'gridw', this.gridColsDef, false)
      this.setItemProp(this.curr, 'gridh', this.gridRowsDef, false)
    },
    onDragStart(evt) {
      evt.dataTransfer.effectAllowed = 'copy'
      const localBeforeData = { rootId: this.rootId, item: this.curr, ind: this.index }
      Kit.setLocal(Consts.LOCAL_KEY_DATA, localBeforeData)
      const localAfterData = { rootId: this.rootId, moved: false }
      Kit.setLocal(Consts.LOCAL_KEY_STAT, localAfterData)
      if (this.moveAble) {
        const img = new Image()
        img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><path /></svg>"
        evt.dataTransfer.setDragImage(img, 0, 0)
        this.cache.display = this.root.style.display
        setTimeout(() => (this.root.style.display = 'none'), 0)
      }
    },
    onDragEnd(evt) {
      if (this.moveAble) {
        const ret = Kit.getLocal(Consts.LOCAL_KEY_STAT)
        if (ret && ret.moved && ret.rootId !== this.rootId) {
          this.list.splice(this.index, 1)
        }
        this.root.style.display = this.cache.display
      }
      this.$parent.setOpts({ dragging: false })
    },
    onDragEnter(evt) {
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
      if (propName === 'id') return this.idPath
      else if (propName === 'gridx') return this.gridXPath
      else if (propName === 'gridy') return this.gridYPath
      else if (propName === 'gridw') return this.gridWPath
      else if (propName === 'gridh') return this.gridHPath
      else return null
    }
  }
}
</script>
