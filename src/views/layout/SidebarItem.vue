<template>
  <div class='menu-wrapper'>
    <template v-for="item in routes">
      <router-link v-if="!item.hidden&&item.noDropdown&&item.children.length>0" :to="item.path+'/'+item.children[0].path" :key="item.path+'/'+item.children[0].path">
        <el-menu-item :index="item.path+'/'+item.children[0].path" class='submenu-title-noDropdown' :key="item.path+'/'+item.children[0].path">
          <!-- <icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg> -->
          <i v-if='item.icon' class="fa" :class="item.icon" aria-hidden="true"></i>
          <span>{{item.children[0].name}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu :index="item.name" v-if="!item.noDropdown&&!item.hidden" :key="item.path+'/'+item.children[0].path">
        <template slot="title">
          <!-- <icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg> -->
          <i v-if='item.icon' class="fa" :class="item.icon" aria-hidden="true"></i>
          <span>{{item.name}}</span>
        </template>
        <template v-for="child in item.children" v-if='!child.hidden'>

          <sidebar-item class='nest-menu' v-if='child.children&&child.children.length>0' :routes='[child]' :key="item.path+'/'+child.path"> </sidebar-item>

          <router-link v-else :to="item.path+'/'+child.path" :key="item.path+'/'+child.path">
            <el-menu-item :index="item.path+'/'+child.path" :key="item.path+'/'+child.path">
              <!-- <icon-svg v-if='child.icon' :icon-class="child.icon"></icon-svg> -->
              <i v-if='child.icon' class="fa" :class="child.icon" aria-hidden="true"></i>
              <span>{{child.name}}</span>
            </el-menu-item>
          </router-link>

        </template>

      </el-submenu>

    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    }
  }
}
</script>

