const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routers: state => {
    const list = state.permission.routers
    // whc, list为undefined时返回空数组
    if (!list) {
      return []
    }
    // return list
    const topMenuActive = state.permission.topMenuActive
    return list.filter((item) => {
      return item.path.indexOf(topMenuActive) === 0
    })
  },
  addRouters: state => state.permission.addRouters,
  topMenu: state => state.permission.topMenu,
  topMenuActive: state => state.permission.topMenuActive,
  accessedPathMap: state => state.permission.accessedPathMap,
  notAccessPathMap: state => state.permission.notAccessPathMap,
  buttonMap: state => state.permission.buttonMap,
  todoNum: state => state.user.todoNum // 代办任务数
}
export default getters

