<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item) in list"
        :key="item.com_id.toString()"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{ item.aut_name }}</span>
        <div slot="label">
          <p style="color: #363636;">{{ item.content }}</p>
          <p>
            <span style="margin-right: 10px;">{{ item.pubdate | relative }}</span>
            <van-button @click="clickShowReply(item)" size="mini" type="default">回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" :name="item.is_liking ? 'like' : 'like-o'" />
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field
        clearable
        placeholder="请输入评论内容"
        v-model="content"
      >
        <van-button @click="addComment" slot="button" size="mini" type="info">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->

    <van-popup position="bottom" :style="{ height: '80%' }" round v-model="isShowReply">
      <!-- 在弹出层中, 展示 commentReply -->
      <comment-reply v-if="isShowReply" @close="isShowReply = false" :article-id="articleId" :comment="currentComment">
      </comment-reply>
    </van-popup>

  </div>
</template>

<script>
import { reqAddComment, reqGetComments } from '@/api/comment.js'
import CommentReply from './commentReply.vue'

export default {
  name: 'ArticleComment',
  // props: ['article-id'],
  components: {
    CommentReply
  },
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      content: '',
      offset: null, // 默认null, 表示加载第一页
      isShowReply: false,
      currentComment: {} // 记录当前正在被回复的评论
    }
  },

  methods: {
    async onLoad () {
      try {
        // console.log('需要加载更多了')
        // 发送请求获取数据
        const res = await reqGetComments(this.articleId, this.offset)
        const arr = res.data.data.results
        console.log(arr)
        // 将数组存起来
        this.list = [...this.list, ...arr]
        // 将last_id 更新到 offset 中, 以便下一次请求下一页的数据
        this.offset = res.data.data.last_id
        // 请求结束, 关闭加载中的状态
        this.loading = false
        // 如果数据加载完了, finished改成true
        if (arr.length === 0) {
          this.finished = true
        }
      } catch (e) {
        console.log(e)
      }
    },

    async addComment () {
      // console.log('添加评论', this.articleId, this.content)
      if (this.content.trim() === '') return
      try {
        const res = await reqAddComment(this.articleId, this.content)
        this.$toast.success('评论成功')
        // 将用户的评论数据, 添加到list的最前面
        this.list.unshift(res.data.data.new_obj)
        this.content = ''
      } catch (e) {
        console.log(e)
        this.$toast.fail('操作失败, 评论已关闭')
      }
    },

    clickShowReply (comment) {
      // console.log('该显示弹框了')
      // 1. 显示弹框
      this.isShowReply = true
      // 2. 记录点击的是哪个, 记录到currentComment
      this.currentComment = comment
    }
  }
}
</script>

<style scoped lang='scss'>
// 发表评论的区域是固定在下端的
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
// 给发表评论区空出地方
.van-list {
  margin-bottom: 45px;
}
</style>
