<script setup>
import { ref } from "vue";
import { useAppStore } from "@/stores/useAppStore";
import AdminLayout from "@/components/layouts/AdminLayout.vue";
import SettingsModal from "@/components/SettingsModal.vue";


const store = useAppStore();
const localApiUrl = ref(store.apiUrl);
const localApiDomain = ref(store.apiDomain);
const showSettings = ref(false);


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

function addPage() {
  pages.value.push({ key: "", label: "", fields: [] });
}

function removePage(index) {
  pages.value.splice(index, 1);
}

</script>
<template>
  <AdminLayout>
    <div class="admin-setting-api">
      <div class="admin-setting-api__head">
        <h3>Настройки API</h3>
        <div class="field">
          <label>API URL</label>
          <input v-model="localApiUrl" placeholder="https://example.com/" />
        </div>
        <div class="field">
          <label>API DOMAIN</label>
          <input v-model="localApiDomain" placeholder="example.com" />
        </div>
      </div>
      <div class="entities-section">
        <h3>Все сущности</h3>

        <div class="pages-container">
          <div class="pages-list">
            <div
              v-for="(page, pIndex) in pages"
              :key="pIndex"
              class="page-card"
            >
              <div class="page-card-header">
                <div class="page-info">
                  <span class="page-index">{{ pIndex + 1 }}</span>
                  <h4 class="page-title" @click="showSettings = true">{{ page.label }}</h4>
                </div>
                <button
                  class="btn btn-small btn-danger"
                  @click="removePage(pIndex)"
                  title="Удалить страницу"
                >
                  <span class="btn-icon">×</span>
                  <span class="btn-text">Удалить</span>
                </button>
              </div>
            </div>
          </div>

          <div class="pages-actions">
            <button class="btn btn-primary btn-add-page" @click="addPage">
              <span class="btn-add-icon">+</span>
              <span class="btn-add-text">Добавить страницу</span>
            </button>

            <div class="pages-summary">
              <span class="summary-text">
                Всего страниц: <strong>{{ pages.length }}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
  <SettingsModal v-if="showSettings" @close="showSettings = false" />
</template>
<style scoped>
.admin-setting-api {
  color: #333;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.field label {
  font-size: 13px;
  color: #666;
}

.field input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e6e6e6;
}

/* Основные стили */
.entities-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

h3 {
  color: #000;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

/* Контейнер страниц */
.pages-container {
  margin-top: 20px;
}

/* Список страниц */
.pages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

/* Карточка страницы */
.page-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0;
  transition: all 0.3s ease;
  overflow: hidden;
}

.page-card:hover {
  border-color: #d0d0d0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Шапка карточки */
.page-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  color: #000;
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0;
}

.page-index {
  background: #e9ecef;
  color: #495057;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

/* Кнопки */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  color: white;
  background: #6c757d;
  min-height: 40px;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

/* Маленькая кнопка */
.btn-small {
  padding: 6px 12px;
  font-size: 0.8125rem;
  min-height: 32px;
}

/* Опасная кнопка */
.btn-danger {
  background: #dc3545;
}

.btn-danger:hover {
  background: #c82333;
}

/* Основная кнопка */
.btn-primary {
  background: #007bff;
}

.btn-primary:hover {
  background: #0056b3;
}

/* Кнопка добавления */
.btn-add-page {
  background: #28a745;
  padding: 12px 24px;
  font-size: 1rem;
  min-height: 44px;
}

.btn-add-page:hover {
  background: #218838;
}

.btn-add-icon {
  font-size: 1.25rem;
  font-weight: bold;
}

.btn-add-text {
  font-weight: 500;
}

/* Иконки в кнопках */
.btn-icon {
  font-size: 1.25rem;
  font-weight: bold;
  line-height: 1;
}

.btn-text {
  font-weight: 500;
}

/* Панель действий */
.pages-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.pages-summary {
  color: #666;
  font-size: 0.875rem;
}

.summary-text strong {
  color: #000;
  font-weight: 600;
}

/* Адаптивность */
@media (max-width: 768px) {
  .entities-section {
    padding: 16px;
  }

  .page-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .pages-actions {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .page-meta {
    flex-direction: column;
    gap: 8px;
  }
}

/* Анимация появления карточки */
.page-card-enter-active,
.page-card-leave-active {
  transition: all 0.3s ease;
}

.page-card-enter-from,
.page-card-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
