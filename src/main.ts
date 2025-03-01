import { createApp } from 'vue'
import 'vant/es/toast/style'
import App from './App.vue'

import Vant from 'vant'
import 'vant/lib/index.css'
import router from './router'
import '@/styles/index.less'

// 更改成全部导入组件
const app = createApp(App)
app.use(Vant)

app.use(router)

app.mount('#app')
