import axios from 'axios'
import store from '@/store'
import router from '@/router'
import JSONbig from 'json-bigint'
// 基于原本的axios功能, 扩展一些默认配置, 创建一个axios实例
const http = axios.create({
  // 基准地址  /api/login => http:xxx/login
  baseURL: '/api',
  // 配置大数的转换处理
  transformResponse: [function (data) {
    // data => 原始的后台返回的 json 字符串数据
    // 这里的方法, 会覆盖axios默认对于返回结果的处理, 默认进行的是 JSON.parse
    // 需要进行的是 JSONbig.parse
    // 后台返回的有可能不是 json字符串, JSONbig 解析就会报错, 不合理的, 需要处理
    try {
      return JSONbig.parse(data)
    } catch (err) {
      // 如果解析不了, 说明不是json格式, 原样输出
      return data
    }
  }]
})

// 配置axios请求拦截器: 所有的axios请求, 在真正发送出去之前, 都会先经过请求拦截器
// 可以在请求拦截器中, 统一的携带token
http.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = store.state.tokenInfo.token
  // 有token才传递, 没token不传递
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use(function (response) {
  // 对响应数据做点什么 (成功响应) response 就是成功的响应 res
  return response
}, async function (error) {
  // 对响应错误做点什么 (失败响应) 处理401错误
  // console.dir(error)
  if (error.response.status === 401) {
    console.log('token过期了, 一小时过去了, 需要通过refresh_token去刷新token')
    // 获取 refresh_token, 判断是否存在, 存在就去刷新token
    const refreshToken = store.state.tokenInfo.refresh_token
    if (refreshToken) {
      try {
        console.log('存在refreshToken, 需要进行刷新token操作')
        // (1) 发送请求, 进行刷新token操作, 获取新的token
        // 注意: 这边发请求, 不用http实例, 用它会自动在请求前帮你携带token(会覆盖你的refresh_token)
        // 这边, 直接用 axios 发送请求
        const res = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          // 请求头中携带refresh_token信息
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        })
        const newToken = res.data.data.token
        // (2) 将新token更新到vuex中
        store.commit('setTokenInfo', {
          refresh_token: refreshToken,
          token: newToken
        })
        // (3) 重新发送刚才的请求, http, 自动携带token (携带的是新token)
        //     error.config就是之前用于请求的配置对象, 可以直接给http使用
        return http(error.config)
      } catch {
        // refresh_token 过期了, 跳转到登录页
        // 清除过期的token对象
        store.commit('removeToken')
        // 跳转到登录页, 跳转完, 将来跳回来
        router.push({
          path: '/login',
          query: {
            backto: router.currentRoute.fullPath
          }
        })
      }
    } else {
      // 没有refreshToken, 直接去登录, 将来还能跳回来
      // router.currentRoute 指向当前路由信息对象 === 等价于之前页面中用的 this.$route
      // 清除本地token, 跳转登录 (无意义的本地token内容, 要清除)
      store.commit('removeToken')
      router.push({
        path: '/login',
        query: {
          backto: router.currentRoute.fullPath
        }
      })
    }
  }
  return Promise.reject(error)
})

export default http
