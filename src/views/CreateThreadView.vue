<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Create new thread in <i>{{ forum.name }}</i></h1>
    <ThreadEditor @save="save" @cancel="cancel" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ThreadEditor from '@/components/ThreadEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'CreateThreadView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    forum() {
      return this.$store.state.forums[this.id]
    }
  },
  components: {
    ThreadEditor
  },
  methods: {
    ...mapActions(['createThread', 'fetchForum']),

    save({ title, text }) {
      this.createThread({ forumId: this.id, title, text }).then(thread =>
        this.$router.push({
          name: 'ThreadView',
          params: { id: thread['.key'] }
        })
      )
    },
    cancel() {
      this.$router.push({ name: 'ForumView', id: this.id })
    }
  },
  async created() {
    await this.fetchForum(this.id)
    this.asyncDataStatus_fetched()
  }
}
</script>
