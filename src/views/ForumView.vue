<style scoped>
.forum-wrapper {
  width: 100%;
}
</style>

<template>
  <div v-if="asyncDataStatus_ready" class="forum-wrapper">
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{forum.name}}</h1>
          <p class="text-lead">{{forum.description}}</p>
        </div>
        <router-link :to="{name: 'CreateThreadView', params: {forumId: id}}" class="btn-green btn-small">Start a thread</router-link>
      </div>
    </div>
    <div class="col-full push-top">
      <ThreadList :threads="threads"/>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";
import ThreadList from "@/components/ThreadList";

export default {
  name: "ForumView",
  props: {
    id: {
      required: true,
      type: String
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    forum() {
      return this.$store.state.forums[this.id];
    },
    threads() {
      return Object.values(this.$store.state.threads).filter(
        thread => thread.forumId === this.id
      );
    }
  },
  components: {
    ThreadList
  },
  methods: {
    ...mapActions(["fetchForum", "fetchThreads", "fetchUser"])
  },
  created: async function() {
    const forum = await this.fetchForum({ id: this.id });
    const threads = await this.fetchThreads({ ids: forum.threads });
    await Promise.all(
      threads.map(thread => this.fetchUser({ id: thread.userId }))
    );
    this.asyncDataStatus_fetched();
  }
};
</script>
