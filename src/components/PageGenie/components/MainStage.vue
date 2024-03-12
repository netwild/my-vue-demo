<template>
  <div class="main-stage" :class="'scope-' + scope">
  </div>
</template>

<script>
export default {
  name: 'MainStage',
  props: {
    scope: {
      type: String,
      default: 'common'
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.main-stage {
  background-color: #edf7ff;
  border-color: #fff;
  border-style: solid;
  transition: all .3s;
  position: relative;
  &.scope-mobile {
    width: 400px;
    height: calc(100% - 5rem);
    border-width: 3px;
    box-shadow: 0 0 1rem rgba(0,0,0, .1);
    border-radius: 10px;
    padding: 10px;
  }
  &:not([class*="scope-mobile"]) {
    width: 100%;
    height: 100%;
    border-width: 0;
    padding: 1rem;
  }
}
</style>
