<template>
  <header id="header" class="header">
    <router-link :to="{name: 'home'}" class="logo router-link-exact-active router-link-active">
      <img src="../assets/img/vueschool-logo.svg">
    </router-link>
    <div class="btn-hamburger">
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>
    <nav class="navbar">
      <ul>
        <li class="navbar-user">
          <router-link :to="{name: 'UserProfileView'}"><img :src="authUser.avatar" alt="" class="avatar-small">
            <span>
              {{ authUser.name }}
              <img src="../assets/img/arrow-profile.svg" alt="" class="icon-profile">
            </span>
          </router-link>
          <div id="user-dropdown">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <a href="profile.html">View profile</a>
                </li>
              <li class="dropdown-menu-item">
                <a href="#">Log out</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TheNavbar",
  computed: {
    ...mapGetters(["authUser"])
  }
};
</script>
