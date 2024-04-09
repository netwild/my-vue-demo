<template>
  <div class="paged-layout-stage-wrap">
    <div v-if="design" class="bg-mask">
      <span>{{ comp.base.name }}</span>
    </div>
    <template v-for="(co, i) in layers">
      <comp-proxy :key="i" :comp="co" :scope="scope" :design="design" />
    </template>
  </div>
</template>

<script>
import CompProxy from '../../../components/CompProxy'
export default {
  name: 'Stage',
  components: {
    CompProxy
  },
  props: {
    scope: {
      type: String,
      default: 'common'
    },
    design: {
      type: Boolean,
      default: true
    },
    comp: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      layers: []
    }
  },
  methods: {
    appendComp(subComp) {
      this.layers.push(subComp)
    },
    setData(data) {
      console.log(data)
    }
  }
}
</script>

<style scoped>
.paged-layout-stage-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  .bg-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 0;
    span {
      color: #fff;
      font-size: 3rem;
      transform: rotate(-30deg);
      text-shadow: 0 0 1rem rgba(0,0,0, .1);
    }
  }
}
</style>
