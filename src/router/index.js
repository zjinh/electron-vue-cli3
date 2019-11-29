import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export const constantRouterMap = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home')
  },
];
const router = new Router({
  // mode: 'history', // require service support
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export default router
