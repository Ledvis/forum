<template>
  <div class="profile-card">
    <p class="text-center"><img :src="user.avatar" alt="" class="avatar-xlarge img-update"></p>
    <div class="form-group">
      <input placeholder="Username" class="form-input text-lead text-bold" type="text" v-model="activeUser.name">
    </div>
    <div class="form-group">
      <input placeholder="Full Name" class="form-input text-lead" type="text" v-model="activeUser.username">
    </div>
    <div class="form-group">
      <label for="user_bio">Bio</label>
      <textarea id="user_bio" placeholder="Write a few words about yourself." class="form-input" v-model="activeUser.bio"></textarea>
    </div>
    <div class="stats">
      <span>{{ userPostCount }} {{ userPostCount === 1 ? 'post' : 'posts' }}</span>
      <span>{{ userThreadCount }} {{ userThreadCount === 1 ? 'thread' : 'threads' }}</span>
    </div>
    <hr>
    <div class="form-group">
      <label for="user_website" class="form-label">Website</label>
      <input autocomplete="off" id="user_website" class="form-input" v-model="activeUser.website">
    </div>
    <div class="form-group">
      <label for="user_email" class="form-label">Email</label>
      <input autocomplete="off" id="user_email" class="form-input" v-model="activeUser.email">
    </div>
    <div class="form-group">
      <label for="user_location" class="form-label">Location</label>
      <input autocomplete="off" id="user_location" class="form-input" v-model="activeUser.location">
    </div>
    <div class="btn-group space-between">
      <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
      <button type="submit" class="btn-blue" @click.prevent="save">Save</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'UserProfileEdit',
  data() {
    return {
      activeUser: { ...this.user }
    }
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    userPostCount() {
      return this.$store.getters.userPostCount(this.user['.key'])
    },
    userThreadCount() {
      return this.$store.getters.userThreadCount(this.user['.key'])
    }
  },
  methods: {
    ...mapActions(['updateUser']),

    save() {
      this.updateUser(this.activeUser)
      this.$router.push({ name: 'UserProfileView' })
    },
    cancel() {
      this.$router.push({ name: 'UserProfileView' })
    }
  }
}
</script>
