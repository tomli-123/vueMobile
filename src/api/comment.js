// 评论相关的所有请求
import http from '@/utils/request.js'
/**
 * 添加评论
 * @param {*} articleId 文章id
 * @param {*} content 内容
 */
export const reqAddComment = (articleId, content) => {
  return http({
    method: 'post',
    url: '/app/v1_0/comments',
    data: {
      target: articleId,
      content
    }
  })
}

/**
 * 获取评论
 * @param {*} articleId 文章id, 要知道获取的是哪个文章的评论
 * @param {*} offset 偏移量, 如果不传, 加载第一页, 传入评论id, 决定下一页, 从哪条开始
 */
export const reqGetComments = (articleId, offset) => {
  return http({
    method: 'get',
    url: '/app/v1_0/comments',
    params: {
      type: 'a',
      source: articleId,
      offset
    }
  })
}

/**
 * 获取评论回复列表
 * @param {*} comId 评论的id, 获取的是哪个评论的回复列表
 * @param {*} offset 偏移量, 如果不传, 加载第一页, 传入评论id, 决定下一页, 从哪条开始
 */
export const reqGetCommentsReply = (comId, offset) => {
  return http({
    method: 'get',
    url: '/app/v1_0/comments',
    params: {
      type: 'c',
      source: comId,
      offset
    }
  })
}

/**
 * 给评论添加回复
 * @param {*} comId 评论的id, 回复的是哪个评论
 * @param {*} content 回复的内容
 * @param {*} articleId 属于哪个文章
 */
export const reqAddCommentReply = (comId, content, articleId) => {
  return http({
    method: 'post',
    url: '/app/v1_0/comments',
    data: {
      target: comId,
      content,
      art_id: articleId
    }
  })
}
