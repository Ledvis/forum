<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        class="form-input"
        v-model="text"
      ></textarea>
    </div>
    <div class="form-actions">
      <button
        v-if="isUpdating"
        class="btn-ghost"
        @click.prevent="cancel"
      >Cancel</button>
      <button class="btn-blue">{{ this.isUpdating ? 'Update' : 'Submit' }} post</button>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'PostEditor',
  props: {
    post: {
      type: Object,
      validator(obj) {
        const keyIsValid = typeof obj['.key'] === 'string'
        const textIsValid = typeof obj.text === 'string'
        const isValid = keyIsValid && textIsValid

        if (!keyIsValid) {
          window.console.error(
            '😳 The post prop object must include a `text` attribute.'
          )
        }

        if (!textIsValid) {
          window.console.error(
            '😳 The post prop object must include a `.key` attribute.'
          )
        }

        return isValid
      }
    },
    threadId: {
      type: String
    }
  },
  data() {
    return {
      text: this.post ? this.post.text : ''
    }
  },
  computed: {
    isUpdating() {
      return !!this.post
    }
  },
  methods: {
    ...mapActions(['createPost', 'updatePost']),

    save() {
      this.persist().then(() => this.$emit('save'))
    },
    persist() {
      return this.isUpdating ? this.update() : this.create()
    },
    create() {
      const post = {
        text: this.text,
        threadId: this.threadId
      }

      this.text = ''
      return this.createPost(post)
    },
    update() {
      const payload = {
        id: this.post['.key'],
        text: this.text
      }

      return this.updatePost(payload)
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
