import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */

/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* redirect : if `redirect:noredirect` will no redirct in the levelbar
* noDropdown : if `noDropdown:true` will has no submenu
* meta : { role: ['admin'] }  will control the page role
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [
      { path: 'dashboard', component: _import('dashboard/dashboard') }
    ]
  }
]

export const topMenu = [{
  // path: '/system',
  // menuName: '系统管理',
  // icon: 'fa-windows'
}
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/system/merchant',
  //   component: Layout,
  //   name: 'XXX',
  //   icon: 'fa-building-o',
  //   children: [
  //     { path: 'merchant', component: _import('merchant/merchant'), name: '商家列表' },
  //     { path: 'account', component: _import('merchant/account'), name: '商家账户' }
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true, role: 'all' }
]
