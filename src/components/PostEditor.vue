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
      <button @click="cancel" v-if="isUpdate" @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
      <button class="btn-blue">{{isUpdate ? 'Update' : 'Submit'}} post</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'PostEditor',
  
  props: {
    threadId: {
      required: false
    },

    post: {
      type: Object,
      validator: obj => {
        const isValidKey = typeof obj['.key'] === 'string'
        const isValidText = typeof obj.text === 'string'
        const valid = isValidKey && isValidKey

        if (!isValidKey) {
          console.error('😕 The post prop object must include a `[".key"]` property');
        }

        if (!isValidText) {
          console.error('😕 The post prop object must include a `text` property');
        }

        return valid
      }
    }
  },

  data() {
    return {
      text: this.post ? this.post.text : ''
    };
  },

  computed: {
    isUpdate() {
      return !!this.post
    }
  },

  methods: {
    save() {
      this.persist().then(post => this.$emit("save", {post}))
    },

    create() {
      const post = {
        text: this.text,
        threadId: this.threadId,
      };

      this.text = "";
      return this.$store.dispatch('createPost', post)
    },

    update() {
      const post = {
        id: this.post['.key'],
        text: this.text
      }
      
      return this.$store.dispatch('updatePost', post)
    },

    persist() {
      return this.isUpdate ? this.update() : this.create()
    },

    cancel() {
      this.$emit('cancel');
    }
  },
};
</script>

<style scoped>
</style>
