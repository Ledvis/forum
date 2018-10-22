<template>
  <div>
    <ForumListItem 
      v-for="forum in forums" :key="forum['.key']"
      :forum="forum"
    />
  </div>
</template>

<script>
import ForumListItem from "./ForumListItem";

export default {
  name: "ForumList",
  props: {
    forums: {
      type: Array
    }
  },
  components: {
    ForumListItem
  }
};
</script>
