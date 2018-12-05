import Vue from 'vue'

function makeAppendChildToParentMutation({ parent, child }) {
  return (store, { parentId, childId }) => {
    const resource = store[parent][parentId]

    if (!resource[child]) {
      Vue.set(resource, child, {})
    }

    Vue.set(resource[child], childId, childId)
  }
}

export default {
  SET_USER(state, { userId, user }) {
    Vue.set(state.users, userId, user)
  },
  SET_POST(state, { postId, post }) {
    Vue.set(state.posts, postId, post)
  },
  SET_THREAD(state, { threadId, thread }) {
    Vue.set(state.threads, threadId, thread)
  },
  SET_ITEM(state, { item, resource, id }) {
    item['.key'] = id
    Vue.set(state[resource], id, item)
  },
  APPEND_POST_TO_THREAD: makeAppendChildToParentMutation({
    parent: 'threads',
    child: 'posts'
  }),
  APPEND_POST_TO_USERS: makeAppendChildToParentMutation({
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
}
