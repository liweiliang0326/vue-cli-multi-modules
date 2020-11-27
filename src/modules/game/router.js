import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { // 首页
      path: '',
      redirect: '/gameSon1'
    },
    {
      path: "/gameSon1",
      name: "gameSon1",
      component: () => import('./views/gameSon1/gameSon1.vue'),
      meta: { title: '去邀请子页面1' }
    },
    {
      path: "/gameSon2",
      name: "gameSon2",
      component: () => import('./views/gameSon2/gameSon2.vue'),
      meta: { title: '去邀请子页面2' }
    }

  ]
});

router.afterEach((to, from) => {
    console.log("afterEach", to);
    document.getElementsByTagName("title")[0].innerHTML = to.meta.title ? to.meta.title : "游戏";
})

export default router;
