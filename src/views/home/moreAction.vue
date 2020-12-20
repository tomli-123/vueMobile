<template>
  <div class="more-action">
    <!-- 状态一 -->
    <van-cell-group v-if="!isReport">
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>

    <!-- 状态二 反馈-->
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell @click="$emit('report', item.value)" v-for="item in reportsList" :key="item.value">{{ item.label }}</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
// 需要展示举报的类型, 直接导入数据即可
import reportsList from '@/constant/reports.js'
export default {
  name: 'MoreAction',
  data () {
    return {
      isReport: false, // 是否是处于状态二：反馈
      reportsList
    }
  }
}
</script>

<style lang='scss' scoped>
.more-action {
  border-radius: 4px;
}
</style>
