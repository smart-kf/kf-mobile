<template>
  <div class="chatroom-contain">
    <!-- 消息展示区域 -->
    <div class="message-display" ref="messageDisplayRef">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.isKf == '2' ? 'right' : '']">
        <div class="avatar-and-name">
          <span class="name">{{ message.guestName }}</span>
          <img :src="message.isKf == '2' ? guestAvatar : kfAvatar" alt="Avatar" />
        </div>
        <div class="message-content">
          <p v-if="message.msgType === 'text'">{{ message.content }}</p>
          <template v-if="message.msgType === 'image'">
            <van-image width="100" height="100" :src="message.content" @click="previewImage(message.content)" />
          </template>
          <div v-if="message.msgType === 'video'" class="video-contain">
            <video :src="message.content" class="video-box"></video>
            <van-icon name="play-circle-o" class="play-icon" @click="playVideo(message.content)" />
          </div>
          <span class="time">{{ dayjs(message.msgTime).format('HH:mm:ss') }}</span>
        </div>
      </div>
    </div>

    <!-- 消息输入区域 -->
    <div class="input-area safe-area-inset-bottom">
      <van-field v-model="newMessage" placeholder="请输入消息..." class="input-box" :enterkeyhint="'发送'" clearable
        @focus="hidePicker" @keydown.enter="onEnter" />
      <van-icon name="smile-o" class="icon" size="18" @click="toggleEmojiPicker" />
      <van-uploader :after-read="afterRead" :max-count="9" accept="image/*,video/*">
        <van-icon name="photo-o" class="icon" size="18" />
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
        <van-icon name="close" class="close-icon" @click="showVideo = false" />
        <video :src="videoUrl" controls width="100%" autoplay class="video-player"></video>
      </div>
    </van-overlay>

    <!-- 检测 loading -->
    <van-overlay :show="isShowChecking">
      <div class="center-x-y">
        <div style="display: flex;flex-direction: column; align-items: center;">
          <van-loading type="spinner" />
          <span style="color: white;margin-top: 12px;">系统检测中</span>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script setup lang="ts">
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import { useRouter, useRoute } from 'vue-router'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { showFailToast } from 'vant'
import WebSocketClient from '@/plugins/mySocket.ts';
import dayjs from 'dayjs'
import { showImagePreview, Loading } from 'vant';
import { checkIP, msgList,fileUpload } from '@/service/user'
import { getCurrentUser } from '@/service/user'
import { throttle } from 'lodash-es'

// 客服头像
const {VITE_CDN_URL,VITE_KF_AVATAR} = import.meta.env
const kfAvatar = `${VITE_CDN_URL}${VITE_KF_AVATAR}`
// 粉丝头像
let guestAvatar: any

// 聊天窗口引用
const messageDisplayRef = ref()

// 消息对象数组
const messages: any = ref([]);

const newMessage = ref('');
const code = ref('');
const isShowChecking = ref(false);
const route = useRoute()
const router = useRouter()


/** 选择表情包  */
const showEmojiPicker = ref(false);
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const hidePicker = () => {
  showEmojiPicker.value = false;
};

const onSelectEmoji = (emoji: any) => {
  newMessage.value += emoji.i;
}
/** 选择表情包  */

// 上传文件
const handleUpload = async(formData:any,isImage:boolean)=>{
  const res = await fileUpload(formData)
  if(res.code === 200){
    const {cdnHost,path} = res.data
    // 发送至聊天框
    const params = {
      msgType: isImage ? 'image' : 'video', // 需要区分video or image
      msgTime: Date.now(),
      content: `${cdnHost}${path}`, //上传成功后获取到的url
      guestAvatar,
      isKf: 2,
    }
    messages.value.push(JSON.parse(JSON.stringify(params)))
    wsClient.sendMessage(JSON.parse(JSON.stringify(params)))
    nextTick(()=>{
      messageDisplayRef.value.scrollTop = messageDisplayRef.value.scrollHeight
    })
  }
}

/** 选择文件 */
const afterRead = (file: any) => {
  console.log('file:', file);
  const isImage = file.file.type.includes('image')
  // 上传至服务器
  const formData = new FormData();
  formData.append('file', file.file);
  formData.append('fileType', isImage ? 'image' : 'video');
  handleUpload(formData,isImage)
};

// 预览图片
const previewImage = (url: string) => {
  showImagePreview({
    images: [url],
    closeable: true
  });
}

// 预览视频
const showVideo = ref(false)
const videoUrl = ref('')
const playVideo = (url: string) => {
  showVideo.value = true
  videoUrl.value = url
}
/** 选择文件 */

