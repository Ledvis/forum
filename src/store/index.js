import Vue from 'vue'
import Vuex from 'vuex'
import data from '@/data'
import {
  countObjProperties
} from '@/utils/index'

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

    SET_USER (state, {
      user,
      userId
    }) {
      Vue.set(state.users, userId, user)
    },

    SET_THREAD (state, {
      threadId,
      thread
    }) {
      Vue.set(state.threads, threadId, thread)
    },

    APPEND_POST_TO_THREAD (state, {
      postId,
      threadId
    }) {
      const thread = state.threads[threadId]

      if (!thread.posts) {
        Vue.set(thread, 'posts', {})
      }

      Vue.set(thread.posts, postId, postId)
    },

    APPEND_POST_TO_USER (state, {
      postId,
      userId
    }) {
      const user = state.users[userId]

      if (!user.posts) {
        Vue.set(user, 'posts', {})
      }

      Vue.set(user.posts, postId, postId)
    },

    APPEND_THREAD_TO_FORUM (state, {
      threadId,
      forumId
    }) {
      const forum = state.forums[forumId]

      if (!forum.threads) {
        Vue.set(forum.threads, threadId, {})
      }

      Vue.set(forum.threads, threadId, threadId)
    },

    APPEND_THREAD_TO_USER (state, {
      userId,
      threadId
    }) {
      const user = state.users[userId]

      if (!user.threads) {
        Vue.set(user, 'threads', {})
      }

      Vue.set(user.threads, threadId, threadId)
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

      return Promise.resolve(postId)
    },

    updateUser ({
      commit
    }, user) {
      commit('SET_USER', {
        user,
        userId: user['.key']
      })
    },

    createThread ({
      commit,
      dispatch,
      state
    }, {
      title,
      text,
      forumId
    }) {
      return new Promise((resolve) => {
        const threadId = 'thread' + Math.random()
        const publishedAt = Date.now() / 1000
        const userId = state.authUser

        const thread = {
          '.key': threadId,
          forumId,
          userId,
          publishedAt,
          title
        }

        commit('SET_THREAD', {
          threadId,
          thread
        })

        commit('APPEND_THREAD_TO_FORUM', {
          threadId,
          forumId
        })

        commit('APPEND_THREAD_TO_USER', {
          userId,
          threadId
        })

        dispatch('createPost', {
          text,
          threadId
        }).then(postId => {
          commit('SET_THREAD', {
            threadId,
            thread: { ...thread,
              firstPostId: postId
            }
          })
        })

        resolve(threadId)
      })
    },

    updateThread ({
      commit,
      state,
      dispatch
    }, {
      title,
      text,
      id
    }) {
      return new Promise((resolve) => {
        const thread = state.threads[id]

        const newThread = { ...thread,
          title
        }

        commit('SET_THREAD', {
          thread: newThread,
          threadId: id
        })

        dispatch('updatePost', {
          id: thread.firstPostId,
          text
        }).then(() => resolve(newThread))
      })
    },

    updatePost ({
      commit,
      state
    }, {
      id,
      text
    }) {
      const post = state.posts[id]

      commit('SET_POST', {
        postId: id,
        post: { ...post,
          text,
          edited: {
            at: Date.now() / 1000,
            by: state.authUser
          }
        }
      })

      Promise.resolve(post)
    }
  },
  getters: {
    authUser (state) {
      return state.users[state.authUser]
    },
    userPosts: state => userId => Object.values(state.posts).filter(post => post.userId === userId),
    userPostsCount: state => id => countObjProperties(state.users[id].posts),
    userThreadsCount: state => id => countObjProperties(state.users[id].threads),
    thread: state => threadId => state.threads[threadId],
    forum: status => forumId => status.forums[forumId]
  }
})
