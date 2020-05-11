import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/welcome',
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home'),
    children: [
      {
        path: '/welcome',
        component: () => import(/* webpackChunkName: "Welcome" */ '../components/Welcome')
      },
      {
        path: '/users',
        component: () => import(/* webpackChunkName: "User" */ '../components/user/User'),
        props: { menu: '用户管理', submenu: '用户列表' }
      },
      {
        path: '/roles',
        component: () => import(/* webpackChunkName: "Roles" */ '../components/power/Roles'),
        props: { menu: '权限管理', submenu: '角色列表' }
      },
      {
        path: '/rights',
        component: () => import(/* webpackChunkName: "Rights" */ '../components/power/Rights'),
        props: { menu: '权限管理', submenu: '权限列表' }
      },
      {
        path: '/goods',
        component: () => import(/* webpackChunkName: "Goods" */ '../components/good/Goods'),
        props: { menu: '商品管理', submenu: '商品列表' }
      },
      {
        path: '/params',
        component: () => import(/* webpackChunkName: "params" */ '../components/good/Params'),
        props: { menu: '商品管理', submenu: '分类参数' }
      },
      {
        path: '/categories',
        component: () => import(/* webpackChunkName: "categories" */ '../components/good/Categories'),
        props: { menu: '商品管理', submenu: '商品分类' }
      },
      {
        path:"/orders",
        component: () => import(/* webpackChunkName: "orders" */ '../components/order/Order'),
        props: { menu: '订单管理', submenu: '订单列表' }
      },
      {
        path:"/reports",
        component:()=>import( /* webpackChunkName: "reports" */"../components/reports/reports"),
        props:{menu:"数据统计",submenu:'数据报表'}
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/Login')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const tokenstr = sessionStorage.getItem('token')
  if (!tokenstr) {
    return next('/login')
  }
  next()
})

export default router


