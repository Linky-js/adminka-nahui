<script setup>
import { ref, watch, onMounted  } from "vue";
import { useAppStore } from "@/stores/useAppStore";
import { useEntityConfig } from "@/composables/useEntityConfig";
import AdminLayout from "@/components/layouts/AdminLayout.vue";
import SettingsModal from "@/components/SettingsModal.vue";

const store = useAppStore();
const { loadSettings, saveSettings } = useEntityConfig();
const localApiUrl = ref(store.apiUrl);
const localApiDomain = ref(store.apiDomain);
const localCharts = ref(store.charts);
const showSettings = ref(false);
const selectedEntity = ref(null);

function openSettings(entityKey) {
  selectedEntity.value = entityKey;
  showSettings.value = true;
}

const pages = ref([]);
function loadPagesFromStore() {
  const ents = store.entities || {};
  pages.value = [];
  for (const k in ents) {
    const entry = ents[k];
    let arr = [];
    let label = k;
    if (Array.isArray(entry)) {
      arr = entry;
    } else if (entry && typeof entry === "object" && entry.fields) {
      arr = entry.fields;
      if (entry.label) label = entry.label;
    }

    const fields = (arr || []).map((f) => ({
      key: f.key || f.sourceKey || f.targetKey || "",
      label: f.label || "",
      type: f.type || "input",
      sourceKey: f.sourceKey || f.key || "",
      optionsText:
        f.props && f.props.options
          ? JSON.stringify(f.props.options, null, 2)
          : "",
    }));
    pages.value.push({ key: k, label, fields });
  }
}

loadPagesFromStore();

// Watch for changes in store.entities to reload pages
watch(() => store.entities, () => {
  loadPagesFromStore();
}, { deep: true });

onMounted(async () => {
  const settings = await loadSettings();
  localCharts.value = settings.charts || [];
});

function saveApiSettings() {
  store.setApiUrl(localApiUrl.value);
  store.setApiDomain(localApiDomain.value);
  store.setCharts(localCharts.value);
  console.log("localCharts.value:", localCharts.value);
  
}

function addPage() {
  const newKey = `new_entity_${Date.now()}`;
  const newEntities = { ...store.entities };
  newEntities[newKey] = { label: "Новая сущность", fields: [] };
  store.setEntities(newEntities);
}

function addChart() {
  localCharts.value.push({
    apiMethod: '',
    title: 'Новый график',
    type: 'line',
    showTooltip: true,
    period: 10,
    orientation: 'ltr'
  });
}

function removeChart(index) {
  localCharts.value.splice(index, 1);
}

function updateChart(index, field, value) {
  localCharts.value[index][field] = value;
}

