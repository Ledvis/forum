<template>
  <div
    v-if="thread"
    class="col-full push-top"
  >
    <h1>Editing <i>{{ thread.title }}</i></h1>
    <ThreadEditor
      :title="thread.title"
      :text="text"
      @save="save"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ThreadEditor from '@/components/ThreadEditor'

export default {
  name: 'EditThreadView',
  components: {
    ThreadEditor
  },
  props: {
    id: {
      type: String
    }
  },
  computed: {
    thread() {
      return this.$store.state.threads[this.id]
    },

    text() {
      const post = this.$store.state.posts[this.thread.firstPostId]
      return post ? post.text : null
    }
  },
  methods: {
    ...mapActions(['fetchThread', 'fetchPost', 'updateThread']),

    save({ title, text }) {
      this.updateThread({
        threadId: this.id,
        title,
        text
      }).then(() => {
        this.$router.push({ name: 'ThreadView', params: { id: this.id } })
      })
    }
  },
  async created() {
    const thread = await this.fetchThread(this.id)
    this.fetchPost(thread.firstPostId)
  }
}
</script>
