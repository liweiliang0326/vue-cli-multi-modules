import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { // 首页
      path: '',
      redirect: '/inviteSon1'
    },
    {
      path: "/inviteSon1",
      name: "inviteSon1",
      component: () => import('./views/inviteSon1/inviteSon1.vue'),
      meta: { title: '去邀请子页面1' }
    },
    {
      path: "/inviteSon2",
      name: "inviteSon2",
      component: () => import('./views/inviteSon2/inviteSon2.vue'),
      meta: { title: '去邀请子页面2' }
    }

  ]
});

router.afterEach((to, from) => {
  console.log("afterEach", to);
  document.getElementsByTagName("title")[0].innerHTML = to.meta.title ? to.meta.title : "邀请好友";
})

export default router;
