import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
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
      {path: '/roles', component: () => import("../components/user/Users.vue")}

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
