<template>
  <div
    v-if="asyncDataStatus_ready"
    class="forum-wrapper"
  >
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">{{ forum.description }}</p>
        </div>
        <router-link
          :to="{name: 'CreateThreadView', params: {id: id}}"
          class="btn-green btn-small"
        >Start a thread</router-link>
      </div>
    </div>
    <ThreadList :id="id" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ThreadList from '@/components/ThreadList'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'ForumView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    forum() {
      return this.$store.state.forums[this.id]
    }
  },
  mixins: [asyncDataStatus],
  methods: {
    ...mapActions(['fetchForum', 'fetchThreads'])
  },
  components: {
    ThreadList
  },
  async created() {
    const forum = await this.fetchForum(this.id)
    await this.fetchThreads(forum.threads)
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped>
.forum-wrapper {
  width: 100%;
}
</style>
