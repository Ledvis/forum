<template>
  <div id="app">
    <TheNavbar/>
    <div class="container">
      <router-view v-show="!loading" @ready="pageLoaded"/>
      <BaseSpinner v-show="loading"/>
    </div>
  </div>
</template>

<script>
import TheNavbar from "@/components/TheNavbar";
import BaseSpinner from "@/components/BaseSpinner";
import NProgress from "nprogress";

export default {
  components: {
    TheNavbar,
    BaseSpinner
  },
  data() {
    return {
      loading: true
    };
  },
  methods: {
    pageLoaded() {
      this.loading = false;
      NProgress.done();
    }
  },
  created() {
    NProgress.configure({
      speed: 200,
      showSpinner: false
    });
    this.$router.beforeEach((to, from, next) => {
      this.loading = true;
      NProgress.start();
      next();
    });
  }
};
</script>

<style>
@import "assets/css/style.css";
@import "~nprogress/nprogress.css";

#nprogress .bar {
  background: rgb(90, 172, 140);
}
</style>
