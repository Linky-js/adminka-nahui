import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../pages/AdminPage.vue'),
  },
  {
    path: '/nelzya-tuda',
    name: 'Forbidden',
    component: () => import('../pages/ForbiddenPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    const app = document.getElementById('app')
    if (app) app.scrollIntoView({ behavior: 'smooth' })
  },
})

export default router
