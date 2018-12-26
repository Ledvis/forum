<style>
@import url('./assets/css/style.css');
</style>

<template>
  <div id="app">
    <TheNavbar/>
    <div class="container">
      <router-view v-show="showPage" @ready="showPage = true"></router-view>
      <div v-show="!showPage">loading...</div>
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'

export default {
  data() {
    return {
      showPage: false
    }
  },
  components: {
    TheNavbar
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      this.showPage = false
      next()
    })
  }
}
</script>
