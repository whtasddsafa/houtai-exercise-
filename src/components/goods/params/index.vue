<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图去 -->
    <el-card>
      <el-alert show-icon title="注意" type="warning" :closable="false">
      </el-alert>
      <!-- 选择商品分裂区域 -->
      <el-row>
        <el-col class="cat_opt">
          <span>选择商品分类区域：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            expand-trigger="hover"
            :props="cateProps"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签去 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态树型的按钮 -->
        <el-tab-pane label="用户管理" name="many">
          <el-button
            :disabled="isBtnDisabled"
            type="primary"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTabDate" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染的tab标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handClosed(i,scope.row)"
                >
                  {{ item }}
                </el-tag>

                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--  -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 这是一个索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <div>
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditDialog(scope.row.attr_id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="removeEditDialog(scope.row.attr_id)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态树型的按钮 -->
        <el-tab-pane label="配置管理" name="only">
          <el-button
            :disabled="isBtnDisabled"
            type="primary"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="onlyTabDate" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染的tab标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handClosed(i,scope.row)"
                >
                  {{ item }}
                </el-tag>

                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--  -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 这是一个索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <div>
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditDialog(scope.row.attr_id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="removeEditDialog(scope.row.attr_id)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的对话框 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 编辑参数的对话框 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  goodsListAPI,
  canshugoriesAPI,
  tjcsgoriesAPI,
  refercsAPI,
  edittjAPI,
  removecsAPI,
} from "@/api/index.js";
export default {
  props: {},
  data() {
    return {
      catelist: [],
      //   级联选择框的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 级联选择框双向绑定对象
      selectedCateKeys: [],
      // 被激活的页签的名称  绑定的是对应的name：first
      activeName: "many",
      //   动态参数的数据
      manyTabDate: [],
      // 静态参数的数据
      onlyTabDate: [],
      // 控制添加参数的对话框
      addDialogVisible: false,
      //   添加参数的表单数据对象
      addForm: {},
      // 添加表单的用户规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 控制编辑对话款的显示和隐藏
      editDialogVisible: false,
      // 修改表单数据对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 控制添加按钮的显示与隐藏
      inputVisible:false,
      // 文本框输入的内容
      inputValue:'',

    };
  },
  created() {
    //   获取所有的商品分类列表
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await goodsListAPI();
      // console.log(res);
      this.catelist = res.data;
      //   console.log(this.catelist);
    },
    // 级联选择框中项变化，会触发这个函数
    handleChange() {
      /* // console.log(this.selectedCateKeys);
      // 只选择三级的
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }
      // 剩余的就是三级的
    //  选择了三级分类，就根据所选分类的id，和当前所处的面板，获取对应的参数
        const {data:res} = await canshugoriesAPI({
            url:`categories/${this.cateId}/attributes`,
            params:{
                sel:this.activeName
            }
        })
        console.log(res.data);
        
    },
    // tab页签点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName); //打印出来的是name */
      this.getParamsData();
    },

    // 获取参数列表数据
    async getParamsData() {
      // console.log(this.selectedCateKeys);
      // 只选择三级的
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        // 最后一部  选择二级的不会出现
        this.manyTabDate = []
        this.onlyTabDate = []
        return;
      }
      // 剩余的就是三级的
      //  选择了三级分类，就根据所选分类的id，和当前所处的面板，获取对应的参数
      const { data: res } = await canshugoriesAPI({
        url: `/categories/${this.cateId}/attributes`,
        params: {
          sel: this.activeName,
        },
      });
      //   console.log(res.data);

      // 点击后渲染
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框输入的值
        item.inputValue = ''
      });
      console.log(res.data);

      // 判断属于是哪个表格下的
      if (this.activeName === "many") {
        this.manyTabDate = res.data;
      } else {
        this.onlyTabDate = res.data;
      }
    },
    // tab页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData();
      //   console.log(this.activeName); //打印出来的是name
    },
    // 监听添加对话款过的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮，添加属性
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await tjcsgoriesAPI({
          url: `/categories/${this.cateId}/attributes`,
          data: {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          },
        });
        // console.log(res.data);
        this.getParamsData();
        this.addDialogVisible = false;
      });
    },
    // 编辑按钮 展示修改对话框
    // id 上面传下来的id
    async showEditDialog(attr_id) {
      const { data: res } = await refercsAPI({
        url: `/categories/${this.cateId}/attributes/${attr_id}`,
        params: {
          attr_sel: this.activeName,
        },
      });
      // console.log(res);
      this.editForm = res.data;
      // this.getParamsData()
      this.editDialogVisible = true;
    },

    // 监听对话框的关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击按钮修改全部信息
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { date: res } = await edittjAPI({
          url: `/categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          data: {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          },
        });
        console.log(res);
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    // 点击删除按钮
    async removeEditDialog(attr_id) {
      const configResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
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
      if (configResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      // 删除的
      const { data: res } = await removecsAPI({
        url: `/categories/${this.cateId}/attributes/${attr_id}`,
      });
      //   console.log(res);

      this.getParamsData();
    },
    // 文本框失去焦点或按下 enter都会触发
    async handleInputConfirm(row){
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
      row.inputVisible = false
      return
      }
      // 如果没有return ，证明输入的内容，需要做后续的处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
     /*  // 需要发布请求，来保存这次操作
     const { date: res } = await edittjAPI({
          url: `/categories/${this.cateId}/attributes/${row.attr_id}`,
          data: {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(' ')
          },
        }); 
        // console.log(res.data);
        // console.log(res); */
      this.saveAttrVlas(row)

    },
    // 
    async saveAttrVlas(row){
       // 需要发布请求，来保存这次操作
     const { date: res } = await edittjAPI({
          url: `/categories/${this.cateId}/attributes/${row.attr_id}`,
          data: {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(' ')
          },
        }); 
        // console.log(res.data);
        // console.log(res);
    },
    // 点击按钮展示文本框
    showInput(row){
      row.inputVisible = true
      // 文本框自动获取焦点
      /* 
      .$nextTick  页面上的元素被重新渲染之后，才会执行指定代码
      */
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 删除对应的参数可选项

    handClosed(i,row){
      row.attr_vals.splice(i,1)
      this.saveAttrVlas(row)
    }
  },
  computed: {
    //   是否启用
    // 如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
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
.cat_opt {
  margin: 15px 0;
}
 .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
