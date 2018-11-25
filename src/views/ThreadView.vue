<template>
  <div class="col-large push-top" v-if="thread">
    <h1>{{ thread.title }}</h1>
    <router-link :to="{name: 'EditThreadView', params: {threadId: thread.id}}" class="btn-green btn-small">Edit Thread</router-link>
    <p>
      By <a href="#" class="link-unstyled">{{ user.name }}</a>,
      <BaseDate :timestamp="thread.publishedAt" />.
      <span class="hide-mobile text-faded text-small" style="float: right; margin-top: 2px;">{{ repliesCount }} {{ repliesCount === 1 ? 'reply' : 'replies' }} by {{ contributorsCount }} {{ contributorsCount === 1 ? 'contributor' : 'contributors' }}</span>
    </p>
    <PostList :posts="posts" />
    <PostEditor :threadId="thread['.key']" />
  </div>
</template>

<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
import PostList from "@/components/PostList";
import PostEditor from "@/components/PostEditor";
import { countObjPropertiesLength } from "@/utils/index";

export default {
  name: "ThreadView",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    thread () {
      return this.$store.state.threads[this.id];
    },
    posts () {
      return Object.values(this.$store.state.posts).filter(post =>
        Object.keys(this.thread.posts).includes(post[".key"])
      );
    },
    ...mapGetters({
      user: "authUser"
    }),
    repliesCount () {
      return Object.keys(this.thread.posts).length - 1;
    },
    contributorsCount () {
      return countObjPropertiesLength(this.thread.contributors);
    }
  },
  components: {
    PostList,
    PostEditor
  },
  async created () {
    const thread = await this.$store.dispatch("fetchThread", this.id);
    await this.$store.dispatch("fetchUser", thread.userId);
    const posts = await this.$store.dispatch("fetchPosts", thread.posts)
    posts.forEach(post => this.$store.dispatch("fetchUser", post.userId))
  }
};
</script>
