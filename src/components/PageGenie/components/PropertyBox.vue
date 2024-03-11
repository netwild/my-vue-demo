<template>
  <div class="side-box-wrap" :class="'scope-' + scope">
    <div class="header">
      <div class="prop-tab-wrap">
        <div class="item" :class="{ active : propActive == 'prop' }" @click="propActive = 'prop'">属性</div>
        <div class="item" :class="{ active : propActive == 'style' }" @click="propActive = 'style'">样式</div>
      </div>
    </div>
    <div class="body" v-show="propActive == 'prop'">
      组件属性
    </div>
    <div class="body" v-show="propActive == 'style'">
      组件样式
    </div>
  </div>
</template>

<script>
export default {
  name: 'PropertyBox',
  props: {
    scope: {
      type: String,
      default: 'common'
    }
  },
  data () {
    return {
      propActive: 'prop' // prop / style
    }
  }
}
</script>

<style scoped>
.prop-tab-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  font-size: .9rem;
  color: #666;
  .item {
    cursor: pointer;
    position: relative;
    height: 100%;
    min-width: 2rem;
    display: flex;
    align-items: center;
    &:not(:first-child) {
      margin-left: 1rem;
    }
    &.active {
      color: #0080eb;
      &::after {
        position: absolute;
        content: '';
        width: 80%;
        height: 3px;
        left: 10%;
        bottom: 0;
        background-color: #0080eb;
      }
    }
  }
}
</style>
