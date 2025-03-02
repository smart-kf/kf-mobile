import Index from '../pages/index.vue'
import ErrorPage from '../pages/errorPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { checkIP } from '@/service/user.ts'

const routes = [
    { path: '/s/:pathMatch(.*)*', component: Index },
    { path: '/error', name: 'ErrorPage', component: ErrorPage },
]

// 集成vue路由,其实整合路由看vue-router的文档和自己用的组件库（Vant）就够了
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
    // 获取当前 URL 的code值
    let pathname = window.location.pathname;
    next();
});

export default router
