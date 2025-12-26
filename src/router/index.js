// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/pages/HomeView.vue'
import CourseView from '@/pages/CourseView.vue'
import FoodView from '@/pages/FoodView.vue'
import LunchView from '@/pages/LunchView.vue'
import DrinkView from '@/pages/DrinkView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/course', name: 'course', component: CourseView },
  { path: '/food', name: 'food', component: FoodView },
  { path: '/lunch', name: 'lunch', component: LunchView },
  { path: '/drink', name: 'drink', component: DrinkView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0, behavior: 'smooth' }
  },
})

// 🔥 THIS is important – default export
export default router
