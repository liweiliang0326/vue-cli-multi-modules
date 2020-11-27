/* eslint-disable */
import Vue from "vue";
import helmet from "./helmet.vue";
import store from "./store";
import router from "./router";

import { Select, Input, Button, Pagination, Empty, Alert, Spin } from "ant-design-vue";
Vue.use(Select).use(Input).use(Button).use(Pagination).use(Empty).use(Alert).use(Spin);

// Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(helmet)
}).$mount("#app");
