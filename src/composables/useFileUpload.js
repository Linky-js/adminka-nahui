import { useApi } from './useApi'

export function useFileUpload() {
  const { upload } = useApi()

  const uploadFile = async (file, type = 'file') => {
    return await upload(file, type)
  }

  const uploadMultipleFiles = async (files, type = 'file') => {
    const results = []
    for (const file of files) {
      try {
        const result = await uploadFile(file, type)
        results.push(result)
      } catch (error) {
        console.error('Error uploading file:', file, error)
        results.push(null)
      }
    }
    return results
  }

  return {
    uploadFile,
    uploadMultipleFiles,
  }
}
