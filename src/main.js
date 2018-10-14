import Vue from 'vue'
import App from './App.vue'
import BaseDate from '@/components/BaseDate.vue'
import router from './router'
import store from './store/index'

Vue.component('BaseDate', BaseDate)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
