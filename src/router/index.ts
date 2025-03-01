import Index from '../pages/index.vue'
import ErrorPage from '../pages/errorPage.vue'
import * as VueRouter from 'vue-router'
import { checkIP } from '@/service/user.ts'

const routes = [
    { path: '/', component: Index },
    { path: '/error', name: 'ErrorPage', component: ErrorPage },
]

// 集成vue路由,其实整合路由看vue-router的文档和自己用的组件库（Vant）就够了
const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})




// 全局前置守卫
router.beforeEach(async(to, from, next) => {
    // 获取当前 URL 的code值
    const queryString = window.location.href.split('?')[1];
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    console.log('to.path:',to.path);
    
    if(to.path == '/'){
        if(code){
            const res = await checkIP({code})
            if(res.code === 200){
                next();
            }else{
                next({ name: 'ErrorPage' });
            }
        }else{
            next({ name: 'ErrorPage' });
        }
    }else{
        next();
    }
    
});

export default router
