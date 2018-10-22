<style scoped>
.forum-wrapper {
  width: 100%;
}
</style>

<template>
  <div class="forum-wrapper">
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">{{ forum.description }}</p>
        </div>
        <router-link :to="{name: 'CreateThreadView', params: {id: id}}" class="btn-green btn-small">Start a thread</router-link>
      </div>
    </div>
    <ThreadList :id="id"/>
  </div>
</template>

<script>
import ThreadList from "@/components/ThreadList";

export default {
  name: "ForumView",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    forum() {
      return this.$store.state.forums[this.id];
    }
  },
  components: {
    ThreadList
  }
};
</script>
