<template>
  <div class="col-full push-top">
    <h1>Create new thread in <i>Announcements</i></h1>
    <ThreadEditor/>
  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor";

export default {
  name: "CreateThreadView",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    ThreadEditor
  }
};
</script>
