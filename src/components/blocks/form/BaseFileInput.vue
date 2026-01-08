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
.single-file {
  position: relative;
  width: max-content;
  padding: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: #333;
}

input,
textarea,
select {
  background: #f1f1f1;
  border: 1px solid #5f22c1;
  padding: 5px;
  min-height: 34px;
}

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
  line-height: 18px;
  /* 112.5% */
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

.single-image {
  position: relative;
}
</style>