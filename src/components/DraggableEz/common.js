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
    heightMode: {
      type: String,
      default: 'screen'
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
    //容器信息
    roots: {
      id: null,
      el: null,
      erd: null,
      width: 0,
      height: 0,
      x: 0,
      y: 0
    },
    //当前项目的原始信息
    curr: {
      item: {},
      index: 0,
      rootId: null,
      eventType: null
    },
    //当前项目的关键信息（从原始信息中提取，方便处理）
    cache: {
      gridx: null,
      gridy: null,
      gridw: null,
      gridh: null,
      itemw: null,
      itemh: null
    },
    //占位符信息
    holder: {
      vali: true,
      gridx: null,
      gridy: null,
      gridw: null,
      gridh: null,
      itemw: null,
      itemh: null,
      //占位符边框
      mask: {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      },
      //占位符有效区域
      area: {
        trsi: 0,
        x: 0,
        y: 0,
        w: 0,
        h: 0
      }
    },
    //上下文环境
    related: {
      dragging: false
    }
  }
}

export default {
  ROOT_ATTR_UUID: 'ezid',
  LOCAL_KEY_DATA: 'EZ_DRAG_DATA_TRANSFER',
  LOCAL_KEY_STAT: 'EZ_DRAG_DATA_STAT',
  getWrapProps,
  getWrapData
}
