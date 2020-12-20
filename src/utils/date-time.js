// 这个文件中, 会封装一些用于处理时间的一些格式化方法
// dayjs 轻量的日期格式化插件 (体积小, 适合移动端)
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // 增强dayjs的功能
// 处理语言格式问题
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // 全局使用语言包

// 1. 基本格式化日期的方法, 传入日期/日期字符串/时间戳, 输出: 标准的 2020年xx月xx日 xx:xx:xx
export function formatTime (val) {
  return dayjs(val).format('YYYY年MM月DD日 HH:mm:ss')
}

// 2. 相对时间, 传入时间, 会和现在的时间进行计算, 得到一个相对的时间
//    to  会显示 ...内 (计算将来的时间)
//    dayjs(时间).to(时间)  算两个时间差, 得到结果,  xx分钟内
//    dayjs(时间).toNow()   和当前时间, 计算计算差, 得到结果,   xx分钟内

//    from 会显示 ...前 (过去的时间)
//    dayjs(时间).from(时间)  算两个时间差, 得到结果,  xx分钟外
//    dayjs(时间).fromNow()   和当前时间, 计算计算差, 得到结果,   xx分钟外 xx天前
export function getRelativeTime (val) {
  return dayjs(val).fromNow()
}
