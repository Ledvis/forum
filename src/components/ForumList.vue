<template>
  <div>
    <ForumListItem
      v-for="forum in forums"
      v-bind:key="forum['.key']"
      v-bind:forum="forum"
    />
  </div>
</template>

<script>
import ForumListItem from "./ForumListItem";

export default {
  name: "ForumList",
  props: {
    forums: {
      required: true,
      type: Array
    }
  },
  components: {
    ForumListItem
  }
};
</script>
