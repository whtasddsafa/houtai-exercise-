import Vue from 'vue'
import VueRouter from 'vue-router'
import {getToken} from '@/utils/token.js'

Vue.use(VueRouter)

const routes = [
  // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  {
    path:'/',
    redirect: '/login'
  },
  {
    path:'/login',
    component:()=>import('../views/Login/index')
  },
  {
    path:'/home',
    
    component:()=>import('../views/Home/index.vue'),
    children:[
      {
        path:'/',
        redirect:'/home/welcome',
      },
      {
        path:'welcome',
        component:()=>import('../components/welcome/index.vue'),
        meta:{
          title:'欢迎'
        }
      },
      {
        path:'users',
        component:()=>import('../components/User/index.vue')
      },
      {
        path:'rights',
        component:()=>import('../components/power/index.vue')
      },
      {
        path:'roles',
        component:()=>import('../components/power/roles.vue')
      },
      {
        path:'categories',
        component:()=>import('../components/goods/cate/index.vue')
      },
      {
        path:'params',
        component:()=>import('../components/goods/params/index.vue')
      },
      {
        path:'goods',
        component:()=>import('../components/goods/list/index.vue'),
        meta:{
          title:'商品列表'
        },
      },
      {
        path:'add',
        component:()=>import('../components/goods/add/index.vue'),
        meta:{
          title:'添加商品'
        }
      },
      {
        path:'orders',
        component:()=>import('../components/order/index.vue'),
        meta:{
          title:'订单列表'
        }
      },
      {
        path:'reports',
        component:()=>import('../components/report/index.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,form,next)=>{
  if(to.path === '/login') return next()
  if(!getToken()){
    return next('/login')
  }
  if(to.meta.title){
    document.title = to.meta.title
  }
  next()
})

export default router
