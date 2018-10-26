<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
    <h1>{{thread.title}}</h1>
    <router-link class="btn-green btn-small" :to="{name: 'EditThreadView', params: {id}}" tag="button">Edit Thread</router-link>
    <p>
      By <a href="#" class="link-unstyled" v-if="user">{{ user.name }}</a>,
      <BaseDate :timestamp="thread.publishedAt" />.
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">{{ repliesCount }} replies by {{ contributorsCount }} contributors</span>
    </p>
    <PostList :posts="posts" />
    <PostEditor :threadId="id" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { countObjProperties } from "@/utils/index";
import asyncDataStatus from "@/mixins/asyncDataStatus";
import PostList from "@/components/PostList";
import PostEditor from "@/components/PostEditor";

export default {
  name: "ThreadShowView",

  components: {
    PostList,
    PostEditor
  },

  props: {
    id: {
      required: true,
      type: String
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    posts() {
      const postIds = Object.values(this.thread.posts);
      return Object.values(this.$store.state.posts).filter(post =>
        postIds.includes(post[".key"])
      );
    },
    thread() {
      return this.$store.getters.thread(this.id);
    },
    repliesCount() {
      return countObjProperties(this.thread.posts) - 1;
    },
    user() {
      return this.$store.state.users[this.thread.userId];
    },
    contributorsCount() {
      return countObjProperties(this.thread.contributors);
    }
  },
  methods: {
    ...mapActions(["fetchThread", "fetchUser", "fetchPosts"])
  },
  created: async function() {
    const thread = await this.fetchThread({ id: this.id });
    await this.fetchUser({ id: thread.userId });
    const posts = await this.fetchPosts({ ids: thread.posts });
    await Promise.all(posts.map(post => this.fetchUser({ id: post.userId })));
    this.asyncDataStatus_fetched();
  }
};
</script>
