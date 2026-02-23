<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const apiDomain = 'https://gyf.global/admin/api/public';

const props = defineProps({
  modelValue: {
    type: [Array, Object, String],
    default: () => [],
  },
  label: String,
  multiple: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'removeImage'])

const fileInput = ref(null)
const isDragActive = ref(false)
const images = ref([])
const skipNextUpdate = ref(false)

// --- Синхронизация с родителем ---
watch(
  () => props.modelValue,
  (newValue) => {
    if (skipNextUpdate.value) {
      skipNextUpdate.value = false
      return
    }

    if (!props.multiple) {
      // В режиме одного фото ожидаем строку или объект
      if (!newValue) images.value = []
      else if (typeof newValue === 'string') {
        images.value = [{ id: Date.now(), url: newValue, isExisting: true }]
      } else if (newValue.url) {
        images.value = [newValue]
      }
    } else {
      images.value = Array.isArray(newValue) ? [...newValue] : []
    }
  },
  { immediate: true, deep: true }
)

watch(
  images,
  (newImages) => {
    skipNextUpdate.value = true


    if (!props.multiple) {
      emit('update:modelValue', newImages[0] || null)
    } else {
      emit('update:modelValue', [...newImages])
      console.log('props.mult', props.multiple);

    }
  },
  { deep: true }
)

// --- Методы ---
const triggerFileInput = () => fileInput.value.click()

const handleFileUpload = (event) => {
  processFiles([...event.target.files])
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragActive.value = false
  processFiles([...e.dataTransfer.files])
}

const processFiles = (files) => {
  files.forEach((file) => {
    if (!file.type.match('image.*')) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const newImg = {
        id: Date.now() + Math.random(),
        dataurl: e.target.result,
        file,
        isExisting: false,
      }

      if (!props.multiple) {
        images.value = [newImg]
      } else {
        images.value.push(newImg)
      }
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (image) => {
  emit('removeImage', image)
  images.value = images.value.filter((img) => img.id !== image.id)
}

// Drag state
const dragOver = (e) => e.preventDefault()
const dragEnter = () => (isDragActive.value = true)
const dragLeave = () => (isDragActive.value = false)
</script>

<template>
  <div>
    <label for="">{{ label }}</label>
    <button @click="triggerFileInput" class="btn-white">
      {{ multiple ? 'Добавить изображения ' : 'Выбрать изображение' }}
    </button>
    Multiple: {{ multiple }}
    <input type="file" ref="fileInput" :multiple="multiple" accept="image/*" @change="handleFileUpload"
      style="display: none" />

    <div class="drop-zone" @dragover.prevent="dragOver" @drop="handleDrop" @dragenter="dragEnter" @dragleave="dragLeave"
      :class="{ 'drag-active': isDragActive }">
      <!-- Множественный режим -->
      <div v-for="img in images" class="single-image">
        <img :src="img.dataurl ? apiDomain + img.dataurl : img.url" alt="" />
        <button @click="removeImage(img)" class="remove-btn">×</button>
      </div>
      <p v-if="!images.length">Перетащите изображение сюда</p>
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
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
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

.image-item {
  position: relative;
  display: inline-block;
  margin: 8px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.image-item img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.image-item:hover img {
  transform: scale(1.05);
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
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
  font-size: 14px;
  font-weight: bold;
  transition: background 0.2s ease;
}

.remove-btn:hover {
  background: #dc2626;
}

.single-image {
  position: relative;
  display: inline-block;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.single-image img {
  width: 200px;
  height: 200px;
  object-fit: cover;
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
