import { countObjProperties } from "@/utils/index";

export default {
  authUser(state) {
    return state.users[state.authUser];
  },
  userPosts: state => userId =>
    Object.values(state.posts).filter(post => post.userId === userId),
  userPostsCount: state => id => countObjProperties(state.users[id].posts),
  userThreadsCount: state => id => countObjProperties(state.users[id].threads),
  thread: state => threadId => state.threads[threadId],
  threadRepliesCount: state => threadId =>
    countObjProperties(state.threads[threadId].posts) - 1,
  forum: status => forumId => status.forums[forumId]
};
