<template>
  <div class="icon-text-wrap" :class="theme">
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
.icon-text-wrap {
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: all .3s;
  font-size: 1rem;
  .svg-icon {
    min-width: 1rem;
    margin-right: 0.2rem;
  }
  span {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 1;
  }
  /* 主标题 */
  &.title {
    color: #fff;
    .svg-icon {
      font-size: 5rem;
      opacity: .2;
    }
    span {
      font-size: 1.2rem;
      font-weight: bold;
      margin-left: -3rem;
      text-shadow: 0 0 3px rgba(0,0,0, .5);
    }
  }
  /* 侧边栏标题 */
  &.side-title {
    color: #666;
    font-size: .9rem;
  }
  /* 右上角导航按钮 */
  &.navi {
    color: rgba(255,255,255, .8);
    cursor: pointer;
    font-size: 0.9rem;
  }
  /* 中间区域工具条按钮 */
  &.tool {
    color: #444;
    cursor: pointer;
    font-size: 0.9rem;
  }
  &:hover {
    &.navi {
      color: #fff;
    }
    &.tool {
      color: #0080eb;
    }
  }
}
</style>
