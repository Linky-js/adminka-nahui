<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

defineProps({
  modelValue: {
    type: [Array, Object, String],
    default: () => [],
  },
  label: String,
})

const emit = defineEmits(['update:modelValue', 'removeFile'])

const fileInput = ref(null)
const isDragActive = ref(false)
const file = ref(null)
const files = ref([])

const triggerFileInput = () => fileInput.value.click()


watch(
  files,
  (newImages) => {
    emit('update:modelValue', [...newImages])
  },
  { deep: true }
)

const handleFileUpload = (event) => {
  processFile(event.target.files[0])
}

const processFile = (file) => {
  if (!file.type.match('.*')) return

  const reader = new FileReader()
  reader.onload = (e) => {
    file.dataurl = e.target.result
    file.isExisting = false
    files.value = [file] // обновляем files как массив
    console.log('file', files.value)
  }
  reader.readAsDataURL(file)
}

const removeFile = () => {
  emit('removeFile', file.value)
  files.value = []
}

// Drag state
const dragOver = (e) => e.preventDefault()
const dragEnter = () => (isDragActive.value = true)
const dragLeave = () => (isDragActive.value = false)

</script>
<template>
  <div>
    <label>{{ label }}</label>
    <button @click="triggerFileInput" class="btn-white">
      {{ label }}
    </button>
    <input type="file" ref="fileInput" accept="*" @change="handleFileUpload" style="display: none" />

    <div class="drop-zone" @dragover.prevent="dragOver" @drop="handleDrop" @dragenter="dragEnter" @dragleave="dragLeave"
      :class="{ 'drag-active': isDragActive }">
      <div v-if="files" class="single-file">
        <p>{{ files[0]?.name }}</p>
        <button @click="removeFile" class="remove-btn">х</button>
      </div>
      <p v-else>Перетащите файл сюда</p>
    </div>
    <a href="https://www.site.com" class="link">А здесь текст этой ссылки</a>
  </div>
</template>


<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

label {
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  line-height: 1.4;
}

.btn-white {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 12px;
}

.btn-white:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.drop-zone {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 40px 20px;
  background: #fafafa;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.drop-zone:hover {
  border-color: #6366f1;
  background: #f0f4ff;
}

.drag-active {
  border-color: #6366f1;
  background: #f0f4ff;
}

.drop-zone p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.single-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-top: 12px;
}

.single-file p {
  margin: 0;
  font-size: 14px;
  color: #374151;
}

.remove-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: background 0.2s ease;
}

.remove-btn:hover {
  background: #dc2626;
}

.link {
  color: #6366f1;
  text-decoration: none;
  font-size: 14px;
  margin-top: 8px;
  display: inline-block;
}

.link:hover {
  text-decoration: underline;
}
</style>