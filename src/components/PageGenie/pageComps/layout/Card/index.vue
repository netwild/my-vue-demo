<!--
 * @Author: lzz
 * @Date: 2024-03-22 16:21:52
 * @LastEditTime: 2024-03-29 08:12:39
-->
<template>
    <layoutWrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList"
        :index-of-parent-list="indexOfParentList">
        <div class="paged-layout-card-wrapper" :key="widget.id" :class="{ 'selected': selected }">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>卡片名称</span>
                </div>
                <draggable :list="widget.subList"
                    v-bind="{ group: 'dragGroup', ghostClass: 'ghostClass', animation: 200 }">
                    <transition-group name="fade" tag="div" class="widget-list" style="min-height: 20px;">
                        <template v-for="(subWidget, swIdx) in widget.subList">
                            <comp-proxy :key="subWidget.id" :widget="subWidget" :scope="scope" :design="design"
                                :designer="designer" :index="swIdx" />
                        </template>
                    </transition-group>
                    <!-- <transition-group name="fade" tag="div" class="form-widget-list">
                            <template v-for="(subWidget, swIdx) in tab.widgetList">
                                <template v-if="'container' === subWidget.category">
                                    <component :is="subWidget.type + '-widget'" :widget="subWidget" :designer="designer"
                                        :key="subWidget.id" :parent-list="tab.widgetList" :index-of-parent-list="swIdx"
                                        :parent-widget="widget"></component>
                                </template>
                                <template v-else>
                                    <component :is="subWidget.type + '-widget'" :field="subWidget" :designer="designer"
                                        :key="subWidget.id" :parent-list="tab.widgetList" :index-of-parent-list="swIdx"
                                        :parent-widget="widget" :design-state="true"></component>
                                </template>
                            </template>
                        </transition-group> -->
                </draggable>
            </el-card>
        </div>
    </layoutWrapper>

</template>
<script>
import CompProxy from '@/components/PageGenie/components/CompProxy.vue'
import draggable from 'vuedraggable'
import layoutWrapper from "@/components/PageGenie/pageComps/layout-wrapper.vue"
export default {
    name: 'Layer',
    components: {
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
    }
}
</script>
<style lang="scss">
.paged-layout-card-wrapper {
    position: relative;
    width: auto;
    overflow: hidden;
    padding: 1rem;
    height: 100%;
    .el-card{
        height: 100%;
    }
    .el-card__body {
        height: calc(100% - 60px);
        padding: 10px;
        >div{
            height: 100%;
            >.widget-list{
                height: 100%
            }
        }
    }
}
</style>