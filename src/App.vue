<template>
  <div id="app">
    <!-- 需要缓存的组件, 将来就会配置到 keep-alive 中显示 -->
    <keep-alive>
      <router-view v-if="$route.meta.isKeepAlive"></router-view>
    </keep-alive>
    <!-- 其他组件, 应该在keep-alive的外面, 应该正常显示 -->
    <router-view v-if="!$route.meta.isKeepAlive"></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
// sass 有两种语法:
// 1 .sass(旧) 必须省略 {} 和 ;   插件 sass 安装后, 就有高亮
//    这种语法 和 stylus 非常相近
// 2 .scss(新)
//    这种语法 和 less 非常相近, 声明变量 scss => $,  less => @

// sass 的语法
// #app
//   background-color: skyblue
//   .my-btn
//     width: 200px
//     height: 50px
//     background-color: pink
//     border-radius: 2px

// rem布局 => 1rem 换算成当前的 html 根的 font-size
// 这个font-size不能写死, 当屏幕变化时, html font-size 也要变化
// 使用 rem 布局(原理):
// 1. 单位 => 使用 rem 作为单位, 相对于 html font-size 计算
// 2. 动态的修改 html font-size
// html {
//   font-size: 50px;
// }

// scss 的语法
// 当配置好了 rem 后, 你的眼中, 应该只有需要适配的标准屏!!! 眼中目前只有 375的屏
// $color: skyblue;
// #app {
//   background-color: $color;
//   .my-btn {
//     // 这里写的所有像素, 都指的是在 375 标准屏幕中的像素
//     width: 375px;
//     height: 100px;
//     background-color: pink;
//     border-radius: 4px;
//     font-size: 12px;
//   }
// }

</style>
