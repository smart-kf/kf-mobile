<template>
    <div class="not-found-page">
      <van-image
        :src="defaultImg"
        fit="contain"
        style="width: 75px; margin: 50px auto 20px;"
      />
      <div class="not-found-text">停止访问该页面</div>
      <!-- <van-text class="not-found-text">哎呀，你访问的页面不存在哦~</van-text> -->
    </div>
  </template>
  
  <script setup>
  import defaultImg from '../assets/logo.png'
  </script>
  
  <style scoped>
  .not-found-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .not-found-text {
    font-size: 18px;
    color: #666;
    margin-bottom: 20px;
  }
  </style>