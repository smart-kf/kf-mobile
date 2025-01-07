
class WebSocketClient {
    constructor() {
      this.connect();
    }
  
    // 连接方法
    connect() {
        this.messageHandlers = [];

        this.socket = io("ws://goim.smartkf.top:80/", {
            host: "goim.smartkf.top", // 域名，部署到线上直接用当前域名，本地连接可以写死。
            secure: true, // 固定
            transports: ['websocket'], // 固定
            query: "token=helloworld&platform=kf",  // token 需要换成登录token，现在没有做校验可以随便放
            path: "/socket.io/", // 固定
        });
        
        // 服务端确认收到消息
        this.socket.on("messageAck",(msg)=>{
            let data = JSON.parse(msg)
            console.log("messageAck-->",data)
            this.messageHandlers.forEach(handler => handler(data));
        })


        // this.socket.on('test', function (msg) {
        //     console.log('test:',msg);
        // });

        // 断开ws链接
        this.socket.on('disconnect', (reason) => {
            console.log('Disconnected from the server:', reason);
        });

        // 连上服务器以后，会告诉客户端的sessionId是多少，这个id是 websocket的 连接id
        this.socket.on("sessionId",function(msg){
            console.log("sessionId-->",msg)
        })
      
    }
  
    
  
    // 发送消息
    sendMessage(message) {
        console.log('发送消息:',message);
        this.socket.emit('message', JSON.stringify(message));
    }

    // 接收消息
    onMessage(handler) {
        this.messageHandlers.push(handler);
    }
  }
  
  export default WebSocketClient;