<template>
  <div>
    <!-- 导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 视图 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="showAddCate">添加分类</el-button>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treetable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-edit" v-else style="color: red"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" size="mini" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
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

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类"
     :visible.sync="addCateVisible"
      width="50%"
      @close="addcateclosed" 
      >
      <!-- 添加用户表单 -->
      <el-form
        :model="addCateFrom"
        :rules="addCateFromRules"
        ref="addCateFromRef"
        label-width="100px"
        class="demo-ruleForm"
         
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <!-- 下边的选择处 -->
        <el-form-item label="父级分类">
            <!-- options指定数据元 -->
            <!-- props用来指定具体的对象 -->
          <el-cascader
          props.checkStrictly="true"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateaa"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { goodsListAPI, addFuListAPI,addCateListAPI } from "@/api/index.js";
export default {
  props: {},
  data() {
    return {
      // 商品分类的数据列表,默认为空
      catelist: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示.将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "isok",
        },
        {
          label: "是否有效",
          // 表示.将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "order",
        },
        {
          label: "操作",
          // 表示.将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "opt",
        },
      ],
      //   控制添加对话框的显示与隐藏
      addCateVisible: false,
      //   添加分类的表单的数据对象
      addCateFrom: {
        // 将要添加的分类名称
        cat_name: "",
        // 分类的id
        cat_pid: 0,
        // 分类的等级 , 默认为1级
        cat_level: 0,
      },
      // 定义校验规则
      addCateFromRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类的列表
      parentCateList: [],
    //   指定级联选择器的配置对象
    cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
    },
    // 选中的父级分类的id数组
    selectedKeys:[]
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await goodsListAPI(this.queryInfo);
      //   console.log(res.data);
      this.catelist = res.data.result;
      // 为总数据条数赋值
      this.total = res.data.total;
    },
    // 监听pagesize事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 点击添加分类对话框
    showAddCate() {
      // 点击后先获取分类的数据列表
      this.getFuCateListaaa();
      // 在展示出对话框
      this.addCateVisible = true;
    },
    // 获取父级分类的数据列表
    async getFuCateListaaa() {
      const { data: res } = await addFuListAPI({
        type: 2,
      });
      console.log(res.data);
      this.parentCateList = res.data;

    },
    // 选择项发生变化的时候触发这个函数
    parentCateChanged(){
      console.log(this.selectedKeys);
        // 如果selectedKeys数组大于0则选中了父级分类
        if(this.selectedKeys.length>0){
            this.addCateFrom.cat_pid = this.selectedKeys[
                this.selectedKeys.length -1
            ]
            // 为当前分类的等级赋值
            this.addCateFrom.cat_level = this.selectedKeys.length
            return
        }else{
            this.addCateFrom.cat_pid= 0,
            this.addCateFrom.cat_level=0
        }
    },
    // 点击按钮,添加新的分类
    addCateaa(){
        // console.log(this.addCateFrom);
          this.$refs.addCateFromRef.validate(async (valid) => {
            if(!valid) return
            const {dats:res} = await addCateListAPI(this.addCateFrom)

            this.getCateList()
            this.addCateVisible = false
          })
    },
    // 监听对话框的关闭事件,重置表单数据
    addcateclosed(){
        // this.$refs.addCateFromRules.reset
        this.$refs.addCateFromRef.resetFields();
        this.selectedKeys = []
        this.addCateFrom.cat_pid= 0,
            this.addCateFrom.cat_level=0
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
.treetable {
  margin-top: 15px;
}
.el-cascader{
    width: 100%
}
</style>
