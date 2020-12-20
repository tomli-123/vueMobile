<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="登录"/>

    <!-- 输入框 -->
    <van-cell-group>
      <van-field
        v-model="mobile"
        required
        label="手机号"
        placeholder="请输入手机号"
        :error-message="mobile_errmsg"
      />
      <van-field
        v-model="code"
        required
        label="验证码"
        placeholder="请输入验证码"
        :error-message="code_errmsg"
      />
    </van-cell-group>

    <div class="btn-wrap">
      <van-button @click="login" type="info">登录</van-button>
      <!-- <van-button @click="getInfo" type="primary">获取个人信息</van-button> -->
    </div>
  </div>
</template>

<script>
import { reqLogin, reqGetProfile } from '@/api/user.js'
import { mapMutations } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      mobile: '13912345678', // 可以是自己的手机号
      code: '246810', // 验证码固定
      mobile_errmsg: '',
      code_errmsg: ''
    }
  },
  methods: {
    ...mapMutations(['setTokenInfo']),

    // 自定义一个校验方法, 可以校验mobile和code的值,
    // 如果通过校验, 返回true, 如果不通过校验, 返回false
    validate () {
      // 如果没有通过校验, 提供错误消息
      // 如果通过了校验, 清掉错误消息, 让请求发送
      if (this.mobile.trim() === '') {
        this.mobile_errmsg = '手机号不能为空'
        return false
      }
      if (!/^1\d{10}$/.test(this.mobile)) {
        this.mobile_errmsg = '手机号必须是正确的11位格式'
        return false
      }
      this.mobile_errmsg = ''

      if (this.code.trim() === '') {
        this.code_errmsg = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.code)) {
        this.code_errmsg = '请输入正确的六位数字验证码'
        return false
      }
      this.code_errmsg = ''

      return true
    },
    async login () {
      // 登录之前做校验
      const flag = this.validate()
      if (!flag) return

      // 加载中提示
      this.$toast.loading({
        message: '拼命加载中...',
        forbidClick: true, // 禁止背景点击
        duration: 0, // 配置不自动消失
        overlay: true // 是否显示背景遮罩
      })

      try {
        // 发送登录请求的测试
        const res = await reqLogin(this.mobile, this.code)
        this.setTokenInfo(res.data.data)
        // 同时默认只能展示一个提示, 后面的提示会自动关闭掉前面的提示
        this.$toast.success('登录成功')
        // 跳转到首页(layout)
        // 尝试获取地址栏的参数
        const backto = this.$route.query.backto
        this.$router.push(backto || '/')
      } catch (e) {
        console.log(e)
        this.$toast.fail('手机号或者验证码有误')
      }
    },

    async getInfo () {
      const res = await reqGetProfile()
      console.log(res.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  .btn-wrap {
    padding: 20px;
    .van-button {
      width: 100%;
      height: 40px;
      border-radius: 5px;
    }
  }
}
</style>
