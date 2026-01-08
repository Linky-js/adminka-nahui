
<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: String,
  label: String,
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
    <input type="date" v-model="modelValueLocal" class="form-control" />
  </div>
</template>

