<template>
  <div class="side-box-wrap" :class="'scope-' + scope">
    <div class="header">
      <icon-text icon="paged-struct" text="页面结构" theme="side-title" />
      <div class="tool-box">
        <svg-icon iconClass="paged-expand" title="全部展开" @click="setExpandAll(true)" />
        <svg-icon iconClass="paged-collapse" title="全部折叠" @click="setExpandAll(false)" />
      </div>
    </div>
    <div class="body">
      <el-tree ref="tree" node-key="id" :data="treeData" :props="treeProps"
      @node-click="handleNodeClick"></el-tree>
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
  },
  data () {
    return {
      treeData: [
        {
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }
      ],
      treeProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick (data) {
      console.log(data)
    },
    setExpandAll (state) {
      var nodes = this.$refs.tree.store.nodesMap
      for (var i in nodes) {
        nodes[i].expanded = state
      }
    }
  }
}
</script>

<style scoped>
</style>
