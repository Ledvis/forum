import Vue from 'vue'
import Router from 'vue-router'
import HomeView from './views/HomeView.vue'
import CategoryView from '@/views/CategoryView'
import ForumView from '@/views/ForumView'
import ThreadView from '@/views/ThreadView'
import UserProfileView from '@/views/UserProfileView'
import CreateThreadView from '@/views/CreateThreadView'
import EditThreadView from '@/views/EditThreadView'
import NotFoundView from '@/views/NotFoundView'
import RegisterView from '@/views/RegisterView'
import SignInView from '@/views/SignInView'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/category/:id',
      name: 'CategoryView',
      component: CategoryView,
      props: true
    },
    {
      path: '/forum/:id',
      name: 'ForumView',
      component: ForumView,
      props: true
    },
    {
      path: '/thread/create/:id',
      name: 'CreateThreadView',
      component: CreateThreadView,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/thread/edit/:id',
      name: 'EditThreadView',
      component: EditThreadView,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/thread/:id',
      name: 'ThreadView',
      component: ThreadView,
      props: true
    },
    {
      path: '/me',
      name: 'Profile',
      component: UserProfileView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/me/edit',
      name: 'UserProfileEdit',
      component: UserProfileView,
      props: {
        edit: true
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignInView,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/logout',
      name: 'SignOut',
      meta: {
        requiresAuth: true
      },
      beforeEnter() {
        store.dispatch('signOut')
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFoundView
    }
  ]
})

router.beforeEach((to, from, next) => {
  window.console.log(`🚦 navigating from ${from.name} to ${to.name}`)

  store.dispatch('initAuthentication').then(user => {
    if (to.matched.some(route => route.meta.requiresAuth)) {
      if (user) {
        next()
      } else {
        next({
          name: 'SignIn',
          query: {
            redirectTo: to.path
          }
        })
      }
    } else if (to.matched.some(route => route.meta.requiresGuest)) {
      if (!user) {
        next()
      } else {
        next({
          name: 'Home'
        })
      }
    } else {
      next()
    }
  })

  next()
})

export default router
