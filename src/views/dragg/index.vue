<template>
  <div class="container-wrap">
    <div class="src-wrap">
      <div
        class="item-wrap"
        v-for="(item, i) in srcList"
        :key="item.id"
        draggable="true"
        @dragstart="onCreate($event, item)"
        @dragend.prevent="onDragEnd($event)"
      >
        {{ item.base.name }}
      </div>
    </div>
    <div class="ins-wraps">
      <div class="ins-wrap layout-normal">
        <div class="wrap-header">
          <h5>默认布局：</h5>
        </div>
        <div
          class="draggable-wrap"
          :class="[dragging['normal'] ? 'dragging-on' : 'dragging-off']"
          @dragenter.prevent="onDragEnter($event, 'normal')"
          @dragover.prevent="onDragOver($event, 'normal')"
          @dragleave.prevent="onDragLeave($event, 'normal')"
          @drop.prevent="onDrop($event, 'normal')"
          :style="layoutStyle"
        >
          <div
            class="draggable-item"
            v-for="(item, ind) in insList['normal']"
            :key="item.base.id"
            draggable="true"
            @dragstart="onDragStart($event, item, ind, 'normal')"
            @dragend.prevent="onDragEnd($event)"
          >
            {{ item.base.name }}
          </div>
        </div>
      </div>
      <div class="ins-wrap layout-custom" :class="[`layout-${layoutMode}`]">
        <div class="wrap-header">
          <h5>自定义布局：</h5>
          <div>
            <input type="radio" id="option1" value="flex" v-model="layoutMode" />
            <label for="option1">弹性布局（Flex）</label>
            <input type="radio" id="option2" value="grid" v-model="layoutMode" />
            <label for="option2">网格布局（Grid）</label>
          </div>
        </div>
        <div
          ref="gridContainer"
          class="draggable-wrap"
          :class="[dragging['custom'] ? 'dragging-on' : 'dragging-off']"
          @dragenter.self.prevent="onDragEnter($event, 'custom')"
          @dragover.self.prevent="onDragOver($event, 'custom')"
          @dragleave.self.prevent="onDragLeave($event, 'custom')"
          @drop.self.prevent="onDrop($event, 'custom')"
          :style="layoutStyle"
        >
          <div
            class="draggable-item"
            v-for="(item, ind) in insList['custom']"
            :key="item.base.id"
            :style="{
              'grid-column': `${item.props.gridx} / span ${item.props.gridw}`,
              'grid-row': `${item.props.gridy} / span ${item.props.gridh}`
            }"
            draggable="true"
            @dragstart.self="onDragStart($event, item, ind, 'custom')"
            @dragend.self.prevent="onDragEnd($event)"
            @dragenter.self.prevent
            @dragover.self.prevent
            @dragleave.self.prevent
            @drop.self.prevent
          >
            {{ item.base.name }}
          </div>
          <div
            class="draggable-item draggable-holder"
            :class="[holder.used ? 'holder-use' : 'holder-dis']"
            :style="{
              'grid-column': `${holder.gridx} / span ${holder.gridw}`,
              'grid-row': `${holder.gridy} / span ${holder.gridh}`
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { v4: uuidv4 } = require('uuid')
import elementResizeDetectorMaker from 'element-resize-detector'
export default {
  name: 'Test',
  components: {},
  data() {
    return {
      srcList: [
        {
          base: { code: 'a01', name: '组件01' },
          props: {}
        },
        {
          base: { code: 'a02', name: '组件02' },
          props: {}
        },
        {
          base: { code: 'a03', name: '组件03' },
          props: {}
        },
        {
          base: { code: 'a04', name: '组件04' },
          props: {}
        },
        {
          base: { code: 'a05', name: '组件05' },
          props: {}
        },
        {
          base: { code: 'a06', name: '组件06' },
          props: {}
        },
        {
          base: { code: 'a07', name: '组件07' },
          props: {}
        },
        {
          base: { code: 'a08', name: '组件08' },
          props: {}
        },
        {
          base: { code: 'a09', name: '组件09' },
          props: {}
        }
      ],
      insList: {
        normal: [],
        custom: []
      },
      erd: null,
      layoutWidth: 0,
      layoutHeight: 0,
      layoutOrigin: [0, 0],
      layoutMode: 'grid',
      rowNum: 12,
      colNum: 24,
      padding: 10,
      rowsDef: 6,
      colsDef: 6,
      selCurrIns: null,
      selCurrInd: null,
      selCurrPar: null,
      dragging: {
        normal: false,
        custom: false
      },
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
    this.erd = elementResizeDetectorMaker()
    this.erd.listenTo(this.$refs.gridContainer, element => {
      this.layoutWidth = element.offsetWidth
      this.layoutHeight = element.offsetHeight
      this.layoutOrigin = [element.offsetLeft, element.offsetTop]
    })
  },
  beforeDestroy() {
    if (this.erd) {
      this.erd.removeListener(this.$refs.layoutContainer)
    }
  },
  computed: {
    colWidth() {
      return parseFloat(this.layoutWidth / this.colNum).toFixed(3)
    },
    rowHeight() {
      return parseFloat(this.layoutHeight / this.rowNum).toFixed(3)
    },
    layoutStyle() {
      return {
        '--col-width': this.colWidth + 'px',
        '--row-height': this.rowHeight + 'px',
        '--grid-padd': this.padding + 'px',
        '--grid-cols': this.colNum,
        '--grid-rows': this.rowNum
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
    deepClone(origin) {
      return JSON.parse(JSON.stringify(origin))
    },
    onCreate(evt, src) {
      const ins = this.deepClone(src)
      ins.base.id = uuidv4()
      ins.props.gridx = 1
      ins.props.gridy = 1
      ins.props.gridw = this.colsDef
      ins.props.gridh = this.rowsDef
      this.selCurrIns = ins
      this.selCurrInd = null
      this.selCurrPar = null
      evt.dataTransfer.effectAllowed = 'copy'
      console.log('创建新实例')
    },
    onDragStart(evt, ins, ind, type) {
      this.selCurrIns = ins
      this.selCurrInd = ind
      this.selCurrPar = type
      evt.dataTransfer.effectAllowed = 'move'
      var img = new Image()
      img.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E"
      evt.dataTransfer.setDragImage(img, 0, 0)
      this.holder.cache.display = evt.target.style.display
      setTimeout(() => {
        evt.target.style.display = 'none'
      }, 0)
      console.log('开始拖拽')
    },
    onDragEnd(evt) {
      this.selCurrIns = null
      this.selCurrInd = null
      this.selCurrPar = null
      this.selInOrOut = null
      evt.target.style.display = this.holder.cache.display
      console.log('停止拖拽')
    },
    onDragEnter(evt, type) {
      this.dragging[type] = true
      this.holder.cache.gridw = this.selCurrIns.props.gridw
      this.holder.cache.gridh = this.selCurrIns.props.gridh
      console.log(`进入区域：${type}`)
    },
    onDragOver(evt, type) {
      if (this.layoutMode === 'grid') this.placeholderGrid(evt, type)
      // console.log(`在区域内移动：${type}`)
    },
    onDragLeave(evt, type) {
      this.dragging[type] = false
      this.selCurrIns.props.gridw = this.holder.cache.gridw
      this.selCurrIns.props.gridh = this.holder.cache.gridh
      console.log(`离开区域：${type}`)
    },
    placeholderGrid(evt, type) {
      let mousePos = [evt.clientX - this.layoutOrigin[0], evt.clientY - this.layoutOrigin[1]]
      let insGridw = this.holder.cache.gridw
      let insGridh = this.holder.cache.gridh
      let insRectw = insGridw * this.colWidth
      let insRecth = insGridh * this.rowHeight

      let areaPos = [mousePos[0] - insRectw / 2, mousePos[1] - insRecth / 2]
      let areaGridx = Math.ceil(areaPos[0] / this.colWidth)
      let areaGridy = Math.ceil(areaPos[1] / this.rowHeight)
      areaGridx = Math.max(1, Math.min(this.colNum - insGridw + 1, areaGridx))
      areaGridy = Math.max(1, Math.min(this.rowNum - insGridh + 1, areaGridy))

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
    onDrop(evt, type) {
      evt.stopPropagation()
      this.dragging[type] = false
      if (this.holder.used) {
        if (this.layoutMode === 'grid') {
          this.selCurrIns.props.gridx = this.holder.gridx
          this.selCurrIns.props.gridy = this.holder.gridy
          this.selCurrIns.props.gridw = this.holder.gridw
          this.selCurrIns.props.gridh = this.holder.gridh
        }
        if (!this.selCurrPar) {
          this.insList[type].push(this.selCurrIns)
          // console.log(this.insList[type])
          // console.log(this.gridNodeUseful)
        } else if (this.selCurrPar !== type) {
          this.insList[type].push(this.selCurrIns)
          this.insList[this.selCurrPar].splice(this.selCurrInd, 1)
        }
      }
      console.log(`在区域内释放：${type}`)
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('./dragg.css');
</style>
