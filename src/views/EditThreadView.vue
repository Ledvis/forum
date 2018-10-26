<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Editing <i>{{ thread.title }}</i></h1>
    <ThreadEditor 
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";
import ThreadEditor from "@/components/ThreadEditor";

export default {
  name: "EditThreadView",
  components: {
    ThreadEditor
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    thread() {
      return this.$store.getters.thread(this.id);
    },
    text() {
      const post = this.$store.state.posts[this.thread.firstPostId];
      return post ? post.text : null;
    }
  },
  methods: {
    ...mapActions(["updateThread", "fetchThread", "fetchPost"]),

    save({ title, text }) {
      this.updateThread({ title, text, id: this.id }).then(
        this.$router.push({ name: "ThreadShowView", params: { id: this.id } })
      );
    },
    cancel() {
      this.$router.push({ name: "ThreadShowView", params: { id: this.id } });
    }
  },
  created: async function() {
    const thread = await this.fetchThread({ id: this.id });
    await this.fetchPost({ id: thread.firstPostId });
    this.asyncDataStatus_fetched();
  }
};
</script>
