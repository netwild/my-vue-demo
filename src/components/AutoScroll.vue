<template>
  <div class="wrap" :style="aniVals">
    <div ref="inner" class="inner" :class="{ 'scroll-able': scrollAble }">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AutoScroll',
  props: {},
  data() {
    return {
      widthDiff: 0,
      scrollAble: false
    }
  },
  computed: {
    aniVals() {
      return {
        '--width-diff': `${this.widthDiff}px`,
        '--scroll-sec': `${-1.2 * this.widthDiff / 15}s`
      }
    }
  },
  mounted() {
    this.overflow()
  },
  methods: {
    overflow() {
      this.$nextTick(() => {
        const widthDisplay = this.$refs.inner.clientWidth
        const widthReality = this.$refs.inner.scrollWidth
        this.widthDiff = widthDisplay - widthReality
        this.scrollAble = this.widthDiff < 0
      })
    }
  }
}
</script>

<style scoped>
.wrap {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  .inner {
    width: 100%;
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .scroll-able:hover {
      width: auto;
      overflow: visible;
      text-overflow: revert;
      animation: inner-scroll var(--scroll-sec) linear infinite alternate;
  }
}
@keyframes inner-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(var(--width-diff));
  }
}
</style>
