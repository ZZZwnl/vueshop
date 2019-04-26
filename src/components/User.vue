<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--修改用户-->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialog"
      width="50%"
      @close="$refs.editUserRef.resetFields()"
    >
      <el-form :rules="editUserRules" ref="editUserRef" :model="editUser" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editUser.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="xiugai()">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialog"
      width="50%"
      @close="$refs.addUserRef.resetFields()"
    >
      <el-form :rules="addUserRules" ref="addUserRef" :model="addUser" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="tianjia()">确 定</el-button>
      </span>
    </el-dialog>
    <!--卡片-->
    <el-card class="box-card">
      <!--搜索框-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="querycdt.query"
            class="input-with-select"
            clearable
            @clear="getUserList()"
            @keyup.enter.native="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <!--添加用户按钮-->
          <el-button type="primary" @click="addUserDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--数据列表区域-->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="180"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!--
                获得到每条记录信息的mg_status的状态值
                当前是el-table表格环境，内部有v-for遍历机制
                在当前的el-table-column组件中，已经把每条记录信息放到内部的匿名插槽中
                <slot row="每条记录信息的对象" column="每条记录的列的信息"></slot>
                现在我们要通过作用域插槽的方式把当前组件匿名插槽的数据获取出来
                语法：<标签 slot-scope-xxx>{{xxx.row}} {{xxx.column}}<标签>
          -->
          <!-- <span slot-scope="info">{{info.row}}</span> -->
          <!-- { "id": 500, "role_name": "超级管理员", "username": "admin",
            "create_time": 1486720211, "mobile": "12345678", "email": "adsfad@qq.com",
          "mg_state": true }-->
          <!-- <span slot-scope="info">{{info.row.mg_state===true?'显示':'不显示'}}</span> -->
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="270">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created () {
    this.getUserList()
  },
  methods: {
    // 修改用户
    xiugai () {
      this.$refs.editUserRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.put(
            'users/' + this.editUser.id,
            this.editUser
          )
          // console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.editUserDialog = false
          this.getUserList()
        }
      })
    },
    async showEditDialog (id) {
      const { data: dt } = await this.$http.get('users/' + id)
      // console.log(dt)
      this.editUser = dt.data
      this.editUserDialog = true
    },
    // 删除用户
    // id:被删除用户的id
    delUser (id) {
      this.$confirm('确定要删除此记录么?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: dt } = await this.$http.delete('users/' + id)
        // console.log(dt)
        if (dt.meta.status !== 200) {
          return this.$message.error(dt.meta.msg)
        }
        this.$message.success(dt.meta.msg)
        if (this.userList.length === 1 && this.querycdt.pagenum > 1) {
          this.querycdt.pagenum--
        }
        this.getUserList()
      })
    },
    // 添加用户
    tianjia () {
      // 表单再次校验
      this.$refs.addUserRef.validate(async valid => {
        if (valid === true) {
          // 把添加好的各项表单信息传递到服务器存储
          const { data: dt } = await this.$http.post('users', this.addUser)
          // console.log(dt)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          // 数据添加成功：提示信息，关闭对话框，数据刷新
          this.$message.success(dt.meta.msg)
          this.addUserDialog = false
          this.getUserList()
        }
      })
    },
    // 分页1
    // 每页条数变化的处理
    handleSizeChange (val) {
      // val: 变化后的每页显示条数
      // console.log(val)
      // 把变化后的条数赋予给querycdt.pagesize
      this.querycdt.pagesize = val
      // 根据变化后的每页条数，重新获得数据
      this.getUserList()
    },
    // 当前页码变化
    handleCurrentChange (val) {
      // val:变化后的页码
      this.querycdt.pagenum = val
      this.getUserList()
    },
    // 获取用于显示的真实用户数据
    async getUserList () {
      const { data: dt } = await this.$http.get('users', {
        params: this.querycdt
      })
      //   console.log(dt)
      // 获取失败处理
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把获得总记录条数的数目赋予给tot
      this.tot = dt.data.total
      // 把获得数据赋予给userList成员
      this.userList = dt.data.users
    }
  },
  data () {
    // 手机号码自定义校验函数
    // value:被校验的数据
    // callback:校验的回调函数，校验无论成功或失败都执行
    var checkMobile = (rule, value, callback) => {
      // 手机号规则：11位，1开始，纯数字，第二位356789
      var reg = /^1[356789]\d{9}$/
      // 正则reg与目标内容匹配
      if (!reg.test(value)) {
        // 校验失败
        return callback(new Error('手机号码格式不正确'))
      }
      // 校验成功
      callback()
    }
    return {
      // 修改用户
      editUserDialog: false,
      editUserRules: {
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editUser: {
        username: '',
        mobile: '',
        email: ''
      },
      // 添加用户
      // 表单校验
      addUserRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 表单数据对象部分
      addUser: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      addUserDialog: false, // 对话框是否显示标志
      // 用户总记录条数
      tot: 0,
      // 声明用户列表数据成员
      userList: [],
      // 获取用户数据的条件参数
      querycdt: {
        query: '', // 被检索的模糊关键字
        pagenum: 1, // 当前页码设定（分页功能体现）
        pagesize: 3 // 设置每次获取3条记录（分页功能体现）
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
