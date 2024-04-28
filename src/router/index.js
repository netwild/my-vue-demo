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
    path: '/dragg',
    name: 'dragg',
    component: () => import(/* webpackChunkName: "dragg" */ '@/views/dragg')
  },
  {
    path: '/datad/tools',
    name: 'datad-tools',
    component: () => import(/* webpackChunkName: "datad-tools" */ '@/views/datad/Tools')
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
