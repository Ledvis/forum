<template>
  <div class="forum-listing">
    <div class="forum-details">
      <router-link
        :to="{name: 'ForumView', params: {id: forum['.key']}}"
        class="text-xlarge"
      >{{ forum.name }}</router-link>
      <p>{{ forum.description }}</p>
    </div>
    <div class="threads-count">
      <p class="count">{{ threadsCount }} {{ threadsCount === 1 ? 'thread' : 'threads' }}</p>
    </div>
    <div class="last-thread"></div>
  </div>
</template>

<script>
export default {
  name: 'ForumListItem',
  props: {
    forum: {
      type: Object
    }
  },
  computed: {
    threadsCount() {
      return Object.values(this.$store.state.threads).filter(
        thread => thread.forumId === this.forum['.key']
      ).length
    }
  }
}
</script>
