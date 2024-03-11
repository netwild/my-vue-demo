<template>
  <div class="side-box-wrap" :class="'scope-' + scope">
    <div class="header">
      <icon-text icon="paged-comp" text="工具箱" theme="side-title" />
      <div class="search-box"></div>
    </div>
    <div class="body">
      组件工具箱
    </div>
  </div>
</template>

<script>
import IconText from './IconText'
export default {
  name: 'CompBox',
  props: {
    scope: {
      type: String,
      default: 'common'
    }
  },
  components: {
    IconText
  }
}
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
}
</style>
