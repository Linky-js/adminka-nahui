<script setup>
import { useRoute } from "vue-router";
import AdminLayout from "@/components/layouts/AdminLayout.vue";
import ListsBlock from "@/components/blocks/ListsBlock.vue";

const route = useRoute();

const entity = route.params.entity;
</script>

<template>
  <div class="wrapper">
    <AdminLayout>
      <ListsBlock :propsPage="entity" :type="null" :key="entity" />
    </AdminLayout>
  </div>
</template>

<style scoped>
.wrapper {
  color: #666;
}
</style>
