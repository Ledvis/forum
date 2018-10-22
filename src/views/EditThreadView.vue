<template>
  <div class="col-full push-top">
    <h1>Editing <i>{{ thread.title }}</i></h1>
    <ThreadEditor :title="thread.title" :text="text" @save="save"/>
  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor";

export default {
  name: "EditThreadView",
  components: {
    ThreadEditor
  },
  props: {
    id: {
      type: String
    }
  },
  computed: {
    thread() {
      return this.$store.state.threads[this.id];
    },

    text() {
      return this.$store.state.posts[this.thread.firstPostId].text;
    }
  },
  methods: {
    save({ title, text }) {
      this.$store
        .dispatch("updateThread", {
          threadId: this.thread[".key"],
          title,
          text
        })
        .then(id => {
          this.$router.push({ name: "ThreadView", params: { id: id } });
        });
    }
  }
};
</script>
