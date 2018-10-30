import firebase from "firebase";

export default {
  createPost({ commit, state }, post) {
    const postId = firebase
      .database()
      .ref("posts")
      .push().key;

    post.publishedAt = Math.floor(Date.now() / 1000);
    post.userId = state.authUser;

    const updates = {};

    updates[`posts/${postId}`] = post;
    updates[`threads/${post.threadId}/posts/${postId}`] = postId;
    updates[`threads/${post.threadId}/contributors/${post.userId}`] =
      post.userId;
    updates[`users/${post.userId}/posts/${postId}`] = postId;

    firebase
      .database()
      .ref()
      .update(updates)
      .then(() => {
        commit("SET_ITEM", { item: post, id: postId, resource: "posts" });

        commit("APPEND_POST_TO_THREAD", {
          parentId: post.threadId,
          childId: postId
        });

        commit("APPEND_POST_TO_USER", {
          parentId: post.userId,
          childId: postId
        });

        commit("APPEND_CONTRIBUTOR_TO_THREAD", {
          parentId: post.threadId,
          childId: post.userId
        });

        return Promise.resolve(postId);
      });
  },

  createThread({ commit, state }, { title, text, forumId }) {
    return new Promise(resolve => {
      const threadId = firebase
        .database()
        .ref("threads")
        .push().key;

      const postId = firebase
        .database()
        .ref("posts")
        .push().key;

      const publishedAt = Date.now() / 1000;
      const userId = state.authUser;

      const thread = {
        forumId,
        userId,
        publishedAt,
        title,
        firstPostId: postId,
        posts: {}
      };

      thread.posts[postId] = postId;

      const post = { text, publishedAt, threadId, userId };

      const updates = {};

      updates[`threads/${threadId}`] = thread;
      updates[`forums/${forumId}/threads/${threadId}`] = threadId;
      updates[`threads/${threadId}/contributors/${post.userId}`] = post.userId;
      updates[`users/${userId}/threads/${threadId}`] = threadId;
      updates[`posts/${postId}`] = post;
      updates[`users/${post.userId}/posts/${postId}`] = postId;

      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          commit("SET_ITEM", {
            resource: "threads",
            id: threadId,
            item: thread
          });

          commit("APPEND_THREAD_TO_FORUM", {
            parentId: forumId,
            childId: threadId
          });

          commit("APPEND_THREAD_TO_USER", {
            parentId: userId,
            childId: threadId
          });

          commit("SET_ITEM", { item: post, id: postId, resource: "posts" });

          commit("APPEND_POST_TO_THREAD", {
            parentId: post.threadId,
            childId: postId
          });

          commit("APPEND_POST_TO_USER", {
            parentId: post.userId,
            childId: postId
          });

          commit("APPEND_CONTRIBUTOR_TO_THREAD", {
            parentId: post.threadId,
            childId: post.userId
          });

          resolve(threadId);
        });
    });
  },

  createUser({ commit }, { id, email, name, username, avatar = null }) {
    return new Promise(resolve => {
      const registeredAt = Math.floor(Date.now() / 1000);
      const usernameLower = username.toLowerCase();
      email = email.toLowerCase();
      const user = {
        avatar,
        email,
        name,
        username,
        usernameLower,
        registeredAt
      };
      firebase
        .database()
        .ref("users")
        .child(id)
        .set(user)
        .then(() => {
          commit("SET_ITEM", { resource: "users", id: id, item: user });
          resolve();
        });
    });
  },

  registerUserWithEmailAndPassword(
    { dispatch },
    { email, name, username, password, avatar = null }
  ) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        return dispatch("createUser", {
          id: user.uid,
          email,
          name,
          username,
          password,
          avatar
        });
      });
  },

  signInWithEmailAndPassword(context, { email, password }) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  },

  signOut({ commit }) {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        commit("SET_AUTH_ID", null);
      });
  },

  fetchAuthUser({ commit, dispatch }) {
    const userId = firebase.auth().currentUser.uid;

    dispatch("fetchUser", { id: userId }).then(() =>
      commit("SET_AUTH_ID", userId)
    );
  },

  updateUser({ commit }, user) {
    commit("SET_USER", {
      user,
      userId: user[".key"]
    });
  },

  updateThread({ commit, state }, { title, text, id }) {
    return new Promise(resolve => {
      const thread = state.threads[id];
      const post = state.posts[thread.firstPostId];
      const edited = {
        at: Date.now() / 1000,
        by: state.authUser
      };

      const updates = {};
      updates[`threads/${id}/title`] = title;
      updates[`posts/${thread.firstPostId}/text`] = text;
      updates[`posts/${thread.firstPostId}/edited`] = edited;

      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          commit("SET_THREAD", {
            thread: { ...thread, title },
            threadId: id
          });

          commit("SET_POST", {
            postId: thread.firstPostId,
            post: { ...post, text, edited }
          });

          resolve(post);
        });
    });
  },

  updatePost({ commit, state }, { id, text }) {
    const post = state.posts[id];
    const edited = {
      at: Date.now() / 1000,
      by: state.authUser
    };

    const updates = { text, edited };

    firebase
      .database()
      .ref("posts")
      .child(id)
      .update(updates)
      .then(() => {
        commit("SET_POST", {
          postId: id,
          post: { ...post, text, edited }
        });

        Promise.resolve(post);
      });
  },

  fetchCategory: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { id, emoji: "🏷", resource: "categories" }),

  fetchForum: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { id, emoji: "🗞", resource: "forums" }),

  fetchThread: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { id, emoji: "📄", resource: "threads" }),

  fetchPost: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { id, emoji: "💬‍", resource: "posts" }),

  fetchUser: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { id, emoji: "🙋‍", resource: "users" }),

  fetchItem({ commit, state }, { id, emoji, resource }) {
    window.console.log("🔥", emoji, id);
    return new Promise(resolve => {
      firebase
        .database()
        .ref(resource)
        .child(id)
        .once("value", snapshot => {
          const item = snapshot.val();
          commit("SET_ITEM", {
            id: snapshot.key,
            item,
            resource
          });
          resolve(state[resource][id]);
        });
    });
  },

  fetchCategories({ commit, state }) {
    window.console.log("🔥", "🏷", "all");
    return new Promise(resolve => {
      firebase
        .database()
        .ref("categories")
        .once("value", snapshot => {
          const categoriesObj = snapshot.val();

          Object.keys(categoriesObj).forEach(id => {
            const categoryItem = categoriesObj[id];

            commit("SET_ITEM", {
              id,
              item: categoryItem,
              resource: "categories"
            });
          });

          resolve(Object.values(state.categories));
        });
    });
  },

  fetchForums: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { ids, emoji: "🗞", resource: "forums" }),

  fetchThreads: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { ids, emoji: "📄", resource: "threads" }),

  fetchPosts: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { ids, emoji: "💬‍", resource: "posts" }),

  fetchUsers: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { ids, emoji: "🙋‍", resource: "users" }),

  fetchItems({ dispatch }, { ids, emoji, resource }) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids);
    return Promise.all(
      ids.map(id => dispatch("fetchItem", { id, emoji, resource }))
    );
  }
};
