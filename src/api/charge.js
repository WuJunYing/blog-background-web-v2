import fetch from '@/utils/fetch'

export function fetchTreeList(query) {
  return fetch({
    url: '/tree/list',
    method: 'get',
    params: query
  })
}

export function getTableList(query) {
  return fetch({
    url: '/charge/list',
    method: 'get',
    params: query
  })
}
