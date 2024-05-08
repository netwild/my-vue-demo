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
    @dragenter.self.prevent.stop="onDragEnter"
    @dragover.self.stop="onDragOver"
    @dragleave.self.prevent.stop="onDragLeave"
    @drop.self.prevent.stop="onDrop"
  >
    <slot
      :rootId="rootId"
      :list="list"
      :clone="clone"
      :moveAble="moveAble"
      :resizeAble="resizeAble"
      :handleSelector="handleSelector"
      :layout="layout"
      :idPath="idPath"
      :gridXPath="gridXPath"
      :gridYPath="gridYPath"
      :gridWPath="gridWPath"
      :gridHPath="gridHPath"
      :gridColsDef="gridColsDef"
      :gridRowsDef="gridRowsDef"
      :setOpts="setOpts"
    ></slot>
    <div
      class="drag-holder"
      :class="[holder.used ? 'holder-use' : 'holder-dis']"
      :style="{
        'grid-column': `${holder.gridx} / span ${holder.gridw}`,
        'grid-row': `${holder.gridy} / span ${holder.gridh}`,
      }"
    ></div>
  </component>
</template>

<script>
import Consts from "./consts";
import Kit from "./kit";
import elementResizeDetectorMaker from "element-resize-detector";
export default {
  name: "draggable-ez-wrap",
  props: {
    tag: {
      type: String,
      default: "div",
    },
    list: {
      type: Array,
      default: [],
      required: true,
    },
    clone: {
      type: Function,
      default: null,
    },
    pushAble: {
      type: Boolean,
      default: true,
    },
    moveAble: {
      type: Boolean,
      default: true,
    },
    resizeAble: {
      type: Boolean,
      default: false,
    },
    handleSelector: {
      type: String,
      default: null,
    },
    layout: {
      type: String,
      default: "normal",
    },
    FlexDir: {
      type: String,
      default: "row",
    },
    FlexMainAlign: {
      type: String,
      default: "space-between",
    },
    FlexItemAlign: {
      type: String,
      default: "stretch",
    },
    FlexMargin: {
      type: Number,
      default: 10,
    },
    idPath: {
      type: Array,
      default() {
        return ["base", "id"];
      },
    },
    gridXPath: {
      type: Array,
      default() {
        return ["props", "gridx"];
      },
    },
    gridYPath: {
      type: Array,
      default() {
        return ["props", "gridy"];
      },
    },
    gridWPath: {
      type: Array,
      default() {
        return ["props", "gridw"];
      },
    },
    gridHPath: {
      type: Array,
      default() {
        return ["props", "gridh"];
      },
    },
    gridCols: {
      type: Number,
      default: 24,
    },
    gridRows: {
      type: Number,
      default: 24,
    },
    gridColsDef: {
      type: Number,
      default: 6,
    },
    gridRowsDef: {
      type: Number,
      default: 6,
    },
    gridGap: {
      type: Number,
      default: 10,
    },
    gridLines: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      erd: null,
      rootWidth: 0,
      rootHeight: 0,
      rootOrigin: [0, 0],
      rootId: Kit.genUUID(),
      rootEl: null,
      dragging: false,
      curr: { ind: 0, item: {}, rootId: null, event: null },
      cache: {
        opacity: null,
        gridx: null,
        gridy: null,
        gridw: null,
        gridh: null,
      },
      holder: {
        used: true,
        gridx: 1,
        gridy: 1,
        gridw: this.gridColsDef,
        gridh: this.gridRowsDef,
      },
    };
  },
  mounted() {
    this.rootEl = this.$refs.layoutRoot;
    this.rootResizeListen();
  },
  beforeDestroy() {
    if (Kit.notNull(this.erd)) this.erd.uninstall(this.$refs.layoutRoot);
  },
  computed: {
    colWidth() {
      return parseFloat(this.rootWidth / this.gridCols).toFixed(3);
    },
    rowHeight() {
      return parseFloat(this.rootHeight / this.gridRows).toFixed(3);
    },
    gridGapdy() {
      if (this.gridGap * this.gridCols > this.rootWidth) return 0;
      if (this.gridGap * this.gridRows > this.rootHeight) return 0;
      return this.gridGap;
    },
    layoutClass() {
      return [
        `layout-${this.layout}`,
        `flex-dir-${this.FlexDir}`,
        this.gridLines ? "grid-lines-on" : "grid-lines-off",
        this.dragging ? "dragging-on" : "dragging-off",
      ];
    },
    layoutStyle() {
      return {
        "--ez-grid-cols": this.gridCols,
        "--ez-grid-rows": this.gridRows,
        "--ez-grid-col-width": this.colWidth + "px",
        "--ez-grid-row-height": this.rowHeight + "px",
        "--ez-grid-padd": this.gridGapdy + "px",
        "--ez-flex-dir": this.FlexDir,
        "--ez-flex-main-align": this.FlexMainAlign,
        "--ez-flex-item-align": this.FlexItemAlign,
        "--ez-flex-margin": this.FlexMargin + "px",
      };
    },
    gridNodeUseful() {
      let map = Array(this.gridRows)
        .fill()
        .map(() => Array(this.gridCols).fill(0));
      this.list.forEach((item, i) => {
        if (this.curr.rootId !== this.rootId || this.curr.ind !== i) {
          const gx = this.getItemProp(item, "gridx");
          const gy = this.getItemProp(item, "gridy");
          const gw = this.getItemProp(item, "gridw");
          const gh = this.getItemProp(item, "gridh");
          for (let y = 0; y < gh; y++) {
            map[gy + y - 1].fill(1, gx - 1, gx + gw - 1);
          }
        }
      });
      return map;
    },
  },
  methods: {
    rootResizeListen() {
      this.erd = elementResizeDetectorMaker();
      this.erd.listenTo(this.rootEl, (elm) => {
        this.rootWidth = elm.offsetWidth;
        this.rootHeight = elm.offsetHeight;
        this.$emit("rootResize", {
          width: this.rootWidth,
          height: this.rootHeight,
        });
      });
    },
    rootOriginListen() {
      const rect = this.rootEl.getBoundingClientRect();
      this.rootOrigin = [rect.left + window.scrollX, rect.top + window.scrollY];
    },
    setOpts(evt) {
      this.dragging = evt.dragging;
    },
    onDragEnter(evt) {
      this.rootOriginListen();
      const localBeforeData = Kit.getLocal(Consts.LOCAL_KEY_DATA);
      this.curr = { ...localBeforeData };
      this.cache.gridx = this.getItemProp(this.curr.item, "gridx");
      this.cache.gridy = this.getItemProp(this.curr.item, "gridy");
      this.cache.gridw = this.getItemProp(this.curr.item, "gridw");
      this.cache.gridh = this.getItemProp(this.curr.item, "gridh");
      this.dragging = true;
    },
    onDragOver(evt) {
      if (this.curr.event === "move") {
        if (this.pushAble) {
          evt.preventDefault();
          if (this.layout === "grid") this.placeholderGrid(evt);
        }
      } else if (this.curr.event === "resize") {
        if (this.curr.rootId === this.rootId) {
          evt.preventDefault();
          if (this.layout === "grid") this.resizeholderGrid(evt);
        }
      }
    },
    onDragLeave(evt) {
      this.dragging = false;
      if (this.curr.rootId === this.rootId) {
        this.setItemProp(this.curr.item, "gridx", this.cache.gridx, true);
        this.setItemProp(this.curr.item, "gridy", this.cache.gridy, true);
        this.setItemProp(this.curr.item, "gridw", this.cache.gridw, true);
        this.setItemProp(this.curr.item, "gridh", this.cache.gridh, true);
      }
    },
    onDrop(evt) {
      this.dragging = false;
      let item =
        this.curr.rootId === this.rootId
          ? this.list[this.curr.ind]
          : this.curr.item;
      if (this.holder.used) {
        this.setItemProp(item, "gridx", this.holder.gridx, true);
        this.setItemProp(item, "gridy", this.holder.gridy, true);
        this.setItemProp(item, "gridw", this.holder.gridw, true);
        this.setItemProp(item, "gridh", this.holder.gridh, true);
        if (this.curr.rootId !== this.rootId) {
          this.list.push(item);
          Kit.setLocal(Consts.LOCAL_KEY_STAT, {
            rootId: this.rootId,
            moved: true,
          });
        }
      }
    },
    placeholderGrid(evt) {
      let mousePos = [
        evt.clientX - this.rootOrigin[0],
        evt.clientY - this.rootOrigin[1],
      ];
      let insGridw = this.cache.gridw;
      let insGridh = this.cache.gridh;

      let insRectw = insGridw * this.colWidth;
      let insRecth = insGridh * this.rowHeight;

      let areaPos = [mousePos[0] - insRectw / 2, mousePos[1] - insRecth / 2];
      let areaGridx = Math.ceil(areaPos[0] / this.colWidth);
      let areaGridy = Math.ceil(areaPos[1] / this.rowHeight);
      areaGridx = Math.max(
        1,
        Math.min(this.gridCols - insGridw + 1, areaGridx)
      );
      areaGridy = Math.max(
        1,
        Math.min(this.gridRows - insGridh + 1, areaGridy)
      );

      let matrixRect = this.getMatrixRect(
        areaGridx,
        areaGridy,
        insGridw,
        insGridh
      );
      let autoRect = this.getMatrixMax(matrixRect);
      if (autoRect.w === 0 && autoRect.h === 0) {
        this.holder.used = false;
        this.holder.gridx = areaGridx;
        this.holder.gridy = areaGridy;
        this.holder.gridw = insGridw;
        this.holder.gridh = insGridh;
      } else {
        this.holder.used = true;
        this.holder.gridx = areaGridx + autoRect.x;
        this.holder.gridy = areaGridy + autoRect.y;
        this.holder.gridw = autoRect.w;
        this.holder.gridh = autoRect.h;
      }
    },
    resizeholderGrid(evt) {
      let mousePos = [
        evt.clientX - this.rootOrigin[0],
        evt.clientY - this.rootOrigin[1],
      ];
      let insGridx = this.cache.gridx;
      let insGridy = this.cache.gridy;
      let insPosx = (insGridx - 1) * this.colWidth;
      let insPosy = (insGridy - 1) * this.rowHeight;
      let insRectw = mousePos[0] - insPosx;
      let insRecth = mousePos[1] - insPosy;
      let areaGridw = Math.ceil(insRectw / this.colWidth);
      let areaGridh = Math.ceil(insRecth / this.rowHeight);
      areaGridw = Math.max(
        1,
        Math.min(this.gridCols - insGridx + 1, areaGridw)
      );
      areaGridh = Math.max(
        1,
        Math.min(this.gridRows - insGridy + 1, areaGridh)
      );
      let matrixRect = this.getMatrixRect(
        insGridx,
        insGridy,
        areaGridw,
        areaGridh
      );
      this.holder.used = !matrixRect.some((row) => row.includes(1));
      this.holder.gridx = insGridx;
      this.holder.gridy = insGridy;
      this.holder.gridw = areaGridw;
      this.holder.gridh = areaGridh;
    },
    getMatrixRect(x, y, w, h) {
      return this.gridNodeUseful
        .slice(y - 1, y - 1 + h)
        .map((sub, i) => sub.slice(x - 1, x - 1 + w));
    },
    getMatrixMax(matrix) {
      let maxArea = 0;
      let maxRect = { x: 0, y: 0, w: 0, h: 0 };
      const rows = matrix.length;
      const cols = matrix[0].length;
      const lefts = new Array(cols).fill(-1);
      const rights = new Array(cols).fill(cols);
      const heights = new Array(cols).fill(0);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (matrix[row][col] === 0) {
            heights[col] += 1;
          } else {
            heights[col] = 0;
          }
        }
        let boundary = -1;
        for (let col = 0; col < cols; col++) {
          if (matrix[row][col] === 0) {
            lefts[col] = Math.max(lefts[col], boundary);
          } else {
            lefts[col] = -1;
            boundary = col;
          }
        }
        boundary = cols;
        for (let col = cols - 1; col >= 0; col--) {
          if (matrix[row][col] === 0) {
            rights[col] = Math.min(rights[col], boundary);
          } else {
            rights[col] = cols;
            boundary = col;
          }
        }
        for (let col = cols - 1; col >= 0; col--) {
          const area = (rights[col] - lefts[col] - 1) * heights[col];
          if (area > maxArea) {
            maxArea = area;
            maxRect = {
              x: lefts[col] + 1,
              y: row - heights[col] + 1,
              w: rights[col] - lefts[col] - 1,
              h: heights[col],
            };
          }
        }
      }
      return maxRect;
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

<style lang="scss" scoped>
@import url("./index.css");
</style>
