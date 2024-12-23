<template>
  <div class="chatroom-contain">
    <!-- 消息展示区域 -->
    <div class="message-display" ref="messageDisplay">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.sender === 'me' ? 'right' : '']"
      >
        <div class="avatar-and-name">
          <span class="name">{{ message.name }}</span>
          <img :src="message.avatar" alt="Avatar" />
        </div>
        <div class="message-content">
          <p>{{ message.text }}</p>
          <span class="time">{{ message.time }}</span>
        </div>
      </div>
    </div>

    <!-- 消息输入区域 -->
    <div class="input-area">
      <van-field
        v-model="newMessage"
        placeholder="请输入消息..."
        class="input-box"
        clearable
        @focus="hidePicker"
        @keydown.enter="onEnter"
      />
      <van-icon name="smile-o" class="icon" size="18" @click="toggleEmojiPicker"/>
      <van-icon name="add-o"  class="icon"  size="18"/>
    </div>

    <!-- 表情包选择区域 -->
    <div v-if="showEmojiPicker" class="emoji-list">
      <EmojiPicker :native="true" @select="onSelectEmoji" />
    </div>
    
  </div>
</template>

<script setup lang="ts">
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import MyAxios from '../plugins/MyAxios.ts'
import { showToast } from 'vant'

// 消息对象数组
const messages = ref([
  {
    sender: 'other',
    name: 'User 1',
    avatar: 'https://via.placeholder.com/40',
    text: 'Hello! How are you?',
    time: '10:15 AM',
  },
  {
    sender: 'me',
    name: 'You',
    avatar: 'https://via.placeholder.com/40',
    text: "I'm good, thanks! How about you?",
    time: '10:16 AM',
  },
]);

const newMessage = ref('');
const showEmojiPicker = ref(false);

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const hidePicker = () => {
  showEmojiPicker.value = false;
};

const onSelectEmoji = (emoji:any)=>{
  newMessage.value += emoji.i;
}

 const onEnter = ()=>{
  messages.value.push({
    sender: 'me',
    name: 'You',
    avatar: 'https://via.placeholder.com/40',
    text: newMessage.value,
    time: '10:16 AM',
  })
  newMessage.value = ''
 }


// 发送请求获取用户数据到页面展示，钩子函数
// await就是等到请求完成拿到数据再执行
onMounted(async () => {
  // const userListData = await MyAxios.get('/user/recommend', {
  //   params: {
  //     pageSize: 10,
  //     pageNum: 1,
  //   },
  // })
  //   .then(function (response) {
  //     console.log('请求/search/tags成功', response)
  //     return response?.data?.records
  //   })
  //   .catch(function (error) {
  //     console.log('请求/search/tags失败', error.response.data.message)
  //     if (error.response.data.message === '用户未登录') {
  //       showToast('用户未登录')
  //       router.push({ path: '/user/login' })
  //     }
  //     return error
  //   })
  // if (userListData.length >= 1) {
  //   userListData.forEach((user: any) => {
  //     if (user.tags) {
  //       user.tags = JSON.parse(user.tags)
  //     }
  //   })
  //   userList.value = userListData
  // }
})
</script>

<style lang="less" scoped>
  
.chatroom-contain {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
  
  /* 消息展示区域 */
  .message-display {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #f9f9f9;
  }
  
  .message {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    max-width: 80%;
  }
  
  .message .avatar-and-name {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  
  .message .avatar-and-name .name {
    font-size: 0.9em;
    color: #555;
  }
  
  .message img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .message-content {
    background: #e0e0e0;
    padding: 10px 15px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
  }
  
  .message-content .time {
    font-size: 0.75em;
    color: #888;
    margin-top: 5px;
    align-self: flex-end;
  }
  
  .message.right {
    margin-left: auto;
    flex-direction: row-reverse;
  }
  
  .message.right .message-content {
    background: #9EEA6A;
  }
  
  /* 消息输入区域 */
  .input-area {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #fff;
    border-top: 1px solid #ddd;

    .icon{
      margin-left: 10px;
    }
  }

  .v3-emoji-picker{
    width: 100%;
  }








  </style>
  