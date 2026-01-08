import { defineStore } from 'pinia'
import { entityConfigs } from '@/configs/entityConfigs'

const STORAGE_KEY = 'app_settings'

export const useAppStore = defineStore('app', {
  state: () => ({
    user: { username: 'guest', auth_key: '' },
    apiUrl: '',
    apiDomain: '',
    entities: {},
  }),
  getters: {
    getUser: (state) => state.user,
    getApiUrl: (state) => state.apiUrl,
    getApiDomain: (state) => state.apiDomain,
    getEntities: (state) => state.entities,
  },
  actions: {
    setUser(u) {
      this.user = u
      this.saveToStorage()
    },
    setApiUrl(url) {
      this.apiUrl = url
      this.saveToStorage()
    },
    setApiDomain(domain) {
      this.apiDomain = domain
      this.saveToStorage()
    },
    setEntities(entities) {
      this.entities = entities || {}
      this.saveToStorage()
    },
    saveToStorage() {
      try {
        const payload = {
          apiUrl: this.apiUrl,
          apiDomain: this.apiDomain,
          entities: this.entities,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      } catch (e) {
        console.error('Failed to save settings to localStorage', e)
      }
    },
    init() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed.apiUrl) this.apiUrl = parsed.apiUrl
          if (parsed.apiDomain) this.apiDomain = parsed.apiDomain
          if (parsed.entities) this.entities = parsed.entities
          else this.entities = entityConfigs || {}
        } else {
          // fallback to default configs shipped with app
          this.entities = entityConfigs || {}
        }
      } catch (e) {
        console.error('Failed to load settings from localStorage', e)
        this.entities = entityConfigs || {}
      }
    },
  },
})
