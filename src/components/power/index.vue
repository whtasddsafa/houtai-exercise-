<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
        <el-table :data="rightsList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                    <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
                    <el-tag v-else type="warning">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
import {powerListAPI} from '@/api/index.js'
export default {
  props: {},
  data() {
    return {
        // 权限列表
        rightsList:[]
    };
  },
  created() {
    //   获取所有权限
      this.getRightsList()
  },
  methods: {
      async getRightsList(){
        const {data:res} = await powerListAPI({
            url:'/rights/list',
        })
        this.rightsList = res.data
        // console.log(this.rightsList);
      }
  },
  components: {},
};
</script>

<style scoped lang="less">
text {
  font-size: 14px;
}
.box-card {
  width: 100%;
}
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
.el-pagination {
  margin-top: 15px;
}
</style>
