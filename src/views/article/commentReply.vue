<template>
<div class="article-comments">
    <!-- 导航栏 -->
    <van-nav-bar :title="comment.reply_count  + '条回复'">
      <van-icon @click="$emit('close')" slot="left" name="cross" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论 -->
    <van-cell title="当前评论">
      <van-image
        slot="icon"
        round
        width="30"
        height="30"
        style="margin-right: 10px;"
        :src="comment.aut_photo"
      />
      <span style="color: #466b9d;" slot="title">{{comment.aut_name}}</span>
      <div slot="label">
        <p style="color: #363636;">{{comment.content}}</p>
        <p>
          <span style="margin-right: 10px;">{{comment.pubdate | relative}}</span>
          <van-button
            size="mini"
            type="default"
          >回复 {{comment.reply_count}}</van-button>
        </p>
      </div>
      <van-icon slot="right-icon" />
    </van-cell>
    <!-- /当前评论 -->
    <van-divider>全部回复</van-divider>

    <!-- 对当前评论 回复列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
     >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">时间: {{item.pubdate | relative}}</span>
          </p>
        </div>
      </van-cell>
    </van-list>
    <!-- 回复列表 -->

    <!-- 发布回复 -->
    <van-cell-group class="publish-wrap">
      <van-field
        clearable
        placeholder="请输入回复内容"
        v-model="content"
      >
        <van-button
          slot="button"
          size="mini"
          type="info"
          @click="clickAddReply"
        >发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布回复 -->
</div>

</template>
<script>
// import { reqGetCommentsReply, reqAddCommentReply } from '@/api/comment.js'
import { reqAddCommentReply } from '@/api/comment.js'

export default {
  name: 'CommentReply',
  props: {
    comment: {
      type: Object,
      required: true
    },
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
      offset: null, // 记录下一页从哪开始
      content: ''
    }
  },
  methods: {
    // list组件的加载函数
    async onLoad () {
      console.log('发送请求-获取数据了')
      try {
        this.finished = true
        // console.log(reqGetCommentsReply)
        // // 获取数据
        // const res = await reqGetCommentsReply(this.comment.com_id.toString(), this.offset)
        // console.log(res)
        // // 将获取得到的数据存到 list
        // const arr = res.data.data.results
        // this.list = [...this.list, ...arr]
        // // 更新offset
        // this.offset = res.data.data.last_id
        // // 关闭loading状态
        // this.loading = false
        // // 判断数据是否加载完, 如果加载完, 将finished改成true
        // if (arr.length === 0) {
        //   this.finished = true
        // }
      } catch (e) {
        console.log(e)
      }
    },

    async clickAddReply () {
      // 发送请求, 进行添加操作
      const comId = this.comment.com_id.toString()
      const res = await reqAddCommentReply(comId, this.content, this.articleId)
      // 将后台返回的 new_obj 追加到 list 的前面
      this.list.unshift(res.data.data.new_obj)
      // 提示用户追加成功
      this.$toast.success('添加回复成功')
      // 输入框情况
      this.content = ''
    }
  }
}
</script>
<style lang="scss" scoped>
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
