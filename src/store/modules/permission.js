import { asyncRouterMap, constantRouterMap, topMenu } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(menuMap, route, path) {
  if (route.role === 'all') {
    menuMap[path] = true
  }
  if (menuMap[path]) {
    return true
  }
  return false
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, menuMap, parentPath = '', notAccessPath) {
  const accessedRouters = asyncRouterMap.filter(route => {
    let rs = false
    const fullPath = parentPath + (parentPath ? '/' : '') + route.path
    if (hasPermission(menuMap, route, fullPath)) {
      rs = true
    }
    if (route.children && route.children.length > 0) {
      route.children = filterAsyncRouter(route.children, menuMap, route.path, notAccessPath)
      if (!rs && route.children.length > 0) {
        rs = true
      }
    }
    if (!rs) {
      notAccessPath[fullPath] = true
    }

    if (rs && route.children && route.children.length > 0) {
      const list = route.children
      let flag = false
      for (let i = 0; i < list.length; i++) {
        const child = list[i]
        if (!child.hidden) {
          flag = true
        }
      }
      if (!flag) {
        route.hidden = true
      }
    }
    return rs
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    topMenu: [],
    topMenuActive: null,
    accessedPathMap: {},
    notAccessPathMap: {},
    buttonMap: {}
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_TOPMENU: (state, topMenu) => {
      state.topMenu = topMenu
    },
    SET_ACCESSED_PATH_MAP: (state, accessedPathMap) => {
      state.accessedPathMap = accessedPathMap
    },
    SET_NOT_ACCESS_PATH_MAP: (state, notAccessPathMap) => {
      state.notAccessPathMap = notAccessPathMap
    },
    SET_BUTTON_MAP: (state, buttonMap) => {
      state.buttonMap = buttonMap
    },
    SET_ACTIVE_MENU: (state, topMenuActive) => {
      state.topMenuActive = topMenuActive
    },
    SET_ACTIVE_MENU_BY_RUL: (state, url) => {
      const topMenu = state.topMenu
      for (let i = 0; i < topMenu.length; i++) {
        const item = topMenu[i]
        if (url.indexOf(item.path) === 0) {
          if (state.topMenuActive !== item.path) {
            state.topMenuActive = item.path
          }
          return
        }
      }

      if (topMenu.length && state.topMenuActive !== topMenu[0].path) {
        state.topMenuActive = topMenu[0].path
      }
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { menuMap, buttonMap } = data
        let accessedRouters
        const notAccessPath = []
        if (!menuMap) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, menuMap, '', notAccessPath)
        }
        const topMap = {}
        accessedRouters.forEach(menu => {
          if (!menu.hidden) {
            const splits = menu.path.split('/')
            topMap['/' + splits[1]] = true
          }
        })

        const topMenus = []
        topMenu.forEach(m => {
          if (topMap[m.path]) {
            topMenus.push(m)
          }
        })

        constantRouterMap.concat(accessedRouters).forEach(menu => {
          if (menu.children) {
            menu.children.forEach(childMenu => {
              menuMap[menu.path + (menu.path === '/' ? '' : '/') + childMenu.path] = true
            })
          }
          menuMap[menu.path] = true
        })
        commit('SET_TOPMENU', topMenus)
        commit('SET_ROUTERS', accessedRouters)
        commit('SET_ACCESSED_PATH_MAP', menuMap)
        commit('SET_NOT_ACCESS_PATH_MAP', notAccessPath)
        commit('SET_BUTTON_MAP', buttonMap)
        resolve()
      })
    },
    setActiveMenu({ commit }, topMenuActive) {
      commit('SET_ACTIVE_MENU', topMenuActive)
    },
    setActiveMenuByUrl({ commit }, url) {
      commit('SET_ACTIVE_MENU_BY_RUL', url)
    }
  }
}

export default permission
