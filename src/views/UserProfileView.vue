<template>
  <div v-if="asyncDataStatus_ready" class="flex-grid">
    <div class="col-3 push-top">
      <UserProfileEdit :user="user" v-if="edit" />
      <UserProfileCard :user="user" v-else/>
    </div>
    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead">
          {{ user.username }}'s recent activity
        </span>
        <a href="#">See only started threads?</a>
      </div>
      <hr>
      <PostList :posts="posts(user['.key'])"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import UserProfileCard from '@/components/UserProfileCard'
import UserProfileEdit from '@/components/UserProfileEdit'
import PostList from '@/components/PostList'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'UserProfileView',
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    ...mapGetters({
      user: 'authUser',
      posts: 'userPosts'
    })
  },
  components: {
    UserProfileCard,
    UserProfileEdit,
    PostList
  },
  methods: {
    ...mapActions(['fetchPosts'])
  },
  async created() {
    await this.fetchPosts(this.user.posts)
    this.asyncDataStatus_fetched()
  }
}
</script>
