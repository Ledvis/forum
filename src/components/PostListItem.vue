<template>
  <div class="post">
    <div class="user-info">
      <a href="#" class="user-name">{{user.name}}</a>

      <a href="#">
        <img class="avatar-large" :src="user.avatar" alt="">
      </a>
      <p class="desktop-only text-small">{{userThreadsCount}} threads</p>
      <p class="desktop-only text-small">{{userPostsCount}} posts</p>
    </div>

    <div class="post-content">
      <template v-if="!editing">
        <div>
          {{post.text}}
        </div>
        <a @click.prevent="editing = true" href="#" style="margin-left: auto;" class="link-unstyled" title="Make a change"><i class="fa fa-pencil"></i></a>
      </template>
      <div v-else>
        <PostEditor 
          :post="post"
          @save="editing = false"
          @cancel="editing = false"
        />
      </div>
    </div>
    
    <div v-if="post.edited">edited</div>
    <BaseDate :timestamp="post.publishedAt"/>
  
  </div>
</template>

<script>
import Vue from 'vue';
import PostEditor from './PostEditor';

export default {
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      editing: false
    }
  },
  computed: {
    user() {
      return this.$store.state.users[this.post.userId];
    },
    userPostsCount() {
      return this.$store.getters.userPostsCount(this.user['.key'])
    },
    userThreadsCount() {
      return this.$store.getters.userThreadsCount(this.user['.key'])
    },
  },
  components: {
    PostEditor
  }
};
</script>

<style scoped>
</style>
