<script setup>
import { ref } from 'vue';
import { useCalendarStore } from '@/stores/index.js';

const calendarStore = useCalendarStore();

const years = [2020, 2021, 2022, 2023, 2024, 2025];

const selectedMonth = ref(calendarStore.selectedMonth);
const selectedYear = ref(calendarStore.getYear);

const onSelectPeriod = () => {
  calendarStore.setMonth(selectedMonth.value.idx);
  calendarStore.setYear(selectedYear.value);
}
</script>

<template>
  <v-form
    class="period_selector border my-1"
    @submit.prevent="onSelectPeriod"
  >
      <v-row
        no-gutters
        class="pt-3 px-1"
      >
        <v-col class="pa-0 mr-1">
          <v-select
            v-model="selectedMonth"
            label="Month"
            density="compact"
            :items="calendarStore.months"
            item-title="abbr"
            item-value="idx"
            return-object
          />
        </v-col>
        <v-col class="pa-0 mr-1">
          <v-select
            v-model="selectedYear"
            label="Year"
            density="compact"
            :items="years"
          />
        </v-col>
        <div
          class="ml-1 pt-1"
        >
          <v-btn
            type="submit"
            border
            text="Go"
          />
        </div>
      </v-row>
  </v-form>
</template>

<style scoped>
.period_selector {
  min-width: 350px;
}
</style>
