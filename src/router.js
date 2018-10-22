import Vue from "vue";
import Router from "vue-router";
import HomeView from "./views/HomeView.vue";
import CategoryView from "@/views/CategoryView";
import ForumView from "@/views/ForumView";
import ThreadView from "@/views/ThreadView";
import UserProfileView from "@/views/UserProfileView";
import CreateThreadView from "@/views/CreateThreadView";
import EditThreadView from "@/views/EditThreadView";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/category/:id",
      name: "CategoryView",
      component: CategoryView,
      props: true
    },
    {
      path: "/forum/:id",
      name: "ForumView",
      component: ForumView,
      props: true
    },
    {
      path: "/thread/create/:id",
      name: "CreateThreadView",
      component: CreateThreadView,
      props: true
    },
    {
      path: "/thread/edit/:id",
      name: "EditThreadView",
      component: EditThreadView,
      props: true
    },
    {
      path: "/thread/:id",
      name: "ThreadView",
      component: ThreadView,
      props: true
    },
    {
      path: "/me",
      name: "UserProfileView",
      component: UserProfileView
    },
    {
      path: "/me/edit",
      name: "UserProfileEdit",
      component: UserProfileView,
      props: {
        edit: true
      }
    }
  ]
});
