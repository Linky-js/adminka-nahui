<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import vuedraggable from 'vuedraggable'

const apiDomain = '';

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
    <input
      type="file"
      ref="fileInput"
      :multiple="multiple"
      accept="image/*"
      @change="handleFileUpload"
      style="display: none"
    />

    <div
      class="drop-zone"
      @dragover.prevent="dragOver"
      @drop="handleDrop"
      @dragenter="dragEnter"
      @dragleave="dragLeave"
      :class="{ 'drag-active': isDragActive }"
    >
      <!-- Множественный режим -->
      <vuedraggable
        v-if="multiple && images.length > 0"
        v-model="images"
        item-key="id"
        @start="drag = true"
        @end="drag = false"
      >
        <template #item="{ element }">
          <div class="image-item">
            <img :src="element.dataurl || apiDomain + 'web/uploads/' + (element?.url?.img || element?.url)" alt="" />
            <button @click="removeImage(element)" class="remove-btn">×</button>
          </div>
        </template>
      </vuedraggable>
      
      <div v-else-if="!multiple && images[0]" class="single-image">
        <img :src="images[0]?.dataurl || apiDomain + 'web/uploads/' + images[0]?.url" alt="" />
        <button @click="removeImage(images[0])" class="remove-btn">×</button>
      </div>

      <p v-if="!images.length">Перетащите изображение сюда</p>
    </div>
    <a href="https://www.site.com" class="link">А здесь текст этой ссылки</a>
  </div>
</template>

<style scoped>
label {
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: #333;
}
.btn-white {
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 112.5% */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #f1f1f1;
  border-radius: 8px;
  width: max-content;
  padding: 8px 20px;
  border: 1px solid #000;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
}
.btn-white:hover {
    background-color: #464649;
    color: #fff;
  }

.drop-zone {
  border: 2px dashed #ccc;
  padding: 10px;
  margin-top: 20px;
  min-height: 200px;
  font-size: 14px;
}

.drag-active {
  border-color: #42b883;
  background-color: rgba(66, 184, 131, 0.1);
}

.image-item {
  position: relative;
  display: inline-block;
  margin: 5px;
}

.image-item img {
  width: 175px;
  height: 175px;
  object-fit: cover;
  cursor: pointer;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgb(233 17 17);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.single-image{
  position: relative;
}
</style>
