import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BaseDate from "@/components/BaseDate";

Vue.component("BaseDate", BaseDate);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
