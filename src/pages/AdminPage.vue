<script setup>
import { ref, onMounted } from 'vue'
import SideBarAdmin from '@/components/blocks/SideBarAdmin.vue'
import HeaderAdmin from '@/components/blocks/HeaderAdmin.vue'
import ListsBlock from '@/components/blocks/ListsBlock.vue'
import UniversalAdminPage from '@/components/UniversalAdminPage.vue'
import MetrikaBlock from '@/components/blocks/MetrikaBlock.vue'
import SettingsModal from '@/components/SettingsModal.vue'

const categories = ref([
  { id: 1, name: 'Видео' },
  { id: 2, name: 'Подкасты' },
  { id: 3, name: 'Темы' },
])

const list = ref(true)
const updatePage = ref(false)
const propsPage = ref('metrika')
const itemPage = ref(null)
const typePage = ref(null)

const showSettings = ref(false)

function goToCategory(item = false) {
  if (item) itemPage.value = item
  else itemPage.value = null
  list.value = false
  updatePage.value = true
}

function goTo(item) {
  switch (item) {
    case 'objects':
      propsPage.value = 'object'
      break
    case 'object-category':
      propsPage.value = 'object1category'
      break
    case 'podcasts':
      propsPage.value = 'podcast'
      break
    case 'news':
      propsPage.value = 'news'
      break
    case 'video':
      propsPage.value = 'video'
      break
    case 'video-banner':
      propsPage.value = 'video1banner'
      break
    case 'podcast-category':
      propsPage.value = 'podcast1category'
      break
    case 'news-category':
      propsPage.value = 'news1category'
      break
    case 'video-category':
      propsPage.value = 'video1category'
      break
    case 'book-category':
      propsPage.value = 'book1category'
      break
    case 'test-category':
      propsPage.value = 'test1category'
      break
    case 'material':
      propsPage.value = 'material'
      break
    case 'theme':
      propsPage.value = 'theme'
      break
    case 'notify':
      propsPage.value = 'notify'
      break
    case 'test':
      propsPage.value = 'test'
      break
    case 'blogger':
      propsPage.value = 'blogger'
      break
    case 'book':
      propsPage.value = 'book'
      break
  }
  if (!list.value) {
    list.value = true
    updatePage.value = false
  }
}

onMounted(() => { })
</script>

<template>
  <div class="wrapperAcc">
    <div class="sidebar">
      <SideBarAdmin @goTo="goTo" />
    </div>

    <div class="info">
      <HeaderAdmin />
      <div class="settings-top">
        <button class="settings-icon" @click="showSettings = true" aria-label="Настройки">
          ⚙️
        </button>
      </div>
      <metrika-block v-if="propsPage == 'metrika'" />
      <ListsBlock v-if="list && propsPage != 'metrika'" @goToCategory="goToCategory" :propsPage="propsPage"
        :type="typePage" />
      <!-- <UniversalPage v-if="updatePage && !itemPage && propsPage != 'metrika'" :propsPage="propsPage" />
      <UniversalPage v-if="updatePage && itemPage && propsPage != 'metrika'" :propsPage="propsPage" :item="itemPage" /> -->
      <UniversalAdminPage v-if="updatePage && propsPage != 'metrika'" :entity="propsPage" :initialData="itemPage" />
      <SettingsModal v-if="showSettings" @close="showSettings = false" />
    </div>
  </div>
</template>
<style scoped>
.wrapperAcc {
  display: flex;
  background: #f5f7f8;
  padding-right: 30px;
  gap: 51px;
}

.sidebar {
  width: 308px;
  position: sticky;
  top: 0;
  height: 100vh;
  flex-shrink: 0;
  background: #333333;
}

.info {
  width: 100%;
  max-width: 954px;
}

.settings-top {
  position: relative
}

.settings-icon {
  position: absolute;
  right: 0;
  top: 8px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>