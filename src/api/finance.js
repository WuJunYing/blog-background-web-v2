import fetch from 'utils/fetch'
import qs from 'qs'

/**
 * 财务接口
 */
export const financeApi = {
  // 获取平台财务列表
  getPlatformFinanceList(data) {
    return fetch({
      url: '/finance/getPlatformFinanceList',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 导出平台财务列表
  exportPlatformFinance(params) {
    return '/finance/exportPlatformFinance?' + qs.stringify(params)
  },

  // 获取商家订单财务列表
  getMechantFinanceList(data) {
    return fetch({
      url: '/finance/getMechantOrderFinanceByPage',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 导出商家订单财务列表
  exportMechantOrderFinance(params) {
    return '/finance/exportMechantOrderFinance?' + qs.stringify(params)
  },

  // 获取商家资金流水明细列表
  getMechantFinanceDetail(data) {
    return fetch({
      url: '/financeDeatil/getMechantFinanceDetailByPage',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 导出 商家资金流水明细列表
  exportMechantFinanceDeatil(params) {
    return '/financeDeatil/exportMechantFinanceDetail?' + qs.stringify(params)
  },
  getDetail(data) {
    return fetch({
      url: '/financeDeatil/getDetail',
      method: 'post',
      data: qs.stringify(data)
    })
  },

  // 获取商家提现列表
  getMechantWithdraw(data) {
    return fetch({
      url: '/finance/getMechantWithdrawByPage',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 导出商家提现列表
  exportMechantWithdraw(params) {
    return '/finance/exportMechantWithdraw?' + qs.stringify(params)
  },
  // 导出商家提现列表
  exportAuditData(params) {
    return '/finance/exportAuditData?' + qs.stringify(params)
  },
  // 审核提现
  auditWithdraw(data) {
    return fetch({
      url: '/finance/auditWithdraw',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
