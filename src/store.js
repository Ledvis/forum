import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";

Vue.use(Vuex);

import { countObjPropertiesLength } from "@/utils/index";
import { isArray } from "util";

function makeAppendChildToParentMutation({ parent, child }) {
  return (store, { parentId, childId }) => {
    const resource = store[parent][parentId];

    if (!resource[child]) {
      Vue.set(resource, child, {});
    }

    console.log(resource[child], childId, childId);
    
    Vue.set(resource[child], childId, childId);
  };
}

export default new Vuex.Store({
  state: {
    posts: {},
    users: {},
    threads: {},
    forums: {},
    categories: {},
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
    SET_ITEM(state, {item, resource, id} ) {
      item['.key'] = id;
      Vue.set(state[resource], id, item);
    },
    APPEND_POST_TO_THREAD: makeAppendChildToParentMutation({
      parent: "threads",
      child: "posts"
    }),
    APPEND_POST_TO_USERS: makeAppendChildToParentMutation({
      parent: "users",
      child: "posts"
    }),
    APPEND_THREAD_TO_FORUM: makeAppendChildToParentMutation({
      parent: "forums",
      child: "threads"
    }),
    APPEND_THREAD_TO_USER: makeAppendChildToParentMutation({
      parent: "users",
      child: "threads"
    })
  },
  actions: {
    updateUser({ commit }, user) {
      commit("SET_USER", {
        userId: user[".key"],
        user
      });
    },

    updatePost({ commit }, post) {
      commit("SET_POST", {
        postId: post[".key"],
        post
      });
      Promise.resolve();
    },

    createPost({ commit, state }, post) {
      return new Promise(resolve => {
        const postId = "post" + Math.random();
        post[".key"] = postId;
        post.publishedAt = Math.floor(Date.now() / 1000);
        post.userId = state.authId;

        commit("SET_POST", {
          postId: post[".key"],
          post
        });
        commit("APPEND_POST_TO_THREAD", {
          parentId: post.threadId,
          childId: postId
        });
        commit("APPEND_POST_TO_USERS", {
          parentId: post.userId,
          childId: postId
        });

        resolve(postId);
      });
    },

    createThread({ dispatch, commit, state }, { id, title, text }) {
      return new Promise(resolve => {
        const threadId = "thread" + Math.random();
        const publishedAt = Math.floor(Date.now() / 1000);
        const thread = {
          forumId: id,
          userId: state.authId,
          publishedAt,
          title
        };
        thread[".key"] = threadId;

        commit("SET_THREAD", {
          threadId,
          thread
        });
        commit("APPEND_THREAD_TO_FORUM", {
          parentId: id,
          childId: threadId
        });
        commit("APPEND_THREAD_TO_USER", {
          parentId: state.authId,
          childId: threadId
        });

        dispatch("createPost", {
          threadId,
          text
        }).then(postId => {
          commit("SET_THREAD", {
            threadId,
            thread: {
              ...thread,
              firstPostId: postId
            }
          });
        });

        resolve(threadId);
      });
    },

    updateThread({ commit, state }, { threadId, title, text }) {
      const thread = state.threads[threadId];
      const post = state.posts[thread.firstPostId];

      const newThread = {
        ...thread,
        title
      };
      const newPost = {
        ...post,
        text
      };

      commit("SET_THREAD", {
        threadId,
        thread: newThread
      });

      commit("SET_POST", {
        postId: post[".key"],
        post: newPost
      });

      return Promise.resolve(threadId);
    },

    fetchThread({ dispatch }, id) {
      return dispatch('fetchItem', {id, resource: 'threads', emoji: '📄'})
    },

    fetchThreads({dispatch}, ids) {
      return dispatch('fetchItems', {ids, resource: 'threads', emoji: '📄'})
    },

    fetchForum({dispatch}, id) {
      return dispatch('fetchItem', {id, resource: 'forums', emoji: '📑'})
    },

    fetchForums({dispatch}, ids) {
      return dispatch('fetchItems', {ids, resource: 'forums', emoji: '📑'})
    },

    fetchUser({dispatch}, id) {
      return dispatch('fetchItem', {id, resource: 'users', emoji: '🙋‍'})
    },

    fetchPost({dispatch}, id) {
      return dispatch('fetchItem', {id, emoji: '💬‍', resource: 'posts'});
    },

    fetchPosts({dispatch}, ids) {
      return dispatch('fetchItems', {ids, resource: 'posts', emoji: '💬‍'})
    },

    fetchCategory({dispatch}, id) {
      return dispatch('fetchItem', {id, resource: 'categories', emoji: '🏷'})
    },

    fetchAllCategories({state, commit}) {
      console.log('🔥', '🏷', 'all')
      
      return new Promise((resolve, reject) => {
        firebase.database().ref('categories').once('value', snapshot => {
          const categoriesObj = snapshot.val();

          Object.keys(categoriesObj).forEach(categoryId => {
            const category = categoriesObj[categoryId];

            commit('SET_ITEM', {id: categoryId, item: category, resource: 'categories'});
          });

          resolve(Object.values(categoriesObj));
        });
      });
    },

    fetchItem({commit, state}, {id, resource, emoji}) {
      console.log('🔥', emoji, id)
      
      return new Promise((resolve, reject) => {
        firebase
        .database()
        .ref(resource)
        .child(id)
        .once("value", snapshot => {
          commit("SET_ITEM", {
            item: snapshot.val(),
            resource,
            id
          });

          resolve(state[resource][id])
        });
      });
    },

    fetchItems({dispatch}, {ids, resource, emoji}) {
      ids = isArray(ids) ? ids : Object.keys(ids);
      return Promise.all(ids.map(id => dispatch('fetchItem', {id, resource, emoji})));
    }
  },

  getters: {
    forums: state => id =>
      Object.values(state.forums).filter(forum => forum.categoryId === id),
    repliesCount: state => id =>
      Object.values(state.threads[id].posts).length - 1,
    authUser: () => {
      return {};
    },
    userPostCount: state => id =>
      countObjPropertiesLength(state.users[id].posts),
    userThreadCount: state => id =>
      countObjPropertiesLength(state.users[id].threads)
  }
});
