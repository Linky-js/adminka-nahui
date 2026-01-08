<script setup>

</script>

<template>
  <div class="metrika">
    <div class="chart">
      <div class="biggesthead">Кол-во регистраций</div>
      <canvas id="allRegisterChart"></canvas>
    </div>
    <div class="chart">
      <div class="biggesthead">Топ 5 школ по регистрации</div>
      <canvas id="salaryChart"></canvas>
    </div>
    <div class="chart">
      <div class="biggesthead">Топ 5 городов по регистрации</div>
      <canvas id="salaryChartCity"></canvas>
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
  font-family: Onest;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
</style>