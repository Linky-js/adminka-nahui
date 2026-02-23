<script setup>
import { defineProps, defineEmits } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import BaseInput from './BaseInput.vue'
import BaseTextarea from './BaseTextarea.vue'
import BaseSelect from './BaseSelect.vue'
import BaseFileInput from './BaseFileInput.vue'
import Editor from './EditorNews.vue'
import DragImages from './DragImages.vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  label: String,
  blocks: { type: Array, required: true } // ← поля повторителя
})

const emit = defineEmits(['update:modelValue'])

const componentMap = {
  input: BaseInput,
  textarea: BaseTextarea,
  select: BaseSelect,
  file: BaseFileInput,
  editor: Editor,
  images: DragImages
}

function update(val) {
  emit('update:modelValue', val)
}

function addItem() {
  const item = { _uid: uuidv4() }

  props.blocks.forEach(f => {
    item[f.key] = f.type === 'images' ? [] : ''
  })

  update([...props.modelValue, item])
}

function removeItem(uid) {
  update(props.modelValue.filter(i => i._uid !== uid))
}
</script>

<template>
  <div class="repeater">
    <label v-if="label">{{ label }}</label>

    <div class="repeater-items">
      <div
        v-for="item in modelValue"
        :key="item._uid"
        class="repeater-item"
      >
        <component
          v-for="field in blocks"
          :key="field.key"
          :is="componentMap[field.type]"
          v-model="item[field.key]"
          :label="field.label"
        />

        <button class="btn danger" @click="removeItem(item._uid)">
          Удалить
        </button>
      </div>
    </div>

    <button class="btn" @click="addItem">
      ➕ Добавить элемент
    </button>
  </div>
</template>


<style scoped>
.repeater {
  margin-bottom: 20px;
}

.repeater label {
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  line-height: 1.4;
}

.repeater-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.repeater-item {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
}

.repeater-actions {
  display: flex;
  gap: 20px;
}
</style>