<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!--  -->
      <!-- 进度条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addruleForm"
        label-width="100px"
        label-position="top"
      >
        <!-- @tab-click="tabClicked"  
          tab被选中时触发
       -->
        <el-tabs
          :tab-position="(topPosition = 'left')"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- 让里面name的值和上面选中的一样 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                expandTrigger="hover"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cd"
                  border
                  v-for="(cd, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabDate"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 -->
            <!-- 
              action：图片要上传到的后台api
             -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" class="btnAdd" @click="add()"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->

    <el-dialog title="图片预览" :visible.sync="perviewVisible" width="50%">
      <img :src="previewPath" alt="" class="perviewImg" />
    </el-dialog>
  </div>
</template>

<script>
import { goodsListAPI, canshugoriesAPI ,tianjiagoodsAPI} from "@/api/index.js";
import { getToken } from "@/utils/token.js";
export default {
  props: {},
  data() {
    return {
      //
      activeIndex: "0",
      //   添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的
        goods_introduce: "",
        //  // 动态参数列表数据
        // manyTableData: [],
        // 静态参数列表数据
        // onlyTabDate: [],
        // 将上面两个的数据都加入进去
        attrs:[],
      },
      addruleForm: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 级联选择器的数据
      catelist: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态参数列表数据
      onlyTabDate: [],
      //
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片上传组件的headers请求头对象
      headersObj: {
        Authorization: getToken(),
      },
      //
      previewPath: "",
      // 图片预览的显示与隐藏
      perviewVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await goodsListAPI();
      // console.log(res);
      this.catelist = res.data;
    },
    // 级联选择器变化会选择这个函数
    handleChange() {
      // console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        return;
      }
    },
    beforeTabLeave(activeName, oldactiveName) {
      // console.log(activeName);//进入的
      // console.log(oldactiveName);//离开的
      // 关于name的
      if (oldactiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // 点击tab时触发  看看选中的时哪个  name名称
    async tabClicked() {
      // console.log(this.activeIndex);

      // 证明访问的是动态参数面板
      // 只有选中 第一个上面的级联选择器才让触发
      if (this.activeIndex === "1") {
        const { data: res } = await canshugoriesAPI({
          url: `categories/${this.cateId}/attributes`,
          params: {
            sel: "many",
          },
        });
        // 获取动态参数列表
        // console.log(res.data);

        // 进行判断 把他分为数组
        res.data.forEach((item) => {
          // 将返回的数组在赋值给item.attr_vals
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
        // console.log(this.manyTableData );
      } else if (this.activeIndex === "2") {
        // 是2就是点击到了第三个
        const { data: res } = await canshugoriesAPI({
          url: `categories/${this.cateId}/attributes`,
          params: {
            sel: "only",
          },
        });
        // console.log(res.data);
        this.onlyTabDate = res.data;
      }
    },
    // 处理图片的预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.perviewVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2.从pics数组中,找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);
      // 3.调用数组的splice方法,把图片信息对象,从pics数组中移除
      this.addForm.pics.splice(i, 1);
      // console.log(this.addForm);
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // console.log(response);
      // 拼接得到图片信息对象
      const pics = {
        pic: response.data.tmp_path,
      };
      // push到图片数组上
      this.addForm.pics.push(pics);
      // console.log(this.addForm);
    },
    //添加商品
    add() {
      // console.log(this.manyTableData );
      this.$refs.addFormRef.validate(async (valid) => {
        if(!valid){
          return this.$message.error('请填写必要的表单项')
        }
        let form = JSON.parse(JSON.stringify(this.addForm));
        
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item=>{
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
        })
        // 处理静态
        this.onlyTabDate.forEach(item=>{
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:''
            }
            this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // console.log(form.attrs);
        // console.log(form);
        const {data:res} = await tianjiagoodsAPI(form)
        console.log(res.data);

        this.$router.push('goods')
      });
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
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
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
  line-height: 38px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.perviewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
