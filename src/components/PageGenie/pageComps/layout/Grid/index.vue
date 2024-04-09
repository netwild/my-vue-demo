<!--
 * @Author: lzz
 * @Date: 2024-03-26 09:21:11
 * @LastEditTime: 2024-03-28 11:21:39
-->
<template>
    <layoutWrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList"
        :index-of-parent-list="indexOfParentList">
        <div class="paged-layout-grid-wrapper" :key="widget.id" :class="{ 'selected': selected }">
            <grid-layout :layout.sync="layout" :col-num="12" :row-height="30" :is-draggable="draggable" :margin="[5, 5]"  :responsive="false"
                     :vertical-compact="false"
                     :prevent-collision="true"
                :is-resizable="resizable" :use-css-transforms="true">
                <grid-item v-for="(item,index) in layout" :static="item.static" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
                    :i="item.i" style="border: 1px solid rebeccapurple;">
                    <draggable :list="item.subList"
                        v-bind="{ group: 'dragGroup', ghostClass: 'ghostClass', animation: 200 }"
                        style="width: 100%;height: 100%;">
                        <transition-group name="fade" tag="div" class="widget-list">
                            <template v-for="(subWidget, swIdx) in item.subList">
                                <comp-proxy :key="subWidget.id" :widget="subWidget" :scope="scope" :design="design"
                                    :designer="designer" :index="swIdx" />
                            </template>
                        </transition-group>
                    </draggable>
                    <span class="remove" @click="removeItem(index)" style="position: absolute;right: 5px;top: 0;font-size: 20px;cursor: pointer;">x</span>
                </grid-item>
            </grid-layout>
        </div>
    </layoutWrapper>
</template>
<script>
import VueGridLayout from 'vue-grid-layout'
import CompProxy from '@/components/PageGenie/components/CompProxy.vue'
import draggable from 'vuedraggable'
import layoutWrapper from "@/components/PageGenie/pageComps/layout-wrapper.vue"
export default {
    name: 'Layer',
    components: {
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem,
        layoutWrapper,
        draggable,
        CompProxy
    },
    computed: {
        selected() {
            return this.widget.id === this.designer.selectedId
        },
    },
    props: {
        scope: {
            type: String,
            default: 'common'
        },
        design: {
            type: Boolean,
            default: false
        },
        widget: Object,
        parentWidget: Object,
        parentList: Array,
        indexOfParentList: Number,
        designer: Object,
    },
    data() {
        return {
            layout: [
                { "x": 0, "y": 0, "w": 2, "h": 4, "i": "0", subList: [] },
                { "x": 2, "y": 0, "w": 2, "h": 3, "i": "1", subList: [] },
                { "x": 4, "y": 0, "w": 2, "h": 3, "i": "2", subList: [] },
                { "x": 6, "y": 0, "w": 2, "h": 3, "i": "3", subList: [] },
                { "x": 8, "y": 0, "w": 2, "h": 3, "i": "4", subList: [] },
                { "x": 10, "y": 0, "w": 2, "h": 3, "i": "5", subList: [] }
            ],
            draggable: true,
            resizable: true,
            responsive: false
        }
    },
    methods: {
        removeItem (index) {
            this.layout.splice(index, 1);
        },
        gridItemClick(item) {
            console.log(item)
        }
    }
}
</script>
<style lang="scss">
.vue-grid-layout {
    .vue-grid-item{
        height: auto;
    }
    .paged-comp-proxy-wrap {
        height: 100%;

        .layout-wrapper {
            height: 100%;

            .paged-layout-grid-wrapper {

                height: 100%;

                .el-card {
                    height: 100%;
                }
            }
        }
    }
}
</style>