<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import {
    CanvasRenderer
} from 'echarts/renderers'
import {
    LineChart,
    BarChart,
    ScatterChart
} from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    LegendComponent
} from 'echarts/components'

use([
    CanvasRenderer,
    LineChart,
    BarChart,
    ScatterChart,
    GridComponent,
    TooltipComponent,
    LegendComponent
])

const props = defineProps({
    config: {
        type: Object,
        required: true,
        default: () => ({})
    }
})

const { get } = useApi()
const chartData = ref([])

// Временные захардкоженные данные
const hardcodedData = [
    { x: 1, y: '08.05' },
    { x: 2, y: '09.05' },
    { x: 3, y: '10.05' },
    { x: 4, y: '11.05' },
    { x: 5, y: '12.05' },
    { x: 6, y: '13.05' },
    { x: 7, y: '14.05' },
    { x: 8, y: '15.05' },
    { x: 9, y: '16.05' },
    { x: 10, y: '17.05' }
]

onMounted(async () => {
    // Загружаем данные из API или используем захардкоженные
    if (props.config.apiMethod) {
        try {
            const data = await get(props.config.apiMethod)
            chartData.value = data || []
        } catch (error) {
            console.error('Failed to load chart data:', error)
            chartData.value = hardcodedData
        }
    } else {
        chartData.value = hardcodedData
    }

    // Ограничиваем период
    if (props.config.period && chartData.value.length > props.config.period) {
        chartData.value = chartData.value.slice(-props.config.period)
    }

    // Сортируем по x
    chartData.value.sort((a, b) => a.x - b.x)
})

const chartOption = computed(() => {
    const data = chartData.value
    const type = props.config.type || 'line'
    const showTooltip = props.config.showTooltip !== false
    const reversed = props.config.orientation === 'rtl'

    const xData = data.map(item => item.y)
    const yData = data.map(item => item.x)

    let seriesType
    switch (type) {
        case 'line':
            seriesType = 'line'
            break
        case 'bar':
            seriesType = 'bar'
            break
        case 'area':
            seriesType = 'line' // area is line with areaStyle
            break
        case 'scatter':
            seriesType = 'scatter'
            break
        default:
            seriesType = 'line'
    }

    const option = {
        title: {
            text: props.config.title || 'Chart'
        },
        tooltip: showTooltip ? {} : false,
        legend: {},
        xAxis: {
            type: 'category',
            data: reversed ? xData.reverse() : xData
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: 'Value',
            type: seriesType,
            data: reversed ? yData.reverse() : yData,
            ...(type === 'area' && { areaStyle: {} })
        }]
    }

    return option
})
</script>

<template>
    <div class="universal-chart">
        <v-chart :option="chartOption" style="width: 100%; height: 300px;" />
    </div>
</template>

<style scoped>
.universal-chart {
    width: 100%;
    margin-bottom: 20px;
}
</style>