// import Cookies from 'js-cookie'

function getSidebarStatus() {
  if (window.localStorage) {
    return !+window.localStorage.sidebarStatus
  }
  return true
}

function setSidebarStatus(val) {
  if (window.localStorage) {
    window.localStorage.sidebarStatus = val
  }
}

const app = {
  state: {
    sidebar: {
      opened: getSidebarStatus()
    },
    visitedViews: []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        // Cookies.set('sidebarStatus', 1)
        setSidebarStatus(1)
      } else {
        setSidebarStatus(0)
        // Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push({ name: view.name, path: view.path, fullPath: view.fullPath })
    },
    DEL_VISITED_VIEWS: (state, view) => {
      let index
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          index = i
          break
        }
      }
      state.visitedViews.splice(index, 1)
    }
  },
  actions: {
    ToggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    addVisitedViews({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    }
  }
}

export default app
