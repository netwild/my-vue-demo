<template>
  <div class="scope-tab">
    <template v-for="item in scopeList">
      <div class="scope-item" :class="{ active: item.key == current }" :key="item.key" @click="scopeTabChg(item.key)">
        {{ item.name }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ScopeTab',
  props: {
    current: {
      type: String,
      default: 'common'
    }
  },
  data () {
    return {
      scopeList: [
        { key: 'common', name: '通用' },
        { key: 'pc', name: '电脑' },
        { key: 'mobile', name: '手机' },
        { key: 'large', name: '大屏' }
      ]
    }
  },
  methods: {
    scopeTabChg (curr) {
      this.$emit('scopeTabChg', curr)
    }
  }
}
</script>

<style scoped>
.scope-tab {
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 1rem;
  background-color: #0080eb;
  box-shadow: 0 0 3px rgba(0,0,0, .3) inset;
  padding: 0 0.3rem;
  margin-left: 0.6rem;
  margin-right: 1rem;
  .scope-item {
    cursor: pointer;
    font-size: 0.9rem;
    color: rgba(255,255,255, .5);
    padding: 0.2rem 0.5rem;
    transition: color .3s;
    position: relative;
    min-width: 3rem;
    line-height: 1.4;
    &.active {
      color: #fff;
      &::after {
        content: '';
        position: absolute;
        left: 25%;
        bottom: 0;
        width: 50%;
        height: 2px;
        background: #fff;
      }
    }
  }
}
</style>
