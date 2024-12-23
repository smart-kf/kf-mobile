import { createApp } from 'vue'
import 'vant/es/toast/style'
import App from './App.vue'
import * as VueRouter from 'vue-router'
import Vant from 'vant'
import 'vant/lib/index.css'
import routes from './router'

// 更改成全部导入组件
const app = createApp(App)
app.use(Vant)

// 集成vue路由,其实整合路由看vue-router的文档和自己用的组件库（Vant）就够了
const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

app.use(router)

app.mount('#app')
