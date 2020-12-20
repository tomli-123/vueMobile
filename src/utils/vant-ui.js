// 这个文件专门用于按需导入 vant 中需要的组件
import Vue from 'vue'
import {
  Button,
  Switch,
  NavBar,
  CellGroup,
  Field,
  Toast,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  List,
  Cell,
  Grid,
  GridItem,
  Image as VanImage,
  PullRefresh,
  Lazyload,
  Popup,
  Icon,
  ActionSheet,
  Search,
  Loading,
  Divider,
  Tag,
  Row,
  Col,
  Dialog,
  DatetimePicker
} from 'vant'

Vue.use(DatetimePicker)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Row)
Vue.use(Col)
Vue.use(Divider)
Vue.use(Loading)
Vue.use(Search)
Vue.use(ActionSheet)
Vue.use(Icon)
Vue.use(Popup)
Vue.use(Lazyload)
Vue.use(PullRefresh)
Vue.use(VanImage)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Cell)
Vue.use(List)
Vue.use(Button)
Vue.use(Switch)
Vue.use(NavBar)
Vue.use(CellGroup)
Vue.use(Field)
Vue.use(Toast)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Tab)
Vue.use(Tabs)
