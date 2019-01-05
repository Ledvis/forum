<template>
  <div id="app">
    <TheNavbar/>
    <div class="container">
      <router-view :key="$route.path" v-show="showPage" @ready="pageReady"></router-view>
      <AppSpinner v-show="!showPage" />
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import AppSpinner from '@/components/AppSpinner'
import NProgress from 'nprogress'

export default {
  data() {
    return {
      showPage: false
    }
  },
  components: {
    TheNavbar,
    AppSpinner
  },
  methods: {
    pageReady() {
      NProgress.done()
      this.showPage = true
    }
  },
  created() {
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })
    NProgress.start()
    this.$router.beforeEach((to, from, next) => {
      NProgress.start()
      this.showPage = false
      next()
    })
  }
}
</script>

<style>
@import url('./assets/css/style.css');
@import '~nprogress/nprogress.css';
#nprogress .bar {
  background-color: rgb(87, 173, 141);
}
</style>
