import Vue from "vue";
import game from "./game.vue";
import store from "./store";
import router from "./router";

// import { Toast, Button, Icon, Popup } from "vant";
// Vue.use(Toast).use(Button).use(Icon).use(Popup);

new Vue({
  store,
  router,
  render: h => h(game)
}).$mount("#app");
