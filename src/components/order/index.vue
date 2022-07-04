<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            <div>
              <!-- 弄得时间 -->
              {{ scope.row.create_time }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="showProgressBox(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog 
    title="修改地址" 
    :visible.sync="addressVisible" 
    width="50%"
    @close="addressDialogClose"
    >
      <el-form
        :model="addressFrom"
        :rules="addressFromrules"
        ref="addressFromRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressFrom.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressFrom.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 展示物流进度对话框 -->
    <el-dialog
  title="物流进度"
  :visible.sync="progressVisible"
  width="30%">
  <!-- 时间线 -->
  <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
  
</el-dialog>
  </div>
</template>

<script>
import { ordersListAPI,kuaidixxAPI } from "@/api/index.js";
// 引入的省市区
export default {
  props: {},
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 总数居
      orderlist: [],
      // 总数
      total: 0,
      //   修改的展示与隐藏
      addressVisible: false,
      //
      addressFrom: {
        address1: [],
        address2: "",
      },
      addressFromrules: {
        address1: [
          { required: true, message: "请选择省市区", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
    //   城市的数据
      cityData,
    //   展示物流对话框的显示与隐藏
    progressVisible:false,
    // 物流信息
    progressInfo:[]
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await ordersListAPI(this.queryInfo);
      //   console.log(res.data);
      this.total = res.data.total;
      this.orderlist = res.data.goods;
    },
    // 页面
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getOrderList();
    },
    // 页码
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getOrderList();
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true;
    },
    // 关闭了就清空修改的表单数据
    addressDialogClose(){
         this.$refs.addressFromRef.resetFields();
    },
    // 
    showProgressBox(id){
        const {data:res} = kuaidixxAPI({
            url:'/kuaidi/1106975712662'
        })
        // console.log(res);
        this.progressInfo = res.data
        this.progressVisible = true
        console.log(this.progressInfo);
    }
  },
  components: {},
};
</script>

<style scoped lang="less">

// 导入样式表
// @import '路径';
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
