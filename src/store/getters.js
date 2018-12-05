import { countObjPropertiesLength } from "@/utils/index";

export default {
  forums: state => id =>
    Object.values(state.forums).filter(forum => forum.categoryId === id),
  repliesCount: state => id =>
    Object.values(state.threads[id].posts).length - 1,
  authUser: state => {
    return state.users[state.authId];
  },
  userPostCount: state => id =>
    countObjPropertiesLength(state.users[id].posts),
  userThreadCount: state => id =>
    countObjPropertiesLength(state.users[id].threads)
}