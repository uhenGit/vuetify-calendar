<script setup>
import { onMounted } from 'vue';
import { useEventStore } from '@/stores/index.js';

const eventStore = useEventStore();

onMounted(() => {
  eventStore.loadEvents();
})
</script>

<template>
  <v-app>
    <app-header />
    <v-main>
      <app-calendar />
    </v-main>
    <app-footer />
  </v-app>
</template>

