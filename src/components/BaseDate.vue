<template>
  <span class="post-date" v-bind:title="timestamp | humanFriendlyPublishedDate">
    {{ timestamp | timePassedFromNow }}
  </span>
</template>

<script>
import moment from "moment";

export default {
  name: 'BaseDate',
  props: {
    timestamp: {
      required: true,
      type: Number
    }
  },
  filters: {
    humanFriendlyPublishedDate(date) {
      return moment.unix(date).format("MMMM Do YYYY, h:mm:ss a");
    },
    timePassedFromNow(date) {
      return moment.unix(date).fromNow();
    }
  }
}
</script>
