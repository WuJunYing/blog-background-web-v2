import fetch from '@/utils/fetch'
import qs from 'qs'

export const propbuildApi = {
  getTableList(data) {
    return fetch({
      url: '/propbuild/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/propbuild/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/propbuild/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/propbuild/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getList(data) {
    return fetch({
      url: '/propbuild/queryList.json',
      method: 'get',
      params: data
    })
  }
}

export const propunitApi = {
  getTableList(data) {
    return fetch({
      url: '/propunit/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/propunit/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/propunit/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/propunit/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getList(data) {
    return fetch({
      url: '/propunit/queryList.json',
      method: 'get',
      params: data
    })
  }
}

export const proproomApi = {
  getTableList(data) {
    return fetch({
      url: '/proproom/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/proproom/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/proproom/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/proproom/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getList(data) {
    return fetch({
      url: '/proproom/queryList.json',
      method: 'get',
      params: data
    })
  }
}

export const telephoneApi = {
  getTableList(data) {
    return fetch({
      url: '/telephone/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/telephone/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/telephone/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/telephone/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const propParkApi = {
  getTableList(data) {
    return fetch({
      url: '/propPark/queryPropParkPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/propPark/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/propPark/updatePropPark.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/propPark/deltePropPark.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryList(data) {
    return fetch({
      url: '/propPark/queryList.json',
      method: 'get',
      params: data
    })
  }
}

export const propCarApi = {
  getTableList(data) {
    return fetch({
      url: '/propCar/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/propCar/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/propCar/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/propCar/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const debitprotocolentryApi = {
  getTableList(data) {
    return fetch({
      url: '/debitprotocolentry/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/debitprotocolentry/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/debitprotocolentry/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/debitprotocolentry/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const personrelationApi = {
  getTableList(data) {
    return fetch({
      url: '/personrelation/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/personrelation/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/personrelation/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/personrelation/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const personinfoApi = {
  getTableList(data) {
    return fetch({
      url: '/personinfo/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/personinfo/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/personinfo/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/personinfo/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const userrepairApi = {
  getTableList(data) {
    return fetch({
      url: '/userrepair/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/userrepair/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/userrepair/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/userrepair/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryRepairStatus(data) {
    return fetch({
      url: '/userrepair/queryRepairStatus.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryById(data) {
    return fetch({
      url: '/userrepair/queryById.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  answerUser(data) {
    return fetch({
      url: '/userrepair/answerUser.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  insertRepairStatus(data) {
    return fetch({
      url: '/userrepair/insertRepairStatus.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const userpraiseApi = {
  getTableList(data) {
    return fetch({
      url: '/userpraise/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/userpraise/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/userpraise/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/userpraise/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryPraiseStatus(data) {
    return fetch({
      url: '/userpraise/queryPraiseStatus.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryById(data) {
    return fetch({
      url: '/userpraise/queryById.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  answerUser(data) {
    return fetch({
      url: '/userpraise/answerUser.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  insertPraiseStatus(data) {
    return fetch({
      url: '/userpraise/insertPraiseStatus.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const reportApi = {
  queryPropDataPerspective(data) {
    return fetch({
      url: '/propFeeReport/queryPropDataPerspective.json',
      method: 'get',
      params: data
    })
  },
  queryPropFinanceReport(data) {
    return fetch({
      url: '/propFeeReport/queryPropFinanceReport.json',
      method: 'get',
      params: data
    })
  },
  queryByPage(data) {
    return fetch({
      url: '/propFeeReport/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  queryJudgementReport(data) {
    return fetch({
      url: '/propFeeReport/queryJudgementReport.json',
      method: 'get',
      params: data
    })
  },
  queryPropIncomeStatistics(data) {
    return fetch({
      url: '/propFeeReport/queryPropIncomeStatistics.json',
      method: 'get',
      params: data
    })
  }
}

export const chargeitemApi = {
  getTableList(data) {
    return fetch({
      url: '/chargeitem/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/chargeitem/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/chargeitem/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/chargeitem/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryList(data) {
    return fetch({
      url: '/chargeitem/queryList.json',
      method: 'get',
      params: data
    })
  }
}

export const auditerrorbillApi = {
  update(data) {
    return fetch({
      url: '/errorBillAudit/resubmitErrorBill.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const ticketApi = {
  getTableList(data) {
    return fetch({
      url: '/ticket/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/ticket/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/ticket/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/ticket/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryAll(data) {
    return fetch({
      url: '/ticket/queryAll.json',
      method: 'get',
      params: data
    })
  },
  queryTicket(data) {
    return fetch({
      url: '/ticket/queryTicket.json',
      method: 'post',
      params: data
    })
  }
}

export const propparkareaApi = {
  getTableList(data) {
    return fetch({
      url: '/propparkarea/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/propparkarea/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/propparkarea/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/propparkarea/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryList(data) {
    return fetch({
      url: '/propparkarea/queryList.json',
      method: 'get',
      params: data
    })
  }
}

export const roomchargeApi = {
  getTableList(data) {
    return fetch({
      url: '/roomcharge/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/roomcharge/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/roomcharge/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/roomcharge/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  batchDelete(data) {
    return fetch({
      url: '/roomcharge/batchDelete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const parkchargeApi = {
  insert(data) {
    return fetch({
      url: '/parkcharge/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  batchDelete(data) {
    return fetch({
      url: '/parkcharge/batchDelete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

export const roombillApi = {
  getTableList(data) {
    return fetch({
      url: '/roombill/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/roombill/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/roombill/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/roombill/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  updateRoomBillPrice(data) {
    return fetch({
      url: '/roombill/updateRoomBillPrice.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  savePayDemo(data) {
    return fetch({
      url: '/roombill/savePayDemo.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  disCountBill(data) {
    return fetch({
      url: '/roombill/disCountBill.json',
      method: 'post',
      params: data
    })
  },
  charge(data) {
    return fetch({
      url: '/roombill/charge.json',
      method: 'post',
      params: data
    })
  },
  cancel(data) {
    return fetch({
      url: '/roombill/cancel.json',
      method: 'post',
      params: data
    })
  }
}
export const propofficechargeApi = {
  getTableList(data) {
    return fetch({
      url: '/propofficecharge/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/propofficecharge/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/propofficecharge/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/propofficecharge/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryList(data) {
    return fetch({
      url: '/propofficecharge/queryList.json',
      method: 'get',
      params: data
    })
  }
}

export const syssettingApi = {
  getTableList(data) {
    return fetch({
      url: '/syssetting/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  insert(data) {
    return fetch({
      url: '/syssetting/insert.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  update(data) {
    return fetch({
      url: '/syssetting/update.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  remove(data) {
    return fetch({
      url: '/syssetting/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryList(data) {
    return fetch({
      url: '/syssetting/queryList.json',
      method: 'get',
      params: data
    })
  },
  queryUserSetting() {
    return fetch({
      url: '/syssetting/queryUserSetting.json',
      method: 'get'
    })
  }
}

export const chargeitemexpandApi = {
  insertsOrUpdates(data) {
    return fetch({
      url: '/chargeitemexpand/insertsOrUpdates.json',
      method: 'post',
      data: data
    })
  },
  delete(data) {
    return fetch({
      url: '/chargeitemexpand/delete.json',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryByItemNo(data) {
    return fetch({
      url: '/chargeitemexpand/queryByItemNo.json',
      method: 'get',
      params: data
    })
  }
}

export const orderPayApi = {
  getTableList(data) {
    return fetch({
      url: '/orderPay/queryByPage.json',
      method: 'get',
      params: data
    })
  },
  queryPayBillDetail(data) {
    return fetch({
      url: '/orderPay/queryPayBillDetail.json',
      method: 'get',
      params: data
    })
  }
}
