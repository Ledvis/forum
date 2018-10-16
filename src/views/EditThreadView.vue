<template>
  <div class="col-full push-top">
    <h1>Editing <i>{{ thread.title }}</i></h1>
    <ThreadEditor 
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'

export default {
  name: 'EditThreadView',
  components: {
    ThreadEditor
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    thread() {
      return this.$store.getters.thread(this.id)
    },
    text() {
      return this.$store.state.posts[this.thread.firstPostId].text
    }
  },
  methods: {
    save({title, text}) {
      this.$store.dispatch('updateThread', {
        title,
        text,
        id: this.id
      }).then(this.$router.push({name: 'ThreadShowView', params: {id: this.id}}))
    },
    cancel() {
      this.$router.push({name: 'ThreadShowView', params: {id: this.id}})
    }
  }
}
</script>
