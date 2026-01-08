<script setup>
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import ListsBlock from '@/components/blocks/ListsBlock.vue'

const route = useRoute()

const entity = route.params.entity
</script>

<template>
    <AdminLayout>
        <ListsBlock :propsPage="entity" :type="null" />
    </AdminLayout>
</template>