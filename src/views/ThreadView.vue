<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>
    <router-link :to="{name: 'EditThreadView', params: {threadId: thread.id}}" class="btn-green btn-small">Edit Thread</router-link>
    <p>
      By <a href="#" class="link-unstyled">Robin</a>, <span title="October 5th 2017, 4:32:55 pm" class="post-date">
        <BaseDate :timestamp="thread.publishedAt"/>
      </span>.
      <span class="hide-mobile text-faded text-small" style="float: right; margin-top: 2px;">3 replies by 3 contributors</span>
    </p>
    <PostList :posts="posts"/>
    <PostEditor :threadId="thread['.key']"/>
  </div>
</template>

<script>
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
    }
  },
  components: {
    PostList,
    PostEditor
  }
};
</script>
