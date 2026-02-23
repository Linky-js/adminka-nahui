import axios from 'axios'
import { useAppStore } from '@/stores/useAppStore'

export function useApi() {
  const store = useAppStore()
  const apiUrl = '/admin/api/'

  /* ================== BASE ================== */

  const get = async (endpoint, params = {}) => {
    const response = await axios.get(`${apiUrl}${endpoint}`, {
      params,
      withCredentials: true,
    })
    return response.data
  }

  const post = async (endpoint, data = {}, config = {}) => {
    const response = await axios.post(`${apiUrl}${endpoint}`, data, {
      withCredentials: true,
      ...config,
    })
    return response.data
  }

  const put = async (endpoint, data = {}, config = {}) => {
    const response = await axios.put(`${apiUrl}${endpoint}`, data, {
      withCredentials: true,
      ...config,
    })
    return response.data
  }

  const del = async (endpoint, config = {}) => {
    const response = await axios.delete(`${apiUrl}${endpoint}`, {
      withCredentials: true,
      ...config,
    })
    return response.data
  }

  /* ================== UPLOAD ================== */

  const upload = async (file) => {
    const fd = new FormData()
    fd.append('file', file)

    const response = await axios.post(`${apiUrl}upload`, fd, {
      withCredentials: true,
    })

    return response.data?.file?.path || null
  }

  /* ================== CONFIG (ENTITIES CONFIG) ================== */

  const listEntityConfigs = async () => {
    const data = await get('config', { action: 'list' })
    return data.entities || {}
  }

  const getEntityConfig = async (entity) => {
    const data = await get('config', {
      action: 'get',
      entity,
    })
    return data.config || null
  }

  const createEntityConfig = async (entity, config) => {
    return await post(`config?action=create&entity=${entity}`, { config })
  }

  const updateEntityConfig = async (entity, config) => {
    return await post(`config?action=update&entity=${entity}`, { config })
  }

  const deleteEntityConfig = async (entity) => {
    return await post(`config?action=delete&entity=${entity}`)
  }

  /* ================== ENTITIES CRUD ================== */

  const getEntities = async (entity) => {
    return await get(`entities/${entity}`)
  }

  const createEntity = async (entity, data) => {
    // data может быть FormData (если есть файл)
    if (data instanceof FormData) {
      return await axios
        .post(`${apiUrl}entities/${entity}`, data, {
          withCredentials: true,
        })
        .then((r) => r.data)
    }

    return await post(`entities/${entity}`, data)
  }

  const updateEntity = async (entity, id, data) => {
    return await put(`entities/${entity}/${id}`, data)
  }

  const deleteEntityById = async (entity, id) => {
    return await del(`entities/${entity}/${id}`)
  }

  const getEntityById = async (entity, id) => {
    return await get(`entities/${entity}/${id}`)
  }

  /* ================== SETTINGS ================== */

  const loadSettings = async () => {
    const data = await get('config', { action: 'load_settings' })
    return data.settings || {}
  }

  const saveSettings = async (settings) => {
    return await post('config?action=save_settings', settings)
  }

  return {
    // base
    get,
    post,
    put,
    del,

    // upload
    upload,

    // config
    listEntityConfigs,
    getEntityConfig,
    createEntityConfig,
    updateEntityConfig,
    deleteEntityConfig,

    // entities
    getEntities,
    getEntityById,
    createEntity,
    updateEntity,
    deleteEntityById,

    // settings
    loadSettings,
    saveSettings,
  }
}
