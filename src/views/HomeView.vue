<template>
  <div class="col-full push-top">
    <h1>Welcome to the Forum</h1>
    <CategoryList />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CategoryList from "@/components/CategoryList.vue";

export default {
  name: "home",
  components: {
    CategoryList
  },
  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },
  async created () {
    const categoriesArr = await this.fetchAllCategories();
    
    categoriesArr.forEach(category => {
      this.fetchForums(category.forums);
    })
  }
};
</script>
