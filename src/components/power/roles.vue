<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <!-- row-key="id"  发布用 -->
      <el-table :data="roleList" border stripe row-key="id">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 人家本来就有   这是拿到这一行的数据-->
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <!-- 第一个孩子是一级，二级就是孩子下的孩子 -->
            <el-row
              :class="['vcenter', 'bdbottom', index === 0 ? 'bdtop' : '']"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
            >
              <!-- 渲染一级 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级 -->
              <el-col :span="19">
                <!-- 渲染二级 -->
                <el-row
                  :class="['vcenter', index1 === 0 ? '' : 'bdtop']"
                  v-for="(item1, index1) in item.children"
                  :key="item1.id"
                >
                  <!-- 二级用 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item1.id)"
                      >{{ item1.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showRditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showRoleQuan(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addRoleClosed"
    >
      <el-form :model="addRole" ref="roleListRef" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="xiugaiisible"
      width="50%"
      @close="xiugaiClosed"
    >
      <el-form :model="editFrom" ref="roleListRef" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="editFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="xiugaiisible = false">取 消</el-button>
        <el-button type="primary" @click="editFromUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除角色 -->
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="quanxianVisible"
      width="50%"
      @close="setquanClosed"
    >
      <!-- 树型解构 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="quanxianVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  roleListAPI,
  addRoleAPI,
  referRolesAPI,
  tijiaoRolesAPI,
  removeRoleAPI,
  removeRoleQuanAPI,
  powerListAPI,
  shouquanRoleAPI,
} from "@/api/index.js";
export default {
  props: {},
  data() {
    return {
      // 所有的角色列表
      roleList: [],
      //   管理是否会显示
      dialogVisible: false,
      //   添加角色
      addRole: {
        roleName: "",
        roleDesc: "",
      },

      //   修改的
      xiugaiisible: false,
      // 查询到的用户
      editFrom: {},
      // 分配权限的
      quanxianVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树型控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId:''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await roleListAPI();
        console.log(res);
      this.roleList = res.data;
    },
    //
    addRoleClosed() {
      this.$refs.roleListRef.resetFields();
    },
    //   添加角色
    addRoleUser() {
      this.$refs.roleListRef.validate(async (valid) => {
        // console.log(valid);
        const { data: res } = await addRoleAPI(this.addRole);
        // console.log(res);
        this.$message.success("添加成功");
        // 隐藏对话框
        this.dialogVisible = false;
        // 重新获取数据
        this.getRolesList();
      });
    },

    // 编辑角色
    async showRditDialog(id) {
      // console.log(id);
      const { data: res } = await referRolesAPI({
        url: "/roles/" + id,
      });
      //   讲值加上去
      this.editFrom = res.data;
      //   console.log(this.editFrom.roleId);
      this.xiugaiisible = true;
    },
    // 监听
    xiugaiClosed() {
      this.$refs.roleListRef.resetFields();
    },
    // 保存修改后的值
    editFromUser() {
      this.$refs.roleListRef.validate(async (valid) => {
        // console.log(va);
        if (!valid) {
          return;
        }
        // 发起修改用户的请求
        const { data: res } = await tijiaoRolesAPI({
          url: "/roles/" + this.editFrom.roleId,
          data: {
            roleName: this.editFrom.roleName,
            roleDesc: this.editFrom.roleDesc,
          },
        });
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户失败");
        }

        // 关闭对话框
        this.xiugaiisible = false;
        // 刷新数据
        this.getRolesList();
        // 提示修改成功
        this.$message.success("更新用户成功");
      });
    },
    // 删除角色
    async removeRoles(id) {
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
        const { data: res } = await removeRoleAPI({ url: "/roles/" + id });
        console.log(res);
        this.$message.success("删除成功");
        console.log(res);
        // 删完刷新列表
        this.getRolesList();
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
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      // 提示用户是否删除
      const shanchu = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
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
        const { data: res } = await removeRoleQuanAPI({
          url: `/roles/${role.id}/rights/${rightId}`,
        });
        console.log(res);
        this.$message.success("删除成功");
        console.log(res);
        // 删完刷新列表
        // this.getRolesList();
        // 这样不会整个页面刷新，就只会在列表中
        role.children = res.data;
      }
    },
    // 分配权限
    async showRoleQuan(role) {
      // 下边用了
      this.roleId = role.id;
      // 获取所有权限数据
      const { data: res } = await powerListAPI({
        url: "/rights/tree",
      });
      // console.log(res);
      this.rightsList = res.data;
      // console.log(this.rightsList);

      // 调用就是自己递归,编程已经选择的 传过去id
      // role值是点击的时候传下来的
      this.getkeys(role, this.defKeys);

      // 把获取的权限数据，保存到data中
      this.quanxianVisible = true;
    },
    // 通过递归的形式,获取角色下所有三级的id,并保存到defKeys:[]中
    getkeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getkeys(item, arr));
    },
    // 监听对话框的关闭事件
    setquanClosed() {
      // 关闭完之后,重新赋值就能重新开始了
      this.defKeys = [];
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      console.log(keys); //拿到的id

      // 人家的要求 用,拼接起来
      const idStr = keys.join(",");

      // 请求
      const { data: res } = await shouquanRoleAPI({
        url: `/roles/${this.roleId}/rights`,
        data: {
          rids: idStr,
        },
      });
      // console.log(idStr);
      this.$message.success('分配权限成功')
      // 刷新下数据
      this.getRolesList()
      this.quanxianVisible = false
    },
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
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
