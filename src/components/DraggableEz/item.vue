<!--
 * @Author: Z.MingYu
 * @Date: 2024-05-06 08:23:01
 * @Description: 拖拽布局组件：项目
-->

<template>
  <component
    :is="tag"
    :style="styles"
    ref="layoutItem"
    class="ez-drag-layout-item"
    draggable="true"
    @dragstart.self.stop="onDragStart"
    @dragend.self.prevent.stop="onDragEnd"
    @dragenter.self.prevent.stop="onDragEnter"
    @drag.self.prevent.stop
    @dragleave.self.prevent.stop
    @dragover.self.prevent.stop
    @drop.self.prevent.stop
  >
    <slot></slot>
    <div
      v-if="resizeAble"
      class="ez-drag-resize-handle"
      draggable="true"
      @dragstart.self.stop="onResizeStart"
      @dragend.self.prevent.stop="onResizeEnd"
      @dragenter.self.prevent.stop="onResizeEnter"
      @drag.self.prevent.stop
      @dragleave.self.prevent.stop
      @dragover.self.prevent.stop
      @drop.self.prevent.stop
    ></div>
  </component>
</template>

<script>
import Consts from "./consts";
import Kit from "./kit";
export default {
  name: "draggable-ez-item",
  props: {
    tag: {
      type: String,
      default: "div",
    },
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      root: null,
      rootId: this.$parent.rootId,
      list: this.$parent.list,
      clone: this.$parent.clone,
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
      curr: {},
      cache: {
        display: null,
      },
    };
  },
  mounted() {
    this.initData();
  },
  updated() {},
  beforeDestroy() {},
  computed: {
    item() {
      return this.list[this.index];
    },
    gridx() {
      return this.getItemProp(this.curr, "gridx");
    },
    gridy() {
      return this.getItemProp(this.curr, "gridy");
    },
    gridw() {
      return this.getItemProp(this.curr, "gridw");
    },
    gridh() {
      return this.getItemProp(this.curr, "gridh");
    },
    styles() {
      return this.layout === "grid"
        ? {
            "grid-column": `${this.gridx} / span ${this.gridw}`,
            "grid-row": `${this.gridy} / span ${this.gridh}`,
          }
        : {};
    },
  },
  methods: {
    initData() {
      this.root = this.$refs.layoutItem;
      this.curr = this.moveAble ? this.item : Kit.deepClone(this.item);
    },
    onDragStart(evt) {
      evt.dataTransfer.effectAllowed = "copy";

      if (!this.moveAble && Kit.notNull(this.clone)) {
        this.curr = this.clone(this.item);
      }

      this.setItemProp(this.curr, "gridx", 1, false);
      this.setItemProp(this.curr, "gridy", 1, false);
      this.setItemProp(this.curr, "gridw", this.gridColsDef, false);
      this.setItemProp(this.curr, "gridh", this.gridRowsDef, false);

      const localBeforeData = {
        rootId: this.rootId,
        item: this.curr,
        ind: this.index,
        event: "move",
      };
      Kit.setLocal(Consts.LOCAL_KEY_DATA, localBeforeData);
      const localAfterData = { rootId: this.rootId, moved: false };
      Kit.setLocal(Consts.LOCAL_KEY_STAT, localAfterData);
      if (this.moveAble) {
        const img = new Image();
        img.src =
          "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><path /></svg>";
        evt.dataTransfer.setDragImage(img, 0, 0);
        this.cache.display = this.root.style.display;
        setTimeout(() => (this.root.style.display = "none"), 0);
      }
    },
    onDragEnd(evt) {
      if (this.moveAble) {
        const ret = Kit.getLocal(Consts.LOCAL_KEY_STAT);
        if (ret && ret.moved && ret.rootId !== this.rootId) {
          this.list.splice(this.index, 1);
        }
        this.root.style.display = this.cache.display;
      }
      this.$parent.setOpts({ dragging: false });
    },
    onDragEnter(evt) {
      this.$parent.setOpts({ dragging: true });
    },
    onResizeStart(evt) {
      evt.dataTransfer.effectAllowed = "move";
      const localBeforeData = {
        rootId: this.rootId,
        item: this.curr,
        ind: this.index,
        event: "resize",
      };
      Kit.setLocal(Consts.LOCAL_KEY_DATA, localBeforeData);
      this.cache.display = this.root.style.display;
      setTimeout(() => (this.root.style.display = "none"), 0);
    },
    onResizeEnd(evt) {
      this.root.style.display = this.cache.display;
      this.$parent.setOpts({ dragging: false });
    },
    onResizeEnter(evt) {
      this.$parent.setOpts({ dragging: true });
    },
    getItemProp(item, prop) {
      const paths = this.getItemPropPath(prop);
      return this.getItemPropNext(item, paths);
    },
    getItemPropNext(item, paths) {
      if (Kit.isNull(item)) return null;
      if (paths.length === 1) {
        return item[paths[0]];
      } else {
        return this.getItemPropNext(item[paths[0]], paths.slice(1));
      }
    },
    setItemProp(item, prop, val, overwrite) {
      const paths = this.getItemPropPath(prop);
      this.setItemPropNext(item, paths, val, overwrite);
    },
    setItemPropNext(item, paths, val, overwrite) {
      if (paths.length === 1) {
        if (Kit.isNull(item[paths[0]]) || overwrite)
          this.$set(item, paths[0], val);
      } else {
        if (Kit.isNull(item[paths[0]])) this.$set(item, paths[0], {});
        this.setItemPropNext(item[paths[0]], paths.slice(1), val, overwrite);
      }
    },
    getItemPropPath(propName) {
      if (propName === "id") return this.idPath;
      else if (propName === "gridx") return this.gridXPath;
      else if (propName === "gridy") return this.gridYPath;
      else if (propName === "gridw") return this.gridWPath;
      else if (propName === "gridh") return this.gridHPath;
      else return null;
    },
  },
};
</script>