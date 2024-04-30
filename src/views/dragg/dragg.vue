<template>
  <div class="container-wrap">
    <div class="left-wrap">
      <drag-layout :list="srcList">
        <div class="item-wrap" v-for="(item, i) in srcList" :key="item.id">
          {{ item.base.name }}
        </div>
      </drag-layout>
    </div>
    <div class="right-wrap">
      <div class="dragg-wrap">
        <div class="wrap-header">
          <h5>舞台01：</h5>
          <div>
            <input type="radio" id="option0101" value="flex" v-model="layouts[0].mode" />
            <label for="option0101">弹性布局（Flex）</label>
            <input type="radio" id="option0102" value="grid" v-model="layouts[0].mode" />
            <label for="option0102">网格布局（Grid）</label>
          </div>
        </div>
        <div class="wrap-body"></div>
      </div>
      <div class="dragg-wrap">
        <div class="wrap-header">
          <h5>舞台02：</h5>
          <div>
            <input type="radio" id="option0201" value="flex" v-model="layouts[1].mode" />
            <label for="option0201">弹性布局（Flex）</label>
            <input type="radio" id="option0202" value="grid" v-model="layouts[1].mode" />
            <label for="option0202">网格布局（Grid）</label>
          </div>
        </div>
        <div class="wrap-body"></div>
      </div>
    </div>
  </div>
</template>

<script>
import DragLayout from '@/components/ez-drag/layout'
export default {
  name: '',
  components: {
    DragLayout
  },
  data() {
    return {
      srcList: [
        {
          base: { code: 'a01', name: '组件01' },
          props: {}
        },
        {
          base: { code: 'a02', name: '组件02' },
          props: {}
        },
        {
          base: { code: 'a03', name: '组件03' },
          props: {}
        },
        {
          base: { code: 'a04', name: '组件04' },
          props: {}
        },
        {
          base: { code: 'a05', name: '组件05' },
          props: {}
        },
        {
          base: { code: 'a06', name: '组件06' },
          props: {}
        },
        {
          base: { code: 'a07', name: '组件07' },
          props: {}
        },
        {
          base: { code: 'a08', name: '组件08' },
          props: {}
        },
        {
          base: { code: 'a09', name: '组件09' },
          props: {}
        }
      ],
      layouts: [
        {
          mode: 'flex'
        },
        {
          mode: 'grid'
        }
      ]
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
    padding: 0 15px;
    .item-wrap {
      margin-top: 15px;
      padding: 20px 0;
      text-align: center;
      background-color: #cccccc;
      font-size: 14px;
      cursor: default;
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
      }
    }
  }
}
</style>
