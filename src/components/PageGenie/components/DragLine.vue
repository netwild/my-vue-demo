<template>
  <div ref="dragHandle" class="drag-handle" :class="dir" :style="dynamicStyle" @mousedown="onMouseDown">
    <div class="line" />
  </div>
</template>

<script>
export default {
  name: 'DragAble',
  props: {
    dir: {
      type: String,
      default: 'h'
    },
    mode: {
      type: String,
      default: 'left'
    },
    pos: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      dragging: false,
      startAt: 0,
      startPos: 0
    }
  },
  computed: {
    dynamicStyle() {
      const stys = {}
      stys[this.mode] = this.pos + 'px'
      stys.cursor = this.dir === 'h' ? 'ew-resize' : 'ns-resize'
      return stys
    }
  },
  mounted() {
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('mousemove', this.onMouseMove)
      window.removeEventListener('mouseup', this.onMouseUp)
    })
  },
  methods: {
    onMouseDown(event) {
      this.dragging = true
      this.startAt = event[this.dir === 'h' ? 'clientX' : 'clientY']
      this.startPos = parseInt(this.$refs.dragHandle.style[this.mode])
    },
    onMouseMove(event) {
      if (!this.dragging) return
      let diff = event[this.dir === 'h' ? 'clientX' : 'clientY'] - this.startAt
      if (this.mode === 'right' || this.mode === 'bottom') diff *= -1
      let newPos = this.startPos + diff
      if (this.min !== null && newPos < this.min) newPos = this.min
      if (this.max !== null && newPos > this.max) newPos = this.max
      this.$emit('drag', newPos)
    },
    onMouseUp() {
      this.dragging = false
    }
  }
}
</script>

<style scoped>
.drag-handle {
  position: absolute;
  background-color: #b3d9f9;
  display: flex;
  .line {
    border-style: double;
    border-color: #9cc0de;
    transition: all .3s;
  }
  &:hover .line {
    border-color: #61829d;
  }
  &.h {
    width: 9px;
    height: 100%;
    align-items: center;
    .line {
      width: 6px;
      height: 60px;
      border-width: 0 3px 0 0;
    }
  }
  &.v {
    width: 100%;
    height: 9px;
    justify-content: center;
    .line {
      width: 60px;
      height: 6px;
      border-width: 0 0 3px 0;
    }
  }
}
</style>
