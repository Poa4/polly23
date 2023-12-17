import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Start',
      component: StartView
    },
      {
      path: '/poll/:id/:uid',
      name: 'PollView',
      component: () => import('../views/PollView.vue')
    },
    {
      path: '/lobby/:id',
      name: 'LobbyView',
      component: () => import('../views/WaitingRoom.vue')
    },
    {
      path: '/create/:id',
      name: 'CreateView',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/InsertTruths/:uid',
      name: 'insertTruths',
      component: () => import('../views/InsertTruths.vue')
    },
    {
      path: '/result/:id',
      name: 'ResultView',
      component: () => import('../views/ResultView.vue')
    },
    {
      path: '/homePageView',
      name: 'HomePage',
      component: () => import('../views/HomePageView.vue')
    }
  ]
})

export default router
