<template>
  <div class="forum-listing">
    <div class="forum-details">
      <router-link class="text-xlarge"
        v-bind:to="{name: 'ForumView', params: {id: forum['.key']}}"
      >
        {{ forum.name }}
      </router-link>
      <p>{{forum.description}}</p>
    </div>
    <div class="threads-count">
      <p class="count">{{threadsCount}} {{threadsCount === 1 ? 'thread' : 'threads'}}</p>
    </div>
    <div class="last-thread">
      <!-- TODO: implement later -->
    </div>
  </div>
</template>

<script>
import {countObjProperties} from '@/utils/index';

export default {
  name: 'ForumListItem',
  props: {
    forum: {
      required: true,
      type: Object
    }
  },
  computed: {
    threadsCount() {
      return countObjProperties(this.forum.threads);
    }
  }
}
</script>

