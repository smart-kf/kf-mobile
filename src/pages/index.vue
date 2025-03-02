<template>
  <div class="chatroom-contain">
    <!-- 消息展示区域 -->
    <div class="message-display" ref="messageDisplay">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.isKf == '2' ? 'right' : '']"
      >
        <div class="avatar-and-name">
          <span class="name">{{ message.guestName }}</span>
          <img :src="message.guestAvatar" alt="Avatar" />
        </div>
        <div class="message-content">
          <p v-if="message.msgType==='text'">{{ message.content }}</p>
          <template v-if="message.msgType==='image'">
            <van-image width="100" height="100" :src="message.content" @click="previewImage(message.content)"/>
          </template>
          <div v-if="message.msgType === 'video'" class="video-contain">
              <video :src="message.content" class="video-box"></video>
              <van-icon name="play-circle-o" class="play-icon" @click="playVideo(message.content)"/>
            </div>
          <span class="time">{{ dayjs(message.msgTime).format('HH:mm:ss') }}</span>
        </div>
      </div>
    </div>

    <!-- 消息输入区域 -->
    <div class="input-area safe-area-inset-bottom">
      <van-field
        v-model="newMessage"
        placeholder="请输入消息..."
        class="input-box"
        :enterkeyhint="'发送'"
        clearable
        @focus="hidePicker"
        @keydown.enter="onEnter"
      />
      <van-icon name="smile-o" class="icon" size="18" @click="toggleEmojiPicker"/>
      <van-uploader :after-read="afterRead" :max-count="9" accept="image/*,video/*">
        <van-icon name="photo-o" class="icon" size="18"/>
      </van-uploader>
      <span class="send-button" @click="onEnter">发送</span>
    </div>

    <!-- 表情包选择区域 -->
    <div v-if="showEmojiPicker" class="emoji-list">
      <EmojiPicker :native="true" @select="onSelectEmoji" />
    </div>

    <!-- 视频播放 -->
    <van-overlay v-if="showVideo" :show="showVideo" @click="showVideo = false">
      <div class="video-wrapper" @click.stop>
        <van-icon name="close" class="close-icon" @click="showVideo = false"/>
        <video :src="videoUrl" controls width="100%" autoplay class="video-player"></video>
      </div>
    </van-overlay>
    
  </div>
</template>

<script setup lang="ts">
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import MyAxios from '../plugins/MyAxios.ts'
import { showToast } from 'vant'
import WebSocketClient from '@/plugins/mySocket.ts';
import dayjs from 'dayjs'
import { showImagePreview } from 'vant';

// 消息对象数组
const messages: any = ref([
  // {
  //   sender: 'other',
  //   name: 'User 1',
  //   avatar: 'https://via.placeholder.com/40',
  //   text: 'Hello! How are you?',
  //   time: '10:15 AM',
  // },
  // {
  //   sender: 'me',
  //   name: 'You',
  //   avatar: 'https://via.placeholder.com/40',
  //   text: "I'm good, thanks! How about you?",
  //   time: '10:16 AM',
  // },
]);

const newMessage = ref('');

/** 选择表情包  */
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
/** 选择表情包  */

/** 选择文件 */
const afterRead = (file: any) => {
  console.log('file:',file);
  const isImage = file.file.type.includes('image')
  // TODO 上传至服务器
  // 发送至聊天框
  const res = {
    msgType: isImage ? 'image' : 'video', // 需要区分video or image
    msgTime: Date.now(),
    content: isImage ? 'https://cdn.smartkf.top/text.png' : 'https://cdn.smartkf.top/QQ20250120-134814-HD.mp4', //上传成功后获取到的url
    guestAvatar: 'https://via.placeholder.com/40',
    isKf: 2,
  }
  messages.value.push(JSON.parse(JSON.stringify(res)))
  wsClient.sendMessage(JSON.parse(JSON.stringify(res)))
  return true;
};

// 预览图片
const previewImage = (url:string)=>{
  showImagePreview({
    images:[url],
    closeable: true
  });
}

// 预览视频
const showVideo = ref(false)
const videoUrl = ref('')
const playVideo = (url: string)=>{
  showVideo.value = true
  videoUrl.value = url
}
/** 选择文件 */

 const onEnter = ()=>{
  const res = {
    msgType: 'text',
    msgTime: Date.now(),
    content: newMessage.value,
    guestAvatar: 'https://via.placeholder.com/40',
    isKf: 2,
    
  }
  messages.value.push(JSON.parse(JSON.stringify(res)))
  wsClient.sendMessage(JSON.parse(JSON.stringify(res)))
  newMessage.value = ''
 }

let wsClient: any

onMounted(async () => {
  // 创建ws链接
  wsClient = new WebSocketClient();

  wsClient.onMessage((res:any)=>{
    console.log('接收到啦：',res);
    messages.value.push(JSON.parse(JSON.stringify(res)))
  })

  // 获取视口高度
  console.log('视口高度为:', window.innerHeight, 'px');
  // 容器高度
  console.log('展示区高度为:', document.querySelector('.chatroom-contain')?.clientHeight, 'px');
  // 获取展示区的高度
  console.log('展示区高度为:', document.querySelector('.message-display')?.clientHeight, 'px');
  // 获取发送区域高度
  console.log('发送区高度为:', document.querySelector('.input-area')?.clientHeight, 'px');
})
</script>

<style lang="less" scoped>
  
.chatroom-contain {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: hidden;
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

.video-contain{
  position: relative;
  .video-box{
    width: 200px;
    height: 120px;
  }
  .play-icon{
    width: 36px;
    height: 36px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #fff;
    font-size: 36px;
    background: #ccc;
    border-radius: 50%;
  }
}

.video-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  .video-player{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }

  .close-icon{
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    color: #fff;
    background: #ccc;
    border-radius: 50%;
  }
}
  
  /* 消息输入区域 */
  .input-area {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-top: 1px solid #ddd;

    .icon{
      margin-left: 8px;
    }

    :deep(.van-uploader__input-wrapper){
      width: 18px;
      height: 18px;
      margin-right: 9px;
    }

    .send-button{
      display: inline-block;
      padding: 0 4px;
      width: 50px;
      user-select: none;
    }
  }

  .v3-emoji-picker{
    width: 100%;
  }








  </style>
  