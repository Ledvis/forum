<template>
  <div>
    <CategoryListItem 
      v-for="category in categories" 
      v-bind:key="category['.key']"
      v-bind:category="category"
    />
  </div>
</template>

<script>
import CategoryListItem from './CategoryListItem';

export default {
  name: 'CategoryList',
  props: {
    categories: {
      required: true,
      type: Array
    }
  },
  components: {
    CategoryListItem
  }
}
</script>

