import Vue from "vue";
import Vuex from "vuex";
import data from "@/data";

Vue.use(Vuex);

import { countObjPropertiesLength } from "@/utils/index";

function makkeAppendChildToParentMutation(parent, child) {}

export default new Vuex.Store({
  state: {
    ...data,
    authId: "ALXhxjwgY9PinwNGHpfai6OWyDu2"
  },
  mutations: {
    SET_USER(state, { userId, user }) {
      Vue.set(state.users, userId, user);
    },
    SET_POST(state, { postId, post }) {
      Vue.set(state.posts, postId, post);
    },
    SET_THREAD(state, { threadId, thread }) {
      Vue.set(state.threads, threadId, thread);
    },
    APPEND_POST_TO_THREAD(state, { threadId, postId }) {
      const thread = state.threads[threadId];

      if (!thread.posts) {
        Vue.set(thread, "posts", {});
      }

      Vue.set(thread.posts, postId, postId);
    },
    APPEND_POST_TO_USERS(state, { userId, postId }) {
      const user = state.users[userId];

      if (!user.posts) {
        Vue.set(user, "posts", {});
      }

      Vue.set(user.posts, postId, postId);
    },
    APPEND_THREAD_TO_FORUM(state, { forumId, threadId }) {
      const forum = state.forums[forumId];

      if (!forum.threads) {
        Vue.set(forum, "threads", {});
      }

      Vue.set(forum.threads, threadId, threadId);
    },
    APPEND_THREAD_TO_USER(state, { userId, threadId }) {
      const user = state.users[userId];

      if (!user.threads) {
        Vue.set(user, "threads", {});
      }

      Vue.set(user.threads, threadId, threadId);
    }
  },
  actions: {
    updateUser({ commit }, user) {
      commit("SET_USER", { userId: user[".key"], user });
    },
    updatePost({ commit }, post) {
      commit("SET_POST", { postId: post[".key"], post });
      Promise.resolve();
    },
    createPost({ commit, state }, post) {
      return new Promise(resolve => {
        const postId = "post" + Math.random();
        post[".key"] = postId;
        post.publishedAt = Math.floor(Date.now() / 1000);
        post.userId = state.authId;

        commit("SET_POST", { postId: post[".key"], post });
        commit("APPEND_POST_TO_THREAD", { threadId: post.threadId, postId });
        commit("APPEND_POST_TO_USERS", { userId: post.userId, postId });

        resolve(postId);
      });
    },

    createThread({ dispatch, commit, state }, { id, title, text }) {
      return new Promise((resolve, reject) => {
        const threadId = "thread" + Math.random();
        const publishedAt = Math.floor(Date.now() / 1000);
        const thread = {
          forumId: id,
          userId: state.authId,
          publishedAt,
          title
        };
        thread[".key"] = threadId;

        commit("SET_THREAD", { threadId, thread });
        commit("APPEND_THREAD_TO_FORUM", { forumId: id, threadId });
        commit("APPEND_THREAD_TO_USER", { userId: state.authId, threadId });

        dispatch("createPost", { threadId, text }).then(postId => {
          commit("SET_THREAD", {
            threadId,
            thread: { ...thread, firstPostId: postId }
          });
        });

        resolve(threadId);
      });
    },
    updateThread({ commit, state }, { threadId, title, text }) {
      const thread = state.threads[threadId];
      const post = state.posts[thread.firstPostId];

      const newThread = { ...thread, title };
      const newPost = { ...post, text };

      commit("SET_THREAD", { threadId, thread: newThread });
      commit("SET_POST", { postId: post[".key"], post: newPost });

      return Promise.resolve(threadId);
    }
  },
  getters: {
    forums: state => id =>
      Object.values(state.forums).filter(forum => forum.categoryId === id),
    repliesCount: state => id =>
      Object.values(state.threads[id].posts).length - 1,
    authUser: state => state.users[state.authId],
    userPostCount: state => id =>
      countObjPropertiesLength(state.users[id].posts),
    userThreadCount: state => id =>
      countObjPropertiesLength(state.users[id].threads)
  }
});
