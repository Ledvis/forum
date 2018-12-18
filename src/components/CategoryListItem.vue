<template>
  <div v-if="forums" class="forum-list">
    <h2 class="list-title">
      <router-link :to="{name: 'CategoryView', params: {id: category['.key']}}">{{ category.name }}</router-link>
    </h2>
    <ForumList :forums="forums" />
  </div>
</template>

<script>
import ForumList from './ForumList'

export default {
  name: 'CategoryListItem',
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  computed: {
    forums() {
      return this.$store.getters.forums(this.category['.key'])
    }
  },
  components: {
    ForumList
  }
}
</script>
