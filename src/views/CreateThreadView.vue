<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Create new thread in <i>{{ forum.name }}</i></h1>
    <ThreadEditor ref="editor" @save="save" @cancel="cancel" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ThreadEditor from '@/components/ThreadEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'CreateThreadView',
  data() {
    return {
      saved: false
    }
  },
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
    },
    hasUnsavedChanges() {
      return (
        (this.$refs.editor.form.title || this.$refs.editor.form.text) &&
        !this.saved
      )
    }
  },
  components: {
    ThreadEditor
  },
  methods: {
    ...mapActions(['createThread', 'fetchForum']),

    async save({ title, text }) {
      this.saved = true
      const thread = await this.createThread({ forumId: this.id, title, text })

      this.$router.push({
        name: 'ThreadView',
        params: { id: thread['.key'] }
      })
    },
    cancel() {
      this.$router.push({ name: 'ForumView', id: this.id })
    }
  },
  async created() {
    await this.fetchForum(this.id)
    this.asyncDataStatus_fetched()
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirmed = window.confirm(
        'Are you sure you want to leave? Unsaved changes will be lost.'
      )
      if (confirmed) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
</script>
