<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表 -->
    <el-table :data="rightsList" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
            <template v-slot="rights">
                <el-tag v-if="rights.row.level == 0">一级</el-tag>
                <el-tag v-if="rights.row.level == 1" type="success">二级</el-tag>
                <el-tag v-if="rights.row.level == 2" type="warning">三级</el-tag>
            </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
    data(){
        return {
            rightsList: [],
        }
    },
    created(){
        this.getRightsList()
    },
    methods: {
        // 获取权限列表数据
        async getRightsList(){
           let {data:res} = await this.$api('rights/list')
           if(res.meta.status !== 200){
               this.$message.error('获取权限列表数据失败！')
           }
           console.log(res);
           this.rightsList = res.data
        }
    }
}
</script>

<style lang="less" scoped>

</style>