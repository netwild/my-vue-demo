<!--
 * @Author: lzz
 * @Date: 2024-03-22 15:39:13
 * @LastEditTime: 2024-03-28 11:13:42
-->

<template>
    <div class="layout-wrapper" :class="[customClass]" @click="selectField">
        <slot></slot>
        <div class="container-action" v-if="designer.selectedId === widget.id">
            <i class="el-icon-delete" @click.stop="removeWidget"></i>
            <i class="el-icon-plus"></i>
        </div>
        <!-- <div class="container-action" v-if="designer.selectedId === widget.id && !widget.internal">
        <i class="el-icon-back" :title="i18nt('designer.hint.selectParentWidget')"
           @click.stop="selectParentWidget(widget)"></i>
        <i class="el-icon-top" v-if="!!parentList && (parentList.length > 1)" :title="i18nt('designer.hint.moveUpWidget')"
           @click.stop="moveUpWidget()"></i>
        <i class="el-icon-bottom" v-if="!!parentList && (parentList.length > 1)" :title="i18nt('designer.hint.moveDownWidget')"
           @click.stop="moveDownWidget()"></i>
        <i v-if="widget.type === 'table'" class="iconfont icon-insertrow" :title="i18nt('designer.hint.insertRow')"
           @click.stop="appendTableRow(widget)"></i>
        <i v-if="widget.type === 'table'" class="iconfont icon-insertcolumn" :title="i18nt('designer.hint.insertColumn')"
           @click.stop="appendTableCol(widget)"></i>
        <i class="el-icon-copy-document" v-if="(widget.type === 'grid') || (widget.type === 'table')"
           :title="i18nt('designer.hint.cloneWidget')" @click.stop="cloneContainer(widget)"></i>
        <i class="el-icon-delete" :title="i18nt('designer.hint.remove')" @click.stop="removeWidget"></i>
      </div>
   -->
        <!-- <div class="drag-handler" v-if="designer.selectedId === widget.id && !widget.internal">
        <i class="el-icon-rank" title="移动"></i>
        <i v-if="widget.options.hidden === true" class="iconfont icon-hide"></i>
      </div> -->
    </div>
</template>
<script>
// import containerMixin from "@/components/form-designer/form-widget/container-widget/containerMixin";
export default {
    name: "layout-wrapper",
    //   mixins: [ containerMixin],
    props: {
        widget: Object,
        parentWidget: Object,
        parentList: Array,
        indexOfParentList: Number,
        designer: Object,
    },
    computed: {
        customClass() {
            return "";
            //   return !!this.widget.options.customClass ? this.widget.options.customClass.join(' ') : ''
        },
    },
    methods: {
        removeWidget() {
            console.log(this.de)
            if (!!this.parentList) {
                const widgetRefName = this.designer.selectedWidgetName
                let nextSelected = null
                if (this.parentList.length === 1) {
                    if (!!this.parentWidget) {
                        nextSelected = this.parentWidget
                    }
                } else if (this.parentList.length === (1 + this.indexOfParentList)) {
                    nextSelected = this.parentList[this.indexOfParentList - 1]
                } else {
                    nextSelected = this.parentList[this.indexOfParentList + 1]
                }

                this.$nextTick(() => {
                    this.parentList.splice(this.indexOfParentList, 1)
                    this.designer.setSelected(nextSelected)

                    // this.designer.formWidget.deleteWidgetRef(widgetRefName)  //删除组件ref！！！
                    this.designer.emitHistoryChange()
                })
            }
        },
        selectField() {
            if (!!this.designer) {
                this.designer.setSelected(this.widget)
                // this.designer.emitEvent('field-selected', this.parentWidget)  //发送选中组件的父组件对象
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.layout-wrapper {
    position: relative;
    height: 100%;

    .selected {
        outline: 2px solid blue;
    }

    .container-action {
        position: absolute;
        //bottom: -30px;
        bottom: 0;
        right: -2px;
        height: 28px;
        line-height: 28px;
        background: green;
        z-index: 999;

        i {
            font-size: 14px;
            color: #fff;
            margin: 0 5px;
            cursor: pointer;
        }
    }

    .drag-handler {
        position: absolute;
        top: -2px;
        //bottom: -24px;  /* 拖拽手柄位于组件下方，有时无法正常拖动，原因未明？？ */
        left: -2px;
        height: 22px;
        line-height: 22px;
        //background: $--color-primary;
        z-index: 9;

        i {
            font-size: 14px;
            font-style: normal;
            color: #fff;
            margin: 4px;
            cursor: move;
        }
    }

}
</style>