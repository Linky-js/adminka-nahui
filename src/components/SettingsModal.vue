<script setup>
import { ref, watch } from "vue";
import { useAppStore } from "@/stores/useAppStore";

const store = useAppStore();

const emit = defineEmits(["close"]);

const props = defineProps({
  entity: { type: String, default: null },
});

// local editable model: pages[] where each page = { key, label, fields: [{key,label,type,sourceKey,optionsText}] }
const pages = ref([]);
const error = ref("");
const currentPage = ref(0);

// initialize local pages from store.entities
function loadPagesFromStore() {
  const ents = store.entities || {};
  if (props.entity) {
    // If specific entity is provided, show only that one
    const entry = ents[props.entity];
    if (entry) {
      let arr = [];
      let label = props.entity;
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
      pages.value = [{ key: props.entity, label, fields }];
    } else {
      pages.value = [];
    }
  } else {
    // Show all entities (for AdminSettingsApi)
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
}

loadPagesFromStore();

// Watch for changes in store.entities to reload pages
watch(
  () => store.entities,
  () => {
    loadPagesFromStore();
  },
  { deep: true }
);

function close() {
  emit("close");
}

function save() {
  try {
    const mapped = {};
    pages.value.forEach((p) => {
      const key = (p.key || "").toString().trim();
      if (!key) return;
      mapped[key] = {
        label: p.label || key,
        fields: (p.fields || []).map((f) => {
          const obj = {
            type: f.type || "input",
            key: f.key || f.sourceKey || "",
            label: f.label || "",
            sourceKey: f.sourceKey || f.key || "",
            targetKey: f.sourceKey || f.key || "",
          };
          if (f.type === "select" && f.optionsText) {
            try {
              obj.props = { options: JSON.parse(f.optionsText) };
            } catch (e) {
              // try comma list
              const parts = f.optionsText
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              obj.props = {
                options: parts.map((p) => ({ value: p, label: p })),
              };
            }
          }
          return obj;
        }),
      };
    });

    store.setEntities(mapped);
    emit("close");
  } catch (e) {
    error.value = "Ошибка при сохранении сущностей";
    console.error(e);
  }
}

function addPage() {
  pages.value.push({ key: "", label: "", fields: [] });
}

function removePage(index) {
  pages.value.splice(index, 1);
}

function addField(pageIndex) {
  pages.value[pageIndex].fields.push({
    key: "",
    label: "",
    type: "input",
    sourceKey: "",
    optionsText: "",
  });
}

function removeField(pageIndex, fieldIndex) {
  pages.value[pageIndex].fields.splice(fieldIndex, 1);
}

function checkPage(newCurrentPage) {
  currentPage.value = newCurrentPage;
}

const getFieldTypeLabel = (type) => {
  const labels = {
    input: "Текст",
    textarea: "Текст",
    editor: "Редактор",
    select: "Список",
    images: "Изображения",
    file: "Файл",
    date: "Дата",
    coords: "Координаты",
  };
  return labels[type] || type;
};
</script>

<template>
  <div class="settings-overlay" @click.self="close">
    <div class="settings-modal">
      <div class="modal-header">
        <div class="header-content">
          <svg
            v-if="!props.entity"
            class="header-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M10.5 6H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-8.5m-6-12H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4.5m0-12v12"
            />
          </svg>
          <svg
            v-else
            class="header-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            />
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a1.998 1.998 0 0 1 0 2.83 1.998 1.998 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a1.998 1.998 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 3.417 1.415 2 2 0 0 1-.587 1.415l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
            />
          </svg>
          <div>
            <h3>
              {{
                props.entity
                  ? `Настройки: ${pages[0]?.label || props.entity}`
                  : "Настройки сущностей"
              }}
            </h3>
            <p class="subtitle">
              {{
                props.entity
                  ? "Настройка полей сущности"
                  : "Управление страницами и полями"
              }}
            </p>
          </div>
        </div>
        <button class="close-btn" @click="close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 6 6 18M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="modal-content">
        <div v-if="!props.entity" class="section">
          <div class="section-header">
            <label>Страницы / Сущности</label>
            <span class="section-count">{{ pages.length }} страниц</span>
          </div>
          <div class="tabs-container">
            <div class="tabs">
              <button
                v-for="(page, pIndex) in pages"
                :key="pIndex"
                class="tab"
                :class="{ active: currentPage === pIndex }"
                @click="checkPage(pIndex)"
              >
                <span class="tab-label">{{
                  page.label || "Новая страница"
                }}</span>
                <span class="tab-key">{{ page.key || "key" }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="pages">
          <div
            v-for="(page, pIndex) in pages"
            :key="pIndex"
            class="page"
            v-show="!props.entity || pIndex === 0"
          >
            <div class="form-group">
              <label class="form-label">
                <span class="label-text">Отображаемое название</span>
                <span class="label-hint">Будет показано в интерфейсе</span>
              </label>
              <input
                v-model="page.label"
                placeholder="Например: Все видео"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-text">Ключ страницы</span>
                <span class="label-hint"
                  >Используется в коде (только латиница)</span
                >
              </label>
              <input
                v-model="page.key"
                placeholder="Например: video"
                class="form-input"
              />
            </div>

            <div class="divider">
              <span>Поля сущности</span>
            </div>

            <div class="fields-section">
              <div class="fields-header">
                <h5>Список полей</h5>
                <span class="fields-count">{{ page.fields.length }} полей</span>
              </div>

              <div class="fields-list">
                <div
                  v-for="(f, fIndex) in page.fields"
                  :key="fIndex"
                  class="field-card"
                >
                  <div class="field-card-header">
                    <div class="field-type-badge" :class="f.type">
                      {{ getFieldTypeLabel(f.type) }}
                    </div>
                    <button
                      class="field-delete-btn"
                      @click="removeField(pIndex, fIndex)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M18 6 6 18M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div class="field-card-body">
                    <div class="form-group compact">
                      <label class="label-text">Название поля</label>
                      <input
                        v-model="f.label"
                        placeholder="Заголовок, Описание..."
                        class="form-input"
                      />
                    </div>

                    <div class="form-group compact">
                      <label class="label-text">Ключ поля</label>
                      <input
                        v-model="f.key"
                        placeholder="slug, title, description"
                        class="form-input"
                      />
                    </div>

                    <div class="form-group compact">
                      <label class="label-text">Тип поля</label>
                      <select v-model="f.type" class="form-select">
                        <option value="input">Текстовое поле</option>
                        <option value="textarea">Многострочный текст</option>
                        <option value="editor">Текстовый редактор</option>
                        <option value="select">Выпадающий список</option>
                        <option value="images">Изображения</option>
                        <option value="file">Файл</option>
                        <option value="date">Дата</option>
                        <option value="coords">Координаты</option>
                      </select>
                    </div>

                    <label class="checkbox-field">
                      <input type="checkbox" v-model="f.required" />
                      <span class="checkbox-custom"></span>
                      <span class="checkbox-label">Обязательное поле</span>
                    </label>

                    <div v-if="f.type === 'select'" class="form-group compact">
                      <label>Опции списка</label>
                      <input
                        v-model="f.optionsText"
                        placeholder="вариант1, вариант2, вариант3"
                        class="form-input"
                      />
                      <span class="field-hint">Перечислите через запятую</span>
                    </div>
                  </div>
                </div>

                <button class="add-field-btn" @click="addField(pIndex)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 5v14m-7-7h14"
                    />
                  </svg>
                  Добавить поле
                </button>
              </div>
            </div>
          </div>

          <button v-if="!props.entity" class="add-page-btn" @click="addPage">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v14m-7-7h14"
              />
            </svg>
            Добавить страницу
          </button>
        </div>

        <div v-if="!props.entity" class="hint-box">
          <svg
            class="hint-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 13v2m0-8v.5m9 4a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <div class="hint-content">
            <strong>Как использовать:</strong>
            <p>
              Страницы сохраняются как "ключ → массив полей". Используйте page
              key в компоненте AdminPage.
            </p>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn secondary" @click="close">
          <span>Отмена</span>
        </button>
        <button class="btn primary" @click="save">
          <svg
            class="btn-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Сохранить изменения</span>
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(4px);
  }
}

