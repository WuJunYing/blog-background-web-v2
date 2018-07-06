<template>
    <el-menu
      mode="vertical"
      unique-opened
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#324157"
      text-color="#fff"
      active-text-color="#ffd04b"
      class="el-menu-vertical-demo">
      <sidebar-item :routes='permission_routers'></sidebar-item>
    </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
