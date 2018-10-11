<template>
  <div class="forum-list">
    <h2 class="list-title">
      <a href="#">Forums</a>
    </h2>
    <ForumListItem
      v-for="forum in forums"
      v-bind:key="forum['.key']"
      v-bind:forum="forum"
    />
  </div>
</template>

<script>
import ForumListItem from './ForumListItem'

export default {
  name: 'ForumList',
  props: {
    forums: {
      required: true,
      type: Array
    }
  },
  components: {
    ForumListItem
  }
}
</script>
