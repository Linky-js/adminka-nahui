<template>
    <div class="wrapperAcc">
        <div class="sidebar">
            <SideBarAdmin />
        </div>

        <div class="info">
            <HeaderAdmin />
            <div class="settings-top">
                <button class="settings-icon" @click="showSettings = true" aria-label="Настройки">
                    ⚙️
                </button>
            </div>
            <slot />
            <SettingsModal v-if="showSettings" @close="showSettings = false" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import SideBarAdmin from '@/components/blocks/SideBarAdmin.vue'
import HeaderAdmin from '@/components/blocks/HeaderAdmin.vue'
import SettingsModal from '@/components/SettingsModal.vue'

const showSettings = ref(false)
</script>

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