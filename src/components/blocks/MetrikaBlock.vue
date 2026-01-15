<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import UniversalChart from './UniversalChart.vue'

const store = useAppStore()
const charts = computed(() => store.charts)
</script>

<template>
  <div class="metrika">
    <div v-for="(chartConfig, index) in charts" :key="index" class="chart">
      <UniversalChart :config="chartConfig" />
    </div>
  </div>
</template>

<style scoped>
.metrika {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.chart {
  width: calc(50% - 10px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.biggesthead {
  color: #333;
  font-family: Arial;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
</style>