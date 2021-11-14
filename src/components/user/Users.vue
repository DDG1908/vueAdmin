<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <!-- 搜索框 -->
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          v-model="inputTxt"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <!-- 按钮 -->
      <el-col :span="6" class="addBtn">
        <el-button type="primary">添加用户</el-button>
      </el-col>
        <!-- 用户列表 -->
      <el-table :data="this.userList" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
            <template v-slot="user">
                <el-switch v-model="user.row.mg_state"></el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
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
          :hide-on-single-page="total <= params.pagesize"
          :current-page="params.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      params: {
        query: "",
        // 当前页
        pagenum: 1,
        // 一页多少条
        pagesize: 1,
      },
      inputTxt: '',
      userList: [],
      total: 0,
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
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
  },
};
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 10px;
  padding-bottom: 10px;
  height: 85vh;
  .el-col{
      margin-bottom: 20px;
  }
}
.addBtn {
  margin-left: 30px;
}
</style>