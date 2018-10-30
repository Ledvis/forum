import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/HomeView";
import ThreadShowView from "@/views/ThreadShowView";
import NotFound from "@/views/NotFoundView";
import ForumView from "@/views/ForumView";
import CategoryView from "@/views/CategoryView";
import ProfileView from "@/views/ProfileView";
import CreateThreadView from "@/views/CreateThreadView";
import EditThreadView from "@/views/EditThreadView";
import RegisterView from "@/views/RegisterView";
import SignInView from "@/views/SignInView";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
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
      path: "/thread/create/:forumId",
      name: "CreateThreadView",
      component: CreateThreadView,
      props: true
    },
    {
      path: "/thread/:id",
      name: "ThreadShowView",
      component: ThreadShowView,
      props: true
    },
    {
      path: "/thread/:id/edit",
      name: "EditThreadView",
      component: EditThreadView,
      props: true
    },
    {
      path: "/me",
      name: "ProfileView",
      component: ProfileView
    },
    {
      path: "/me/edit",
      name: "ProfileEdit",
      component: ProfileView,
      props: {
        edit: true
      }
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterView
    },
    {
      path: "/signin",
      name: "SignIn",
      component: SignInView
    },
    {
      path: "*",
      name: "NotFound",
      component: NotFound
    }
  ],
  mode: "history"
});
