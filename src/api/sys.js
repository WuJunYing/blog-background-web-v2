import fetch from '@/utils/fetch'
import qs from 'qs'

export const detpApi = {
  getDeptTree() {
    return fetch({
      url: '/cpy/queryList.json',
      method: 'get'
    })
  },
  getDeptList(data) {
    return fetch({
      url: '/depart/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insertDept(data) {
    return fetch({
      url: '/depart/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  updateDept(data) {
    return fetch({
      url: '/depart/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  deleteDept(data) {
    return fetch({
      url: '/depart/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getDeptSelectList(params = {}) {
    return fetch({
      url: '/depart/queryListTree.json',
      method: 'get',
      params
    })
  }
}

export const estateApi = {
  getTableList(data) {
    return fetch({
      url: '/propcommunity/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/propcommunity/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/propcommunity/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/propcommunity/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getAreaList(data) {
    return fetch({
      url: '/area/getArea.json',
      method: 'get',
      params: data
    })
  }
}

export const logApi = {
  getTableList(data) {
    return fetch({
      url: '/systemlog/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  deleteLog(data) {
    return fetch({
      url: '/systemlog/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const appApi = {
  getTableList(data) {
    return fetch({
      url: '/appVersion/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/appVersion/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/appVersion/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/appVersion/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  valify(data) {
    return fetch({
      url: '/appVersion/valify.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const codeApi = {
  getTableList(data) {
    return fetch({
      url: '/personrelationtype/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/personrelationtype/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/personrelationtype/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/personrelationtype/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const systemCodeApi = {
  getTableList(data) {
    return fetch({
      url: '/systemdictionary/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/systemdictionary/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/systemdictionary/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/systemdictionary/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const wuyeNodeApi = {
  getTableList(data) {
    return fetch({
      url: '/systemprocess/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/systemprocess/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/systemprocess/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/systemprocess/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const roleApi = {
  getTableList(data) {
    return fetch({
      url: '/baserole/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/baserole/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/baserole/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/baserole/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryList(data) {
    return fetch({
      url: '/baserole/queryList.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryMenutree(data) {
    return fetch({
      url: '/basemodule/querytree.json',
      method: 'get',
      params: data
    })
  },
  queryButtonlist(data) {
    return fetch({
      url: '/basebutton/querylist.json',
      method: 'get',
      params: data
    })
  },
  saveRoleRight(data) {
    return fetch({
      url: '/baserole/saveRoleRight.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const userApi = {
  getTableList(data) {
    return fetch({
      url: '/baseuser/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/baseuser/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/baseuser/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/baseuser/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getUserSelectList(data = {}) {
    return fetch({
      url: ' /baseuser/queryUserTree.json',
      method: 'get',
      params: data
    })
  },
  queryList(data) {
    return fetch({
      url: ' /baseuser/queryList.json',
      method: 'get',
      params: data
    })
  },
  queryById(data) {
    return fetch({
      url: ' /baseuser/queryById.json',
      method: 'get',
      params: data
    })
  },
  reset(data) {
    return fetch({
      url: ' /baseuser/reset.json',
      method: 'get',
      params: data
    })
  },
  lock(data) {
    return fetch({
      url: ' /baseuser/lock.json',
      method: 'get',
      params: data
    })
  },
  unlock(data) {
    return fetch({
      url: ' /baseuser/unlock.json',
      method: 'get',
      params: data
    })
  },
  saveAppRight(data) {
    return fetch({
      url: ' /appRight/saveAppRight.json',
      method: 'get',
      params: data
    })
  }
}

export const userpermissionApi = {
  getTableList(data) {
    return fetch({
      url: '/userpermission/queryBulidingUserByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/userpermission/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/userpermission/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/userpermission/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  setCustomerService(data) {
    return fetch({
      url: '/userpermission/setCustomerService.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  updateDefaultCService(data) {
    return fetch({
      url: '/userpermission/updateDefaultCService.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  cancelDefaultCService(data) {
    return fetch({
      url: '/userpermission/cancelDefaultCService.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  updateFirstDealUser(data) {
    return fetch({
      url: '/userpermission/updateFirstDealUser.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getList(data) {
    return fetch({
      url: '/userpermission/queryList.json',
      method: 'get',
      params: data
    })
  }
}

export const propofficeApi = {
  getTableList(data) {
    return fetch({
      url: '/propoffice/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/propoffice/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/propoffice/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/propoffice/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getList(data) {
    return fetch({
      url: '/propoffice/queryList.json',
      method: 'get',
      params: data
    })
  }
}

export const propofficebuildingApi = {
  getList(data) {
    return fetch({
      url: '/propofficebuilding/queryList.json',
      method: 'get',
      params: data
    })
  },
  update(data) {
    return fetch({
      url: '/propofficebuilding/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
