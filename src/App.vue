<style>
@import url("./assets/css/style.css");
</style>

<template>
  <div id="app">
    <TheNavbar/>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TheNavbar from "@/components/TheNavbar";

export default {
  components: {
    TheNavbar
  }
};
</script>
