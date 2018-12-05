<template>
  <div v-if="category" class="col-full push-top">
    <h1>{{ category.name }}</h1>
    <CategoryListItem :category="category"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CategoryListItem from "@/components/CategoryListItem";

export default {
  name: "CategoryView",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    category() {
      return this.$store.state.categories[this.id];
    }
  },
  methods: {
    ...mapActions(['fetchCategory', 'fetchForums'])
  },
  components: {
    CategoryListItem
  },
  async created() {
    const category = await this.fetchCategory(this.id);
    this.fetchForums(category.forums);
  }
};
</script>
