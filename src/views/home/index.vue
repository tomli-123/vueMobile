<template>
  <div class="home">
    <!-- 顶部tab栏 -->
    <!-- title 标题-->
    <!-- 每一个 van-tab 就是一个面板 -->
    <!--
        1. van-tabs 只有点到了对应的 tab, 才会去加载对应tab的内容
        2. 并且 van-tabs 会默认帮你缓存已经加载过的结果 (非常利于性能优化)
    -->
    <!-- v-model 绑定的就是高亮的 tab 栏的下标 -->
    <van-tabs v-model="active">
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <article-list @show-more="handleShowmore" :channel="item"></article-list>
      </van-tab>
    </van-tabs>

    <!-- 固定定位的小图标 -->
    <div class="bar-btn" @click="showChannelEdit = true">
      <van-icon name="wap-nav"/>
    </div>

    <!-- 共用一个弹出层 -->
    <van-popup v-model="showMore" :style="{ width: '60%' }">
      <more-action ref="refMoreAction" @report="report" @dislike="dislike"></more-action>
    </van-popup>

    <!-- action-sheet 底部栏目管理的面板 -->
    <van-action-sheet v-model="showChannelEdit" title="频道管理">
      <channel-edit @update-active="updateActive" :active="active" @update-curchannel="updateCurrentChannel"></channel-edit>
    </van-action-sheet>
  </div>
</template>

<script>
import { reqDislikeArticle, reqReportArticle } from '@/api/article.js'
import ArticleList from './articleList.vue'
import MoreAction from './moreAction.vue'
import ChannelEdit from './channelEdit.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // tabs组件正在高亮的下标
      showMore: false, // 默认隐藏
      articleId: null, // 存储正在操作的文章的 id
      showChannelEdit: false // 是否展示编辑栏目的面板
    }
  },
  created () {
    this.getChannelsAsync()
  },
  computed: {
    ...mapState(['channels'])
  },
  methods: {
    ...mapActions(['getChannelsAsync']),
    handleShowmore (articleId) {
      // 让moreAction显示 (vue是异步dom更新的, vue不会每一行执行完都去更新一下页面)
      // vue会等主线程代码执行完, 统一更新
      this.showMore = true
      this.articleId = articleId

      // 在moreAction显示的同时, 需要将isReport改成false
      // 为什么没有找到, 因为moreAction还没有显示
      // 等vue dom更新完, 再执行这句话
      // setTimeout(() => {
      //   this.$refs.refMoreAction.isReport = false
      // }, 20)
      // -----------------------------------------------------
      // vue专门提供了一个语法: this.$nextTick(函数), 这个函数会在vue dom更新完, 立刻执行
      this.$nextTick(() => {
        this.$refs.refMoreAction.isReport = false
      })
    },

    // 处理不感兴趣
    async dislike () {
      // 1. 发送请求
      await reqDislikeArticle(this.articleId)
      // 2. 关闭弹框
      this.showMore = false
      // 3. 删除数据, 给子组件, 发布消息, 传递 channel_id, articleId
      this.$eventBus.$emit('del-article', {
        channelId: this.channels[this.active].id,
        articleId: this.articleId
      })
    },

    // 举报
    async report (value) {
      // 1. 调用接口
      await reqReportArticle(this.articleId, value)
      // 2. 退出弹层
      this.showMore = false
      // 3. 删除文章
      this.$eventBus.$emit('del-article', {
        channelId: this.channels[this.active].id,
        articleId: this.articleId
      })
    },

    updateCurrentChannel (index) {
      // 更新高亮的栏目
      this.active = index
      // 关闭弹框
      this.showChannelEdit = false
    },

    updateActive (index) {
      this.active = index
    }
  },
  components: {
    ArticleList,
    MoreAction,
    ChannelEdit
  }
}
</script>

<style lang="scss" scoped>
// css3 中, 新出了两个单位, vh vw
// vh (viewport height) 100vh 就是一个屏幕的高
// vw (viewport width)  100vw 就是一个屏幕的宽
.home {
  height: 100vh;
  padding-top: 46px;
  box-sizing: border-box;
  overflow: hidden;
  .van-tabs {
    height: 100%;
    padding-top: 50px;
  }
  // 频道管理的开关按钮
  .bar-btn {
    position: fixed;
    right: 5px;
    top: 57px;
    display: flex;
    align-items: center;
    background-color: #fff;
    opacity: 0.8;
    z-index:1;
    .van-icon-wap-nav{
      font-size: 20px;
    }
  }
}
</style>

<style lang="scss">
// 深度作用选择器, /deep/ (less) scoped: 只能作用于当前组件模板中的内容, 无法往下渗透到子组件的!
// sass/scss     ::v-deep
.home {
  // 导航部分
  .van-tabs__wrap {
    position:fixed;
    top: 46px;
    left: 0px;
    // right 30px 是为了预留, 将来编辑频道的小图标的位置
    right: 30px;
  }
  .van-tabs__content {
    height: 100%;
    .van-tab__pane {
      height: 100%;
    }
  }
  .van-tabs__line {
    background-color: #3196fa;
  }
}
</style>
