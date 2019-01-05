import { countObjPropertiesLength } from '@/utils/index'

export default {
  forums: state => id =>
    Object.values(state.forums).filter(forum => forum.categoryId === id),
  repliesCount: state => id =>
    Object.values(state.threads[id].posts).length - 1,
  authUser: state => {
    return state.authId ? state.users[state.authId] : null
  },
  userPosts: state => id => {
    const user = state.users[id]
    if (user.posts) {
      return Object.values(state.posts).filter(post => post.userId === id)
    }
    return []
  },
  userPostCount: state => id => countObjPropertiesLength(state.users[id].posts),
  userThreadCount: state => id =>
    countObjPropertiesLength(state.users[id].threads)
}
