<template>
  <div class="col-full">
    <h1>Welcome to the Forum</h1>
    <ForumList :forums="forums"/>
  </div>
</template>

<script>
import {forums, posts, users} from '@/data';
import ForumList from '@/components/ForumList';

export default {
  components: {
    ForumList
  },

  data () {
    return {
      forums: Object.values(forums),
      posts,
      users
    }
  }
}
</script>
