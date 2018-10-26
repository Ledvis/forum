<template>
  <form @submit.prevent="save">
    <div class="form-group">
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          class="form-input"
          v-model="text"></textarea>
    </div>
    <div class="form-actions">
      <button @click="cancel" v-if="isUpdate" @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
      <button class="btn-blue">{{isUpdate ? 'Update' : 'Submit'}} post</button>
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "PostEditor",

  props: {
    threadId: {
      required: false
    },

    post: {
      type: Object,
      validator: obj => {
        const isValidKey = typeof obj[".key"] === "string";
        const isValidText = typeof obj.text === "string";
        const valid = isValidKey && isValidKey;

        if (!isValidKey) {
          window.console.error(
            '😕 The post prop object must include a `[".key"]` property'
          );
        }

        if (!isValidText) {
          window.console.error(
            "😕 The post prop object must include a `text` property"
          );
        }

        return valid;
      }
    }
  },

  data() {
    return {
      text: this.post ? this.post.text : ""
    };
  },

  computed: {
    isUpdate() {
      return !!this.post;
    }
  },

  methods: {
    ...mapActions(["createPost", "updatePost"]),

    save() {
      this.persist().then(post => this.$emit("save", { post }));
    },

    persist() {
      return this.isUpdate ? this.update() : this.create();
    },

    create() {
      const post = {
        text: this.text,
        threadId: this.threadId
      };

      this.text = "";
      return this.createPost(post);
    },

    update() {
      const post = {
        id: this.post[".key"],
        text: this.text
      };

      return this.updatePost(post);
    },

    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>

<style scoped>
</style>
