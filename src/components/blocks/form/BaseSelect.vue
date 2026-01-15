<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  options: { type: Array, default: () => [] },
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
    <select v-model="modelValueLocal" class="form-control">
      <option disabled value="">Выберите...</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
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
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

.form-control:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-control:hover {
  border-color: #9ca3af;
}
</style>