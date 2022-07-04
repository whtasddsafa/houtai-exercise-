<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt="" />
      </div>
      <div class="login_form">
        <!-- 下面的表单 -->
        <el-form :model="form" ref="a" :rules="rules">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              prefix-icon="el-icon-user"
              v-model="form.username"
            ></el-input>
          </el-form-item>
          <!--密码 -->
          <el-form-item prop="password">
            <el-input
              prefix-icon="el-icon-search"
              v-model="form.password"
              type="password"
            ></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="btns">
            <!--                                        和上面得ref对应 -->
            <el-button type="primary" @click="submitForm('a')">登录</el-button>
            <el-button @click="resetForm('a')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { loginAPI } from "@/api/index.js";
import { setToken } from "@/utils/token.js";
export default {
  props: {},
  data() {
    return {
      form: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      // formName 传进来得是一个变量，所以用中括号
      //                        element中 valid传得值是一个布尔值  true或者false
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // alert("submit!");
          // axios在这里进行
          const { data: res } = await loginAPI(this.form);
          // console.log(res);
          if (res.meta.status == 200) {
            this.$message({
              message: "登录成功",
              type: "success",
              duration: 1000,
              // 提示之后  跳转页面
              // ui中得 关闭后跳转
              onClose: () => {
                setToken(res.data.token)
                this.$router.push('/home')
              },
            });
          }
        } else {
          
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.login_container {
  height: 100%;
  background-color: #2b4d2b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
}
</style>
