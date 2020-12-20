/**
 * 这里封装用户相关的axios请求
 */
import http from '@/utils/request.js'

/**
 * 用户登录(注册) 从未登录过的用户, 后台会自动注册该账号(根据手机号注册的)
 * @param {*} mobile 手机号
 * @param {*} code 验证码 (暂时写死) 246810
 */
export const reqLogin = (mobile, code) => {
  return http({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}

/**
 * 获取用户个人信息 (编辑页, 进行基本渲染使用) 有头像, 有生日
 */
export const reqGetProfile = () => {
  return http({
    method: 'get',
    url: '/app/v1_0/user/profile'
  })
}

/**
 * 关注用户
 * @param {*} id 关注的用户的id
 */
export const reqFollow = (id) => {
  return http({
    method: 'post',
    url: '/app/v1_0/user/followings',
    data: {
      target: id
    }
  })
}

/**
 * 取消对于该id用户的关注
 * @param {*} id 取关用户的id
 */
export const reqUnFollow = (id) => {
  return http({
    method: 'delete',
    url: `/app/v1_0/user/followings/${id}`
  })
}

/**
 * 获取用户自己信息 (用户中心基本渲染) 包含关注数, 文章数等信息
 */
export const reqGetUser = () => {
  return http({
    method: 'get',
    url: '/app/v1_0/user'
  })
}

/**
 * 编辑用户的个人信息
 * @param {*} obj
 * {
 *   name: 昵称,     1-7位字符
 *   gender: 性别    0男, 1女
 *   birthday: 生日  格式: '2018-12-20'
 * }
 */
export const reqUpdateUserInfo = (obj) => {
  return http({
    method: 'patch',
    url: '/app/v1_0/user/profile',
    data: obj
  })
}

/**
 * 更新头像
 * @param {*} formData 传入一个formData, 利用formData收集图片的信息
 */
export const reqUpdatePhoto = (formData) => {
  return http({
    method: 'patch',
    url: '/app/v1_0/user/photo',
    data: formData
  })
}