const getChartTypeLabel = (type) => {
  const labels = {
    line: 'Линейный',
    bar: 'Столбчатый',
    area: 'Областной',
    scatter: 'Точечный'
  };
  return labels[type] || type;
};
</script>
<template>
  <AdminLayout>
    <div class="admin-settings">
      <div class="settings-header">
        <div class="header-content">
          <svg class="header-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 13a8 8 0 0 1 7 7 6 6 0 0 0 3-5 9 9 0 0 0 6-8 3 3 0 0 0-3-3 9 9 0 0 0-8 6 6 6 0 0 0-5 3Zm0 0a9 9 0 0 1 9-9"/>
          </svg>
          <div>
            <h1>Настройки API</h1>
            <p class="subtitle">Конфигурация API и управление сущностями</p>
          </div>
        </div>
      </div>

      <div class="settings-container">
        <!-- Combined API & Charts Section -->
        <div class="settings-section">
          <div class="section-header">
            <div class="section-title">
              <svg class="section-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777Zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
              <h2>API и Графики</h2>
            </div>
            <span class="section-badge">{{ localCharts.length }} графиков</span>
          </div>

          <!-- API Settings -->
          <div class="api-settings">
            <h3 class="subsection-title">Настройки API</h3>
            <div class="settings-grid compact">
              <div class="form-group">
                <label class="form-label">
                  <span class="label-text">API URL</span>
                  <span class="label-hint">Базовый URL для API запросов</span>
                </label>
                <div class="input-group">
                  <div class="input-prefix">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v5m-3-3h6m-9-9V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4"/>
                    </svg>
                  </div>
                  <input v-model="localApiUrl" placeholder="https://api.example.com/v1/" class="form-input" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="label-text">API DOMAIN</span>
                  <span class="label-hint">Домен для CORS и куков</span>
                </label>
                <div class="input-group">
                  <div class="input-prefix">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9"/>
                    </svg>
                  </div>
                  <input v-model="localApiDomain" placeholder="example.com" class="form-input" />
                </div>
              </div>
            </div>
          </div>

          <!-- Compact Charts Section -->
          <div class="compact-charts-section">
            <div class="charts-header">
              <h3 class="subsection-title">Графики метрик</h3>
              <button class="btn secondary small add-chart-header-btn" @click="addChart">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/>
                </svg>
                Добавить график
              </button>
            </div>

            <div class="compact-charts-container">
              <div v-for="(chart, index) in localCharts" :key="index" class="compact-chart-card">
                <div class="compact-chart-header">
                  <div class="compact-chart-title">
                    <span class="compact-chart-index">{{ index + 1 }}</span>
                    <div class="compact-chart-info">
                      <h4>{{ chart.title || 'Новый график' }}</h4>
                      <span class="compact-chart-type">{{ getChartTypeLabel(chart.type) }}</span>
                    </div>
                  </div>
                  <button class="btn danger small icon-only" @click="removeChart(index)" title="Удалить">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                <div class="compact-chart-fields">
                  <div class="compact-form-row">
                    <div class="compact-form-group">
                      <label>API Method</label>
                      <input v-model="chart.apiMethod" placeholder="/metrics/..." class="compact-input" />
                    </div>
                    <div class="compact-form-group">
                      <label>Тип</label>
                      <select v-model="chart.type" class="compact-select">
                        <option value="line">Линия</option>
                        <option value="bar">Бары</option>
                        <option value="area">Область</option>
                        <option value="scatter">Точки</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="compact-form-row">
                    <div class="compact-form-group">
                      <label>Период</label>
                      <input type="number" v-model.number="chart.period" min="1" class="compact-input" />
                    </div>
                    <div class="compact-form-group">
                      <label>Ориентация</label>
                      <select v-model="chart.orientation" class="compact-select">
                        <option value="ltr">Слева направо</option>
                        <option value="rtl">Справа налево</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="compact-chart-options">
                    <label class="compact-switch">
                      <input type="checkbox" v-model="chart.showTooltip" />
                      <span class="compact-switch-slider"></span>
                      <span class="compact-switch-label">Подсказки</span>
                    </label>
                    <div class="compact-chart-preview" :class="`compact-chart-${chart.type}`">
                      <div v-if="chart.type === 'bar'" class="compact-preview-bars">
                        <div v-for="i in 3" :key="i" class="compact-bar" :style="{ height: `${30 + i * 20}%` }"></div>
                      </div>
                      <div v-else-if="chart.type === 'line'" class="compact-preview-line">
                        <svg width="100%" height="100%" viewBox="0 0 60 20" preserveAspectRatio="none">
                          <path d="M0,15 L15,12 L30,8 L45,10 L60,5" fill="none" stroke="currentColor" stroke-width="1.5" />
                        </svg>
                      </div>
                      <div v-else-if="chart.type === 'area'" class="compact-preview-area">
                        <svg width="100%" height="100%" viewBox="0 0 60 20" preserveAspectRatio="none">
                          <path d="M0,15 L15,12 L30,8 L45,10 L60,5 L60,20 L0,20 Z" fill="currentColor" fill-opacity="0.2" />
                        </svg>
                      </div>
                      <div v-else-if="chart.type === 'scatter'" class="compact-preview-scatter">
                        <div class="compact-dot" style="left: 30%; top: 40%"></div>
                        <div class="compact-dot" style="left: 50%; top: 60%"></div>
                        <div class="compact-dot" style="left: 70%; top: 30%"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="localCharts.length === 0" class="no-charts-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3v16a2 2 0 0 0 2 2h16m-9-9 3 3 6-6M6 10v7m4-7v4m4-4v1"/>
                </svg>
                <p>Нет добавленных графиков</p>
                <button class="btn secondary small" @click="addChart">Добавить первый график</button>
              </div>
            </div>
          </div>

          <!-- Save Button at the bottom -->
          <div class="section-footer">
            <button class="btn primary save-btn" @click="saveApiSettings">
              <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Сохранить настройки API
            </button>
          </div>
        </div>

        <!-- Entities Section -->
        <div class="settings-section">
          <div class="section-header">
            <div class="section-title">
              <svg class="section-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10"/>
              </svg>
              <h2>Управление сущностями</h2>
            </div>
            <span class="section-badge">Всего сущностей: {{ pages.length }}</span>
          </div>

          <div class="entities-container">
            <div class="entities-list">
              <div v-for="(page, pIndex) in pages" :key="pIndex" class="entity-card">
                <div class="entity-card-header" @click="openSettings(page.key)">
                  <div class="entity-info">
                    <div class="entity-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10"/>
                      </svg>
                    </div>
                    <div class="entity-details">
                      <h3 class="entity-title">{{ page.label || 'Без названия' }}</h3>
                      <div class="entity-meta">
                        <span class="entity-key">{{ page.key || 'Нет ключа' }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="entity-actions">
                    <button class="btn secondary small" @click.stop="openSettings(page.key)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 2-4 4-4-4M8 22l4-4 4 4M2 12h4m14 0h-4m-8-4V2v4m8 14v4v-4"/>
                      </svg>
                      Настроить
                    </button>
                    <button class="btn danger small icon-only" @click.stop="removePage(pIndex)" title="Удалить">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="entities-actions">
              <button class="btn primary" @click="addPage">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/>
                </svg>
                Добавить сущность
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
  <SettingsModal v-if="showSettings" :entity="selectedEntity" @close="showSettings = false; selectedEntity = null" />
</template>

<style scoped>
.admin-settings {
  min-height: 100vh;
}

/* Header */
.settings-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 32px;
  color: white;
  margin-bottom: 32px;
  box-shadow: 0 10px 40px rgba(99, 102, 241, 0.2);
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.header-icon {
  flex-shrink: 0;
  margin-top: 4px;
}

.settings-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: white;
}

