import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/paged/design',
    name: 'paged-design',
    component: () => import(/* webpackChunkName: "paged-design" */ '@/views/paged/Design')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '@/views/AboutView')
  }
]

const router = new VueRouter({
  routes
})

export default router