const onEnter = () => {
  if(!newMessage.value.trim()){
    showFailToast('请勿发送空白消息')
    return
  }
  const res = {
    msgType: 'text',
    msgTime: Date.now(),
    content: newMessage.value,
    guestAvatar,
    isKf: 2,
  }
  messages.value.push(JSON.parse(JSON.stringify(res)))
  wsClient.sendMessage(JSON.parse(JSON.stringify(res)))
  newMessage.value = ''
  nextTick(()=>{
    messageDisplayRef.value.scrollTop = messageDisplayRef.value.scrollHeight
  })
}

const checking = async () => {
  isShowChecking.value = true;
  let ok = await checkIP({ code: code.value }).then((res: any) => {
    if (res.code != 200) {
      showFailToast(res.message);
      return
    }
    isShowChecking.value = false;
    return true;
  }).catch((err: any) => {
    console.log('检测失败:', err);
    isShowChecking.value = false;
    return false;
  })
  return ok
}

const lastMsgTime = ref(0)
let preScrollHeight = 0
let preScrollTop = 0
// 是否请求完消息
const isLoadAll = ref(false)

const getMsg = async()=>{
  if(isLoadAll.value){
    return 
  }

  preScrollHeight = messageDisplayRef.value.scrollHeight
  preScrollTop = messageDisplayRef.value.scrollTop

  let msgs = await msgList({lastMsgTime: lastMsgTime.value})

  if(msgs.code === 200) {
    if(msgs?.data?.messages) {
      messages.value = [...msgs.data.messages,...messages.value]
      lastMsgTime.value = msgs.data.messages[0].msgTime
    }else{
      isLoadAll.value = true
    }
    // 滚动条定位
    nextTick(()=>{
      if(preScrollHeight===0){
        messageDisplayRef.value.scrollTop = messageDisplayRef.value.scrollHeight - messageDisplayRef.value.clientHeight
      }else{
        messageDisplayRef.value.scrollTop = (messageDisplayRef.value.scrollHeight-preScrollHeight)+preScrollTop
      }
    })
  }
}

// 定义滚动事件处理函数
const handleScroll = throttle(()=>{
  const { scrollTop } = messageDisplayRef.value;
  // 这里可以添加根据滚动位置执行的逻辑
  if(scrollTop <= 0){
    getMsg()
  }
},500)



let wsClient: any
onMounted(async () => {

  let pathMatch = route.params.pathMatch;
  console.log(pathMatch, typeof pathMatch, pathMatch.length)
  if (!pathMatch || typeof pathMatch !== 'object' || pathMatch.length == 0) {
    router.push('/error');
    return
  }

  let res = '/s/' + pathMatch.join('/')
  code.value = '/s/' + pathMatch.join('/')
  let ok = await checking();
  if (!ok) {
    router.push('/error');
    return
  }

  let user = getCurrentUser();
  // 粉丝头像
  guestAvatar = `${VITE_CDN_URL}${user.avatar}`

  // 获取聊天记录
  getMsg()

  let wsParams = {
    host: user.wsHost,
    fullHost: user.wsFullHost,
    uuid: user.uuid,
  };

  // 创建ws链接
  wsClient = new WebSocketClient(wsParams);

  wsClient.onMessage((res: any) => {
    console.log('接收到啦：', res);
    messages.value.push(JSON.parse(JSON.stringify(res)))
    // 到最底部
    nextTick(()=>{
      messageDisplayRef.value.scrollTop = messageDisplayRef.value.scrollHeight
    })
  })

  // 绑定滚动事件
  messageDisplayRef.value.addEventListener('scroll',handleScroll)
 
})

onUnmounted(()=>{
  // 解绑事件
  messageDisplayRef.value.removeEventListener('scroll',handleScroll)
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
  p{
    overflow-wrap: anywhere;
  }
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

.video-contain {
  position: relative;

  .video-box {
    height: 120px;
  }

  .play-icon {
    width: 36px;
    height: 36px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 36px;
    background: #ccc;
    border-radius: 50%;
  }
}

.video-wrapper {
  width: 100%;
  height: 100%;
  position: relative;

  .video-player {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .close-icon {
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

  .icon {
    margin-left: 8px;
  }

  :deep(.van-uploader__input-wrapper) {
    width: 18px;
    height: 18px;
    margin-right: 9px;
  }

  .send-button {
    display: inline-block;
    padding: 0 4px;
    width: 50px;
    user-select: none;
  }
}

.v3-emoji-picker {
  width: 100%;
}

.center-x-y {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>