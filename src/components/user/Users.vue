<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-col :span="6">
            <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
        <el-col :span="6" class="addBtn">
            <el-button type="primary">添加用户</el-button>
        </el-col>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
            params: {
                query: '',
                pagenum:'1',
                pagesize:'10'
            },
            userList: [],
            total: 0,
        }
    },
    created(){
        this.getUsers()
    },
    methods:{
        async getUsers(){
            let res = await this.$api('/users',{params:this.params})
            console.log(res);
            this.userList = res.data.data.users
            this.total = res.data.data.total
        }
    }
};
</script>

<style lang="less" scoped>
.box-card{
    margin-top: 10px;
    padding-bottom: 10px;
}
.addBtn{
    margin-left: 30px;
}
</style>