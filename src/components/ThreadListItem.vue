<template>
  <div class="thread">
    <div>
      <p>
        <router-link :to="{name: 'ThreadView', params: {id: thread['.key']}}">{{ thread.title }}</router-link>
      </p>
      <p class="text-faded text-xsmall">
        By <a href="#">Joseph Kerr</a>,
        <BaseDate :timestamp="thread.publishedAt"/>
      </p>
    </div>
    <div class="activity">
      <p class="replies-count">
        {{ repliesCount }} {{ repliesCount === 1 ? 'reply' : 'replies' }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ThreadListItem",
  props: {
    thread: {
      type: Object,
      required: true
    }
  },
  computed: {
    repliesCount() {
      return this.$store.getters.repliesCount(this.thread[".key"]);
    }
  }
};
</script>
