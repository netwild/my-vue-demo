<template>
  <div class="wrap" :class="theme">
    <svg-icon :iconClass="icon" v-if="icon" />
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'IconText',
  props: {
    icon: {
      type: String,
      default: null
    },
    text: {
      type: [String, Number],
      default: ''
    },
    theme: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
/* 默认样式 */
.wrap {
  display: flex;
  align-items: center;
  overflow: hidden;
  .svg-icon {
    min-width: 1rem;
    margin-right: 0.3rem;
  }
  span {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  /* 标题样式 */
  &.title {
    color: #fff;
    .svg-icon {
      font-size: 5rem;
      opacity: .2;
    }
    span {
      font-size: 1.2rem;
      font-weight: bold;
      margin-left: -2rem;
      text-shadow: 0 0 3px rgba(0,0,0, .5);
    }
  }
  /* 右上角导航按钮 */
  &.navi {
    color: #fff;
    .svg-icon {
      font-size: 1.2rem;
    }
    span {
      font-size: 1rem;
    }
  }
}
</style>
