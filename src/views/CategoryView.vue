<template>
  <div
    v-if="asyncDataStatus_ready" 
    class="col-full push-top"
  >
    <h1>{{ category.name }}</h1>
    <CategoryListItem :category="category" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import CategoryListItem from '@/components/CategoryListItem'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'CategoryView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    category() {
      return this.$store.state.categories[this.id]
    }
  },
  mixins: [asyncDataStatus],
  methods: {
    ...mapActions(['fetchCategory', 'fetchForums'])
  },
  components: {
    CategoryListItem
  },
  async created() {
    const category = await this.fetchCategory(this.id)
    await this.fetchForums(category.forums)
    this.asyncDataStatus_fetched()
  }
}
</script>
