<template>
  <div class="flex-grid">
    <div class="col-3 push-top">
      <UserProfileEdit :user="authUser" v-if="edit" />
      <UserProfileCard :user="authUser" v-else/>
    </div>
    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead">
          {{ authUser.username }}'s recent activity
        </span>
        <a href="#">See only started threads?</a>
      </div>
      <hr>
      <PostList :posts="posts"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserProfileCard from "@/components/UserProfileCard";
import UserProfileEdit from "@/components/UserProfileEdit";
import PostList from "@/components/PostList";

export default {
  name: "UserProfileView",
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["authUser"]),
    posts() {
      if (this.authUser.posts) {
        return Object.values(this.$store.state.posts).filter(post =>
          Object.values(this.authUser.posts).includes(post[".key"])
        );
      }
      return [];
    }
  },
  components: {
    UserProfileCard,
    UserProfileEdit,
    PostList
  }
};
</script>
