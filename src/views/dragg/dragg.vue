<template>
  <div class="container-wrap">
    <div class="left-wrap">
      <draggable-wrap :list="srcList" :pushAble="false" :moveAble="false" :clone="createIns">
        <draggable-item
          v-for="(item, i) in srcList"
          :key="i"
          :list="srcList"
          :index="i"
          class="item-wrap"
        >
          {{ item.base.name }}
        </draggable-item>
      </draggable-wrap>
    </div>
    <div class="right-wrap">
      <div class="dragg-wrap" v-for="(lay, i) in layouts" :key="i">
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
          <draggable-wrap :list="lay.list" :layout="lay.mode" :grid-rows="12">
            <draggable-item
              v-for="(item, i) in lay.list"
              :key="item.base.id"
              :list="lay.list"
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
import DraggableWrap from '@/components/DraggableEz/wrap'
import DraggableItem from '@/components/DraggableEz/item'
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
          list: []
        },
        {
          mode: 'grid',
          list: []
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
body {
  height: 100%;
}
.container-wrap {
  height: 100%;
  display: flex;
  .left-wrap {
    width: 200px;
    height: 100%;
    border-right: 1px solid #999;
    padding: 15px;
    .item-wrap {
      padding: 20px 0;
      text-align: center;
      background-color: #cccccc;
      font-size: 14px;
      cursor: default;
      &:not(:first-child) {
        margin-top: 15px;
      }
    }
  }
  .right-wrap {
    flex: 1;
    height: 100%;
    padding: 15px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .dragg-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .wrap-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;
        line-height: 30px;
        h5 {
          margin: 0;
        }
      }
      .wrap-body {
        flex: 1;
        border: 1px solid #999;
        overflow: hidden auto;
        position: relative;
        height: 100%;
        .item-wrap {
          flex: 1;
          display: flex;
          padding: 10px;
          background-color: #ccc;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
../../components/DraggableEz/kit
