<template>
  <div class="side-box-wrap" :class="'scope-' + scope">
    <div class="header">
      <div class="prop-tab-wrap">
        <div class="item" :class="{ active : propActive == 'prop' }" @click="propActive = 'prop'">属性</div>
        <div class="item" :class="{ active : propActive == 'theme' }" @click="propActive = 'theme'">风格</div>
        <div class="item" :class="{ active : propActive == 'style' }" @click="propActive = 'style'">样式</div>
      </div>
    </div>
    <div class="body" key="prop" v-show="propActive == 'prop'">
      组件属性
    </div>
    <div class="body" key="theme" v-show="propActive == 'theme'">
      组件风格
    </div>
    <div class="body" key="style" v-show="propActive == 'style'">
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
      propActive: 'prop' // prop / theme / style
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
    transition: color .3s;
    &:not(:first-child) {
      margin-left: 1rem;
    }
    &::after {
        position: absolute;
        content: '';
        width: 0%;
        height: 3px;
        left: 50%;
        bottom: 0;
        background-color: #0080eb;
        transition: all .3s;
      }
    &.active {
      color: #0080eb;
      &::after {
        width: 80%;
        left: 10%;
      }
    }
  }
}
</style>
