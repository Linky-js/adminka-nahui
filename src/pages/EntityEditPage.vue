<script setup>
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import UniversalAdminPage from '@/components/UniversalAdminPage.vue'

const route = useRoute()

const entity = route.params.entity
const id = route.params.id
</script>

<template>
    <AdminLayout>
        <UniversalAdminPage :entity="entity" :initialData="{ id: parseInt(id) }" />
    </AdminLayout>
</template>