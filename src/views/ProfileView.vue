<template>
  <div class="flex-grid">
    <UserProfileCard
      v-if="!edit"
      :user="user"
      :userPostsCount="userPostsCount"
      :userThreadsCount="userThreadsCount"
    />
    <UserProfileCardEditor
      v-else
      :user="user"
      :userPostsCount="userPostsCount"
      :userThreadsCount="userThreadsCount"
    />
    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead">
          {{user.username}}'s recent activity
        </span>
        <a href="#">See only started threads?</a>
      </div>
      <hr>
      <PostList :posts="userPosts"/>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {countObjProperties} from '@/utils/index';
import PostList from '@/components/PostList'
import UserProfileCard from '@/components/UserProfileCard'
import UserProfileCardEditor from '@/components/UserProfileCardEditor'

export default {
  name: 'ProfileView',
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'authUser'
    }),
    userPostsCount() {
      return countObjProperties(this.user.posts)
    },
    userThreadsCount() {
      return countObjProperties(this.user.threads)
    },
    userPosts() {
      return this.$store.getters.userPosts(this.user['.key'])
    }
  },
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor
  }
}
</script>

