<template>
  <div class="col-large push-top">
    <h1>{{thread.title}}</h1>
    <router-link class="btn-green btn-small"
      :to="{name: 'EditThreadView', params: {id}}"
      tag="button">Edit Thread</router-link>
    <p>
      By <a href="#" class="link-unstyled">Robin</a>, <BaseDate :timestamp="thread.publishedAt"/>.
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">3 replies by 3 contributors</span>
    </p>
    <PostList :posts="posts"/>
    <PostEditor
      :threadId="id"
    />
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'

export default {
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
  computed: {
    posts () {
      const postIds = Object.values(this.thread.posts)
      return Object.values(this.$store.state.posts)
        .filter(post => postIds.includes(post['.key']))
    },
    thread() {
      return this.$store.getters.thread(this.id)
    }
  },
}
</script>
