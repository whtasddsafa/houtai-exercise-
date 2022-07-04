// 封装axios网络请求
import theaxios from 'axios'
import {getToken} from './token.js'
// 进度条
import NProgress from 'nprogress'
/* const axios = axios.create({
    baseURL:'/api',
    timeout:20000,
})

export default ({url,method = 'GET',params = {},data={},headers = {}}) => {
    return axios({
        url,
        method,
        params,
        data,
        headers
    })
} */
const axios = theaxios.create({
    baseURL: '/api',
    timeout: 20000,
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  NProgress.start();
  
    // 在发送请求之前做些什么
    // 目标: 统一携带token
    // 判断本地有token在携带，判断具体api/index.js里如果没有携带 请求头，在加上去
    // if(getToken()?.length>0 && config.headers.Authorization === undefined ){
    console.log(config);    
    config.headers.Authorization = getToken()
    // }
    // console.log(config);
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
// 本质：就是一个函数
axios.interceptors.response.use(function (response) {
  NProgress.done();  
  
  
  // 对响应数据做点什么
    // http响应为2xx\3xx就进入这里
    return response;
  }, function (error) {
    // 对响应错误做点什么
    // http响应为4xx/5xx就进入这里
    // console.dir(error);

    // 只有401才代表身份过期，才需要跳转登录
    if(error.response.status === 401){
        // 不能使用this.$router.push()因为this不是vue组件对象无法调用$router
        // this.$router是为拿到router路由对象
        // 所以直接去上面引入路由对象  然后直接用
        // Notify({type:'success',message:'请重新登录'})
        router.push('/login')
    }
    return Promise.reject(error);
  });
export default function (config) {
    
    return axios(config)
}