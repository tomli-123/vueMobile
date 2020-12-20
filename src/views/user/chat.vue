<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>

    <!-- 聊天主体区域  refList盒子.scrollTop = refList盒子.scrollHeight -->
    <div class="chat-list" ref="refList">
      <div class="chat-item" :class="item.name === 'xz' ? 'left' : 'right'" v-for="(item, index) in list" :key="index">
        <!-- 如果仅仅只是为了包裹一个盒子, 做v-if的判断处理, 可以包一个div, 多了一个层级, 也可以用template标签包裹一下, template不影响任何结构和样式 -->
        <!-- 里面渲染左边还是右边是不一样的 -->
        <!-- 显示成左侧小智同学 -->
        <template v-if="item.name === 'xz'">
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="chat-pao">{{ item.msg }}</div>
        </template>
        <!-- 显示成右侧用户记录 -->
        <template v-else>
          <div class="chat-pao">{{ item.msg }}</div>
          <van-image  fit="cover" round :src="user.photo" />
        </template>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="word" placeholder="说点什么...">
        <span  @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import { reqGetProfile } from '@/api/user.js'

export default {
  name: 'UserChat',
  data () {
    return {
      word: '',
      user: {},
      // list: [
      //   { name: 'xz', msg: '你好, 我是小智', timestamp: +new Date() },
      //   { name: 'me', msg: '你好, 我是切图仔', timestamp: +new Date() },
      //   { name: 'me', msg: '你在干嘛', timestamp: +new Date() },
      //   { name: 'xz', msg: '小智拍了拍你, 说: 干啥', timestamp: +new Date() }
      // ],
      list: [],
      isOpen: false,
      ws: null, // websocket对象
      timeId: null
    }
  },
  async created () {
    this.timeId = setInterval(() => {
      console.log('你好哇, 我是定时器')
    }, 1000)
    // 等加载完用户信息之后, 建立websocket连接
    // async 函数调用的返回值, 也是一个promise对象
    await this.loadUserProfile()
    // 建立连接
    this.openWS()
  },
  // 实例销毁的时候执行, 离开路由, 实例就会被销毁
  destroyed () {
    // console.log('实例被销毁了')
    this.ws.close()
    clearInterval(this.timeId)
    console.log('关闭连接')
  },

  methods: {
    openWS () {
      // 创建websocket对象创建连接
      this.ws = new WebSocket('wss://echo.websocket.org')
      // 添加连接的监听
      this.ws.onopen = () => {
        console.log('连接建立成功')
        this.isOpen = true
        // 就可以往list中添加一项, 模拟小智的初始化回复
        this.list.push({
          name: 'xz',
          msg: '你好, 我是小智, 我准备就绪了',
          timestamp: +new Date()
        })
      }
      // 添加消息的监听
      this.ws.onmessage = (e) => {
        // console.log('有新消息了', e.data)
        this.list.push({
          name: 'xz',
          msg: '小智拍了拍你的狗头, 说:' + e.data,
          timestamp: +new Date()
        })

        // 等页面结构更新完就立刻触发
        this.$nextTick(() => {
        // 让滚动条滚动到底部
          this.$refs.refList.scrollTop = this.$refs.refList.scrollHeight
        })
      }
      // 添加关闭连接的监听
      this.ws.onclose = () => {
        this.isOpen = false
        console.log('连接已断开')
      }
    },
    send () {
      // console.log(this.word)
      if (this.word === '') return
      this.ws.send(this.word)
      // vue是异步dom更新的, push完, 结构不会立刻更新的
      this.list.push({
        name: 'me',
        msg: this.word,
        timestamp: +new Date()
      })
      this.word = ''
      // 等页面结构更新完就立刻触发
      this.$nextTick(() => {
        // 让滚动条滚动到底部
        this.$refs.refList.scrollTop = this.$refs.refList.scrollHeight
      })
    },
    async loadUserProfile () {
      const res = await reqGetProfile()
      this.user = res.data.data
      console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
