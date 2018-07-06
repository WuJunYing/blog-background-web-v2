import { toDataStr } from './index'
import fetch from '@/utils/fetch'
import qs from 'qs'
const defaultSize = 10

export function pageUtilsInstall(Vue) {
  Vue.prototype.$validate = function(formName) {
    return new Promise((resolve, reject) => {
      this.$refs[formName].validate((rs) => {
        if (rs) {
          resolve(rs)
        }
      })
    })
  }

  Vue.prototype.$resetFields = function(formName) {
    return new Promise((resolve, reject) => {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
        resolve()
      })
    })
  }

  Vue.prototype.$myConfirm = function(title, msg = '提示', config = {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }) {
    return new Promise((resolve, reject) => {
      this.$confirm(title, msg, config).then(() => {
        resolve(true)
      }).catch(() => {
        // resolve(false)
      })
    })
  }

  Vue.prototype.$toDataStr = function(val, fmt) {
    return toDataStr(val, fmt)
  }

  Vue.prototype.$has = function(code) {
    const buttonMap = this.$store.getters.buttonMap || {}
    if (!code || buttonMap[code]) {
      return true
    }
    return false
  }

  Vue.prototype.$baseApi = function() {
    return process.env.BASE_API
  }

  Vue.prototype.$http = {
    get: function(url, params) {
      return fetch({
        url: url,
        method: 'get',
        params
      })
    },
    post: function(url, params) {
      return fetch({
        url,
        method: 'post',
        data: qs.stringify(params)
      })
    }
  }

  Vue.prototype.$msg = function(response) {
    if (response.data.code < 0 || response.data.code === undefined) {
      if (response.data.message) {
        this.$notify.error({
          title: '错误',
          message: response.data.message,
          duration: 2000
        })
      }
    } else {
      this.$notify({
        title: '成功',
        message: response.data.message,
        type: 'success',
        duration: 2000
      })
    }
  }

  Vue.prototype.$tip = function(msg) {
    this.$message.warning(msg)
  }

  Vue.prototype.$toQueryString = function(params) {
    return qs.stringify(params)
  }

  // Vue.prototype.$getCode = Vue.$getCode = async function(params) {
  //   const code = params.join ? params.join(',') : params
  //   const response = await fetch({
  //     url: '/dict/code',
  //     method: 'get',
  //     params: { code }
  //   })
  //   return response.data
  // }

  const codeMap = {}
  Vue.prototype.$initCode = async function(code) {
    const codeArray = code.push ? code : [code]
    const requestCode = []
    codeArray.forEach(c => {
      if (!codeMap[c]) {
        requestCode.push(c)
      }
    })
    if (requestCode.length > 0) {
      const rsCodeMap = await getCode(requestCode)
      for (const key in rsCodeMap) {
        codeMap[key] = rsCodeMap[key]
      }
    }
  }

  Vue.prototype.$getCodeMap = function(code) {
    const list = codeMap[code] || []
    const map = {}
    list.forEach(item => {
      map[item.code] = item.fullName
    })
    return map
  }

  const codeToKVMap = {}
  Vue.prototype.$v = function(code, val) {
    let map = codeToKVMap[code]
    if (!map) {
      map = {}
      const list = codeMap[code] || []
      list.forEach(item => {
        map[item.code] = item.fullName
      })
    }
    return map[val] || val
  }

  Vue.filter('v', function(val, code) {
    let map = codeToKVMap[code]
    if (!map) {
      map = {}
      const list = codeMap[code] || []
      list.forEach(item => {
        map[item.code] = item.fullName
      })
    }
    return map[val] || val
  })

  Vue.prototype.$getCodeList = function(code) {
    return codeMap[code] || []
  }

  Vue.prototype.$treeHeight = function(code) {
    return document.documentElement.clientHeight - 150
  }

  /* whc, 价格转换，把分单位价格转换成元 */
  Vue.prototype.$convertMoney = function(cents) {
    if (isNaN(cents)) {
      return ''
    }
    return parseFloat(cents * 0.01 + '').toFixed(2)
  }
  /* end */

  Vue.mixin({
    data() {
      return {
        pageParams: {
          sortName: null,
          sortOrder: null
        }
      }
    },
    methods: {
      $setPage(val) {
        if (window.localStorage) {
          const pageSizes = JSON.parse(window.localStorage.pageSizes || '{}') || {}
          pageSizes[this.$route.path] = val
          window.localStorage.pageSizes = JSON.stringify(pageSizes)
        }
      },
      $getPage(val) {
        if (window.localStorage) {
          const pageSizes = JSON.parse(window.localStorage.pageSizes || '{}') || {}
          return pageSizes[this.$route.path] || defaultSize
        }
        return defaultSize
      },
      $handleSizeChange(val) {
        this.$setPage(val)
        this.pageSize = val
        this.getTableList()
      },
      $handleCurrentChange(val) {
        this.currentPage = val
        this.getTableList()
      },
      $handleFilter() {
        this.currentPage = 1
        this.getTableList()
      },
      $sortChange(params) {
        if (params.prop && params.order) {
          this.pageParams.sortName = params.prop
          this.pageParams.sortOrder = params.order === 'ascending' ? 'asc' : 'desc'
        } else {
          this.pageParams.sortName = null
          this.pageParams.sortOrder = null
        }

        this.getTableList && this.getTableList()
      }
    }
  })
}

async function getCode(params) {
  const code = params.join ? params.join(',') : params
  const response = await fetch({
    url: '/dict/code',
    method: 'get',
    params: { code }
  })
  return response.data
}
