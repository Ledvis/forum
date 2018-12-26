<template>
  <div
    v-if="asyncDataStatus_ready"
    class="col-full push-top"
  >
    <h1>Welcome to the Forum</h1>
    <CategoryList />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import CategoryList from '@/components/CategoryList.vue'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'home',
  components: {
    CategoryList
  },
  mixins: [asyncDataStatus],
  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },
  async created() {
    const categoriesArr = await this.fetchAllCategories()

    await Promise.all(
      categoriesArr.map(category => {
        return this.fetchForums(category.forums)
      })
    )

    this.asyncDataStatus_fetched()
  }
}
</script>
