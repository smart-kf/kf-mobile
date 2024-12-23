<template>
  <div>
    <van-empty image="search" description="数据加载中" />
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import MyAxios from '../plugins/MyAxios.ts'
import { showToast } from 'vant'

const router = useRouter()

const userList = ref([])

// 发送请求获取用户数据到页面展示，钩子函数
// await就是等到请求完成拿到数据再执行
onMounted(async () => {
  const userListData = await MyAxios.get('/user/recommend', {
    params: {
      pageSize: 10,
      pageNum: 1,
    },
  })
    .then(function (response) {
      console.log('请求/search/tags成功', response)
      return response?.data?.records
    })
    .catch(function (error) {
      console.log('请求/search/tags失败', error.response.data.message)
      if (error.response.data.message === '用户未登录') {
        showToast('用户未登录')
        router.push({ path: '/user/login' })
      }
      return error
    })
  if (userListData.length >= 1) {
    userListData.forEach((user: any) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    })
    userList.value = userListData
  }
})
</script>

<style scoped></style>
