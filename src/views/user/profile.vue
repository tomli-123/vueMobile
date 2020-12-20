<template>
  <div class="profile">
    <!-- 导航条 -->
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料"></van-nav-bar>

    <!-- 编辑区 -->
    <van-cell-group>
      <!-- 隐藏域(hidden) -->
      <!-- hidden html表单元素的固有属性, 就类似于display: none的效果, 不占位置的 -->
      <input @change="updatePhoto" type="file" hidden ref="refPhoto">
      <van-cell @click="$refs.refPhoto.click()" is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>

      <van-cell is-link title="名称" :value="user.name" @click="clickShowName"/>
      <!-- gender 0 男, 1 女 -->
      <van-cell is-link title="性别" :value="user.gender === 0 ? '男' : '女'" @click="showGender=true"/>
      <van-cell is-link title="生日" :value="user.birthday" @click="clickShowBirthday"/>
    </van-cell-group>

    <!-- 修改姓名的对话框 -->
    <van-dialog @confirm="saveName" v-model="showName" title="修改昵称" show-cancel-button>
      <van-field v-model.trim="newName" placeholder="请输入昵称"></van-field>
    </van-dialog>

    <!-- 修改性别的弹出层 -->
    <van-popup v-model="showGender" position="bottom">
      <van-nav-bar title="修改性别" left-text="取消" @click-left="showGender=false">
      </van-nav-bar>
      <van-cell title="男" @click="saveGender(0)" is-link></van-cell>
      <van-cell title="女" @click="saveGender(1)" is-link></van-cell>
    </van-popup>

    <!-- 修改生日的弹出层 -->
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        @cancel="showBirthday = false"
        @confirm="saveBirthday"
        v-model="newDate"
        type="date"
        title="选择生日"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
  </div>
</template>

<script>
import { reqGetProfile, reqUpdateUserInfo, reqUpdatePhoto } from '@/api/user.js'
import dayjs from 'dayjs'

export default {
  name: 'userProfile',
  data () {
    return {
      // 控制弹层
      showName: false,
      showGender: false,
      showBirthday: false,
      // 当前用户的信息
      user: {},
      newName: '', // 用于存放编辑时的昵称
      minDate: new Date(1900, 1, 1), // 生日可选的最小值
      maxDate: new Date(), // 生日可选的最大值
      newDate: new Date() // 用户修改的个人生日
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      const res = await reqGetProfile()
      this.user = res.data.data
      console.log(res)
    },
    clickShowName () {
      // 显示修改姓名的对话框
      this.showName = true
      // 显示的同时, 需要显示原有的姓名
      this.newName = this.user.name
    },
    async saveName () {
      try {
        if (this.newName === '') return
        if (this.newName.length > 7) {
          this.$toast.fail('用户名长度不能超过7位字符')
          return
        }
        // 用户点了保存, 提交修改姓名的ajax
        await reqUpdateUserInfo({
          name: this.newName
        })
        // 更新页面
        this.user.name = this.newName
        this.$toast.success('修改成功')
      } catch {
        this.$toast.fail('用户名已存在, 请重新编辑')
      }
    },

    async saveGender (gender) {
      try {
        // 发送请求, 进行修改
        await reqUpdateUserInfo({
          gender
        })
        // 视图渲染
        this.user.gender = gender
        // 关闭弹框
        this.showGender = false
        // 提示
        this.$toast.success('修改成功')
      } catch {
        this.$toast.fail('修改失败')
      }
    },

    clickShowBirthday () {
      // 1. 显示生日的日期框
      this.showBirthday = true
      // 2. 数据回显, 将生日赋值给日期框 xxxx-xx-xx 这种格式组件不识别
      // 需要将字符串的日期, 转成标准的日期对象
      this.newDate = new Date(this.user.birthday)
    },
    async saveBirthday () {
      try {
        // 后台的需要的格式是 xxxx-xx-xx 需要dayjs进行转换格式
        const birthday = dayjs(this.newDate).format('YYYY-MM-DD')
        await reqUpdateUserInfo({
          birthday
        })
        // console.log(res, birthday)
        // 视图的渲染
        this.user.birthday = birthday
        // 关闭弹层
        this.showBirthday = false
        // 提示
        this.$toast.success('修改成功')
      } catch {
        this.$toast.fail('修改失败')
      }
    },

    async updatePhoto () {
      // input:file 框中, 有一个 files 属性(数组), 能够拿到选择的文件
      // console.dir(this.$refs.refPhoto)
      try {
        this.$toast.loading({
          duration: 0,
          overlay: true,
          message: '正在上传中...'
        })

        const file = this.$refs.refPhoto.files[0]
        const formData = new FormData()
        formData.append('photo', file)
        const res = await reqUpdatePhoto(formData)
        // 更新视图
        this.user.photo = res.data.data.photo
        // 提示用户
        this.$toast.success('上传成功')
      } catch {
        this.$toast.fail('上传失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.profile {
  ::v-deep .van-nav-bar__text {
    color: white;
  }
}
</style>
