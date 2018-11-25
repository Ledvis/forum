<template>
  <div class="col-full push-top">
    <h1>Welcome to the Forum</h1>
    <CategoryList />
  </div>
</template>

<script>
import CategoryList from "@/components/CategoryList.vue";

export default {
  name: "home",
  components: {
    CategoryList
  },
  async beforeCreate () {
    const categoriesArr = await this.$store.dispatch('fetchAllCategories');
    categoriesArr.forEach(category => {
      this.$store.dispatch('fetchForums', category.forums)
    })
  }
};
</script>
