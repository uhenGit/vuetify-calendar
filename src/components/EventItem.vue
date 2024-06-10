<script setup>
import { computed, ref } from 'vue';
import {useCalendarStore, useEventStore } from '@/stores/index.js';

const eventStore = useEventStore();
const calendarStore = useCalendarStore();

const props = defineProps({
  dayEvents: {
    type: Array,
    required: true,
  },
});

const isShowAddBtn = ref(false);
const isShowAddDialog = ref(false);
const isShowViewDialog = ref(false);
const eventTitle = ref('');
const eventCategory = ref('23585758-9bdc-4d54-8b98-670c6f1dda5f');
const eventStartTime = ref('');
const eventEndDateTime = ref('');

// First element of the props array is current day
const events = computed(() => {
  return props.dayEvents
    .slice(1)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
});
// Only two events should be displayed in the item. Whole events list watch on demand
const visibleEvents = computed(() => events.value.slice(0, 2));
// Since the event is added at the selected day, take the current month and year from the calendar store
const eventStartDate = computed(() => {
  const indexedEventMonth = calendarStore.getMonth + 1;
  const eventMonth = (indexedEventMonth) < 10
    ? `0${indexedEventMonth}`
    : indexedEventMonth;
  const eventDay = props.dayEvents[0] < 10
    ? `0${props.dayEvents[0]}`
    : props.dayEvents[0];

  return `${calendarStore.getYear}-${eventMonth}-${eventDay}T${eventStartTime.value}`;
})
const viewBtnText = computed(() => events.value.length > 2 ? 'Show all events' : 'Show details');
const showAddBtn = () => {
  isShowAddBtn.value = true;
}
const hideAddBtn = () => {
  isShowAddBtn.value = false;
}
const getEventTime = (startDate) => {
  const eventDate = new Date(startDate);
  return `${eventDate.getHours()} : ${eventDate.getMinutes()}`
}
const chipDetails = (categoryId) => {
  return eventStore.categories.find(({ id }) => id === categoryId);
}
const hasEmptyField = () => {
  return !eventTitle.value.trim()
    || !eventCategory.value
    || !eventStartTime.value
    || !eventEndDateTime.value;
}
const onSaveEvent = async () => {
  if (hasEmptyField()) {
    return;
  }

  try {
    await eventStore.createEvent({
      name: eventTitle.value,
      categoryId: eventCategory.value,
      startDate: eventStartDate.value,
      endDate: eventEndDateTime.value,
    });
    // @todo onsuccess clear and close modal
    await eventStore.loadEvents();
  } catch (err) {
    console.log('Save event error: ', err)
  }
}
</script>

<template>
  <div
    :onmouseover="showAddBtn"
    :onmouseleave="hideAddBtn"
    class="position-relative event_item"
  >
    {{ props.dayEvents[0] === -1 ? '' : props.dayEvents[0] }}
    <v-fade-transition>
      <v-btn
        v-show="isShowAddBtn && props.dayEvents[0] !== -1"
        icon="mdi-plus-circle-outline"
        density="compact"
        class="position-absolute top-0 right-0"
        @click="isShowAddDialog = true"
      />
    </v-fade-transition>
    <div class="d-flex flex-column">
      <v-chip
        v-for="event in visibleEvents"
        :key="event.id"
        density="comfortable"
        size="small"
        :color="chipDetails(event.categoryId).color"
        class="mb-1"
      >
        <span>{{ event.name }} - {{ getEventTime(event.startDate) }}</span>
      </v-chip>
      <v-btn
        v-if="props.dayEvents.length > 1"
        :text="viewBtnText"
        border
        size="x-small"
        @click="isShowViewDialog = true"
      />
    </div>
  </div>
<!--  Add Event Modal  -->
  <v-dialog
    v-model="isShowAddDialog"
    width="auto"
  >
    <v-card
      min-width="500"
      title="Create new event"
      class="position-relative"
    >
      <v-btn
        icon="mdi-close-circle-outline"
        density="compact"
        class="position-absolute top-0 right-0"
        @click="isShowAddDialog = false"
      />
      <v-form
        validate-on="submit"
        class="pa-3"
        @submit.prevent = onSaveEvent
      >
        <v-text-field
          v-model="eventTitle"
          label="Event title"
          :rules="[val => !!val.trim() || 'Required']"
          density="compact"
        />
        <v-radio-group
          v-model="eventCategory"
          inline
        >
          <v-radio
            v-for="category in eventStore.categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </v-radio-group>
        <v-text-field
          v-model="eventStartTime"
          type="time"
          label="Select event start time"
          :rules="[val => !!val || 'Required']"
        />
        <v-text-field
          v-model="eventEndDateTime"
          type="datetime-local"
          label="Select event end date and time"
          :rules="[val => !!val || 'Required']"
        />
        <v-btn
          text="Save"
          type="submit"
          block
        />
      </v-form>
    </v-card>
  </v-dialog>
<!--  END Add Event Modal  -->
<!--  View Events Modal  -->
  <v-dialog
    v-model="isShowViewDialog"
    width="auto"
  >
    <h2>{{ props.dayEvents[0] }}, {{ calendarStore.selectedMonth.abbr }}</h2>
    <v-card
      min-width="500"
      title="Events list"
    >
      <v-btn
        icon="mdi-close-circle-outline"
        density="compact"
        class="position-absolute top-0 right-0"
        @click="isShowViewDialog = false"
      />
      <v-table
        height="300px"
        fixed-header
      >
        <thead>
          <tr>
            <th class="text-left">
              Category
            </th>
            <th class="text-left">
              Event name
            </th>
            <th class="text-left">
              Start date
            </th>
            <th class="text-left">
              End date
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="event in events"
            :key="event.id"
          >
            <td>
              <v-chip
                density="compact"
                size="small"
                :color="chipDetails(event.categoryId).color"
              >
                {{ chipDetails(event.categoryId).name }}
              </v-chip>
            </td>
            <td>
              {{ event.name }}
            </td>
            <td>
              {{ getEventTime(event.startDate) }}
            </td>
            <td>
              {{ getEventTime(event.endDate) }}
            </td>
          </tr>
        </tbody>
      </v-table>
      <template #actions>
        <v-btn
          text="Close"
          class="ms-auto"
          @click="isShowViewDialog = false"
        />
      </template>
    </v-card>
  </v-dialog>
<!--  END View Events modal  -->
</template>

<style scoped>
.event_item {
  min-width: 15%;
  min-height: 12vh;
}
</style>
