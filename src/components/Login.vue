<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/img/logo.png" alt>
      </div>

      <el-form :rules="loginFormRules" ref="loginFormRef" :model="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" show-password>
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :push="15">
            <el-button type="primary" @click="login()">登录</el-button>
            <el-button type="info" @click="reset()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    // 表单域重置
    reset () {
      this.$refs.loginFormRef.resetFields()
    },
    // 后台管理员登录系统
    login () {
      // 对各个表单域进行再次验证
      // this.$refs.loginFormRef.validata(回调函数参数)
      this.$refs.loginFormRef.validate(async valid => {
        // valid表单验证的标志信息，true: 成功, false: 失败
        if (valid === true) {
          // 用户名，密码的真实性验证(axios带着去服务器完成)
          const { data: dt } = await this.$http.post('/login', this.loginForm)
          // console.log(dt)

          // 用户名，密码错误提示
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }

          // 管理员的账号校验没有问题，把获取的token存储给sessionStorage
          window.sessionStorage.setItem('token', dt.data.token)
          // 跳转到后台页面
          this.$router.push('/home')
        }
      })
    }
  },
  data () {
    return {
      // 给登录表单域制作校验规则
      loginFormRules: {
        username: [
          // {require:必填项目,message:错误提示,trigger:触发机制}
          { required: true, message: '用户名必填', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }]
      },
      // 登录form表单数据对象
      loginForm: {
        username: '',
        password: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
  overflow: hidden;
  .login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
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
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
