import Vue from 'vue'
import Vuex from 'vuex'
import data from '@/data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...data,
    authUser: 'FsCDAk9w8NeXEceLV87arpsXjnQ2'
  },
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
    },
    SET_USER (state, {
      user,
      userId
    }) {
      Vue.set(state.users, userId, user)
    }
  },
  actions: {
    createPost ({
      commit,
      state
    }, post) {
      const postId = 'post' + Math.random()
      post['.key'] = postId
      post.publishedAt = Math.floor(Date.now() / 1000)
      post.userId = state.authUser

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
    },
    updateUser ({
      commit
    }, user) {
      console.log(user)
      commit('SET_USER', {
        user,
        userId: user['.key']
      })
    }
  },
  getters: {
    authUser (state) {
      return state.users[state.authUser]
    },
    userPosts: state => userId => Object.values(state.posts).filter(post => post.userId === userId),
    thread: state => threadId => state.threads[threadId]
  }
})
