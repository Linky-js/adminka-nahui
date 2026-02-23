<script setup>
import axios from 'axios'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'
import { useApi } from '@/composables/useApi'

const props = defineProps({
  propsPage: String,
  typePage: String,
})

const emit = defineEmits(['goToCategory'])
const router = useRouter()
const store = useAppStore()
const { getEntities, deleteEntityById } = useApi()

const searchQuery = ref('')
const sortBy = ref('idDesc')
const categories = ref([])

const filteredCategories = computed(() => {
  if (!Array.isArray(categories.value)) return [];
  let filtered = categories.value.filter((category) => {
    const name = category.name || category.title || '';
    return name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
  if (sortBy.value === 'idAsc') {
    return filtered.sort((a, b) => a.id - b.id)
  } else if (sortBy.value === 'idDesc') {
    return filtered.sort((a, b) => b.id - a.id)
  } else if (sortBy.value === 'nameAsc') {
    return filtered.sort((a, b) => (a.name || a.title || '').localeCompare(b.name || b.title || ''))
  } else if (sortBy.value === 'nameDesc') {
    return filtered.sort((a, b) => (b.name || b.title || '').localeCompare(a.name || a.title || ''))
  }
  return filtered
})

function sortByF(event, asc) {
  let items = document.querySelectorAll('.filteres')
  items.forEach((item) => item.classList.remove('active'))
  let item = event.target
  item.classList.add('active')
  sortBy.value = asc
}

function sortByIdDesc() {
  sortBy.value = 'idDesc'
}
function sortByNameAsc() {
  sortBy.value = 'nameAsc'
}
function sortByNameDesc() {
  sortBy.value = 'nameDesc'
}

function goToCategory(item, type) {
  router.push(`/admin/${props.propsPage}/${item.id}/edit`)
}

function editCategory(category) {
  router.push(`/admin/${props.propsPage}/${category.id}/edit`)
}

async function deleteCategory(id) {
  if (confirm('Вы уверены, что хотите удалить этот элемент?')) {
    try {
      await deleteEntityById('entities/' + props.propsPage, id)
      getContent()
    } catch (error) {
      console.error('Ошибка при удалении категории:', error)
    }
  } else {
    console.log('Удаление отменено пользователем')
  }
}

async function getContent() {
  try {
    const data = await getEntities('' + props.propsPage)
    categories.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error)
    categories.value = []
  }
}

function addCategory() {
  router.push(`/admin/${props.propsPage}/create`)
}

onMounted(() => {
  getContent()
})

watch(() => props.propsPage, () => getContent())
</script>

<template>
  <div class="categories">
    <!-- Кнопка для добавления категории -->
    <div class="categories__actions">
      <button class="btn-white" @click="addCategory">Добавить</button>
    </div>

    <!-- Поиск и фильтры -->
    <div class="categories__filters">
      <input v-model="searchQuery" type="text" placeholder="Поиск..." />

      <div class="sort-buttons">
        <button class="sort-btn" @click="sortByF($event, 'idAsc')">
          ID ↑
        </button>
        <button class="sort-btn" @click="sortByF($event, 'idDesc')">
          ID ↓
        </button>
        <button class="sort-btn" @click="sortByF($event, 'nameAsc')">
          Имя A-Z
        </button>
        <button class="sort-btn" @click="sortByF($event, 'nameDesc')">
          Имя Z-A
        </button>
      </div>
    </div>

    <!-- Таблица категорий -->
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Название категории</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in filteredCategories" :key="category.id">
          <td>{{ category.id }}</td>
          <td @click="goToCategory(category, propsPage)" class="category-name">
            {{ category?.name || category?.title }}
          </td>
          <td class="table-actions">
            <button class="btn-white" @click="goToCategory(category, propsPage)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path
                  d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path fill-rule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
              </svg>
            </button>
            <!-- <button v-if="!this.categories.themes" class="btn-white btn-danger" @click="deleteCategory(category.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3"
                viewBox="0 0 16 16">
                <path
                  d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
              </svg>
            </button> -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<style scoped>
.categories {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.categories__actions {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.categories__filters {
  margin-bottom: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.categories__filters input[type="text"] {
  padding: 12px 16px;
  font-size: 14px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  transition: all 0.2s ease;
  min-width: 250px;
}

.categories__filters input[type="text"]:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

th,
td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

td {
  color: #374151;
  font-size: 14px;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover {
  background: #f8fafc;
}

.category-name {
  cursor: pointer;
  color: #6366f1;
  font-weight: 500;
  transition: color 0.2s ease;
}

.category-name:hover {
  color: #4f46e5;
}

.btn-white {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  background: #f1f5f9;
  color: #475569;
}

.btn-white:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.btn-danger {
  background: #fee2e2;
  color: #dc2626;
}

.btn-danger:hover {
  background: #fecaca;
}

.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.sort-buttons {
  display: flex;
  gap: 8px;
}

.sort-btn {
  padding: 6px 12px;
  font-size: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.sort-btn.active {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}
</style>
