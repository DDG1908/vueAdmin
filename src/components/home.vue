<template>
	<div>
		<el-container>
			<el-header class="header">
				<div>
					<img class="header-img" src="../assets/logo.png" />
					<span>大大怪后台管理</span>
				</div>
				 <el-button type="info" @click="logout">退出</el-button>
			</el-header>
			<el-container>
				<el-aside width="200px" class="aside">会员管理</el-aside>
				<el-main class="main">主题</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			logout(){
				window.sessionStorage.clear('token')
				this.$router.replace('/login')
			}
		}
	}
</script>

<style lang="less" scoped>
.el-container{
	height: 100vh;
}
.header{
	display: flex;
	justify-content: space-between;
	background-color: #373D41;
	div{
		display: flex;
		align-items: center;
	}
	img{
		width: 50px;
		height: 50px;
	}
	span{
		margin-left: 20px;
	}
}
// .header-img{
// 	width: 50px;
// 	height: 50px;
// }
.aside{
	background-color: #333744;
}
.main{
	background-color: #EAEDf1;
}
</style>
