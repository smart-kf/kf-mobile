import MyAxios from '../plugins/MyAxios.ts'
import { getCurrentUserStates, setCurrentUserStates } from '../states/user.ts'

// 抽象出来获取当前用户信息的方法
export const getCurrentUser = async () => {
  // 小项目没必要去做缓存，路由守卫每次都去后端拿就好了，这样还能保证是最新的数据
  // const currentUser = getCurrentUserStates();
  // if (currentUser) {
  //     return currentUser
  // }
  // 如果未登录
  // console.log("未登录，发送请求到后端获取")
  const res: any = await MyAxios.get('/user/current')
  console.log('请求到的数据', res)
  if (res.code === 0) {
    setCurrentUserStates(res.data)
    return res.data
  } else {
    return null
  }
}

export const checkIP = async(params: any):Promise<any>=>{
  const res: any = await MyAxios.post('/api/kf-fe/qrcode/check',params)
  return res
}
