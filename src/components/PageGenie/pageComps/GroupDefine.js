/**
 * 组件分组列表，与 page-comps 下的子目录相对应
 * 在渲染组件工具箱时遍历分组列表
 */
const list = [
  { code: 'layout', name: '布局' },
  { code: 'base', name: '基础' },
  { code: 'table', name: '表格' },
  { code: 'chart', name: '分析图' }
]

/**
 * 组件类型字典
 * 在组件的声明文件中通过 type 属性指定组件类型
 * 用来明确组件所支持的上下文环境
 */
const types = {
  stage: {
    name: '舞台',
    parents: [],
    children: ['layer']
  },
  layer: {
    name: '图层',
    parents: ['stage'],
    children: ['layout', 'card']
  },
  layout: {
    name: '布局',
    parents: ['layer', 'card'],
    children: ['card']
  },
  card: {
    name: '卡片',
    parents: ['layer', 'layout'],
    children: ['layout', 'comp']
  },
  comp: {
    name: '组件',
    parents: ['card'],
    children: []
  }
}

/**
 * 默认展开的分组
 */
const actives = ['layout', 'base']

/**
 * ======================================
 * 组件约定：
 * ======================================
 * 1、在对应的组件分组目录内创建组件子目录；
 * 2、在组件子目录内创建声明文件：CompDefine.json
 * 3、声明文件格式：
 *   1) icon：String，组件图标，默认：paged-comp
 *   2) name：String，组件显示名称，默认：无
 *   3) index：String，组件主文件，默认：index，无需加“.vue”扩展名
 *   4) type：String，组件类型，从组件类型字典（types）中指定其一，默认：comp
 *   5) display：Boolean，是否在组件工具箱中显示，默认：true
 *   6) drag：Boolean，是否支持拖拽，默认：true
 *   7) dataBind：Boolean，组件是否支持数据绑定，默认：true
 */
const compDef = {
  base: {
    icon: 'paged-comp',
    name: '',
    index: 'index',
    type: 'comp',
    display: true,
    drag: true,
    dataBind: false
  }
}

/**
 * 检索 page-comps 目录内的全部组件声明文件
 * 用于渲染组件工具箱的详细列表
 */
const loadComps = () => {
  const groups = list.reduce((acc, item) => {
    acc[item.code] = { comps: [], ...item }
    return acc
  }, {})
  const re_grp = /^\.\/([^/]+)/
  const re_def = /\/CompDefine\.js/
  const context = require.context('.', true, /\/CompDefine\.js$/)
  const keys = context.keys()
  keys.forEach((key) => {
    const match = key.match(re_grp)
    if (match && groups[match[1]]) {
      const def = context(key).default
      const base = setObjDef(def.base, compDef.base)
      const path = key.substr(2).replace(re_def, '')
      base.code = path.replace(/[/.]/g, '-').toLowerCase()
      base.path = `${path}/${base.index}`
      def.base = base
      groups[match[1]].comps.push(def)
    }
  })
  // console.log(groups)
  return groups
}

/**
 * 对象属性补全
 * @param {*} obj 原对象
 * @param {*} defs 基准对象
 * @returns 新对象
 */
function setObjDef(obj, defs) {
  const dist = { ...obj }
  for (const key in defs) {
    if (dist[key] === undefined || dist[key] === null || dist[key] === '') {
      dist[key] = defs[key]
    }
  }
  return dist
}

export default {
  list,
  actives,
  types,
  loadComps
}
