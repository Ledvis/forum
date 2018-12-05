import { isArray } from 'util'
import firebase from 'firebase'

export default {
  updateUser({ commit }, user) {
    commit('SET_USER', {
      userId: user['.key'],
      user
    })
  },

  updatePost({ commit }, post) {
    commit('SET_POST', {
      postId: post['.key'],
      post
    })
    Promise.resolve()
  },

  createPost({ commit, state }, post) {
    const postId = firebase
      .database()
      .ref('posts')
      .push().key

    post.publishedAt = Math.floor(Date.now() / 1000)
    post.userId = state.authId

    const updates = {}
    updates[`posts/${postId}`] = post
    updates[`threads/${post.threadId}/posts/${postId}`] = postId
    updates[`users/${post.userId}/posts/${postId}`] = postId

    firebase
      .database()
      .ref()
      .update(updates)
      .then(() => {
        commit('SET_ITEM', {
          id: postId,
          item: post,
          resource: 'posts'
        })
        commit('APPEND_POST_TO_THREAD', {
          parentId: post.threadId,
          childId: postId
        })
        commit('APPEND_POST_TO_USERS', {
          parentId: post.userId,
          childId: postId
        })

        return Promise.resolve(state.posts[postId])
      })
  },

  createThread({ dispatch, commit, state }, { id, title, text }) {
    return new Promise(resolve => {
      const threadId = 'thread' + Math.random()
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = {
        forumId: id,
        userId: state.authId,
        publishedAt,
        title
      }
      thread['.key'] = threadId

      commit('SET_THREAD', {
        threadId,
        thread
      })
      commit('APPEND_THREAD_TO_FORUM', {
        parentId: id,
        childId: threadId
      })
      commit('APPEND_THREAD_TO_USER', {
        parentId: state.authId,
        childId: threadId
      })

      dispatch('createPost', {
        threadId,
        text
      }).then(postId => {
        commit('SET_THREAD', {
          threadId,
          thread: {
            ...thread,
            firstPostId: postId
          }
        })
      })

      resolve(threadId)
    })
  },

  updateThread({ commit, state }, { threadId, title, text }) {
    const thread = state.threads[threadId]
    const post = state.posts[thread.firstPostId]

    const newThread = {
      ...thread,
      title
    }
    const newPost = {
      ...post,
      text
    }

    commit('SET_THREAD', {
      threadId,
      thread: newThread
    })

    commit('SET_POST', {
      postId: post['.key'],
      post: newPost
    })

    return Promise.resolve(threadId)
  },

  fetchThread: ({ dispatch }, id) => {
    return dispatch('fetchItem', {
      id,
      resource: 'threads',
      emoji: '📄'
    })
  },

  fetchThreads: ({ dispatch }, ids) => {
    return dispatch('fetchItems', {
      ids,
      resource: 'threads',
      emoji: '📄'
    })
  },

  fetchForum: ({ dispatch }, id) => {
    return dispatch('fetchItem', {
      id,
      resource: 'forums',
      emoji: '📑'
    })
  },

  fetchForums: ({ dispatch }, ids) => {
    return dispatch('fetchItems', {
      ids,
      resource: 'forums',
      emoji: '📑'
    })
  },

  fetchUser: ({ dispatch }, id) => {
    return dispatch('fetchItem', {
      id,
      resource: 'users',
      emoji: '🙋‍'
    })
  },

  fetchPost: ({ dispatch }, id) => {
    return dispatch('fetchItem', {
      id,
      emoji: '💬‍',
      resource: 'posts'
    })
  },

  fetchPosts: ({ dispatch }, ids) => {
    return dispatch('fetchItems', {
      ids,
      resource: 'posts',
      emoji: '💬‍'
    })
  },

  fetchCategory: ({ dispatch }, id) =>
    dispatch('fetchItem', {
      id,
      resource: 'categories',
      emoji: '🏷'
    }),

  fetchAllCategories({ commit }) {
    window.console.log('🔥', '🏷', 'all')

    return new Promise(resolve => {
      firebase
        .database()
        .ref('categories')
        .once('value', snapshot => {
          const categoriesObj = snapshot.val()

          Object.keys(categoriesObj).forEach(categoryId => {
            const category = categoriesObj[categoryId]

            commit('SET_ITEM', {
              id: categoryId,
              item: category,
              resource: 'categories'
            })
          })

          resolve(Object.values(categoriesObj))
        })
    })
  },

  fetchItem({ commit, state }, { id, resource, emoji }) {
    window.console.log('🔥', emoji, id)

    return new Promise(resolve => {
      firebase
        .database()
        .ref(resource)
        .child(id)
        .once('value', snapshot => {
          commit('SET_ITEM', {
            item: snapshot.val(),
            resource,
            id
          })

          resolve(state[resource][id])
        })
    })
  },

  fetchItems({ dispatch }, { ids, resource, emoji }) {
    ids = isArray(ids) ? ids : Object.keys(ids)
    return Promise.all(
      ids.map(id =>
        dispatch('fetchItem', {
          id,
          resource,
          emoji
        })
      )
    )
  }
}
