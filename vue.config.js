// 覆盖默认的webpack配置
module.exports = {
  publicPath: './',
  devServer: {
    port: 3000,
    open: true,
    // 代理服务器的配置
    proxy: {
    // (标识) 要代理的路径 /api 开头就说明, 需要进行代理
    // /api/login => http://ttapi.research.itcast.cn/api/login
    // 需要配置 pathRewrite 路径重写, 去掉多余的标识符 /api
    // /api/login => http://ttapi.research.itcast.cn/login
      '/api': {
        target: 'http://ttapi.research.itcast.cn',
        pathRewrite: { '^/api': '' },
        secure: true, // 默认值  true
        changeOrigin: true // 默认值 true
      }
    }
  },
  // configureWebpack 配置是vuecli中提供的一个配置项, 用于对webpack打包做更加精细的控制
  configureWebpack: (config) => {
    // 如果是生产环境, 在打包之后的js中去掉console.log
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  }
}
