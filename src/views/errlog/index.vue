<template>
  <div class="errPage-container">
    <err-code></err-code>

    <h3>请点击右上角bug小图表</h3>
    <code>
      现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在Vue官网提供了一个方法来捕获处理异常
    </code>
    <a href="#"><img src='http://panjiachen.github.io/images/errHandler.png'></a>
  </div>
</template>

<script>
import errCode from './errcode'

export default {
  components: { errCode }
}
</script>

<style scope>
  .errPage-container {
    padding: 30px;
  }
</style>
