import Vue from "vue";
import invite from "./Invite.vue";
import router from "./router";

new Vue({
  router,
  render: h => h(invite)
}).$mount("#app");
