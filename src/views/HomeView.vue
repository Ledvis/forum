<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Welcome to the Forum</h1>
    <CategoryList :categories="categories"/>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";
import CategoryList from "@/components/CategoryList";

export default {
  components: {
    CategoryList
  },
  mixins: [asyncDataStatus],
  computed: {
    categories() {
      return Object.values(this.$store.state.categories);
    }
  },
  methods: {
    ...mapActions(["fetchCategories", "fetchForums"])
  },
  created: async function() {
    const categories = await this.fetchCategories();
    await Promise.all(
      categories.map(category => this.fetchForums({ ids: category.forums }))
    );
    this.asyncDataStatus_fetched();
  }
};
</script>
