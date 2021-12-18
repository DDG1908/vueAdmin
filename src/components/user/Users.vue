<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户数据 -->
    <el-card class="box-card">
        <!-- 搜索框 -->
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          v-model="params.query"
					clearable
					@clear="getUsers()"
        >
          <el-button slot="append" icon="el-icon-search" @click="getUsers()"></el-button>
        </el-input>
      </el-col>
      <!-- 按钮 -->
      <el-col :span="6" class="addBtn">
        <el-button type="primary" @click="changeDialogVisible">添加用户</el-button>
      </el-col>
        <!-- 用户列表 -->
      <el-table :data="this.userList" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="70px">
            <template v-slot="user">
                <el-switch v-model="user.row.mg_state" @change="changeUserState(user.row)"></el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
            <template v-slot="user">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                    <el-button type="primary" @click="changeEditDialogVisible(user.row)" icon="el-icon-edit" size="mini"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                    <el-button type="danger" @click="deleteUserWarn(user.row.id)" icon="el-icon-delete" size="mini"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                    <el-button type="info" icon="el-icon-setting" size="mini"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户弹窗 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%"
      @close="dialogClose">
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile" :maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息弹窗 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editdialogVisible"
      width="40%">
      <el-form :model="editUserForm" :rules="addUserRules" ref="editUserFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile" :maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 邮箱校验
    var cheakEmail = (rule,value,callback) => {
      var reg=/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if(reg.test(value)){
        return callback()
      }
      else{
        callback(new Error('请输入正确的邮箱'))
      }
    };
    // 手机号校验
    var cheakPhone = (rule,value,callback) => {
      var reg=/^[1][3,4,5,7,8][0-9]{9}$/;
      if(reg.test(value)){
        return callback()
      }
      else{
        callback(new Error('请输入正确的手机号'))
      }
    }
    return {
      params: {
        query: "",    // 查询用户用的关键字
        pagenum: 1,   // 当前页
        pagesize: 5,  // 一页多少条
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editdialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      editUserForm: {
        username: '',
        email: '',
        mobile: '',
      },
      userId: '',     //编辑某个用户的用户id，用于传给修改用户信息的接口
      addUserRules: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: cheakEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: cheakPhone, trigger: 'blur' }
        ]
      },
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    //获取用户数据
    async getUsers() {
      let res = await this.$api("/users", { params: this.params });
      console.log(res);
      
      this.userList = res.data.data.users;
      this.total = res.data.data.total;
    },
    // 一页内数据条数改变
    handleSizeChange(val) {
      this.params.pagesize = val
      this.getUsers()
    },
    // 当前页码改变
    handleCurrentChange(val) {
      this.params.pagenum = val
      this.getUsers()
    },
		// 改变用户状态
		async changeUserState(user){
			const{data:res} = await this.$api.put(`/users/${user.id}/state/${user.mg_state}`)
			if(res.meta.status !== 200){
				user.mg_stat = !user.mg_stat
				this.$message.error('状态改变失败')
			}
			else{
				this.$message.success('状态改变成功')
			}
		},
    //添加用户弹窗
    changeDialogVisible(){
      this.dialogVisible = true
    },
    // 关闭添加用户弹窗清空表单
    dialogClose(){
      this.$refs.addUserFormRef.resetFields()
    },
    //添加用户提交
    async addUserSubmit(){
      this.$refs.addUserFormRef.validate(async valid => {
        if(!valid){
          this.$message.error('请正确填写信息')
        }
        else{
          const {data:res} = await this.$api.post('/users',this.addUserForm)
          if(res.meta.status !==201){
            this.$message.error(`添加用户失败!${res.meta.msg}`)
          }
          else{
            this.$message.success('添加用户成功！')
          }
          this.dialogVisible = false
          this.getUsers()
        }
      })
    },
    //编辑用户弹窗
    changeEditDialogVisible(user){
      this.editUserForm.username = user.username
      this.editUserForm.mobile = user.mobile
      this.editUserForm.email = user.email
      this.userId = user.id
      this.editdialogVisible = true
    },
    // 编辑用户提交
    editUserSubmit(){
      this.$refs.editUserFormRef.validate(async valid => {
        if(!valid){
          this.$message.error('请正确填写信息')
        }
        else{
          const {data:res} = await this.$api.put(`/users/${this.userId}`,this.editUserForm)
          if(res.meta.status !==200){
            this.$message.error(`修改失败!${res.meta.msg}`)
          }
          else{
            this.$message.success('修改成功！')
          }
          this.editdialogVisible = false
          this.getUsers()
        }
      })
    },
    //删除用户
    async deleteUser(id){
      const {data:res} = await this.$api.delete(`users/${id}`)
      if(res.meta.status !==200){
        this.$message.error(`删除失败!${res.meta.msg}`)
      }
      else{
        this.$message.success('删除成功')
        this.getUsers()
      }
    },
    //点击删除用户弹出提示框
    deleteUserWarn(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUser(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
  },
};
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 10px;
  padding-bottom: 10px;
  .el-col{
      margin-bottom: 20px;
  }
  .block{
    margin-top: 20px;
  }
}
/deep/ .el-card__body{
  padding-bottom: 0;
}
.addBtn {
  margin-left: 30px;
}
</style>