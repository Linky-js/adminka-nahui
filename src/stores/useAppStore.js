import { defineStore } from 'pinia'
import { useEntityConfig } from '@/composables/useEntityConfig'

const STORAGE_KEY = 'app_settings'

export const useAppStore = defineStore('app', {
  state: () => ({
    user: { username: 'guest', auth_key: '' },
    apiUrl: 'http://localhost:3001/',
    apiDomain: '',
    charts: [],
    entities: {},
  }),
  getters: {
    getUser: (state) => state.user,
    getApiUrl: (state) => state.apiUrl,
    getApiDomain: (state) => state.apiDomain,
    getCharts: (state) => state.charts,
    getEntities: (state) => state.entities,
  },
  actions: {
    setUser(u) {
      this.user = u
      // user не сохраняем на сервер, только локально если нужно
    },
    setApiUrl(url) {
      this.apiUrl = url
      this.saveSettingsToServer()
    },
    setApiDomain(domain) {
      this.apiDomain = domain
      this.saveSettingsToServer()
    },
    setCharts(charts) {
      this.charts = charts || []
      this.saveSettingsToServer()
    },
    async setEntities(entities) {
      this.entities = entities || {}
      await this.saveEntitiesToApi()
    },
    saveToStorage() {
      // deprecated, but keep for compatibility if needed
    },
    async init() {
      // Загружаем settings с сервера
      await this.loadSettingsFromServer()
      // Загружаем entities с сервера
      await this.loadEntitiesFromApi()
    },
    async loadSettingsFromServer() {
      const { loadSettings } = useEntityConfig()
      const settings = await loadSettings()
      if (settings.apiUrl) this.apiUrl = settings.apiUrl
      if (settings.apiDomain) this.apiDomain = settings.apiDomain
      if (settings.charts) this.charts = settings.charts
    },
    async saveSettingsToServer() {
      const { saveSettings } = useEntityConfig()
      const settings = {
        apiUrl: this.apiUrl,
        apiDomain: this.apiDomain,
        charts: this.charts,
      }
      await saveSettings(settings)
    },
    async loadEntitiesFromApi() {
      const { listEntities } = useEntityConfig()
      this.entities = await listEntities()
    },
    async saveEntitiesToApi() {
      const { listEntities, createEntity, updateEntity, deleteEntity } = useEntityConfig()
      const currentEntities = await listEntities()
      const currentKeys = Object.keys(currentEntities)
      const newKeys = Object.keys(this.entities)

      // Удаляем старые entities, которых нет в новых
      for (const key of currentKeys) {
        if (!newKeys.includes(key)) {
          await deleteEntity(key)
        }
      }

      // Создаем или обновляем
      for (const key of newKeys) {
        const config = this.entities[key]
        if (currentKeys.includes(key)) {
          await updateEntity(key, config)
        } else {
          await createEntity(key, config)
        }
      }
    },
  },
})
