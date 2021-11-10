<template>
  <div>
    <el-container>
		<!-- 头部 -->
      <el-header class="header">
        <div>
          <img class="header-img" src="../assets/logo.png" />
          <span>大大怪后台管理</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
	  
      <el-container>
		  <!-- 左边菜单栏 -->
        <el-aside :width="iscollapse ? '60px' : '200px'" class="aside">
					<div class="collapse" @click="chanceCollapse">
						| | |
					</div>
          <el-menu
            default-active="2"
						:unique-opened="true"
						:collapse="iscollapse"
						:collapse-transition="false"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409EFF"
          >
		  	<!-- 一级菜单 -->
            <el-submenu :index="String(item.id)" v-for="item in Menuslist" :key="item.id">
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
			  <!-- 二级菜单 -->
              <el-menu-item-group>
                <el-menu-item :index="String(citem.id)" v-for="citem in item.children" :key="citem.id">
					<i class="el-icon-menu"></i>
                	<span>{{citem.authName}}</span>
				</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>

		<!-- 右边主体区 -->
        <el-main class="main">主题</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
		Menuslist: [],
		iconsObj:{
			'125': 'iconfont icon-yonghu',
			'103': 'iconfont icon-quanxian',
			'101': 'iconfont icon-24gf-bag',
			'102': 'iconfont icon-zhangdan',
			'145': 'iconfont icon-shujutongji',
		},
		iscollapse: false,
	};
  },
  created(){
	  this.getMenulist()
	  
  },
  methods: {
	//退出登陆
    logout() {
      window.sessionStorage.clear("token");
      this.$router.replace("/login");
    },
	//获取左侧列表数据
	async getMenulist(){
		const res = await this.$api('/menus')
		this.Menuslist = res.data.data
		console.log(this.Menuslist)
	},
	// 左侧菜单栏伸缩
	chanceCollapse(){
		this.iscollapse = !this.iscollapse
	}
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100vh;
}
.header {
  display: flex;
  justify-content: space-between;
  background-color: #373d41;
  div {
    display: flex;
    align-items: center;
  }
  img {
    width: 50px;
    height: 50px;
  }
  span {
	  color: #fff;
    margin-left: 20px;
  }
}
.aside {
  background-color: #545c64;
  .iconfont{
	  margin-right: 5px;
  }
  .el-menu{
	  border: none;
  }
	.collapse{
		background-color: #4a5064;
		text-align: center;
	}
}
.main {
  background-color: #eaedf1;
}
</style>
