import Vue from 'vue'
import Vuex from 'vuex'
import data from '@/data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: data,
  mutations: {
    SET_POST (state, {
      post,
      postId
    }) {
      Vue.set(state.posts, postId, post)
    },
    APPEND_POST_TO_THREAD (state, {
      postId,
      threadId
    }) {
      const thread = state.threads[threadId]
      Vue.set(thread.posts, postId, postId)
    },
    APPEND_POST_TO_USER (state, {
      postId,
      userId
    }) {
      const user = state.users[userId]
      Vue.set(user.posts, postId, postId)
    }
  },
  actions: {
    createPost ({
      commit
    }, post) {
      const postId = 'post' + Math.random()
      post['.key'] = postId

      commit('SET_POST', {
        post,
        postId
      })

      commit('APPEND_POST_TO_THREAD', {
        postId,
        threadId: post.threadId
      })

      commit('APPEND_POST_TO_USER', {
        postId,
        userId: post.userId
      })
    }
  }
})
