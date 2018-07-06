<template>
  <section class="app-main" style="min-height: 100%">
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
const map = {}
export default {
  name: 'AppMain',
  computed: {
    key() {
      let key = map[this.$route.name]
      if (key && this.$route.name && this.$route.params.from === 'tap') {
        return key
      }

      // return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      // return this.$route.name !== undefined ? this.$route.name + query : this.$route + +new Date()
      const query = this.$route.query ? JSON.stringify(this.$route.query) : ''
      key = this.$route.name !== undefined ? this.$route.name + query + +new Date() : this.$route + +new Date()
      map[this.$route.name] = key
      return key
    }
  }
}
</script>
