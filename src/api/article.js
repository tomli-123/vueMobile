// 这个文件封装所有和文章相关的请求
import http from '@/utils/request.js'

/**
 * 根据 id 和 时间戳, 获取推荐数据
 * @param {*} channelId 频道id, 哪个频道
 * @param {*} timestamp 时间戳 (根据当前的时间戳, 完成推荐的推送) 加载历史的推荐数据, 传入历史的时间戳
 * with_top: 是否包含置顶项, 0不包含置顶,  1包含置顶, 这边写死 1
 */
export const reqGetArticles = (channelId, timestamp) => {
  return http({
    method: 'get',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: 1
    }
  })
}

/**
 * 对文章不喜欢
 * @param {*} articleId 文章id
 */
export const reqDislikeArticle = (articleId) => {
  return http({
    method: 'post',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

/**
 * 举报文章
 * @param {*} target 文章id
 * @param {*} type 举报类型
 */
export const reqReportArticle = (target, type) => {
  return http({
    method: 'post',
    url: '/app/v1_0/article/reports',
    data: {
      target,
      type
    }
  })
}

/**
 * 获取文章详情数据
 * @param {*} articleId 文章id
 */
export const reqGetArticleDetail = (articleId) => {
  return http({
    method: 'get',
    url: `/app/v1_0/articles/${articleId}`
  })
}

/**
 * 对文章点赞
 * @param {*} articleId 文章id
 */
export const reqAddLike = (articleId) => {
  return http({
    method: 'post',
    url: '/app/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

/**
 * 对文章取消点赞
 * @param {*} articleId 文章id
 */
export const reqDelLike = (articleId) => {
  return http({
    method: 'delete',
    url: `/app/v1_0/article/likings/${articleId}`
  })
}

/**
 * 对文章不喜欢
 * @param {*} articleId 文章id
 */
export const reqAddDisLike = (articleId) => {
  return http({
    method: 'post',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

/**
 * 对文章取消不喜欢
 * @param {*} articleId 文章id
 */
export const reqDelDisLike = (articleId) => {
  return http({
    method: 'delete',
    url: `/app/v1_0/article/dislikes/${articleId}`
  })
}
