<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
});

const emit = defineEmits(['update:modelValue']);

const modelValueLocal = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<template>
  <div class="form-group">
    <label v-if="label">{{ label }}</label>
    <input v-model="modelValueLocal" :type="type" class="form-control" />
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

.form-control {
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: white;
  transition: all 0.2s ease;
  outline: none;
}

.form-control:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-control:hover {
  border-color: #9ca3af;
}
</style>
