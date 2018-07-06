import fetch from '@/utils/fetch'
import qs from 'qs'

export const keywordApi = {
  getTableList(data) {
    return fetch({
      url: '/keyword/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/keyword/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/keyword/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/keyword/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const pointApi = {
  getTableList(data) {
    return fetch({
      url: '/scorerule/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/scorerule/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/scorerule/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/scorerule/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const ownerspecialApi = {
  getTableList(data) {
    return fetch({
      url: '/ownerspecial/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/ownerspecial/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/ownerspecial/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/ownerspecial/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  syncRedis(data) {
    return fetch({
      url: '/ownerspecial/syncRedis.json',
      method: 'get',
      params: data
    })
  }
}

export const adverApi = {
  getTableList(data) {
    return fetch({
      url: '/adver/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/adver/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/adver/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/adver/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  lock(data) {
    return fetch({
      url: '/adver/lock.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  unlock(data) {
    return fetch({
      url: '/adver/unlock.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const advercntApi = {
  getTableList(data) {
    return fetch({
      url: '/advercnt/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/advercnt/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/advercnt/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/advercnt/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  syncRedis(data) {
    return fetch({
      url: '/advercnt/syncRedis.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const marketApi = {
  getTableList(data) {
    return fetch({
      url: '/secondhand/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/secondhand/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/secondhand/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/secondhand/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  lock(data) {
    return fetch({
      url: '/secondhand/lock.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  unlock(data) {
    return fetch({
      url: '/secondhand/unlock.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getCommunityList(data) {
    return fetch({
      url: '/propcommunity/queryList.json',
      method: 'get',
      params: data
    })
  }
}

export const mainpostApi = {
  getTableList(data) {
    return fetch({
      url: '/mainpost/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/mainpost/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/mainpost/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/mainpost/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  setHome(data) {
    return fetch({
      url: '/mainpost/setHome.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const mainactiveApi = {
  getTableList(data) {
    return fetch({
      url: '/mainactive/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/mainactive/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/mainactive/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/mainactive/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  syncRedis(data) {
    return fetch({
      url: '/active/syncRedis.json',
      method: 'get',
      params: data
    })
  }
}

export const userpostApi = {
  getTableList(data) {
    return fetch({
      url: '/userpost/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/userpost/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/userpost/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/userpost/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  lock(data) {
    return fetch({
      url: '/userpost/lock.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  unlock(data) {
    return fetch({
      url: '/userpost/unlock.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const usercommentApi = {
  getTableList(data) {
    return fetch({
      url: '/usercomment/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/usercomment/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/usercomment/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/usercomment/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const activeApi = {
  getTableList(data) {
    return fetch({
      url: '/active/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/active/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/active/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/active/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  lock(data) {
    return fetch({
      url: '/active/lock.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  unlock(data) {
    return fetch({
      url: '/active/unlock.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  aduit(data) {
    return fetch({
      url: '/active/aduit.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  reject(data) {
    return fetch({
      url: '/active/reject.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  finish(data) {
    return fetch({
      url: '/active/finish.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  sethome(data) {
    return fetch({
      url: '/active/sethome.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  cancelhome(data) {
    return fetch({
      url: '/active/cancelhome.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  activityPush(data) {
    return fetch({
      url: '/active/activityPush.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const propnoticeApi = {
  getTableList(data) {
    return fetch({
      url: '/propnotice/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/propnotice/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/propnotice/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/propnotice/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  lock(data) {
    return fetch({
      url: '/propnotice/lock.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  unlock(data) {
    return fetch({
      url: '/propnotice/unlock.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const joinsApi = {
  getTableList(data) {
    return fetch({
      url: '/joins/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/joins/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/joins/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/joins/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  setwinner(data) {
    return fetch({
      url: '/joins/setwinner.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  setExchange(data) {
    return fetch({
      url: '/joins/setExchange.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const giftApi = {
  getTableList(data) {
    return fetch({
      url: '/gift/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/gift/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/gift/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/gift/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryList(data) {
    return fetch({
      url: '/gift/queryList.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  cacuRegin(data) {
    return fetch({
      url: '/gift/cacuRegin.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
