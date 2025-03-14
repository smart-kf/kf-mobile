import { getCurrentUser } from "@/service/user";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL

const MyAxios = axios.create({
    baseURL: baseURL,
});

console.log('baseURL:', baseURL)

// MyAxios.defaults.withCredentials = true; // 配置为true,向后台发送请求的时候要携带上凭证


// 添加请求拦截器，发送请求之前要做什么，比如数据校验等
MyAxios.interceptors.request.use(function (config) {
    let user = getCurrentUser()
    if (user) {
        config.headers['authorization'] = user.uuid;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器，就是说接收到后端的数据后，可以做一些事情
MyAxios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default MyAxios;