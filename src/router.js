import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/HomeView'
import ThreadShow from '@/views/ThreadShowView'
import NotFound from '@/views/NotFoundView'
import ForumView from '@/views/ForumView'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: ThreadShow,
    props: true
  },
  {
    path: '/forum/:id',
    name: 'ForumView',
    component: ForumView,
    props: true
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
  ],
  mode: 'history'
})
