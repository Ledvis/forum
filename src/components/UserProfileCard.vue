<template>
  <div class="profile-card">
    <p class="text-center"><img alt="" class="avatar-xlarge"></p>
    <h1 class="title">{{ user.username }}</h1>
    <p class="text-lead">{{ user.name }}</p>
    <p class="text-justify">
      <span v-if="user.bio">{{ user.bio }}</span>
      <span v-else>No bio specified.</span>
    </p>
    <span class="online">TheMask is online</span>
    <div class="stats">
      <span>{{ userPostCount }} posts</span>
      <span>{{ userThreadCount }} {{ userThreadCount === 1 ? 'thread' : 'threads'}}</span>
    </div>
    <hr>
    <p class="text-xsmall text-faded text-center">Member since june 2003, 
      <!-- TODO: Implement correct date exposure in format month year -->
      last visited <BaseDate :timestamp="user.lastVisitAt"/></p>
    <div class="text-center">
      <hr>
      <router-link :to="{name: 'UserProfileEdit'}" class="btn-green btn-small">Edit Profile</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserProfileCard",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    userPostCount() {
      return this.$store.getters.userPostCount(this.user[".key"]);
    },
    userThreadCount() {
      return this.$store.getters.userThreadCount(this.user[".key"]);
    }
  }
};
</script>
