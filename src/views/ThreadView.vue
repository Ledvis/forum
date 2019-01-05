<template>
  <div
    class="col-large push-top"
    v-if="asyncDataStatus_ready"
  >
    <h1>{{ thread.title }}</h1>
    <router-link
      :to="{name: 'EditThreadView', params: {threadId: thread.id}}"
      class="btn-green btn-small"
    >Edit Thread</router-link>
    <p>
      By <a
        href="#"
        class="link-unstyled"
      >{{ user.name }}</a>,
      <BaseDate :timestamp="thread.publishedAt" />.
      <span
        class="hide-mobile text-faded text-small"
        style="float: right; margin-top: 2px;"
      >{{ repliesCount }} {{ repliesCount === 1 ? 'reply' : 'replies' }} by {{ contributorsCount }} {{ contributorsCount === 1 ? 'contributor' : 'contributors' }}</span>
    </p>
    <PostList :posts="posts" />
    <PostEditor v-if="authUser" :threadId="thread['.key']" />
    <div v-else class="text-center" style="margin-bottom: 50px;">
      <router-link :to="{name: 'SignIn', query: {redirectTo: $route.path}}">Sign in</router-link> or
      <router-link :to="{name: 'Register', query: {redirectTo: $route.path}}">Register</router-link> to post a reply.
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import { countObjPropertiesLength } from '@/utils/index'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'ThreadView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    thread() {
      return this.$store.state.threads[this.id]
    },
    posts() {
      return Object.values(this.$store.state.posts).filter(post =>
        Object.keys(this.thread.posts).includes(post['.key'])
      )
    },
    ...mapGetters({
      authUser: 'authUser'
    }),
    user() {
      return this.$store.state.users[this.thread.userId]
    },
    repliesCount() {
      return Object.keys(this.thread.posts).length - 1
    },
    contributorsCount() {
      return countObjPropertiesLength(this.thread.contributors)
    }
  },
  components: {
    PostList,
    PostEditor
  },
  methods: {
    ...mapActions(['fetchThread', 'fetchUser', 'fetchPosts'])
  },
  async created() {
    const thread = await this.fetchThread(this.id)
    await this.fetchUser(thread.userId)
    const posts = await this.fetchPosts(thread.posts)
    await Promise.all(posts.map(post => this.fetchUser(post.userId)))
    this.asyncDataStatus_fetched()
  }
}
</script>
