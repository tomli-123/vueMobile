import Vue from 'vue'
import Vuex from 'vuex'
import { setToken, getToken, removeToken } from '@/utils/storage.js'
import { reqGetChannels, reqGetAllChannels } from '@/api/channels.js'
Vue.use(Vuex)

export default new Vuex.Store({
  // 准备state数据
  state: {
    // 这里的初始值, 也不能为空, 需要从本地的localStorage中拿
    tokenInfo: getToken(),
    channels: [], // 我的频道
    allChannels: [] // 全部的频道
  },
  mutations: {
    // 设置tokenInfo这个对象, 对象中有token信息
    setTokenInfo (state, tokenObj) {
      state.tokenInfo = tokenObj
      // 一更新token, 就往本地存一份, 本地就可以实时的同步到vuex的数据
      setToken(tokenObj)
    },
    // 移出tokenInfo的信息, 恢复成空对象
    removeToken (state) {
      state.tokenInfo = {}
      // 更新到本地, 本地可以清掉token信息
      removeToken()
    },
    // 设置channels数据 (给我什么channels数组, 就设置什么)
    setChannels (state, channels) {
      state.channels = channels
    },
    // 往channels后面追加一项
    addChannel (state, channel) {
      state.channels.push(channel)
    },
    // 删除一项
    delChannel (state, channel) {
      state.channels = state.channels.filter(item => item.id !== channel.id)
    },

    // 设置allChannels数据 (给我什么channels数组, 就设置什么)
    setAllChannels (state, allChannels) {
      state.allChannels = allChannels
    }
  },
  // actions 中, 不能直接操作 state, 要交给 mutation 去修改
  actions: {
    // 获取channels数据, 存到vuex中
    async getChannelsAsync (context) {
      // 发送请求, 获取channels的数据
      const res = await reqGetChannels()
      context.commit('setChannels', res.data.data.channels)
    },

    // 获取allChannels全部频道数据, 存到vuex中
    async getAllChannelsAsync (context) {
      const res = await reqGetAllChannels()
      context.commit('setAllChannels', res.data.data.channels)
    }
  },
  // getters: 基于state派生出来一些属性, 只要state中相关的数据变化了, getters也会自动更新
  getters: {
    // 可选频道
    optionalChannels: (state) => {
      // 我的频道 state.channels
      // 全部频道 state.allChannels
      // 可选频道 = 全部频道 - 我的频道
      // 遍历全部频道, 如果这一项, 在我的频道中出现过了, 就不要了
      // -----------------------------------------------------------------
      // const arr = []
      // state.allChannels.forEach(item => {
      //   // 判断 item 在我的频道中是否出现过
      //   // 尝试能找到 id 相同的项
      //   const index = state.channels.findIndex(channel => channel.id === item.id)
      //   // 如果能找到 id 相同的项, 说明出现过了
      //   if (index === -1) {
      //     // 没找到
      //     arr.push(item)
      //   }
      // })
      // -----------------------------------------------------------------
      // 编程能力(对于数据格式的处理, 慢慢积累)
      const arr = state.allChannels.filter(item => {
        // item 如果在 channels 中不存在, 就需要保留下来
        // 尝试能找到 id 相同的项
        const index = state.channels.findIndex(channel => channel.id === item.id)
        // index 只要是 -1 表示不存在, 才保留
        return index === -1
      })
      return arr
    }
  }
})
