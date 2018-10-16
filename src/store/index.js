import Vue from 'vue'
import Vuex from 'vuex'
import {
  countObjProperties
} from '@/utils/index'

Vue.use(Vuex)

function makeAppendChildToParentMutation ({
  parent,
  child
}) {
  return (state, {
    parentId,
    childId
  }) => {
    const resource = state[parent][parentId]

    if (!resource[child]) {
      Vue.set(resource, child, {})
    }

    Vue.set(resource[child], childId, childId)
  }
}

export default new Vuex.Store({
  state: {
    categories: {},
    forums: {},
    posts: {},
    threads: {},
    users: {},
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

    APPEND_POST_TO_THREAD: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'posts'
    }),

    APPEND_POST_TO_USER: makeAppendChildToParentMutation({
      parent: 'users',
      child: 'posts'
    }),

    APPEND_THREAD_TO_FORUM: makeAppendChildToParentMutation({
      parent: 'forums',
      child: 'threads'
    }),

    APPEND_THREAD_TO_USER: makeAppendChildToParentMutation({
      parent: 'users',
      child: 'threads'
    })
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
        parentId: post.threadId,
        childId: postId
      })

      commit('APPEND_POST_TO_USER', {
        parentId: post.userId,
        childId: postId
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
          parentId: forumId,
          childId: threadId
        })

        commit('APPEND_THREAD_TO_USER', {
          parentId: userId,
          childId: threadId
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
      // return state.users[state.authUser]
      return {}
    },
    userPosts: state => userId => Object.values(state.posts).filter(post => post.userId === userId),
    userPostsCount: state => id => countObjProperties(state.users[id].posts),
    userThreadsCount: state => id => countObjProperties(state.users[id].threads),
    thread: state => threadId => state.threads[threadId],
    threadRepliesCount: state => threadId => countObjProperties(state.threads[threadId].posts) - 1,
    forum: status => forumId => status.forums[forumId]
  }
})
