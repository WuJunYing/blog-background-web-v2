// import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权

// permissiom judge
function hasPermission(path) {
  const accessedPathMap = store.getters.accessedPathMap
  if (accessedPathMap[path]) {
    return true
  }
  return false
}

// register global progress.
NProgress.configure({ minimum: 0.8, ease: 'ease', speed: 1000, showSpinner: false })
const whiteList = ['/login', '/authredirect']// 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start() // 开启Progress
  if (getToken()) { // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          // const roles = res.data.role
          // const menuMap = res.data.menuMap
          store.dispatch('GenerateRoutes', { ...res.data }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            store.dispatch('setActiveMenuByUrl', to.path)
            next({ ...to }) // hack方法 确保addRoutes已完成
          })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/login' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (to.path === '/404') {
          const notAccessPathMap = store.getters.notAccessPathMap
          let redirectedFrom = to.redirectedFrom
          if (redirectedFrom.indexOf('?') > -1) {
            redirectedFrom = redirectedFrom.split('?')[0]
          }
          if (notAccessPathMap[redirectedFrom]) {
            next({ path: '/401' })
          } else {
            next()
          }
        } else {
          if (hasPermission(to.path)) {
            try {
              // const component = to.matched[to.matched.length - 1].components.default
              // const methods = component.methods
              // const initMethod = []
              // for (const key in methods) {
              //   if (key.indexOf('_init') === 0) {
              //     initMethod.push(methods[key])
              //   }
              // }
              // if (component.dict || initMethod.length > 0) {
              //   const rs = []
              //   initMethod.forEach(m => {
              //     rs.push(m())
              //   })

              //   if (component.dict) {
              //     rs.push(Vue.$initCode(component.dict))
              //   }
              //   Promise.all(rs).then(_ => {
              //     next()
              //   })
              // } else {
              //   next()
              // }
              next()
            } catch (ex) {
              console.log(ex)
              next()
            }
          } else {
            next({ path: '/401' })
          }
        }
        // 可删 ↑
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
