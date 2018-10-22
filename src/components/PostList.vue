<template>
  <div class="post-list">
    <PostListItem 
      v-for="post in posts" :key="post['.key']"
      :post="post"
    />
  </div>
</template>

<script>
import PostListItem from "./PostListItem";

export default {
  name: "PostList",
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  components: {
    PostListItem
  }
};
</script>
