<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表 -->
    <el-card>
        <el-col :span="6" class="addBtn">
            <el-button type="primary" @click="changeDialogVisible">添加角色</el-button>
        </el-col>
        <el-table :data="rolesList" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
            <el-table-column prop="" label="操作">
                <!-- <template v-slot="role">
                    <el-button type="primary" @click="changeEditDialogVisible(user.row)" icon="el-icon-edit" size="mini"></el-button>
                    <el-button type="danger" @click="deleteUserWarn(user.row.id)" icon="el-icon-delete" size="mini"></el-button>
                    <el-button type="info" icon="el-icon-setting" size="mini"></el-button>
                </template> -->
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 添加用户弹窗 -->
    <!-- <el-dialog
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
    </el-dialog> -->
  </div>
</template>

<script>
export default {
    data() {
        return{
            rolesList: [],
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        async getRolesList(){
            const {data:res} = await this.$api('roles')
            if(res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败！')
            }
            this.rolesList = res.data
            console.log(this.rolesList);
        },
        //添加用户弹窗
        changeDialogVisible(){
        this.dialogVisible = true
        },
    }
}
</script>

<style lang="less" scoped>
.addBtn {
  margin-bottom: 20px;
}
</style>