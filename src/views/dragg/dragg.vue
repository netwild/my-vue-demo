<template>
  <div class="container-wrap">
    <draggable-wrap
      :list="srcList"
      :pushAble="false"
      :moveAble="false"
      :clone="createIns"
      class="left-wrap"
    >
      <draggable-item v-for="(item, i) in srcList" :key="i" :index="i" class="item-wrap">
        {{ item.base.name }}
      </draggable-item>
    </draggable-wrap>
    <div class="right-wrap">
      <div class="dragg-wrap" v-for="(lay, i) in layouts" :key="i" :style="{ height: lay.height }">
        <div class="wrap-header">
          <h5>舞台0{{ i + 1 }}：</h5>
          <div>
            <input type="radio" :id="`option0${i}01`" value="flex" v-model="lay.mode" />
            <label :for="`option0${i}01`">弹性布局（Flex）</label>
            <input type="radio" :id="`option0${i}02`" value="grid" v-model="lay.mode" />
            <label :for="`option0${i}02`">网格布局（Grid）</label>
          </div>
        </div>
        <div class="wrap-body">
          <draggable-wrap :list="lay.list" :layout="lay.mode" :resizeAble="true" :gridLines="true">
            <draggable-item
              v-for="(item, i) in lay.list"
              :key="item.base.id"
              :index="i"
              class="item-wrap"
            >
              {{ item.base.name }}
            </draggable-item>
          </draggable-wrap>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Kit from '../../components/DraggableEz/kit'
import { DraggableWrap, DraggableItem } from '@/components/DraggableEz'
export default {
  name: '',
  components: {
    DraggableWrap,
    DraggableItem
  },
  data() {
    return {
      srcList: [
        {
          base: { code: 'a01', name: '组件01' }
        },
        {
          base: { code: 'a02', name: '组件02' }
        },
        {
          base: { code: 'a03', name: '组件03' }
        },
        {
          base: { code: 'a04', name: '组件04' }
        },
        {
          base: { code: 'a05', name: '组件05' }
        },
        {
          base: { code: 'a06', name: '组件06' }
        },
        {
          base: { code: 'a07', name: '组件07' }
        },
        {
          base: { code: 'a08', name: '组件08' }
        },
        {
          base: { code: 'a09', name: '组件09' }
        }
      ],
      layouts: [
        {
          mode: 'flex',
          list: [],
          height: '20%'
        },
        {
          mode: 'grid',
          list: [],
          height: '80%'
        }
      ]
    }
  },
  methods: {
    createIns(origin) {
      let ins = Kit.deepClone(origin)
      ins.base.id = Kit.genUUID()
      return ins
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('./dragg.css');
</style>
