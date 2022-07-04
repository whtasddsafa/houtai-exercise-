<template>
  <div class="home-box">
    <!-- <el-button type="info" @click="loginout">退出</el-button> -->
    <el-container class="home-el">
      <el-header>
        <div class="home-title">电商后台管理系统</div>
        <div>
          <el-button type="info" @click="loginout">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse?'64px':'200px'">
          <!-- 菜单栏 -->
          <div class="toggle-button" @click="toggle">|||</div>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath"
          >
          <!-- 一级 -->
            <el-submenu :index="item.id + '' " v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级 -->
                <el-menu-item 
                :index="item1.path"
                 v-for="item1 in item.children" 
                 :key="item1.id"
                 @click="saveNavState(item1.path)"
                 >
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{item1.authName}}</span>
                  </template>
                </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主题 -->
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { removeToken } from "@/utils/token.js";
import {menusLeftAPI} from '@/api/index.js'
export default {
  props: {},
  data() {
    return {
        menuList:[],
        iconsObj:{
            '125':'el-icon-full-screen',
            '103':'el-icon-place',
            '101':'el-icon-map-location',
            '102':'el-icon-full-screen',
            '145':'el-icon-place',
        },
        isCollapse:false,
        // 被激活得链接地址
        activePath:''
    };
  },
  created() {
      this.getMnulist()
    //   激活
      this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    loginout() {
      removeToken();
      this.$router.push("/login");
      sessionStorage.removeItem('activePath')
    },
    // 获取所有菜单
    async getMnulist(){
        // 的结构赋值下
        const {data:res} = await menusLeftAPI()
        // console.log(res.data);
        this.menuList = res.data
    },
    // 点击按钮切换菜单
    toggle(){
        this.isCollapse = !this.isCollapse
    },
    // 保存链接激活状态
    saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  .home-title {
    font-size: 20px;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
      border-right:none;
  }
}
.el-main {
  background-color: #eee;
}
.home-box,
.home-el {
  height: 100%;
}
.i{
    margin-left: 10px;
}
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    color: #fff;
    text-align: center;
    line-height: 24px;
    letter-spacing: 0.2em;
    
}
</style>
