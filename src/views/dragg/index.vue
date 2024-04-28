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
          @dragenter.prevent="onDragEnter($event, 'normal')"
          @dragover.prevent="onDragOver($event, 'normal')"
          @dragleave.prevent="onDragLeave($event, 'normal')"
          @drop.prevent="onDrop($event, 'normal')"
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
          @dragenter.self.prevent="onDragEnter($event, 'custom')"
          @dragover.self.prevent="onDragOver($event, 'custom')"
          @dragleave.self.prevent="onDragLeave($event, 'custom')"
          @drop.self.prevent="onDrop($event, 'custom')"
          :style="styles"
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
          <div class="draggable-item draggable-holder" :style="holderList['custom']"></div>
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
      layoutMode: 'grid',
      insList: {
        normal: [],
        custom: []
      },
      holderList: {
        normal: {
          display: 'none'
        },
        custom: {
          display: 'none',
          'grid-column': null,
          'grid-row': null,
          left: '0px',
          top: '0px',
          transform: 'translate(0px,0px)'
        }
      },
      dragging: false,
      selCurrIns: null,
      selCurrInd: null,
      selCurrPar: null,
      selInOrOut: null,
      containerWidth: 0,
      containerHeight: 0,
      padding: 5,
      rowNum: 12,
      colNum: 24,
      erd: null,
      groupSrc: {
        name: 'dragWrap',
        pull: 'clone',
        put: false
      },
      groupIns: {
        name: 'dragWrap',
        pull: false,
        put: true
      }
    }
  },
  mounted() {
    this.erd = elementResizeDetectorMaker()
    this.erd.listenTo(this.$refs.gridContainer, element => {
      this.containerWidth = element.offsetWidth
      this.containerHeight = element.offsetHeight
    })
  },
  beforeDestroy() {
    if (this.erd) {
      this.erd.removeListener(this.$refs.layoutContainer)
    }
  },
  computed: {
    colWidth() {
      return parseFloat(this.containerWidth / this.colNum).toFixed(3)
    },
    rowHeight() {
      return parseFloat(this.containerHeight / this.rowNum).toFixed(3)
    },
    styles() {
      return {
        '--col-width': this.colWidth + 'px',
        '--row-height': this.rowHeight + 'px',
        '--grid-padd': this.padding + 'px',
        '--grid-cols': this.colNum,
        '--grid-rows': this.rowNum
      }
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
      ins.props.gridw = 6
      ins.props.gridh = 4
      this.dragging = true
      this.selCurrIns = ins
      this.selCurrInd = null
      this.selCurrPar = null
      this.selInOrOut = 'out'
      evt.dataTransfer.effectAllowed = 'copy'
      console.log('创建新实例')
    },
    onDragStart(evt, ins, ind, type) {
      this.dragging = true
      this.selCurrIns = ins
      this.selCurrInd = ind
      this.selCurrPar = type
      this.selInOrOut = 'in'
      evt.dataTransfer.effectAllowed = 'move'
      var img = new Image()
      img.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E"
      evt.dataTransfer.setDragImage(img, 0, 0)
      console.log('开始拖拽')
    },
    onDragEnd(evt) {
      this.dragging = false
      this.selCurrIns = null
      this.selCurrInd = null
      this.selCurrPar = null
      this.selInOrOut = null
      console.log('停止拖拽')
    },
    onDragEnter(evt, type) {
      console.log(evt)
      evt.target.classList.add('dragging-over')
      this.holderList[type].display = 'block'
      console.log(`进入区域：${type}`)
    },
    onDragLeave(evt, type) {
      evt.target.classList.remove('dragging-over')
      this.holderList[type].display = 'none'
      console.log(`离开区域：${type}`)
    },
    onDragOver(evt, type) {
      evt.target.classList.add('dragging-over')
      this.placeholder(evt, type)
      // console.log(`在区域内移动：${type}`)
    },
    onDrop(evt, type) {
      evt.stopPropagation()
      evt.target.classList.remove('dragging-over')
      this.holderList[type].display = 'none'
      this.insList[type].push(this.selCurrIns)
      if (this.selCurrPar) {
        this.insList[this.selCurrPar].splice(this.selCurrInd, 1)
      }
      console.log(`在区域内释放：${type}`)
    },
    placeholder(evt, type) {
      const insData = this.insList[type]
      const holderStyle = this.holderList[type]
      const props = this.selCurrIns.props
      holderStyle['grid-column'] = `${props.gridx} / span ${props.gridw}`
      holderStyle['grid-row'] = `${props.gridy} / span ${props.gridh}`

      // 获取容器的偏移量
      var containerOffsetLeft = evt.target.offsetLeft
      var containerOffsetTop = evt.target.offsetTop

      // 获取鼠标位置
      var mouseX = evt.clientX
      var mouseY = evt.clientY

      // 计算鼠标相对于容器的偏移量
      var offsetX = mouseX - containerOffsetLeft
      var offsetY = mouseY - containerOffsetTop
      console.log(
        '鼠标进入目标元素时的偏移量：',
        containerOffsetLeft,
        containerOffsetTop,
        offsetX,
        offsetY
      )

      // holderStyle['left'] = offsetX + 'px'
      // holderStyle['top'] = offsetY + 'px'

      holderStyle['transform'] = `translate(${offsetX}px, ${offsetY}px)`

      // if (this.selInOrOut === 'out') {
      //   if (insData.length === 0) {
      //     holderStyle['grid-column'] = '1 / span 6'
      //     holderStyle['grid-row'] = '1 / span 4'
      //   }
      // } else {
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('./dragg.css');
</style>
