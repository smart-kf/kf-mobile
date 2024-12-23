<!-- 定义整体的公共布局 -->
<template>
  <van-nav-bar>
    <template #title>
      <img src="@/assets/logo.png" width="1rem" height="1rem" /><span
        style="padding-left: 2px"
        >微客</span
      >
    </template>
  </van-nav-bar>

  <!-- 激活不同页面(还是要加一个路由组件) -->
  <div id="content">
    <router-view></router-view>
  </div>
</template>

<!-- setup使用了vue3的语法糖不用写export -->
<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()
const onClickLeft = () => {
  router.back()
}
const onClickRight = () => {
  router.push({ path: '/search' })
}
const onChange = (index) => showToast(`标签 ${index}`)
</script>

<style scoped>
#content {
  padding-bottom: 60px;
}
</style>
