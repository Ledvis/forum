<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Create new thread in <i>{{forum.name}}</i></h1>
    <ThreadEditor @save="save" @cancel="cancel"/>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";
import ThreadEditor from "@/components/ThreadEditor";

export default {
  name: "CreateThreadView",
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  mixins: [asyncDataStatus],
  components: {
    ThreadEditor
  },
  computed: {
    forum() {
      return this.$store.getters.forum(this.forumId);
    }
  },
  methods: {
    ...mapActions(["createThread", "fetchForum"]),

    save({ title, text }) {
      this.createThread({
        forumId: this.forum[".key"],
        title,
        text
      }).then(threadId =>
        this.$router.push({
          name: "ThreadShowView",
          params: { id: threadId }
        })
      );
    },
    cancel() {
      this.$router.push({ name: "ForumView", params: { id: this.forumId } });
    }
  },
  created: async function() {
    await this.fetchForum({ id: this.forumId });
    this.asyncDataStatus_fetched();
  }
};
</script>
