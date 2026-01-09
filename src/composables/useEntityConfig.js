import axios from 'axios'

const ENTITY_CONFIG_URL = 'https://muz.dmgug.ru/test/SaveEntities.php'

export function useEntityConfig() {
  const listEntities = async () => {
    try {
      const response = await axios.get(`${ENTITY_CONFIG_URL}?action=list`)
      console.log('RESPONSE: ', response);
      
      return response.data.entities || {}
    } catch (error) {
      console.error('Failed to list entities:', error)
      return {}
    }
  }

  const getEntity = async (entity) => {
    try {
      const response = await axios.get(`${ENTITY_CONFIG_URL}?action=get&entity=${entity}`)
      return response.data.config || null
    } catch (error) {
      console.error('Failed to get entity:', error)
      return null
    }
  }

  const createEntity = async (entity, config) => {
    try {
      const response = await axios.post(`${ENTITY_CONFIG_URL}?action=create&entity=${entity}`, {
        config,
      })
      return response.data
    } catch (error) {
      console.error('Failed to create entity:', error)
      throw error
    }
  }

  const updateEntity = async (entity, config) => {
    try {
      const response = await axios.post(`${ENTITY_CONFIG_URL}?action=update&entity=${entity}`, {
        config,
      })
      return response.data
    } catch (error) {
      console.error('Failed to update entity:', error)
      throw error
    }
  }

  const deleteEntity = async (entity) => {
    try {
      const response = await axios.post(`${ENTITY_CONFIG_URL}?action=delete&entity=${entity}`)
      return response.data
    } catch (error) {
      console.error('Failed to delete entity:', error)
      throw error
    }
  }

  const saveSettings = async (settings) => {
    try {
      const response = await axios.post(`${ENTITY_CONFIG_URL}?action=save_settings`, settings)
      return response.data
    } catch (error) {
      console.error('Failed to save settings:', error)
      throw error
    }
  }

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${ENTITY_CONFIG_URL}?action=load_settings`)
      return response.data.settings || {}
    } catch (error) {
      console.error('Failed to load settings:', error)
      return {}
    }
  }
  return {
    listEntities,
    getEntity,
    createEntity,
    updateEntity,
    deleteEntity,
    saveSettings,
    loadSettings,
  }
}
