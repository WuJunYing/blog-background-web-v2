<template>
  <div class="grid-content bg-purple">
    <el-tree
      :data="treeData"
      :props="defaultProps"
      @node-click="handleNodeClick"
      highlight-current
      :load="loadNode"
      lazy
      :expand-on-click-node="true"
      class="left-tree"
      :style="{ height: $treeHeight() + 'px' }"></el-tree>
  </div>
</template>

<script>
import { propunitApi, propbuildApi, proproomApi } from 'api/estate'
import { marketApi } from 'api/bus'
import { propofficeApi } from 'api/sys'

export default {
  props: {
    level: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'communityName'
      }
    }
  },
  methods: {
    handleNodeClick(data, node) {
      var params = {}
      if (node.level === 1) {
        params.communityNo = data.communityNo
        params.officeNo = null
        params.buildingNo = null
        params.unitNo = null
        params.roomNo = null
      } else if (node.level === 2) {
        params.communityNo = node.parent.data.communityNo
        params.officeNo = data.communityNo
        params.buildingNo = null
        params.unitNo = null
        params.roomNo = null
      } else if (node.level === 3) {
        params.communityNo = node.parent.parent.data.communityNo
        params.officeNo = node.parent.data.communityNo
        params.buildingNo = data.communityNo
        params.unitNo = null
        params.roomNo = null
      } else if (node.level === 4) {
        params.communityNo = node.parent.parent.parent.data.communityNo
        params.officeNo = node.parent.parent.data.communityNo
        params.buildingNo = node.parent.data.communityNo
        params.unitNo = data.communityNo
        params.roomNo = null
      } else if (node.level === 5) {
        params.communityNo = node.parent.parent.parent.parent.data.communityNo
        params.officeNo = node.parent.parent.parent.data.communityNo
        params.buildingNo = node.parent.parent.data.communityNo
        params.unitNo = node.parent.data.communityNo
        params.roomNo = data.communityNo
      }
      this.$emit('ktx-tree-click', params,
        [params.communityNo, params.officeNo, params.buildingNo, params.unitNo, params.roomNo], data, node)
    },
    async loadNode(node, resolve) {
      if (node.level >= this.level) {
        resolve([])
        return
      }
      if (node.level === 0) {
        const response = await marketApi.getCommunityList()
        return resolve(response.data.rows)
      } else if (node.level === 1) {
        const response = await propofficeApi.getList({ communityNo: node.data.communityNo })
        const list = response.data.rows
        const rs = []
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          rs.push({
            communityNo: item.officeNo,
            communityName: item.officeName,
            children: []
          })
        }
        return resolve(rs)
      } else if (node.level === 2) {
        propbuildApi.getList({ officeNo: node.data.communityNo }).then(response => {
          const list = response.data.rows
          const rs = []
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            rs.push({
              communityNo: item.buildingNo,
              communityName: item.buildingName,
              children: []
            })
          }
          return resolve(rs)
        })
      } else if (node.level === 3) {
        propunitApi.getList({ buildingNo: node.data.communityNo }).then(response => {
          const list = response.data.rows
          const rs = []
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            rs.push({
              communityNo: item.unitNo,
              communityName: item.unitName,
              children: []
            })
          }
          return resolve(rs)
        })
      } else if (node.level === 4) {
        const params = {
          buildingNo: node.parent.data.communityNo,
          unitNo: node.data.communityNo
        }
        proproomApi.getList(params).then(response => {
          const list = response.data
          const rs = []
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            rs.push({
              communityNo: item.roomNo,
              communityName: item.roomName,
              children: []
            })
          }
          return resolve(rs)
        })
      } else {
        return resolve([])
      }
    }
  }
}
</script>

<style lang="scss" scope>
  .left-tree {
    overflow: auto;
  }
</style>
<style lang="scss">
  .left-tree > div {
    min-width: 150px;
  }
</style>

