<template>
	<div class="login">
		<el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="loginForm">
		  <el-form-item label="账号:" prop="username">
		    <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
		  </el-form-item>
		  <el-form-item label="密码:" prop="password">
		    <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
		  </el-form-item>
		  <el-form-item class="btn">
		      <el-button type="primary" @click="submitForm('loginForm')">登陆</el-button>
		      <el-button @click="resetForm('loginForm')">重置</el-button>
		    </el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				loginForm: {
					username: 'admin',
					password: '123456',
				},
				rules: {
					username: [
						{ required: true, message: '请输入账号', trigger: 'blur' },
						{ min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
					]
				}
			}
		},
		created() {
			
		},
		methods:{
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
				          if (!valid) return
						  this.$api.post('/login',this.loginForm).then(res => {
							  if(res.data.meta.status == 200){
								  window.sessionStorage.setItem('token',res.data.data.token)
								  this.$router.push('/home')
								  console.log(res.data)
								  this.$message({
									  type: 'success',
									  message: '登陆成功'
								  });
								  
							  }
							  else{
								this.$message.error('登陆失败')
							  }
						  })
				        })
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style lang="less" scoped>
.login{
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	width: 450px;
	height: 300px;
	background-color: #1c4587;
}
.loginForm{
	margin-top: 50px;
	width: 80%;
}
.btn{
	float: right;
	margin-top: 40px;
}
</style>
