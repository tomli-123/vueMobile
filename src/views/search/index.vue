<template>
  <div class="search">
    <!-- 搜索组件一级路由   $router.back()返回上一个页面-->
    <van-nav-bar
      left-arrow
      title="搜索中心"
      @click-left="$router.back()">
    </van-nav-bar>

    <!-- https://youzan.github.io/vant/#/zh-CN/search -->
    <van-search
      show-action
      placeholder="请输入搜索关键词"
      shape="round"
      @input="getSuggestion"
      v-model.trim="keyword"
    >
      <template #action>
        <div @click="clickSearch">搜索</div>
      </template>
    </van-search>

    <!-- 联想建议 -->
    <van-cell-group v-if="keyword.trim() !== ''">
      <!-- icon="search" 添加了左侧的小图标 -->
      <van-cell @click="clickSuggestion(index)" v-for="(item,index) in showSuggestions" :key="index" icon="search">
        <div v-html="item"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <van-cell-group v-else>
      <van-cell v-if="history.length > 0" title="历史记录"></van-cell>
      <van-cell @click="clickHistory(item)" :title="item" v-for="(item, index) in history" :key="index">
        <van-icon @click.stop="delHistory(index)" name="close" />
      </van-cell>
    </van-cell-group>
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import { reqGetSuggestion } from '@/api/search.js'
import { getHistory, setHistory } from '@/utils/storage.js'
export default {
  name: 'Search',
  // 组件被构造时, 会自动调用data函数, 给组件提供数据
  data () {
    return {
      keyword: '', // 搜索关键字
      suggestions: [], // 联想建议  ['a', 'aa', 'A']
      history: getHistory(), // 搜索历史
      timeId: null
    }
  },
  methods: {
    // 获取联想推荐搜索词
    getSuggestion () {
      // 防抖处理: 特征, 延迟执行, 不会立刻执行, 会先等一等, 一段时间都没有再次触发, 才真正执行
      // 超过两秒用户都没有再输入了, 才真正的发送请求
      clearTimeout(this.timeId)
      this.timeId = setTimeout(async () => {
        if (this.keyword.trim() === '') {
          this.suggestions = []
          return
        }
        // console.log('获取联想记忆, 获取相关搜索项')
        const res = await reqGetSuggestion(this.keyword)
        this.suggestions = res.data.data.options
      }, 300)
    },

    // 点击搜索, 要加的历史, 是搜索关键字
    clickSearch () {
      // 如果点击搜索按钮时, 搜索框为空, 不需要添加历史, 直接return
      if (this.keyword.trim() === '') return
      // 添加历史记录
      this.addHistory(this.keyword)
    },

    // 点击推荐建议, 追加的应该是 suggestions 中的对应项
    clickSuggestion (index) {
      // 添加历史记录
      this.addHistory(this.suggestions[index])
    },

    // 点击历史记录, 同样也要更新历史记录
    clickHistory (item) {
      this.addHistory(item)
    },

    // 封装一个方法, 专门用于添加历史记录
    // 添加历史:
    // 1. 要添加到历史记录的最前面 unshift
    // 2. 如果有重复的, 要删除
    addHistory (words) {
      // 添加之前, 先判断, 有没有已经在历史记录中了
      // 如果有, 就将旧的删除
      const index = this.history.findIndex(item => item === words)
      if (index !== -1) {
        // 说明一定存在相同的项
        // arr.splice(从哪开始删, 删几个, 替换的项1, 替换的项2, ...)
        this.history.splice(index, 1)
      }
      // console.log('添加历史', words)
      this.history.unshift(words)
      setHistory(this.history)

      // 添加完历史, 立刻进行搜索跳转
      this.$router.push('/searchResult?keyword=' + words)
    },

    delHistory (index) {
      this.history.splice(index, 1)
      setHistory(this.history)
    }
  },
  // 1. 提供一个专门用于展示的计算属性
  // 2. 利用 v-html 进行渲染
  computed: {
    showSuggestions () {
      // 应该要对this.suggestions中的每一项, 都要进行替换处理, 如果是关键字需要高亮
      // 得到一个新数组, 专门用于展示 map, map会收集遍历时返回的每一项
      const results = this.suggestions.map(item => {
        // 将item字符串, 进行替换, 将替换的结果返回
        // item.replace(正则表达式, 函数)
        const regExp = new RegExp(this.keyword, 'gi')
        const newStr = item.replace(regExp, (match) => {
          return `<span style="color: red;">${match}</span>`
        })
        return newStr
      })
      return results
    }
  }
}
</script>

<style lang="" scoped>

</style>
