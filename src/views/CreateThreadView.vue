<template>
  <div class="col-full push-top">
    <h1>Create new thread in <i>Announcements</i></h1>
    <ThreadEditor @save="save" @cancel="cancel"/>
  </div>
</template>

<script>
import { mapActions } from "vuex";
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
  },
  methods: {
    ...mapActions(["createThread"]),

    save({ title, text }) {
      this.createThread({ id: this.id, title, text }).then(id =>
        this.$router.push({ name: "ThreadView", params: { id } })
      );
    },
    cancel() {
      this.$router.push({ name: "ForumView", id: this.id });
    }
  }
};
</script>
