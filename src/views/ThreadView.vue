<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>
    <router-link :to="{name: 'EditThreadView', params: {threadId: thread.id}}" class="btn-green btn-small">Edit Thread</router-link>
    <p>
      By <a href="#" class="link-unstyled">{{ user.name }}</a>, 
      <BaseDate :timestamp="thread.publishedAt"/>.
      <span class="hide-mobile text-faded text-small" style="float: right; margin-top: 2px;">{{ repliesCount }} {{ repliesCount === 1 ? 'reply' : 'replies' }} by {{ contributorsCount }} {{ contributorsCount === 1 ? 'contributor' : 'contributors' }}</span>
    </p>
    <PostList :posts="posts"/>
    <PostEditor :threadId="thread['.key']"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PostList from "@/components/PostList";
import PostEditor from "@/components/PostEditor";

export default {
  name: "ThreadView",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    thread() {
      return this.$store.state.threads[this.id];
    },
    posts() {
      return Object.values(this.$store.state.posts).filter(post =>
        Object.keys(this.thread.posts).includes(post[".key"])
      );
    },
    ...mapGetters({
      user: "authUser"
    }),
    repliesCount() {
      return Object.keys(this.thread.posts).length - 1;
    },
    contributorsCount() {
      const replies = Object.keys(this.thread.posts)
        .filter(postId => postId !== this.thread.firstPostId)
        .map(postId => this.$store.state.posts[postId]);

      const userIds = replies.map(post => post.userId);

      return userIds.filter((id, index) => index === userIds.indexOf(id))
        .length;
    }
  },
  components: {
    PostList,
    PostEditor
  }
};
</script>
