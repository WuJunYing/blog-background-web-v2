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
      { path: 'dashboard', component: _import('dashboard/ktx-index') }
    ]
  }
]

export const topMenu = [{
  path: '/system',
  menuName: '系统管理',
  icon: 'fa-windows'
},
{
  path: '/fund',
  menuName: '资金管理',
  icon: 'fa-diamond'
},
{
  path: '/operation',
  menuName: '运营管理',
  icon: 'fa-th'
}
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/system/merchant',
    component: Layout,
    name: '商家管理',
    icon: 'fa-building-o',
    children: [
      { path: 'merchant', component: _import('merchant/merchant'), name: '商家列表' },
      { path: 'account', component: _import('merchant/account'), name: '商家账户' }
    ]
  },
  {
    path: '/system/product',
    component: Layout,
    name: '产品管理',
    icon: 'fa-th-list',
    children: [
      { path: 'productList', component: _import('product/productList'), name: '产品列表' },
      { path: 'cultivationScheme', component: _import('product/cultivationScheme'), name: '养殖方案' },
      { path: 'landClaim', component: _import('product/landClaim'), name: '土地认领方案' },
      { path: 'label', component: _import('product/label'), name: '产品标签' }
    ]
  },
  {
    path: '/system/order',
    component: Layout,
    name: '订单管理',
    icon: 'fa-list-ol',
    children: [
      { path: 'productOrder', component: _import('order/productOrder'), name: '产品订单管理' },
      { path: 'landOrder', component: _import('order/landOrder'), name: '土地订单管理' }
    ]
  },
  {
    path: '/system/cultivation',
    component: Layout,
    name: '养殖管理',
    icon: 'fa-arrows-alt',
    children: [
      { path: 'cultivation', component: _import('cultivation/cultivation'), name: '养殖列表' }
    ]
  },
  {
    path: '/system/terrace',
    component: Layout,
    name: '平台管理',
    icon: 'fa-address-book-o',
    children: [
      { path: 'duty', component: _import('terrace/duty'), name: '职务管理' },
      { path: 'employee', component: _import('terrace/employee'), name: '员工管理' }
    ]
  },
  {
    path: '/fund/finance',
    component: Layout,
    name: '财务管理',
    icon: 'fa-credit-card-alt',
    children: [
      // { path: 'terraceFinance', component: _import('finance/terraceFinance'), name: '平台财务列表' },
      { path: 'merchantOrder', component: _import('finance/merchantOrder'), name: '商家订单财务' },
      { path: 'merchantFundDetail', component: _import('finance/merchantFundDetail'), name: '商家资金流水明细' },
      { path: 'merchantWithdraw', component: _import('finance/merchantWithdraw'), name: '商家提现' }
    ]
  },
  {
    path: '/fund/business',
    component: Layout,
    name: '业务管理',
    icon: 'fa-pie-chart',
    children: [
      { path: 'gatheringProp', component: _import('business/gatheringProp'), name: '收款比例' }
    ]
  },
  {
    path: '/operation/operation',
    component: Layout,
    name: '运营管理',
    icon: 'fa-th',
    children: [
      { path: 'farmPromotion', component: _import('operation/recommendation'), name: '推广管理' }
    ]
  },
  {
    path: '/operation/community',
    component: Layout,
    name: '社区管理',
    icon: 'fa-th-large',
    children: [
      { path: 'communityList', component: _import('community/communityList'), name: '社区列表' }
    ]
  },
  {
    path: '/operation/comment',
    component: Layout,
    name: '评论管理',
    icon: 'fa-commenting-o',
    children: [
      { path: 'comment', component: _import('comment/comment'), name: '评论列表' }
    ]
  },
  { path: '*', redirect: '/404', hidden: true, role: 'all' }
]
