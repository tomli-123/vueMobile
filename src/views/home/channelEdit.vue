<template>
  <div class="channel-edit">
    <!-- 当前登陆用户已经订阅的频道 -->
    <div class="channel">
      <van-cell title="我的频道" :border="false">
        <van-button @click="editing=!editing" plain size="mini" type="danger">
          {{ editing ? '取消' : '编辑' }}
        </van-button>
      </van-cell>
      <van-grid>
        <van-grid-item :class="{ current: active === index }" @click="clickChannel(index)" v-for="(item, index) in channels" :key="item.id">
          <span>{{ item.name }}</span>
          <van-icon @click="clickDelChannel(item, index)" v-show="editing && index !== 0" name="cross" class="btn"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
     <!-- 当前登陆用户没有订阅的频道 (可选的频道) -->
    <div class="channel">
      <van-cell title="可选频道" :border="false"></van-cell>
      <van-grid>
        <van-grid-item @click="clickAddChannel(item)" v-for="item in optionalChannels" :key="item.id">
          <span>{{ item.name }}</span>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { reqSetChannels } from '@/api/channels.js'
export default {
  name: 'ChannelEdit',
  // props: ['active'],
  props: {
    active: {
      type: Number, // 限制传递过来的数据, 必须是number类型
      required: false, // 必填项, 必须父传子传递这个属性
      default: 0 // 默认值
    }
  },
  // 1. 想要用 vuex 中的我的频道的数据 用mapState映射
  // 2. 只要编辑栏目显示, 就需要拿到最新的全部栏目数据, 存到vuex中, 调用action
  computed: {
    ...mapState(['channels']),
    ...mapGetters(['optionalChannels'])
  },
  methods: {
    ...mapActions(['getAllChannelsAsync']),
    ...mapMutations(['addChannel', 'delChannel']),
    clickChannel (index) {
      // 在编辑状态, 直接return
      if (this.editing) return
      // 不在编辑状态, 点击时才跳转
      this.$emit('update-curchannel', index)
    },

    // 添加操作, 将点击选中的channel, 添加到vuex中的 channels中
    async clickAddChannel (channel) {
      // 要遵循单向数据流, vuex中的数据, 应该交给vuex自己去改
      // 添加操作, 加入到 vuex 中
      this.addChannel(channel)
      this.resetChannels()
    },

    // 删除操作, 将点击选中的channel, 从vuex中channels中移出对应项
    clickDelChannel (channel, index) {
      // 删除的就是高亮的项, 需要重置index为 0
      if (this.active === index) {
        this.$emit('update-active', 0)
      }
      // 删除的是前面的项, 需要将 this.active - 1
      if (index < this.active) {
        this.$emit('update-active', this.active - 1)
      }
      // vuex中的数据, 交给vuex自己去改
      this.delChannel(channel)
      this.resetChannels()
    },

    // 根据现有channels数据, 往后台发送重置式请求
    async resetChannels () {
      // 处理数据格式 [{ id: 0, name: xxx}] => [{ id: 0, seq: 0 }]
      const results = this.channels.map((item, index) => {
        return {
          id: item.id,
          seq: index
        }
      })
      // 重置我的频道时, 不需要加上推荐, 需要去掉, 就是去掉数组的第一项
      results.shift()

      // 同步到后台, 发送请求
      await reqSetChannels(results)
    }
  },
  created () {
    this.getAllChannelsAsync()
  },
  data () {
    return {
      editing: false // 没在编辑 (显示×号)
    }
  }
}
</script>

<style lang="scss" scoped>
.channel{
  padding:15px;
  font-size:14px;
  // scss 中深度作用选择器 ::v-deep  =>  /deep/ (less)
  ::v-deep .van-button--mini {
    height: 22px;
    min-width: 50px;
  }
  .btn {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 14px;
  }

  .current {
    color: #e5615b;
    font-weight: bold;
  }
}
</style>
