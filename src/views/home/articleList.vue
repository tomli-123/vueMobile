<template>
  <div class="article-list" @scroll="scroll" ref="articleList">
    <!--
      列表容器: van-list
      1. 数据项在 list 中, 且起始的list为空数组
      2. van-list特性
         (1) list中的数据不足以撑满一个屏幕, 一进入页面, 默认会加载更多, 执行onLoad函数
             会一直发送请求, 直到数据撑满屏幕了
         (2) 当用户滑动到底部, 触底时, 也会加载更多, 执行onLoad函数

      3. 关键属性:
         (1) loading: 布尔值, 标记了当前 van-list 是否在加载中...
             - 只要 onLoad 函数一触发, 会自动将 loading 值改成 true
             - 如果数据回来了, 需要手动, 将loading值 改回false, 表示数据已经加载完成

         (2) finished: 是否已完成, 标记数据是否全部加载完了
             - 在数据回来后, 需要判断一下数据是否全部加载完了
             - 如果全部加载完成, 就需要将 finished 改成 true
             - 一旦finished改成true, 那么就不会再触发onLoad函数了
     -->
    <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell @click="$router.push('/article/' + item.art_id.toString())" v-for="item in list" :key="item.art_id.toString()" :title="item.title">
          <template #label>
            <van-grid :column-num="item.cover.images.length">
              <van-grid-item v-for="(img, index) in item.cover.images" :key="index" icon="photo-o" text="文字" >
                <van-image lazy-load :src="img"></van-image>
              </van-grid-item>
              <div class="meta">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}} 评论</span>
                <span>{{item.pubdate | relative }}</span>
                <div v-if="tokenInfo.token" @click.stop="close(item)" class="right-icon">
                  <van-icon name="cross" />
                </div>
              </div>
            </van-grid>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { reqGetArticles } from '@/api/article.js'
import { mapState } from 'vuex'
// import { formatTime, getRelativeTime } from '@/utils/date-time.js'
export default {
  name: 'ArticleList',
  created () {
    console.log('created')
    // console.log('我是文章列表, 我被加载了')
    // console.log(formatTime(+new Date()))
    // console.log(getRelativeTime(+new Date() - 10 * 1000 * 60))

    // 给bus注册事件
    this.$eventBus.$on('del-article', (obj) => {
      // console.log(obj)
      // 父组件发布了一个消息, 所有的article-list都能接收到, 判断是不是他的操作
      // 多个artcile-list都能接收到发布的消息
      // 1. 根据 channelId, 判断, 是不是我要进行操作
      // 2. 根据 articleId, 进行具体的删除
      if (obj.channelId !== this.channel.id) {
        // console.log('与我无关')
        return
      }
      // 根据articleId从list中, 过滤掉对应的项, 保留不是该id的所有项
      this.list = this.list.filter(item => item.art_id.toString() !== obj.articleId)
    })
  },
  activated () {
    console.log('激活了')
    // 恢复滚动距离
    this.$refs.articleList.scrollTop = this.scrollTop
  },
  deactivated () {
    console.log('停用了')
  },
  props: ['channel'],
  data () {
    return {
      timestamp: null,
      list: [],
      loading: false,
      finished: false,
      isRefreshing: false, // 是否在下拉刷新中
      scrollTop: 0 // 记录当前articleList组件卷去的高度
    }
  },
  methods: {
    // onload什么时候触发:
    // (1) 一进入页面, 发现数据不够, 就会触发
    // (2) 往上滑动, 滑动到底部时, 自动触发
    async onLoad () {
      console.log('加载更多了')
      if (!this.timestamp) {
        // 初始化时间戳
        this.timestamp = +new Date()
      }

      // 1. 发送请求获取数据
      const res = await reqGetArticles(this.channel.id, this.timestamp)
      // 更新时间戳, 存储后台返回的下一页推荐对应的时间戳
      this.timestamp = res.data.data.pre_timestamp

      // 2. 将数据追加到原有的数据的后面
      const arr = res.data.data.results
      this.list = [...this.list, ...arr]

      // 3. 如果数据加载完成, 手动将loading值, 改成false
      this.loading = false

      // 4. 如果数据全部加载完了, 没了, 将finished, 改成true
      if (arr.length === 0) {
        this.finished = true
      }
    },

    // 用户下拉的时候执行
    async onRefresh () {
      // console.log('下拉刷新了')
      // 1. 发送请求, 拉取最新的数据, 重新展示 (基于当前的时间戳)
      const res = await reqGetArticles(this.channel.id, +new Date())
      // 2. 更新时间戳 (决定刷新后, 下一页, 应该加载哪些数据)
      this.timestamp = res.data.data.pre_timestamp
      // 3. 更新列表数据
      this.list = res.data.data.results
      // 4. 将刷新状态关闭
      this.isRefreshing = false
      // 5. 提示用户, 刷新成功
      this.$toast.success('刷新成功')

      // 在调用一下 onLoad, 防止数据不满一屏幕, 不触发 onLoad
      this.onLoad()
    },

    close (item) {
      this.$emit('show-more', item.art_id.toString())
    },

    scroll (e) {
      // 将你已经滚动的距离, 记录到this.scrollTop中
      // console.log('滚动了', e.target.scrollTop)
      this.scrollTop = e.target.scrollTop
    }
  },
  computed: {
    ...mapState(['tokenInfo'])
  }
}
</script>

<style lang="scss" scoped>
.article-list {
  height: 100%;
  overflow: auto; // 将来内容溢出article-list, 就会以滚动条显示 overflow: scroll;
  ::v-deep .van-list {
    padding-bottom: 100px;
  }
  .meta {
    width: 100%;
    span {
      margin-right: 10px;
    }
    .right-icon {
      float: right;
      margin-top: 3px;
      margin-right: 3px;
    }
  }
}
</style>
