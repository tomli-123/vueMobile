// 跟搜索相关的所有请求
import http from '@/utils/request.js'

/**
 * 获取联想建议
 * @param {*} q 搜索前缀词句
 */
export const reqGetSuggestion = (q) => {
  return http({
    method: 'get',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

// 路由传参(vue的语法)
// 1. 动态路由  /product/:id   this.$route.params.id
// 2. 查询参数  /product?id=1  this.$route.query.id

// axios传参(传给后台) axios的语法
// 1. get/delete 请求时的参数, 在地址栏传递, 配置params传参
// 2. post/put/patch 请求时的参数, 在请求体传递, 配置data传参
/**
 * 获取搜索结果
 * @param {*} page 页码, 第几页
 * @param {*} q 搜索关键字
 */
export const reqGetSearchList = (page, q) => {
  return http({
    method: 'get',
    url: '/app/v1_0/search',
    params: {
      page,
      q
    }
  })
}
