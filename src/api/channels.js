// 存放所有与频道相关的请求 (获取, 添加, 删除...)
import http from '@/utils/request.js'

/**
 * 获取用户频道信息
 */
export const reqGetChannels = () => {
  return http({
    method: 'get',
    url: '/app/v1_0/user/channels'
  })
}

/**
 * 获取全部的频道信息
 */
export const reqGetAllChannels = () => {
  return http({
    method: 'get',
    url: '/app/v1_0/channels'
  })
}

/**
 * 重置我的频道, 需要传入我的频道数组
 * @param {*} channels 数组  [{ id: 0, seq: 0 }, { id: 1, seq: 1 }]
 * - id 频道id
 * - seq 顺序序号
 * 往后台传递channels之前, 需要给channels的每一项, 准备一个属性叫seq
 *
 * [{ id: 0, name: '推荐' }, { id: 1, name: "前端" }] => [{ id: 0, seq: 0 }, { id: 1, seq: 1 }]
 */
export const reqSetChannels = (channels) => {
  return http({
    method: 'put',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}
