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
          <h1>{{forum.name}}</h1>
          <p class="text-lead">{{forum.description}}</p>
        </div>
        <a href="#" class="btn-green btn-small">Start a thread</a>
      </div>
    </div>
    <div class="col-full push-top">
      <ThreadList :threads="threads"/>
    </div>
  </div>
</template>

<script>
import {forums, threads} from '@/data.json';
import ThreadList from '@/components/ThreadList';

export default {
  name: 'ForumView',
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    forum() {
      return forums[this.id]
    },
    threads() {
      return Object.values(threads).filter(thread => thread.forumId === this.id);
    }
  },
  components: {
    ThreadList
  }
}
</script>
