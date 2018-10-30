import Vue from "vue";
import firebase from "firebase";
import App from "./App.vue";
import BaseDate from "@/components/BaseDate.vue";
import router from "./router";
import store from "./store/index";

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_ID
};

firebase.initializeApp(config);

Vue.component("BaseDate", BaseDate);

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch("fetchAuthUser");
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
