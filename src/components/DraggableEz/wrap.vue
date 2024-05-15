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
    <slot :wrapData="wrapData" :related="related"></slot>
    <div
      class="drag-holder"
      :class="[holder.vali ? 'holder-able' : 'holder-deny']"
      :style="{
        'grid-column': `${holder.gridx} / span ${holder.gridw}`,
        'grid-row': `${holder.gridy} / span ${holder.gridh}`,
      }"
    ></div>
  </component>
</template>

<script>
import Kit from "./kit";
import Common from "./common";
import elementResizeDetectorMaker from "element-resize-detector";
export default {
  name: "draggable-ez-wrap",
  props: Common.getWrapProps(),
  data() {
    return Common.getWrapData();
  },
  mounted() {
    this.roots.id = Kit.genUUID();
    this.roots.el = this.$refs.layoutRoot;
    this.rootResizeListen();
  },
  beforeDestroy() {
    if (Kit.notNull(this.roots.erd)) this.roots.erd.uninstall(this.roots.el);
  },
  computed: {
    gridColw() {
      return parseFloat(this.roots.width / this.gridCols).toFixed(3);
    },
    gridRowh() {
      return parseFloat(this.roots.height / this.gridRows).toFixed(3);
    },
    gridGap() {
      if (this.itemMargin * this.gridCols > this.roots.width) return 0;
      if (this.itemMargin * this.gridRows > this.roots.height) return 0;
      return this.itemMargin;
    },
    layoutClass() {
      return [
        `layout-${this.layout}`,
        `flex-dir-${this.flexDir}`,
        this.gridLines ? "grid-lines-on" : "grid-lines-off",
        this.related.dragging ? "dragging-on" : "dragging-off",
      ];
    },
    layoutStyle() {
      return {
        "--ez-grid-cols": this.gridCols,
        "--ez-grid-rows": this.gridRows,
        "--ez-grid-col-width": this.gridColw + "px",
        "--ez-grid-row-height": this.gridRowh + "px",
        "--ez-grid-gap": this.gridGap + "px",
        "--ez-flex-dir": this.flexDir,
        "--ez-flex-main-align": this.flexMainAlign,
        "--ez-flex-item-align": this.flexItemAlign,
        "--ez-item-margin": this.itemMargin + "px",
      };
    },
    gridUseful() {
      let map = Array(this.gridRows)
        .fill()
        .map(() => Array(this.gridCols).fill(0));
      this.list.forEach((item, i) => {
        if (this.curr.rootId !== this.roots.id || this.curr.index !== i) {
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
        related: this.related,
      };
    },
  },
  methods: {
    rootResizeListen() {
      this.roots.erd = elementResizeDetectorMaker();
      this.roots.erd.listenTo(this.roots.el, (elm) => {
        this.roots.width = elm.offsetWidth;
        this.roots.height = elm.offsetHeight;
        this.$emit("rootResize", {
          width: this.roots.width,
          height: this.roots.height,
        });
      });
    },
    rootPositionListen() {
      const rect = this.roots.el.getBoundingClientRect();
      this.roots.x = rect.left + window.scrollX;
      this.roots.y = rect.top + window.scrollY;
    },
    onDragEnter(evt) {
      this.rootPositionListen();
      const localBeforeData = Kit.getLocal(Common.LOCAL_KEY_DATA);
      this.curr = { ...localBeforeData };
      this.cache.gridx = this.getItemProp(this.curr.item, "gridx");
      this.cache.gridy = this.getItemProp(this.curr.item, "gridy");
      this.cache.gridw = this.getItemProp(this.curr.item, "gridw");
      this.cache.gridh = this.getItemProp(this.curr.item, "gridh");
      this.cache.itemw = this.getItemProp(this.curr.item, "itemw");
      this.cache.itemh = this.getItemProp(this.curr.item, "itemh");
      this.related.dragging = true;
    },
    onDragOver(evt) {
      if (this.curr.eventType === "move") {
        if (this.pushAble) {
          evt.preventDefault();
          if (this.layout === "grid") this.placeholderGrid(evt);
          else this.placeholderFlex(evt);
        }
      } else if (this.curr.eventType === "resize") {
        if (this.curr.rootId === this.roots.id) {
          evt.preventDefault();
          if (this.layout === "grid") this.resizeholderGrid(evt);
        }
      }
    },
    onDragLeave(evt) {
      if (this.curr.rootId === this.roots.id) {
        this.setItemProp(this.curr.item, "gridx", this.cache.gridx, true);
        this.setItemProp(this.curr.item, "gridy", this.cache.gridy, true);
        this.setItemProp(this.curr.item, "gridw", this.cache.gridw, true);
        this.setItemProp(this.curr.item, "gridh", this.cache.gridh, true);
        this.setItemProp(this.curr.item, "itemw", this.cache.itemw, true);
        this.setItemProp(this.curr.item, "itemh", this.cache.itemh, true);
      }
      this.related.dragging = false;
    },
    onDrop(evt) {
      let item =
        this.curr.rootId === this.roots.id
          ? this.list[this.curr.index]
          : this.curr.item;
      if (this.holder.vali) {
        this.setItemProp(item, "gridx", this.holder.gridx, true);
        this.setItemProp(item, "gridy", this.holder.gridy, true);
        this.setItemProp(item, "gridw", this.holder.gridw, true);
        this.setItemProp(item, "gridh", this.holder.gridh, true);
        this.setItemProp(item, "itemw", this.holder.itemw, true);
        this.setItemProp(item, "itemh", this.holder.itemh, true);
        if (this.curr.rootId !== this.roots.id) {
          this.list.push(item);
          Kit.setLocal(Common.LOCAL_KEY_STAT, {
            rootId: this.roots.id,
            moved: true,
          });
        }
      }
      this.related.dragging = false;
    },
    placeholderFlex(evt) {
      this.holder.vali = true;
      this.holder.gridx = this.cache.gridx;
      this.holder.gridy = this.cache.gridy;
      this.holder.gridw = this.cache.gridw;
      this.holder.gridh = this.cache.gridh;
      this.holder.itemw = this.cache.itemw;
      this.holder.itemh = this.cache.itemh;
    },
    placeholderGrid(evt) {
      let mousePos = [evt.clientX - this.roots.x, evt.clientY - this.roots.y];
      let insGridw = this.cache.gridw;
      let insGridh = this.cache.gridh;

      let insRectw = insGridw * this.gridColw;
      let insRecth = insGridh * this.gridRowh;

      let areaPos = [mousePos[0] - insRectw / 2, mousePos[1] - insRecth / 2];
      let areaGridx = Math.ceil(areaPos[0] / this.gridColw);
      let areaGridy = Math.ceil(areaPos[1] / this.gridRowh);
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
        this.holder.vali = false;
        this.holder.gridx = areaGridx;
        this.holder.gridy = areaGridy;
        this.holder.gridw = insGridw;
        this.holder.gridh = insGridh;
      } else {
        this.holder.vali = true;
        this.holder.gridx = areaGridx + autoRect.x;
        this.holder.gridy = areaGridy + autoRect.y;
        this.holder.gridw = autoRect.w;
        this.holder.gridh = autoRect.h;
      }
    },
    resizeholderGrid(evt) {
      let mousePos = [evt.clientX - this.roots.x, evt.clientY - this.roots.y];
      let insGridx = this.cache.gridx;
      let insGridy = this.cache.gridy;
      let insPosx = (insGridx - 1) * this.gridColw;
      let insPosy = (insGridy - 1) * this.gridRowh;
      let insRectw = mousePos[0] - insPosx;
      let insRecth = mousePos[1] - insPosy;
      let areaGridw = Math.ceil(insRectw / this.gridColw);
      let areaGridh = Math.ceil(insRecth / this.gridRowh);
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
      this.holder.vali = !matrixRect.some((row) => row.includes(1));
      this.holder.gridx = insGridx;
      this.holder.gridy = insGridy;
      this.holder.gridw = areaGridw;
      this.holder.gridh = areaGridh;
    },
    getMatrixRect(x, y, w, h) {
      return this.gridUseful
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
      else if (propName === "itemw") return this.itemWPath;
      else if (propName === "itemh") return this.itemHPath;
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