.subtitle {
  margin: 8px 0 0 0;
  font-size: 16px;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.9);
}

/* Settings Container */
.settings-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Settings Section */
.settings-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.settings-section:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f1f5f9;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.section-icon {
  color: #6366f1;
  flex-shrink: 0;
}

.section-title h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
}

.section-badge {
  background: #e0e7ff;
  color: #4f46e5;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 20px;
}

/* API Settings */
.api-settings {
  margin-bottom: 40px;
}

.subsection-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px 0;
}

/* Compact Settings Grid */
.settings-grid.compact {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 0;
}

/* Form Elements */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.label-text {
  font-weight: 600;
  color: #334155;
  font-size: 14px;
}

.label-hint {
  font-size: 12px;
  color: #94a3b8;
}

/* Input Group */
.input-group {
  position: relative;
}

.input-prefix {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
  color: #1e293b;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input::placeholder {
  color: #cbd5e1;
}

/* Compact Charts Section */
.compact-charts-section {
  margin-bottom: 32px;
}

.charts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-chart-header-btn {
  background: #f1f5f9;
  color: #475569;
  border: 2px solid #e2e8f0;
}

.add-chart-header-btn:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.compact-charts-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.compact-chart-card {
  background: #f8fafc;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.compact-chart-card:hover {
  border-color: #c7d2fe;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.08);
}

.compact-chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.compact-chart-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.compact-chart-index {
  background: #6366f1;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  flex-shrink: 0;
}

.compact-chart-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.compact-chart-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.2;
}

.compact-chart-type {
  font-size: 12px;
  color: #64748b;
  background: #e2e8f0;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
  width: fit-content;
}

