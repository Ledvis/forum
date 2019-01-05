import { isArray } from 'util'
import firebase from 'firebase'

export default {
  updateUser({ commit }, user) {
    commit('SET_USER', {
      userId: user['.key'],
      user
    })
  },

  updatePost({ commit, state }, { id, text }) {
    return new Promise(resolve => {
      const post = state.posts[id]
      const edited = {
        at: Math.floor(Date.now() / 1000),
        by: state.authId
      }

      const updates = {
        text,
        edited
      }

      firebase
        .database()
        .ref('posts')
        .child(id)
        .update(updates)
        .then(() => {
          commit('SET_POST', {
            postId: id,
            post: {
              ...post,
              text,
              edited
            }
          })
          resolve(post)
        })
    })
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
    updates[`threads/${post.threadId}/contributors/${postId}`] = postId
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
        commit('APPEND_CONTRIBUTORS_TO_THREAD', {
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

  createThread({ commit, state }, { forumId, title, text }) {
    return new Promise(resolve => {
      const threadId = firebase
        .database()
        .ref('threads')
        .push().key

      const postId = firebase
        .database()
        .ref('posts')
        .push().key

      const userId = state.authId

      const publishedAt = Math.floor(Date.now() / 1000)

      const thread = {
        title,
        forumId,
        publishedAt,
        userId,
        firstPostId: postId,
        posts: {}
      }

      thread.posts[postId] = postId

      const post = {
        text,
        publishedAt,
        threadId,
        userId
      }

      const updates = {}

      // Update thread
      updates[`threads/${threadId}`] = thread
      updates[`forums/${forumId}/threads/${threadId}`] = threadId
      updates[`users/${userId}/threads/${threadId}`] = threadId

      // Update post
      updates[`posts/${postId}`] = post
      updates[`users/${userId}/posts/${postId}`] = postId
      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          // Update thread
          commit('SET_ITEM', {
            id: threadId,
            item: thread,
            resource: 'threads'
          })
          commit('APPEND_THREAD_TO_FORUM', {
            parentId: forumId,
            childId: threadId
          })
          commit('APPEND_THREAD_TO_USER', {
            parentId: userId,
            childId: threadId
          })

          // Update post
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

          resolve(state.threads[threadId])
        })
    })
  },

  updateThread({ commit, state }, { threadId, title, text }) {
    return new Promise(resolve => {
      const thread = state.threads[threadId]
      const post = state.posts[thread.firstPostId]

      const edited = {
        at: Math.floor(Date.now() / 1000),
        by: state.authId
      }

      const updates = {}

      updates[`posts/${thread.firstPostId}/text`] = text
      updates[`posts/${thread.firstPostId}/edited`] = edited
      updates[`threads/${threadId}/title`] = title

      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          commit('SET_THREAD', {
            threadId,
            thread: {
              ...thread,
              title
            }
          })

          commit('SET_POST', {
            postId: thread.firstPostId,
            post: {
              ...post,
              text,
              edited
            }
          })

          return resolve(threadId)
        })
    })
  },

  initAuthentication({ dispatch, commit, state }) {
    return new Promise(resolve => {
      if (state.unsubscribeAuthObserver) {
        state.unsubscribeAuthObserver()
      }

      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        window.console.log('👣 the user has changed')

        if (user) {
          dispatch('fetchAuthUser').then(dbUser => resolve(dbUser))
        } else {
          resolve(null)
        }
      })

      commit('SET_UNSUBSCRIBE_AUTH_OBSERVER', unsubscribe)
    })
  },

  fetchAuthUser({ dispatch, commit }) {
    const userId = firebase.auth().currentUser.uid

    return new Promise(resolve => {
      firebase
        .database()
        .ref('users')
        .child(userId)
        .once('value', snapshot => {
          if (snapshot.exists()) {
            return dispatch('fetchUser', userId).then(user => {
              commit('SET_AUTH_ID', userId)
              resolve(user)
            })
          } else {
            resolve(null)
          }
        })
    })
  },

  registerUserWithEmailAndPassword(
    { dispatch },
    { name, username, email, password, avatar = null }
  ) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        return dispatch('createUser', {
          id: user.uid,
          email,
          name,
          username,
          password,
          avatar
        })
      })
      .then(() => dispatch('fetchAuthUser'))
  },

  signInWithEmailAndPassword(context, { email, password }) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },

  signOut({ commit }) {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        commit('SET_AUTH_ID', null)
      })
  },

  signInWithGoogle({ dispatch }) {
    const provider = new firebase.auth.GoogleAuthProvider()

    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(data => {
        const user = data.user
        firebase
          .database()
          .ref('users')
          .child(user.uid)
          .once('value', snapshot => {
            if (!snapshot.exists()) {
              return dispatch('createUser', {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                username: user.email,
                avatar: user.photoURL
              }).then(() => dispatch('fetchAuthUser'))
            }
          })
      })
  },

  createUser({ state, commit }, { id, name, username, email, avatar }) {
    return new Promise(resolve => {
      const registeredAt = Math.floor(Date.now() / 1000)
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = {
        registeredAt,
        name,
        username,
        usernameLower,
        email,
        avatar
      }

      firebase
        .database()
        .ref('users')
        .child(id)
        .set(user)
        .then(() => {
          commit('SET_ITEM', {
            resource: 'users',
            id,
            item: user
          })
          resolve(state.users[id])
        })
    })
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
