/*
 * @Author: lzz
 * @Date: 2024-03-22 11:07:59
 * @LastEditTime: 2024-03-28 09:00:49
 */


import { deepClone, generateId, getDefaultFormConfig } from "@/utils/util"
// import {containers, advancedFields, basicFields, customFields} from "@/components/form-designer/widget-panel/widgetsConfig.js"
// import {VARIANT_FORM_VERSION} from "@/utils/config"

export function createDesigner(vueInstance) {
  let defaultFormConfig = deepClone(getDefaultFormConfig())

  return {
    widgetList: [], //组件列表
    formConfig: {}, //表单属性
    selectedId: null, //选中组件ID
    selectedWidget: null, //x选中组件
    selectedWidgetName: null,  //选中组件名称（唯一）
    formWidget: null,  //表单设计容器
    vueInstance: vueInstance,
    /**
     * @description: 初始化设计器
     * @param {*} resetFormJson 
     * @return {*}
     */
    initDesigner(resetFormJson) {
      this.widgetList = []
      this.formConfig = deepClone(defaultFormConfig)
      if (!resetFormJson) {
        this.initHistoryData()
      }
    },

    clearDesigner(skipHistoryChange) {
      let emptyWidgetListFlag = (this.widgetList.length === 0)
      this.widgetList = []
      this.selectedId = null
      this.selectedWidgetName = null
      this.selectedWidget = {}  //this.selectedWidget = null
    },

    setSelected(selected) {
      if (!selected) {
        this.clearSelected()
        return
      }

      this.selectedWidget = selected
      if (!!selected.id) {
        this.selectedId = selected.id
        this.selectedWidgetName = selected.options.name
      }
    },
    removeWidget() {
      console.log('del',this)
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

          this.designer.formWidget.deleteWidgetRef(widgetRefName)  //删除组件ref！！！
          this.designer.emitHistoryChange()
        })
      }
    },
    updateSelectedWidgetNameAndLabel(selectedWidget, newName, newLabel) {
      this.selectedWidgetName = newName
      //selectedWidget.options.name = newName  //此行多余
      if (!!newLabel && (Object.keys(selectedWidget.options).indexOf('label') > -1)) {
        selectedWidget.options.label = newLabel
      }
    },

    clearSelected() {
      this.selectedId = null
      this.selectedWidgetName = null
      this.selectedWidget = {}  //this.selectedWidget = null
    },

    checkWidgetMove(evt) {
      //限制是否可拖拽
      //   if (!!evt.draggedContext && !!evt.draggedContext.element) {
      //     let wgCategory = evt.draggedContext.element.category
      //     let wgType = evt.draggedContext.element.type
      //     if (!!evt.to) {
      //       if ((evt.to.className === 'sub-form-table') && (wgCategory === 'container')) {
      //         //this.$message.info(this.vueInstance.i18nt('designer.hint.onlyFieldWidgetAcceptable'))
      //         return false
      //       }
      //     }
      //   }
      return true
    },
    addContainer(container) {

    },
    copyNewContainerWidget(origin) {
      let newCon = deepClone(origin)
      console.log("newCon", newCon)
      if (!newCon.options) {
        newCon.options = {}
      }
      newCon.id = newCon.type.replace(/-/g, '') + generateId()
      newCon.options.name = newCon.name
      if (newCon.type === 'grid') {
        let newCol = deepClone(this.getContainerByType('grid-col'))
        let tmpId = generateId()
        newCol.id = 'grid-col-' + tmpId
        newCol.options.name = 'gridCol' + tmpId
        newCon.cols.push(newCol)
        //
        newCol = deepClone(newCol)
        tmpId = generateId()
        newCol.id = 'grid-col-' + tmpId
        newCol.options.name = 'gridCol' + tmpId
        newCon.cols.push(newCol)
      } else if (newCon.type === 'table') {
        let newRow = { cols: [] }
        newRow.id = 'table-row-' + generateId()
        newRow.merged = false
        let newCell = deepClone(this.getContainerByType('table-cell'))
        newCell.id = 'table-cell-' + generateId()
        newCell.options.name = newCell.id
        newCell.merged = false
        newCell.options.colspan = 1
        newCell.options.rowspan = 1
        newRow.cols.push(newCell)
        newCon.rows.push(newRow)
      } else if (newCon.type === 'tab') {
        let newTabPane = deepClone(this.getContainerByType('tab-pane'))
        newTabPane.id = 'tab-pane-' + generateId()
        newTabPane.options.name = 'layer'
        newTabPane.options.label = 'tab 1'
        newCon.tabs.push(newTabPane)
      } else if (newCon.type === 'layer') {
        // let newLayerPane = deepClone( this.getContainerByType('tab-pane') )
        let newLayerPane = {
          options: {}
        }
        newLayerPane.id = 'layer-' + generateId()
        newLayerPane.options.name = 'layer'
        newLayerPane.options.label = 'layer'
        if (!newCon.subList) {
          newCon.subList = []
        }
      } else if (newCon.type === 'card') {
        // let newLayerPane = deepClone( this.getContainerByType('tab-pane') )
        if (!newCon.subList) {
          newCon.subList = []
        }
      }
      return newCon
    },

  }
}
