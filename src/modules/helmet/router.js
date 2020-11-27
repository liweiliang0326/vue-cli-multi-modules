import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [

    { // 首页
      path: '',
      redirect: '/home'
    },

    { // 首页
      path: '/home',
      name: 'Home',
      component: () => import('./views/home/home.vue'),
    },

    { // 直播页面
      path: '/live/:id',
      name: 'Live',
      component: () => import('./views/live/live.vue'),
    },

    { // 视频回放页面
      path: '/videoplayback/:id',
      name: 'videoPlayBack',
      component: () => import('./views/videoPlayBack/videoPlayBack.vue'),
    },

    { // 查看图片
      path: '/viewpicture/:id',
      name: 'viewPicture',
      component: () => import('./views/viewPicture/viewPicture.vue'),
    }
  ]
});

export default router;
