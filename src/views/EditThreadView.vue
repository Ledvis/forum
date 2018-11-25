<template>
  <div v-if="thread" class="col-full push-top">
    <h1>Editing <i>{{ thread.title }}</i></h1>
    <ThreadEditor :title="thread.title" :text="text" @save="save" />
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
    thread () {
      return this.$store.state.threads[this.id];
    },

    text () {
      const post = this.$store.state.posts[this.thread.firstPostId]; 
      return post ? post.text : null;
    }
  },
  methods: {
    save ({ title, text }) {
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
  },
  async created () {
    const thread = await this.$store.dispatch('fetchThread', this.id);
    this.$store.dispatch('fetchPost', thread.firstPostId)
  }
};
</script>
