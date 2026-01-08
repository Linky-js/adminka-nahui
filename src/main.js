import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router/router'
import App from './App.vue'
import { useAppStore } from '@/stores/useAppStore'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// initialize store from localStorage (loads api settings and entities)
const appStore = useAppStore(pinia)
appStore.init()

app.mount('#app')
