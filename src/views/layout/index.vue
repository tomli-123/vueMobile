<template>
  <div class="layout-container">
    <van-nav-bar fixed v-if="$route.path !== '/user'">
      <!-- #left => v-slot:left 的简写 -->
      <template #left>
        <div @click="$router.push('/')" class="logo"></div>
      </template>
      <template #right>
        <van-button
          @click="$router.push('/search')"
          class="search-btn"
          round
          type="info"
          size="small"
          icon="search">
          搜索
        </van-button>
      </template>
    </van-nav-bar>

    <router-view></router-view>

    <van-tabbar route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex'
}
</script>

<style lang="scss">
.layout-container {
  // logo区域
  // 在css中加载图片等内容, 需要在 @ 前面补上 ~, 否则将无法识别 @
  .logo {
    background: url("~@/assets/logo.png") no-repeat;
    background-size: cover;
    width: 100px;
    height: 30px;
    transform: scale(1.2);
  }
  // 搜索按钮
  .search-btn {
    background-color: #5babfb;
    width: 100px;
    font-size: 14px;
    .van-icon {
      color: #fff;
    }
  }
}
</style>
