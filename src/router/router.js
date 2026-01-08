import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/admin',
    name: 'AdminHome',
    component: () => import('../pages/AdminPage.vue'),
  },
  {
    path: '/admin/:entity',
    name: 'AdminEntityList',
    component: () => import('../pages/EntityListPage.vue'),
    props: true,
  },
  {
    path: '/admin/:entity/create',
    name: 'AdminEntityCreate',
    component: () => import('../pages/EntityCreatePage.vue'),
    props: true,
  },
  {
    path: '/admin/:entity/:id/edit',
    name: 'AdminEntityEdit',
    component: () => import('../pages/EntityEditPage.vue'),
    props: true,
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
