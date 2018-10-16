<template>
  <div class="col-large push-top">
    <h1>{{thread.title}}</h1>
    <!-- <router-link class="btn-green btn-small"
      :to="{name: 'EditThreadView', params: {id}}"
      tag="button">Edit Thread</router-link> -->
    <!-- <p>
      By <a href="#" class="link-unstyled">{{ user.name }}</a>, <BaseDate :timestamp="thread.publishedAt"/>.
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">{{ repliesCount }} replies by {{ contributorsCount }} contributors</span>
    </p> -->
    <!-- <PostList :posts="posts"/> -->
    <PostEditor
      :threadId="id"
    />
  </div>
</template>

<script>
import firebase from 'firebase'
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'

export default {
  name: 'ThreadShowView',
  
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
    // posts () {
    //   const postIds = Object.values(this.thread.posts)
    //   return Object.values(this.$store.state.posts)
    //     .filter(post => postIds.includes(post['.key']))
    // },
    thread() {
      return this.$store.getters.thread(this.id)
    },
    // repliesCount () {
    //   return this.$store.getters.threadRepliesCount(this.thread['.key'])
    // },
    // user() {
    //   return this.$store.state.users[this.thread.userId]
    // },
    // contributorsCount() {
    //   const replies = Object.keys(this.thread.posts)
    //     .filter(postId => postId !== this.thread.firstPostId)
    //     .map(postId => this.$store.state.posts[postId])
      
    //   const userIds = replies
    //     .map(post => post.userId)

    //   const contributors = userIds.filter((userId, index) => userIds.indexOf(userId) === index).length

    //     return contributors
    // }
  },
  created() {
    firebase.database().ref('threads').child(this.id).once('value', snapshot => {
      const thread = snapshot.val()
      this.$store.commit('SET_THREAD', {threadId: snapshot.key, thread: {...thread, '.key': snapshot.key}})
    })
  }
}
</script>