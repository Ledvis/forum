<template>
  <div v-if="threads" class="col-full push-top">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>
      <ThreadListItem
        v-if="threads"
        v-for="thread in threads" :key="thread['.key']"
        :thread="thread"
      />
    </div>
  </div>
</template>

<script>
import ThreadListItem from "./ThreadListItem";

export default {
  name: "ThreadList",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    ThreadListItem
  },
  computed: {
    threads() {
      return Object.values(this.$store.state.threads).filter(
        thread => thread.forumId === this.id
      );
    }
  }
};
</script>
