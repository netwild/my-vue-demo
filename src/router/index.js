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
    path: '/page-genie',
    name: 'page-genie',
    component: () => import(/* webpackChunkName: "page-genie" */ '@/views/PageGenie')
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
