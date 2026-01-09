import axios from 'axios'
import { useAppStore } from '@/stores/useAppStore'

export function useApi() {
  const store = useAppStore()
  const apiUrl = store.apiUrl
  const user = store.user

  const getAuthParams = () => {
    return `&auth=${user.username}:${user.auth_key}`
  }

  const get = async (endpoint, params = {}) => {
    try {
      const url = `${apiUrl}${endpoint}${getAuthParams()}`
      const queryString = new URLSearchParams(params).toString()
      const fullUrl = queryString ? `${url}&${queryString}` : url
      const response = await axios.get(fullUrl)
      return response.data
    } catch (error) {
      console.error('API GET error:', error)
      throw error
    }
  }

  const post = async (endpoint, data = {}, config = {}) => {
    try {
      const url = `${apiUrl}${endpoint}${getAuthParams()}`
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
        ...config,
      })
      return response.data
    } catch (error) {
      console.error('API POST error:', error)
      throw error
    }
  }

  const upload = async (file, type = 'file') => {
    try {
      const fd = new FormData()
      fd.append('UploadForm[file]', file)
      fd.append('folder', type === 'image' ? 'images/img' : 'documents')
      fd.append('filenamePrefix', type === 'image' ? 'img_' : 'doc_')

      const url = `${apiUrl}upload${getAuthParams()}`
      const response = await axios.post(url, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const data = response.data
      if (!data) return null
      return data.path || data.url || data.file || data
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const getEntityList = async (entity, params = {}) => {
    let endpoint = ''
    if (entity.includes('1category')) {
      endpoint = `api-${entity.slice(0, -9)}-category/get-list`
    } else if (entity.includes('1banner')) {
      endpoint = `api-${entity.slice(0, -7)}-banner/get-list`
    } else {
      endpoint = `api-${entity}/get-admin-list`
    }
    return await get(endpoint, params)
  }

  const getEntityById = async (entity, id) => {
    let endpoint = ''
    if (entity.includes('1category')) {
      endpoint = `api-${entity.slice(0, -9)}-category/get-list`
    } else if (entity.includes('1banner')) {
      endpoint = `api-${entity.slice(0, -7)}-banner/get-list`
    } else {
      endpoint = `api-${entity}/get-admin-list`
    }
    const data = await get(endpoint, { id })
    return data[entity] && data[entity].length > 0 ? data[entity][0] : null
  }

  const saveEntity = async (entity, data, isUpdate = false) => {
    let link = ''
    if (entity.includes('1category')) {
      link = entity.slice(0, -9) + '-category'
    } else {
      link = entity
      if (entity.includes('1banner')) {
        link = entity.slice(0, -7) + '-banner'
      }
    }

    const endpoint = `api-${link}/${isUpdate ? 'update' : 'set'}`
    return await post(endpoint, data)
  }

  const deleteEntity = async (entity, id) => {
    let link = ''
    if (entity.includes('1category')) {
      link = entity.slice(0, -9) + '-category'
    } else {
      link = entity
      if (entity.includes('1banner')) {
        link = entity.slice(0, -7) + '-banner'
      }
    }

    const endpoint = `api-${link}/del`
    return await post(endpoint, { id })
  }

  const getEntityConfig = async (entityName) => {
    const data = await get(`SaveEntities.php?action=get&entity=${entityName}`)
    return data.config || null
  }

  const saveEntityConfig = async (entityName, config) => {
    return await post(`SaveEntities.php?action=create&entity=${entityName}`, { config })
  }

  const updateEntityConfig = async (entityName, config) => {
    return await post(`SaveEntities.php?action=update&entity=${entityName}`, { config })
  }

  const deleteEntityConfig = async (entityName) => {
    return await post(`SaveEntities.php?action=delete&entity=${entityName}`, {})
  }

  const listEntityConfigs = async () => {
    const data = await get('SaveEntities.php?action=list')
    return data.entities || []
  }

  return {
    get,
    post,
    upload,
    getEntityList,
    getEntityById,
    saveEntity,
    deleteEntity,
    getEntityConfig,
    saveEntityConfig,
    updateEntityConfig,
    deleteEntityConfig,
    listEntityConfigs,
    getAuthParams,
  }
}
