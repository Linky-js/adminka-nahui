import { useApi } from './useApi'

export function useEntityConfig() {
  const api = useApi()

  const listEntities = async () => {
    const response = await api.get('config', { action: 'list' })
    return response.entities || {}
  }

  const getEntity = async (entity) => {
    const response = await api.get('config', {
      action: 'get',
      entity,
    })
    return response.config || null
  }

  const createEntity = async (entity, config) => {
    return await api.post('config?action=create&entity=' + entity, {
      config,
    })
  }

  const updateEntity = async (entity, config) => {
    return await api.post('config?action=update&entity=' + entity, {
      config,
    })
  }

  const deleteEntity = async (entity) => {
    return await api.post('config?action=delete&entity=' + entity)
  }

  const saveSettings = async (settings) => {
    return await api.post('config?action=save_settings', settings)
  }

  const loadSettings = async () => {
    const response = await api.get('config', {
      action: 'load_settings',
    })
    return response.settings || {}
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
