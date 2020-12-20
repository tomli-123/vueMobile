import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
// 首页tab栏相关
import LayoutIndex from '@/views/layout'
import HomeIndex from '@/views/home'
import QuestionIndex from '@/views/question'
import VideoIndex from '@/views/video'
import store from '@/store'

const UserIndex = () => import('@/views/user')
// 一级路由页面
const Search = () => import('@/views/search')
const SearchResult = () => import('@/views/search/result.vue')
const Article = () => import('@/views/article')
const UserProfile = () => import('@/views/user/profile.vue')
const UserChat = () => import('@/views/user/chat.vue')

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/',
      component: LayoutIndex,
      children: [
        { path: '', component: HomeIndex, meta: { isKeepAlive: true } },
        { path: '/question', component: QuestionIndex },
        { path: '/video', component: VideoIndex },
        { path: '/user', component: UserIndex }
      ]
    },
    { path: '/search', component: Search },
    { path: '/searchResult', component: SearchResult },
    { path: '/article/:id', component: Article },
    { path: '/userProfile', component: UserProfile },
    { path: '/userChat', component: UserChat }
  ]
})
// PC管理系统: 除了登录页, 都要授权
// 移动端:
// 1. 有些页面要授权(用户中心, 购物车)
// 2. 有些页面不需要授权即可访问 (首页, 登录页, 文章列表页, 搜索页, 详情页...)
// 会拿一个数组, 存储需要授权的地址
const AuthUrls = ['/user', '/cart']

// 全局前置守卫: 所有的路由在真正被访问前, 都会先经过全局前置守卫, 让全局前置守卫放行了, 才会继续访问到路由
// 如果要去的页面, 是需要授权才能访问的页面, 那么就需要判断是否token
router.beforeEach((to, from, next) => {
  // 在登录被真正访问前, 也会先经过全局前置守卫, 判断有没有token
  // 只要有token就放进首页, 如果真是是过期的token, 那么在响应拦截器中也会处理, refresh_token过期,
  // 也会清除过期的token
  // 要授权的页面, 判断是否有token
  const token = store.state.tokenInfo.token
  // 如果发现过期的token, 一定要清
  if (to.path === '/login' && token) {
    // 登录过了, 放行, 直接去首页
    next('/')
    return
  }

  // 判断要去的页面, 是否需要授权
  if (AuthUrls.includes(to.path)) {
    if (token) {
      // 有token, 有票
      next()
    } else {
      // 想去需要授权的页面, 且没有token, 拦截到登录
      // next('/login')
      next({
        path: '/login',
        // 这里传递的参数, 会被拼接到跳转的路由上
        query: {
          a: 1,
          b: 2,
          backto: to.fullPath
        }
      })
    }
  } else {
    // 不需要授权即可访问
    next()
  }
})

export default router
