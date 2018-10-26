<template>
  <div v-if="asyncDataStatus_ready" class="col-full">
    <h1>{{ category.name }}</h1>
    <CategoryListItem :category="category"/>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";
import CategoryListItem from "@/components/CategoryListItem";

export default {
  name: "CategoryView",
  props: {
    id: {
      required: true,
      type: String
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    category() {
      return this.$store.state.categories[this.id];
    }
  },
  components: {
    CategoryListItem
  },
  methods: {
    ...mapActions(["fetchCategory", "fetchForums"])
  },
  created: async function() {
    const category = await this.fetchCategory({ id: this.id });
    await this.fetchForums({ ids: category.forums });
    this.asyncDataStatus_fetched();
  }
};
</script>
