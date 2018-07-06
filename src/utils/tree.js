
export function format(data = []) {
  const map = {}
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    map[item.companyId] = item
  }

  const root = []
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const parent = map[item.parentId]
    if (parent) {
      const cList = parent.children || (parent.children = [])
      cList.push(item)
    } else {
      root.push(item)
    }
  }
  return root
}

export function formatCompanyAndDept(company = [], dept = []) {
  const map = {}
  const root = []
  for (let i = 0; i < company.length; i++) {
    const item = company[i]
    map[item.companyId] = item
    root.push(item)
  }

  for (let i = 0; i < dept.length; i++) {
    const item = dept[i]
    item.companyName = item.fullName
    const parent = map[item.companyId]
    if (parent) {
      const cList = parent.children || (parent.children = [])
      cList.push(item)
    }
  }
  return root
}

export function formatCommunityAndDept(community = [], dept = []) {
  const map = {}
  const root = []
  for (let i = 0; i < community.length; i++) {
    const item = community[i]
    map[item.communityNo] = item
    root.push(item)
  }

  for (let i = 0; i < dept.length; i++) {
    const item = dept[i]
    item.communityName = item.fullName
    const parent = map[item.communityNo]
    if (parent) {
      const cList = parent.children || (parent.children = [])
      cList.push(item)
    }
  }
  return root
}