.settings-modal {
  width: 800px;
  max-width: 90vw;
  background: #fff;
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto,
    sans-serif;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px 20px 0 0;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.header-icon {
  flex-shrink: 0;
  margin-top: 4px;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.9);
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

/* Content */
.modal-content {
  padding: 28px;
  overflow-y: auto;
  flex: 1;
}

.section {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header label {
  font-weight: 600;
  color: #1e293b;
  font-size: 15px;
}

.section-count {
  background: #e2e8f0;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
}

/* Tabs */
.tabs-container {
  background: white;
  border-radius: 12px;
  padding: 4px;
  border: 1px solid #e2e8f0;
}

.tabs {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tab {
  flex: 1;
  min-width: 120px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.tab:hover {
  background: #f1f5f9;
}

.tab.active {
  background: #3b82f6;
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.tab-label {
  font-weight: 500;
  font-size: 14px;
  text-align: center;
}

.tab-key {
  font-size: 11px;
  opacity: 0.7;
  font-family: "Monaco", "Consolas", monospace;
}

.tab.active .tab-key {
  opacity: 0.9;
}

/* Pages */
.pages {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

/* Form Elements */
.form-group {
  margin-bottom: 20px;
}

.form-group.compact {
  margin-bottom: 16px;
}

.form-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.label-text {
  font-weight: 500;
  color: #334155;
  font-size: 14px;
}

.label-hint {
  font-size: 12px;
  color: #94a3b8;
}

.form-input,
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
  color: #1e293b;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input::placeholder {
  color: #cbd5e1;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  margin: 32px 0 24px;
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider::before {
  margin-right: 16px;
}

.divider::after {
  margin-left: 16px;
}

/* Fields Section */
.fields-section {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.fields-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.fields-header h5 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.fields-count {
  background: #e2e8f0;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
}

.fields-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Field Card */
.field-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.field-card:hover {
  border-color: #c7d2fe;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.1);
}

.field-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.field-type-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-type-badge.input,
.field-type-badge.textarea {
  background: #dbeafe;
  color: #1d4ed8;
}

.field-type-badge.editor {
  background: #fef3c7;
  color: #92400e;
}

.field-type-badge.select {
  background: #dcfce7;
  color: #166534;
}

.field-type-badge.images {
  background: #fae8ff;
  color: #86198f;
}

.field-type-badge.file {
  background: #fee2e2;
  color: #991b1b;
}

.field-type-badge.date {
  background: #e0e7ff;
  color: #3730a3;
}

.field-type-badge.coords {
  background: #ccfbf1;
  color: #0f766e;
}

.field-delete-btn {
  background: #fee2e2;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #dc2626;
}

.field-delete-btn:hover {
  background: #fecaca;
  transform: scale(1.1);
}

/* Form Row */
.form-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: end;
}

/* Checkbox */
.checkbox-field {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 12px 0;
}

.checkbox-field input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox-field input:checked + .checkbox-custom {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-field input:checked + .checkbox-custom::after {
  content: "✓";
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}

/* Field Hint */
.field-hint {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 6px;
}

/* Buttons */
.add-field-btn,
.add-page-btn {
  width: 100%;
  padding: 16px;
  background: white;
  border: 2px dashed #cbd5e1;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #64748b;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-field-btn:hover,
.add-page-btn:hover {
  border-color: #6366f1;
  color: #6366f1;
  background: #f8fafc;
  transform: translateY(-2px);
}

.add-field-btn svg,
.add-page-btn svg {
  transition: transform 0.2s ease;
}

.add-field-btn:hover svg,
.add-page-btn:hover svg {
  transform: rotate(90deg);
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  font-weight: 500;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn.small {
  padding: 8px 16px;
  font-size: 13px;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
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

/* Hint Box */
.hint-box {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 24px;
}

.hint-icon {
  color: #0ea5e9;
  flex-shrink: 0;
  margin-top: 2px;
}

.hint-content strong {
  display: block;
  color: #0369a1;
  font-size: 14px;
  margin-bottom: 4px;
}

.hint-content p {
  margin: 0;
  color: #0c4a6e;
  font-size: 13px;
  line-height: 1.5;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 12px;
  padding: 20px 28px;
  border-top: 1px solid #f0f0f0;
  background: #f8fafc;
  border-radius: 0 0 20px 20px;
}

.modal-actions .btn {
  flex: 1;
}

/* Scrollbar Styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .settings-modal {
    max-width: 95vw;
  }

  .modal-header {
    padding: 20px;
  }

  .modal-content {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .tabs {
    flex-direction: column;
  }

  .tab {
    min-width: 100%;
  }
}
</style>
