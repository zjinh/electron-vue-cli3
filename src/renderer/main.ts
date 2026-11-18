import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import './assets/style/public.scss'

const router = createRouter({ history: createWebHashHistory(), routes: [{ path: '/', name: 'Home', component: HomeView }] })
createApp(App).use(router).mount('#app')
