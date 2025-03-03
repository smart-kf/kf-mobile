// 首先导入socket.io-client库中的io函数以及Socket类型，用于创建WebSocket连接及后续类型标注
// import { io, Socket } from'socket.io-client';

// 定义WebSocketClient类
class WebSocketClient {
  // 声明messageHandlers属性，类型为一个函数数组，每个函数接收一个任意类型的参数，无返回值
  messageHandlers: ((data: any) => void)[] = []
  // 声明socket属性，类型为Socket.io的Socket类型
  socket: any

  params: any

  // 构造函数
  constructor(params: any) {
    console.log('ws参数:', params)
    // 在构造函数中调用connect方法来建立连接
    this.connect(params)
  }

  // 连接方法，用于建立WebSocket连接以及设置相关的事件监听
  connect(params: any): void {
    // 使用io函数创建WebSocket连接，传入连接的URL以及一些配置选项
    this.socket = io(params.fullHost, {
      host: params.host,
      secure: true,
      transports: ['websocket'],
      query: 'token=' + params.uuid + '&platform=kf',
      path: '/socket.io/',
    })

    // 监听服务端发送的'messageAck'消息，当收到该消息时，解析消息内容并遍历所有消息处理函数进行调用
    this.socket.on('messageAck', (msg: string) => {
      let data = JSON.parse(msg)
      console.log('messageAck-->', data)
    })

    this.socket.on('message', (msg: string) => {
      let data = JSON.parse(msg)
      console.log('message-->', data)
      this.messageHandlers.forEach((handler) => handler(data))
    })

    // 监听服务端断开连接的事件，当连接断开时，在控制台打印断开原因
    this.socket.on('disconnect', (reason: string) => {
      console.log('Disconnected from the server:', reason)
    })

    // 监听服务端发送的'sessionId'消息，当收到该消息时，在控制台打印出sessionId信息
    this.socket.on('sessionId', (msg: string) => {
      console.log('sessionId-->', msg)
    })
  }

  // 发送消息的方法，接收一个消息参数，类型为任意类型（可根据实际情况细化为具体类型），将其转换为JSON字符串后通过WebSocket连接发送给服务端
  sendMessage(message: any): void {
    console.log('发送消息:', message)
    this.socket.emit('message', JSON.stringify(message))
  }

  // 接收消息的方法，接收一个消息处理函数作为参数，该函数接收一个任意类型的参数且无返回值，将其添加到messageHandlers数组中，以便后续处理接收到的消息
  onMessage(handler: (data: any) => void): void {
    this.messageHandlers.push(handler)
  }
}

export default WebSocketClient
