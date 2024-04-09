<template>
  <div class="side-box-wrap" :class="'scope-' + scope">
    <div class="header">
      <icon-text icon="paged-compbox" text="工具箱" theme="side-title" />
      <div class="search-box" />
    </div>
    <div class="body">
      <el-collapse v-if="compLib" v-model="actives">
        <el-collapse-item v-for="grp in list" :key="grp.code" :title="'• ' + grp.name" :name="grp.code">
          <!-- 拷贝拖拽 -->
          <draggable :list="compLib[grp.code].comps" :group="{ name: 'dragGroup', pull: 'clone', put: false }"
            :options="dragOpts" tag="div" class="comp-wrap" @add="onDragAdd" @start="onDragStart" @end="onDragEnd"
            :move="checkMove" :clone="handleFieldWidgetClone">
            <template v-for="(comp, i) in compLib[grp.code].comps">
              <div v-if="comp.base.display" :key="i" class="comp-box" :class="{ 'dis-dragg': !comp.base.drag }">
                <svg-icon :icon-class="comp.base.icon" />
                <span class="caption">{{ comp.base.name }}</span>
              </div>
            </template>
          </draggable>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import groupDef from '../pageComps/GroupDefine'
import IconText from './IconText'
import draggable from 'vuedraggable'
export default {
  name: 'CompBox',
  components: {
    IconText, draggable
  },
  props: {
    scope: {
      type: String,
      default: 'common'
    },
    lib: {
      type: Object,
      default: null
    },
    designer: Object,
  },
  data() {
    return {
      list: groupDef.list,
      actives: groupDef.actives,
      dragging: false,
      dragOpts: {
        filter: '.dis-dragg',
        sort: false,
        group: {
          name: 'comp-container',
          pull: 'clone',
          put: false
        }
      }
    }
  },
  computed: {
    compLib() {
      return this.lib
    }
  },
  methods: {
    onDragAdd(e) {
      const newIndex = evt.newIndex
      if (!!this.designer.widgetList[newIndex]) {
        this.designer.setSelected(this.designer.widgetList[newIndex])
      }

      this.designer.emitHistoryChange()
      this.designer.emitEvent('field-selected', null)
    },
    checkMove(evt) {
      return this.designer.checkWidgetMove(evt)
    },
    onDragStart(e) {
      this.dragging = true
    },
    onDragEnd(e) {
      this.dragging = false
    },
    handleFieldWidgetClone(origin) {
      console.log(origin)
      if(origin.base.type){
        return this.designer.copyNewContainerWidget(origin.base)
      }
        
      },
  }
}
</script>

<style scoped>
.body {
  .comp-wrap {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr));
    grid-gap: .5rem;

    .comp-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #333;
      cursor: pointer;
      padding: .8rem .3rem .3rem .3rem;
      transition: all .3s;
      border-radius: 5px;

      .svg-icon {
        width: 1.5rem;
        height: 1.5rem;
        transition: transform .3s;
      }

      .caption {
        font-size: .8rem;
        margin-top: .5rem;
        line-height: 1.3;
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      &:hover {
        background-color: #f0f0f0;
        box-shadow: 0 0 5px rgba(0, 0, 0, .2) inset;
        color: #0080eb;

        .svg-icon {
          transform: scale(1.2) rotate(10deg);
        }
      }
    }
  }

  .el-collapse {
    border-width: 0;
    padding: 0 .5rem;
    height: 100%;
  }

  ::v-deep .el-collapse-item__header {
    height: 35px;
    line-height: 35px;
    border-bottom-color: #EBEEF5;
    white-space: nowrap;
    overflow: hidden;
    color: #999;
  }

  ::v-deep .el-collapse-item__wrap {
    border-bottom-width: 0;
  }

  ::v-deep .el-collapse-item__content {
    padding: .5rem 0;
    border-bottom: 1px solid #EBEEF5;
  }
}
</style>
