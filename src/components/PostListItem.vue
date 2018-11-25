<template>
  <div class="post" v-if="post && user">
    <div class="user-info"><a href="#" class="user-name">{{ user.name }}</a><a href="#"><img :src="user.avatar" alt="" class="avatar-large"></a>
      <p class="desktop-only text-small">{{ userPostCount }} {{ userPostCount === 1 ? 'post' : 'posts'}}</p>
    </div>
    <div class="post-content">
      <template v-if="!editing">
        <div class="post-text">{{ post.text }}</div>
        <a href="#" @click.prevent="editing = true" title="Make a change" class="link-unstyled" style="margin-left: auto;"><i class="fa fa-pencil"></i></a>
      </template>
      <PostEditor 
        v-else
        :post="post"
        @cancel="editing = false"
        @save="editing = false"
      />
    </div>
    <BaseDate :timestamp="post.publishedAt"/>
  </div>
</template>


<script>
import PostEditor from "./PostEditor";

export default {
  name: "PostListItem",
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false
    };
  },
  computed: {
    user() {
      return this.$store.state.users[this.post.userId];
    },
    userPostCount() {
      return this.$store.getters.userPostCount(this.user[".key"]);
    }
  },
  components: {
    PostEditor
  }
};
</script>
