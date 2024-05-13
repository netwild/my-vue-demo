/*
 * @Author: Z.MingYu
 * @Date: 2024-05-06 08:21:25
 * @Description: 通用逻辑封装
 */

function getWrapProps() {
  return {
    tag: {
      type: String,
      default: 'div'
    },
    list: {
      type: Array,
      default: [],
      required: true
    },
    clone: {
      type: Function,
      default: null
    },
    pushAble: {
      type: Boolean,
      default: true
    },
    moveAble: {
      type: Boolean,
      default: true
    },
    resizeAble: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: 'normal'
    },
    itemMargin: {
      type: Number,
      default: 15
    },
    flexDir: {
      type: String,
      default: 'row'
    },
    flexMainAlign: {
      type: String,
      default: 'space-between'
    },
    flexItemAlign: {
      type: String,
      default: 'stretch'
    },
    idPath: {
      type: Array,
      default() {
        return ['base', 'id']
      }
    },
    itemWPath: {
      type: Array,
      default() {
        return ['props', 'itemw']
      }
    },
    itemHPath: {
      type: Array,
      default() {
        return ['props', 'itemh']
      }
    },
    gridXPath: {
      type: Array,
      default() {
        return ['props', 'gridx']
      }
    },
    gridYPath: {
      type: Array,
      default() {
        return ['props', 'gridy']
      }
    },
    gridWPath: {
      type: Array,
      default() {
        return ['props', 'gridw']
      }
    },
    gridHPath: {
      type: Array,
      default() {
        return ['props', 'gridh']
      }
    },
    gridCols: {
      type: Number,
      default: 24
    },
    gridRows: {
      type: Number,
      default: 24
    },
    gridLines: {
      type: Boolean,
      default: true
    },
    gridColsDef: {
      type: Number,
      default: 6
    },
    gridRowsDef: {
      type: Number,
      default: 6
    }
  }
}

function getWrapData() {
  return {
    roots: {
      id: null,
      el: null,
      erd: null,
      width: 0,
      height: 0,
      x: 0,
      y: 0
    },
    curr: {
      item: {},
      index: 0,
      rootId: null,
      eventType: null
    },
    cache: {
      index: null,
      display: null,
      gridx: null,
      gridy: null,
      gridw: null,
      gridh: null,
      itemw: null,
      itemh: null
    },
    holder: {
      vali: true,
      index: null,
      gridx: null,
      gridy: null,
      gridw: null,
      gridh: null,
      itemw: null,
      itemh: null
    },
    dragging: false
  }
}

export default {
  ROOT_ATTR_UUID: 'ezid',
  LOCAL_KEY_DATA: 'EZ_DRAG_DATA_TRANSFER',
  LOCAL_KEY_STAT: 'EZ_DRAG_DATA_STAT',
  getWrapProps,
  getWrapData
}
