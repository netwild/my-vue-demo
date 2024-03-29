'use strict'
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  assetsDir: 'assets',
  productionSourceMap: false,
  chainWebpack (config) {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  // css: {
  //   requireModuleExtension: false,
  //   loaderOptions: {
  //     sass: {
  //       additionalData: '@import "@/assets/style/common.scss";'
  //     }
  //   }
  // }
}
