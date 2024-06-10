<script setup>
import { ref } from 'vue';
import { useCalendarStore, useEventStore } from '@/stores/index.js';

const calendarStore = useCalendarStore();
const eventStore = useEventStore();

const showPrevBtnTooltip = ref(false);
const showNextBtnTooltip = ref(false);

const onSelectCategories = (category) => {
  eventStore.setCategory(category);
}

const onPrevMonth = () => {
  calendarStore.decrementMonth();
}
const onNextMonth = () => {
  calendarStore.incrementMonth();
}

</script>
<template>
  <v-app-bar
    :elevation="2"
    class="py-1"
  >
    <v-app-bar-title>
      Vue Calendar
    </v-app-bar-title>
    <v-select
      :items="eventStore.categories"
      label="Select categories"
      chips
      multiple
      item-title="name"
      item-value="id"
      class="pt-5 mr-5 category_selector"
      @update:model-value="onSelectCategories"
    />
    <template #append>
      <div class="d-flex flex-column">
        <div>
          <v-tooltip
            v-model="showPrevBtnTooltip"
            location="bottom"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                density="compact"
                @click="onPrevMonth"
              >
                <v-icon>
                  mdi-chevron-left-circle
                </v-icon>
              </v-btn>
            </template>
            <span>Previous month</span>
          </v-tooltip>
          <v-tooltip
            v-model="showNextBtnTooltip"
            location="bottom"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                density="compact"
                @click="onNextMonth"
              >
                <v-icon>
                  mdi-chevron-right-circle
                </v-icon>
              </v-btn>
            </template>
            <span>Next month</span>
          </v-tooltip>
        </div>
        <v-btn
          size="x-small"
          border
          text="Reset date"
          class="mt-2"
          @click="calendarStore.resetDate()"
        />
      </div>
      <period-selector />
    </template>
  </v-app-bar>
</template>

<style scoped>
.category_selector {
  max-width: 320px;
}
</style>
