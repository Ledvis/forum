<template>
  <form @submit.prevent="save">
    <div class="form-group"><label for="thread_title">Title:</label>
      <input id="thread_title" name="title" class="form-input" type="text" v-model="form.title">
    </div>
    <div class="form-group"><label for="thread_content">Content:</label>
      <textarea id="thread_content" name="content" rows="8" cols="140" class="form-input" v-model="form.text"></textarea>
    </div>
    <div class="btn-group">
      <button class="btn btn-ghost" @click="cancel">Cancel</button>
      <button type="submit" name="Publish" class="btn btn-blue">Publish</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'ThreadEditor',
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        title: this.title,
        text: this.text
      }
    }
  },
  methods: {
    save() {
      this.$emit('save', { ...this.form })
    },

    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
