<!-- 定义整体的公共布局 -->
<template>
  <van-nav-bar
  title="标题"
  left-text="返回"
  right-text="按钮"
  left-arrow
  @click-left="onClickLeft"
  @click-right="onClickRight"
  
  >
  <template #right>
    <van-icon name="search" size="18" />
  </template>
  </van-nav-bar>

  <!-- 激活不同页面(还是要加一个路由组件) -->
  <div id="content">
    <router-view></router-view>
  </div>

  <van-tabbar route @change="onChange">
  <van-tabbar-item icon="home-o" to="/index" name="index">主页</van-tabbar-item>
  <van-tabbar-item icon="search" to="/team" name="team">队伍页</van-tabbar-item>
  <van-tabbar-item icon="friends-o" to="/user"name="user">个人</van-tabbar-item>
  </van-tabbar>


</template>

<!-- setup使用了vue3的语法糖不用写export -->
<script setup>
import { ref } from 'vue';
import { showToast } from 'vant';
import { useRouter } from 'vue-router';


const router = useRouter();
const onClickLeft = () => {
  router.back();
};
const onClickRight = () => {
  router.push({ path: '/search' })
};
const onChange = (index) => showToast(`标签 ${index}`);
</script>

<style scoped>

#content{
  padding-bottom: 60px;
}

</style>