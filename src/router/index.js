import { createRouter, createWebHistory } from 'vue-router'
import HomePageView from "@/views/HomePageView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Start',
      component: HomePageView
    },
      {
      path: '/poll/:id/:uid',
      name: 'PollView',
      component: () => import('../views/PollView.vue')
    },
    {
      path: '/lobby/:id/:uid',
      name: 'LobbyView',
      component: () => import('../views/WaitingRoom.vue')
    },
    {
      path: '/lobby/:id/',
      name: 'LobbyViewWithoutUserName',
      component: () => import('../views/JoinWaitingRoomThroughLink.vue')
    },
    {
      path: '/create/:id/:uid',
      name: 'CreateView',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/InsertTruths/:id/:uid',
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
    },
    {
<<<<<<< HEAD
      path: '/test/',
      name: 'VanjaView',
      component: () => import('../Vanja.vue')
    },
    {
      path: '/spotTheLie/:id/:uid',
      name: 'spotTheLie',
      component: () => import("../views/SpotTheLie.vue")
=======
      path: '/highscore/',
      name: 'HighScoreView',
      component: () => import('../HighScore.vue')
>>>>>>> 98075d1657251a1e79c8e6385594f8ede4a4e547
    }
  ]
})

export default router
