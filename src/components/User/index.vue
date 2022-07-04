// 用户列表组件
<template>
  <div>
    <!-- 导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 进行搜索操作 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <!-- 点击搜索 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userlist" style="width: 100%">
        <!-- 前面得索引 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!--  -->
          <template v-slot:default="scope">
            <!-- {{ scope.row }} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot:default="scope">
            <!-- {{ scope.row }} -->
            <!-- 通过id进行增删改查的操作 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showRditDialog(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUserId(scope.row.id)"
            ></el-button>
            <!-- 添加提示文字 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="fenpeirolea(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addClosed"
    >
      <!-- 内容 -->
      <el-form
        :model="addFrom"
        :rules="addfromRules"
        ref="addformRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser('addformRef')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改对话框" :visible.sync="xiugaiisible" width="50%">
      <el-form
        ref="editFromRef"
        :model="editFrom"
        label-width="70px"
        :rules="editFromRluse"
        @close="editdClosed"
      >
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="xiugaiisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除 -->
    <!-- 分配角色按钮 -->
    <el-dialog title="分配角色" 
    :visible.sync="fenpeiVisible"
     width="50%"
     @close="setRoleClosed"
     >
      <div>
        <p>当前的用户:{{ userinfo.username }}</p>
        <p>当前的角色:{{ userinfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fenpeiVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleId"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  userListAPI,
  userStateUserAPI,
  addUserAPI,
  referUserAPI,
  bianjiUserAPI,
  removeUserAPI,
  roleListAPI,
  fenpeiRoleAPI
} from "@/api/index.js";
export default {
  props: {},
  data() {
    // 验证邮箱
    var ckeckEmail = (rule, vlaue, cd) => {
      const regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (regEmail.test(vlaue)) {
        return cd();
      }
      cd(new Error("请输入合法的邮箱"));
    };
    // 验证手机号
    var ckeckMobile = (rule, vlaue, cd) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(vlaue)) {
        return cd();
      }
      cd(new Error("请输入正确的邮箱"));
    };

    return {
      userlist: [],
      total: 4,
      // 这是在axios传过去的值
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页的数据的个数
        pagesize: 2,
      },
      // 控制对话框的显示于隐藏
      dialogVisible: false,
      // 添加用户数据
      addFrom: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加验证规则
      addfromRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: ckeckEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: ckeckMobile, trigger: "blur" },
        ],
      },

      // 控制修改对话框的显示和隐藏
      xiugaiisible: false,
      // 查询到的用户
      editFrom: {},
      editFromRluse: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: ckeckEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: ckeckMobile, trigger: "blur" },
        ],
      },

      // 分配角色s
      fenpeiVisible: false,
      // 分配角色的用户信息
      userinfo: {},
      // 所有的角色列表
      roleList: [],
      // 已选中的用户id
      selectRoleId:''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await userListAPI(
        this.queryInfo
        /* {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页的数据的个数
        pagesize: 2,
      } */
      );
      // console.log(res);
      // 用户数据
      this.userlist = res.data.users;
      // 总共有几个
      this.total = res.data.total;
    },
    // xuanze页数
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      //  重新获取下数据
      this.getUserList();
    },
    // 监听  页码值  改变事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      //  重新获取下数据
      this.getUserList();
    },
    // 监听开关的改变
    async userStateChanged(userinfo) {
      // console.log(userinfo);
      const { data: res } = await userStateUserAPI({
        url: `users/${userinfo.id}/state/${userinfo.mg_state}`,
        // params:{
        //   type:userinfo.mg_state,
        // }
      });
      console.log(res);
    },
    // 监听对话框的关闭事件
    addClosed() {
      this.$refs.addformRef.resetFields();
    },
    // 添加用户
    adduser(addformRef) {
      this.$refs[addformRef].validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        const { data: res } = await addUserAPI(this.addFrom);
        // console.log(res);
        this.$message.success("添加成功");
        // 隐藏对话框
        this.dialogVisible = false;
        // 重新获取数据
        this.getUserList();
      });
    },
    // 修改用户
    async showRditDialog(id) {
      // console.log(id);
      const { data: res } = await referUserAPI({
        url: "/users/" + id,
      });
      // console.log(res);
      this.editFrom = res.data;
      // console.log(this.editFrom.email);
      this.xiugaiisible = true;
    },
    // 监听修改用户对话框的关闭事件
    editdClosed() {
      this.$refs.editFromRef.resetFields();
    },
    // 保存修改后的值
    editUserInfo() {
      this.$refs.editFromRef.validate(async (valid) => {
        // console.log(va);
        if (!valid) {
          return;
        }
        // 发起修改用户的请求
        const { data: res } = await bianjiUserAPI({
          url: "/users/" + this.editFrom.id,
          data: {
            email: this.editFrom.email,
            mobile: this.editFrom.mobile,
          },
        });
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户失败");
        }

        // 关闭对话框
        this.xiugaiisible = false;
        // 刷新数据
        this.getUserList();
        // 提示修改成功
        this.$message.success("更新用户成功");
      });
    },
    // 删除对应的
    async removeUserId(id) {
      // 先提示在删除
      const shanchu = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
      if (shanchu === "confirm") {
        const { data: res } = await removeUserAPI({ url: "/users/" + id });
        console.log(res);
        this.$message.success("删除成功");
        console.log(res);
        // 删完刷新列表
        this.getUserList();
      }
      // const {data:res} = await removeUserAPI(
      //   {url:'/user/'+id}
      // )
      // console.log(res);
      // this.$message.success('删除成功')
      // console.log(res);
      // // 删完刷新列表
      // this.getUserList()
    },

    // 分配角色按钮
    async fenpeirolea(userinfo) {
      this.userinfo = userinfo;
      // 在展示对话框之前 获取所有的角色列表
      const { data: res } = await roleListAPI();
      console.log(res);
      this.roleList = res.data;

      this.fenpeiVisible = true;
    },
    // 点击按钮 分配角色
    async saveRoleId(){
      if(!this.selectRoleId){
        return this.$message.error('请选择要分配的角色')
      }
      const {data:res} = await fenpeiRoleAPI({
        url:`/users/${this.userinfo.id}/role`,
        data:{
          rid:this.selectRoleId
        }
      })
      if(res.meta.status === 200){
        this.$message.success('更新用户成功')
      }

      this.getUserList()
      this.fenpeiVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleClosed(){
      this.selectRoleId= ''
      this.userinfo = {}
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
