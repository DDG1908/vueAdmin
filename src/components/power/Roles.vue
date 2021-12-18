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
              <template v-slot="role">
                  <el-button type="primary" @click="changeEditDialogVisible(role.row)" icon="el-icon-edit" size="mini">编辑</el-button>
                  <el-button type="danger" @click="deleteUserWarn(role.row.id)" icon="el-icon-delete" size="mini">删除</el-button>
                  <el-button type="warning" @click="setRolesDialog(role.row)" icon="el-icon-setting" size="mini">分配权限</el-button>
              </template>
          </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户弹窗 -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="30%"
      @close="dialogClose">
      <el-form :model="addRolesForm" :rules="addRolesRules" ref="addUserFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户弹窗 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClose">
      <el-form :model="editRolesForm" :rules="addRolesRules" ref="editUserFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRolesDialogVisible"
      width="30%"
      @close="seletedRightsIdList=[]">
        <el-tree 
        :data="rightsList" 
        :props="defaultProps" 
        :default-checked-keys="seletedRightsIdList"
        ref="rightsTree"
        node-key="id"
        default-expand-all
        show-checkbox>
        </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button @click="setRolesSubmit" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return{
            rolesList: [],
            rightsList: [],
            seletedRightsIdList: [],//默认选中的权限的id值数组
            defaultProps: {
              children: 'children',
              label: 'authName'
            },
            addRolesForm: {
              roleName: '',
              roleDesc: ''
            },
            editRolesForm: {
              roleName: '',
              roleDesc: '',
              id: '',
            },
            addRolesRules: {
              roleName: [
                  { required: true, message: '请输入用户名', trigger: 'blur' },
              ]
            },
            dialogVisible: false,
            editDialogVisible: false,
            setRolesDialogVisible: false,
            roleId: '',//分配权限时用的角色id
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
      // 获取角色列表
        async getRolesList(){
            const {data:res} = await this.$api('roles')
            console.log(res);
            if(res.meta.status !== 200) {
                return this.$message.error(`获取角色列表失败！${res.meta.msg}`)
            }
            this.rolesList = res.data
            console.log(this.rolesList);
        },
        //添加用户弹窗
        changeDialogVisible(){
          this.dialogVisible = true
        },
        // 关闭添加用户弹窗清空表单
        dialogClose(){
          this.$refs.addUserFormRef.resetFields()
        },
        //添加角色
        async addRolesSubmit(){
          if(this.addRolesForm.roleName){
            let {data:res} = await this.$api.post('/roles',this.addRolesForm)
            if(res.meta.status !== 201) {
              this.$message.error('添加失败！')
            }
            else{
              this.$message.success('添加成功！')
              this.getRolesList()
              this.dialogVisible = false
            }
          }
          else{
            this.$message.error('角色名称不能为空！')
          }
        },
        // 删除角色
        async deleteRole(id){
          let {data:res} = await this.$api.delete(`/roles/${id}`)
          if(res.meta.status !== 200){
            this.$message.error(`删除失败!${res.meta.msg}`)
          }
          else{
            console.log(res);
            this.getRolesList()
            this.$message.success('删除成功！')
          }
        },
        //点击删除角色弹出提示框
        deleteUserWarn(id) {
          this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteRole(id)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        },
        //编辑角色弹窗
        changeEditDialogVisible(row){
          this.editRolesForm.roleName = row.roleName
          this.editRolesForm.roleDesc = row.roleDesc
          this.editRolesForm.id = row.id
          this.editDialogVisible = true
        },
        // 关闭编辑角色弹窗清空表单
        editDialogClose(){
          this.$refs.editUserFormRef.resetFields()
        },
        //提交编辑角色
        async editRolesSubmit(){
          let {data:res} = await this.$api.put(`/roles/${this.editRolesForm.id}`,this.editRolesForm)
          console.log(res);
          if(res.meta.status !== 200){
            this.$message.error('编辑失败！')
          }
          else{
            this.getRolesList()
            this.editDialogVisible = false
            this.$message.success('编辑成功！')
          }
        },
        // 分配权限弹窗
        setRolesDialog(row){
          this.getRightsList()
          this.getSeletedRightsIdList(row,this.seletedRightsIdList)
          console.log(this.seletedRightsIdList);
          this.setRolesDialogVisible = true
          this.roleId = row.id
        },
        // 获取权限列表
        async getRightsList(){
          let {data:res} = await this.$api.get('rights/tree')
          this.rightsList = res.data
        },
        //递归角色已有权限
        getSeletedRightsIdList(node,arr){
          if(!node.children) {
            return arr.push(node.id)
          }
          node.children.forEach(item => {
            this.getSeletedRightsIdList(item,arr)
          });
        },
        // 分配权限提交
        async setRolesSubmit(){
          let idArr = [
            ...this.$refs.rightsTree.getCheckedKeys(),
            ...this.$refs.rightsTree.getHalfCheckedKeys()
          ]
          let idArrToString = idArr.join(',')
          let {data:res} = await this.$api.post(`/roles/${this.roleId}/rights`,{rids:idArrToString})
          console.log(res);
          if(res.meta.status !== 200) {
            return this.$message.error('操作失败！')
          }
          this.getRolesList()
          this.setRolesDialogVisible = false
          this.$message.success('分配成功！')
        }
    }
}
</script>

<style lang="less" scoped>
.addBtn {
  margin-bottom: 20px;
}
</style>