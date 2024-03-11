<template>
  <div class="side-box-wrap" :class="'scope-' + scope">
    <div class="header">
      <icon-text icon="paged-struct" text="页面结构" theme="side-title" />
      <div class="search-box"></div>
    </div>
    <div class="body">
      页面结构树形
    </div>
  </div>
</template>

<script>
import IconText from './IconText'
export default {
  name: 'PageStruct',
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
</style>
