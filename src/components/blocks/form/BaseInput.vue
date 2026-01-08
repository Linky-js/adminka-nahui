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
    <input
      v-model="modelValueLocal"
      :type="type"
      class="form-control"
    />
  </div>
</template>
<style scoped>

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
</style>