/* Compact Chart Fields */
.compact-chart-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.compact-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.compact-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.compact-form-group label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
}

.compact-input,
.compact-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  transition: all 0.2s ease;
  background: white;
  color: #1e293b;
}

.compact-input:focus,
.compact-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.compact-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
}

/* Compact Chart Options */
.compact-chart-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.compact-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.compact-switch input {
  display: none;
}

.compact-switch-slider {
  position: relative;
  width: 36px;
  height: 18px;
  background: #cbd5e1;
  border-radius: 9px;
  transition: all 0.2s ease;
}

.compact-switch-slider::before {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: all 0.2s ease;
}

.compact-switch input:checked + .compact-switch-slider {
  background: #10b981;
}

.compact-switch input:checked + .compact-switch-slider::before {
  transform: translateX(18px);
}

.compact-switch-label {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

/* Compact Chart Preview */
.compact-chart-preview {
  width: 80px;
  height: 40px;
  border-radius: 6px;
  background: white;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  position: relative;
}

.compact-preview-bars {
  display: flex;
  align-items: flex-end;
  height: 100%;
  padding: 6px;
  gap: 4px;
}

.compact-bar {
  flex: 1;
  background: linear-gradient(to top, #6366f1, #8b5cf6);
  border-radius: 2px 2px 0 0;
  min-height: 20%;
}

.compact-preview-line,
.compact-preview-area {
  height: 100%;
  padding: 8px;
}

.compact-preview-line {
  color: #10b981;
}

.compact-preview-area {
  color: #f59e0b;
}

.compact-preview-scatter {
  position: relative;
  width: 100%;
  height: 100%;
}

.compact-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #ef4444;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

/* No Charts Message */
.no-charts-message {
  text-align: center;
  padding: 40px 20px;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  color: #64748b;
}

.no-charts-message svg {
  color: #94a3b8;
  margin-bottom: 12px;
}

.no-charts-message p {
  margin: 0 0 16px 0;
  font-size: 14px;
}

/* Section Footer */
.section-footer {
  padding-top: 32px;
  border-top: 2px solid #f1f5f9;
  margin-top: 32px;
  text-align: center;
}

/* Save Button */
.save-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.25);
  min-width: 200px;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
}

/* Entities Section */
.entities-container {
  margin-top: 8px;
}

.entities-list {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.entity-card {
  background: white;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  overflow: hidden;
}

.entity-card:hover {
  border-color: #c7d2fe;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
  transform: translateY(-4px);
}

.entity-card-header {
  padding: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.entity-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.entity-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f46e5;
  flex-shrink: 0;
}

.entity-details {
  flex: 1;
  min-width: 0;
}

.entity-title {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.entity-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.entity-key {
  background: #f1f5f9;
  color: #64748b;
  font-size: 11px;
  font-family: 'Monaco', 'Consolas', monospace;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.entity-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  min-height: 40px;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.btn.small {
  padding: 6px 12px;
  font-size: 12px;
  min-height: 32px;
}

.btn.icon-only {
  width: 32px;
  padding: 0;
  min-height: 32px;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25);
}

.btn.primary:hover {
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
}

.btn.secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn.secondary:hover {
  background: #e2e8f0;
}

.btn.danger {
  background: #fee2e2;
  color: #dc2626;
}

.btn.danger:hover {
  background: #fecaca;
}

.btn-icon {
  flex-shrink: 0;
}

/* Entities Actions */
.entities-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 2px solid #f1f5f9;
}

/* Responsive */
@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .admin-settings {
    padding: 16px;
  }
  
  .settings-header {
    padding: 24px;
    margin-bottom: 24px;
  }
  
  .settings-section {
    padding: 24px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .settings-grid.compact {
    grid-template-columns: 1fr;
  }
  
  .compact-form-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .entity-card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .charts-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .add-chart-header-btn {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .compact-chart-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .compact-chart-preview {
    align-self: flex-end;
  }
  
  .entities-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .entities-actions .btn {
    width: 100%;
  }
}
</style>