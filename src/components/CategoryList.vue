<template>
  <div>
    <CategoryListItem 
      v-for="category in categories" 
      :key="category['.key']"
      :category="category"
    />
  </div>
</template>

<script>
import CategoryListItem from './CategoryListItem'

export default {
  name: 'CategoryList',
  computed: {
    categories() {
      return Object.values(this.$store.state.categories)
    }
  },
  components: {
    CategoryListItem
  }
}
</script>
