<template>
  <div v-if="forum" class="col-full push-top">
    <h1>Create new thread in <i>{{forum.name}}</i></h1>
    <ThreadEditor @save="save" @cancel="cancel"/>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ThreadEditor from "@/components/ThreadEditor";

export default {
  name: "CreateThreadView",
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
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
  created() {
    this.fetchForum({ id: this.forumId });
  }
};
</script>
