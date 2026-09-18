const path = require('path')
const express = require('express')
const { defineConfig } = require('@vue/cli-service')

// 商品图片、头像等静态资源在后端由 /upload_resources/** 提供；
// 开发期启用 Mock 时后端可能未启动，这里直接把仓库根目录的 upload_resources 挂到同一路径下。
const uploadResourcesDir = path.resolve(__dirname, '../upload_resources')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 管理端独立部署端口，区别于用户端 8080
    port: 8079,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      // 商品图片等静态资源由后端 /upload_resources/** 提供，开发期代理到后端
      '/upload_resources': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
    },
    setupMiddlewares(middlewares) {
      // 放在代理之前：本地存在该图片时直接返回，避免依赖后端
      middlewares.unshift({
        name: 'local-upload-resources',
        path: '/upload_resources',
        middleware: express.static(uploadResourcesDir)
      })
      return middlewares
    }
  }
})
