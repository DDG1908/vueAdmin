import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
	  path: '/login',
	  name: 'login',
	  component: () => import('../components/login.vue')
  },
  {
	  path: '/home',
	  component: () => import('../components/home.vue'),
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: () => import('../components/welcome.vue')},
      {path: '/users', component: () => import("../components/user/Users.vue")},
      {path: '/rights', component: () => import("../components/power/Rights.vue")},
      {path: '/roles', component: () => import("../components/power/Roles.vue")}
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next) => {
	if(to.path === '/login') return next()
	if(window.sessionStorage.getItem('token')) return next()
	return next('/login')
})

export default router
