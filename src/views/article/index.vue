<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="文章详情"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 loading  就是一个大图标 -->
    <van-loading class="article-loading" v-if="loading" />
    <!-- /加载中 loading -->

    <div v-else>
      <!-- 文章详情 -->
      <div class="detail">
        <h3 class="title">{{ article.title }}</h3>
        <div class="author">
          <van-image :src="article.aut_photo" round width="1rem" height="1rem" fit="fill" />
          <div class="text">
            <p class="name">{{ article.aut_name }}</p>
            <p class="time">{{ article.pubdate | relative }}</p>
          </div>
          <van-button
            @click="toggleFollow"
            round
            size="small"
            type="info"
          >{{ article.is_followed ? '取关' : '+ 关注' }}</van-button>
        </div>
        <div class="content" v-html="article.content"></div>
        <van-divider>END</van-divider>
        <div class="zan">
          <van-button
            @click="toggleLike"
            round
            size="small"
            hairline
            type="primary"
            plain
            :icon="article.attitude === 1 ? 'good-job' : 'good-job-o'">
            {{ article.attitude === 1 ? '取消点赞' : '点赞' }}
          </van-button>

          &nbsp;&nbsp;&nbsp;&nbsp;
          <van-button @click="toggleDislike" round size="small" hairline type="danger" plain icon="delete">
            {{ article.attitude === 0 ? '取消不喜欢' : '不喜欢' }}
          </van-button>
        </div>
      </div>
      <!-- /文章详情 -->

      <!-- 文章评论列表 -->
      <article-comment :article-id="$route.params.id"></article-comment>
      <!-- /文章评论列表 -->
    </div>
  </div>
</template>

<script>
import { reqGetArticleDetail, reqDelLike, reqAddLike, reqDelDisLike, reqAddDisLike } from '@/api/article.js'
import { reqFollow, reqUnFollow } from '@/api/user.js'
import ArticleComment from './comment.vue'

export default {
  name: 'ArticleIndex',
  data () {
    return {
      loading: true, // 控制加载中的 loading 状态
      article: {} // 默认空对象
    }
  },
  components: {
    ArticleComment
  },
  created () {
    // 加载文章的数据
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      // 发送请求获取数据
      const res = await reqGetArticleDetail(this.$route.params.id)
      // 存数据
      this.article = res.data.data
      // 将loading状态关闭
      this.loading = false

      console.log(this.article)
    },
    // 切换关注状态
    async toggleFollow () {
      try {
        // 问题: 如何区分, 进行的是取关操作 还是关注操作?
        if (this.article.is_followed) {
          // 关注了, 进行的是取关操作
          await reqUnFollow(this.article.aut_id)
          this.$toast.success('取关成功')
        } else {
          // 没关注, 进行的是关注操作
          await reqFollow(this.article.aut_id)
          this.$toast.success('关注成功')
        }
        // 这里都操作成功了, 没有必要为了改个布尔值, 再重新发次请求, 可以直接自己更新即可
        this.article.is_followed = !this.article.is_followed
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    },
    // 切换点赞状态 1点赞了, 取消就是恢复成 -1
    async toggleLike () {
      try {
        // 判断进行的是点赞还是取消点赞
        if (this.article.attitude === 1) {
          // 进行的是取消点赞
          await reqDelLike(this.article.art_id.toString())
          this.$toast.success('取消点赞成功')
          this.article.attitude = -1
        } else {
          // 进行的是点赞操作
          await reqAddLike(this.article.art_id.toString())
          this.$toast.success('点赞成功')
          this.article.attitude = 1
        }
      } catch (e) {
        console.log(e)
        this.$toast.fail('操作失败')
      }
    },
    // 切换不喜欢的状态 0不喜欢了, 取消就是恢复成 -1
    async toggleDislike () {
      try {
        // 判断进行的是不喜欢 还是取消不喜欢
        if (this.article.attitude === 0) {
          // 进行的是取消不喜欢
          await reqDelDisLike(this.article.art_id.toString())
          this.$toast.success('取消不喜欢')
          this.article.attitude = -1
        } else {
          // 进行的是不喜欢操作
          await reqAddDisLike(this.article.art_id.toString())
          this.$toast.success('操作成功')
          this.article.attitude = 0
        }
      } catch (e) {
        console.log(e)
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.article-container{
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error{
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan{
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    font-size:14px;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    ::v-deep img{
      max-width:100%;
      background: #f9f9f9;
    }
  }
}
</style>
