<template>
  <span :title="timestamp | humanFriendlyDate" class="post-date test">{{ timestamp | diffFromNow }}</span>
</template>

<script>
import moment from "moment";

export default {
  name: "BaseDate",
  props: {
    timestamp: {
      type: Number,
      required: true
    }
  },
  filters: {
    humanFriendlyDate(date) {
      return moment.unix(date).format("MMMM Do YYYY, h:mm:ss a");
    },
    diffFromNow(date) {
      return moment.unix(date).fromNow();
    }
  }
};
</script>
