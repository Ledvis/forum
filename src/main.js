import Vue from "vue";
import firebase from "firebase";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BaseDate from "@/components/BaseDate";

const config = {
  apiKey: "AIzaSyCDCLgZiO3UFw0PGatPCXVK9F9nY4uI3BM",
  authDomain: "vue-forum-d7758.firebaseapp.com",
  databaseURL: "https://vue-forum-d7758.firebaseio.com",
  projectId: "vue-forum-d7758",
  storageBucket: "vue-forum-d7758.appspot.com",
  messagingSenderId: "628124569546"
};

firebase.initializeApp(config);

Vue.component("BaseDate", BaseDate);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
