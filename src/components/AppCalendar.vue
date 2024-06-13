<script setup>
import { computed, ref, onMounted, onUpdated } from 'vue';
import { useCalendarStore, useEventStore } from '@/stores/index.js';

const eventStore = useEventStore();
const calendarStore = useCalendarStore();
calendarStore.$subscribe(() => {
  getDaysInMonth();
  getFirstDayOfMonth();
  getLastCalendarCells();
});

const weekLength = 7;

const weekDays = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const daysInCurrentMonth = ref(0);
const firstDayOfCurrentMonth = ref(0);
const lastCalendarCells = ref(0);

const getDaysInMonth = () => {
  daysInCurrentMonth.value = new Date(
    calendarStore.getYear,
    calendarStore.getMonth + 1,
    0
  ).getDate();
}

const getFirstDayOfMonth = () => {
  firstDayOfCurrentMonth.value = new Date(
    calendarStore.getYear,
    calendarStore.getMonth,
    1
  ).getDay();
}

const getLastCalendarCells = () => {
  const totalCellsNumber = firstDayOfCurrentMonth.value <= 5 ? 35 : 42;
  const cellsNumber = totalCellsNumber - daysInCurrentMonth.value - firstDayOfCurrentMonth.value;

  lastCalendarCells.value = cellsNumber < 0
    ? weekLength + cellsNumber
    : cellsNumber;
}

const totalMonthGrid = computed(() => {
  const emptyDaysBeforeFirstDay = generateArray(firstDayOfCurrentMonth.value, -1);
  const emptyDaysAfterLastDay = generateArray(lastCalendarCells.value, -1);
  const daysOfMonth = generateArray(daysInCurrentMonth.value);

  return emptyDaysBeforeFirstDay.concat(daysOfMonth).concat(emptyDaysAfterLastDay);
})

// Break total month grid array on two dimensions array that looks like:
// month - [ week - [days], week - [days], week - [days].....]
const chunkedDays = computed(() => {
  return totalMonthGrid.value.reduce((acc, cV, idx) => {
    const chunkIdx = Math.floor(idx / weekLength);

    if (!acc[chunkIdx]) {
      acc[chunkIdx] = [];
    }

    acc[chunkIdx].push(cV);

    return acc;
  }, [])
})

/**
 * Generate an array of specified length and contents. For an empty cells, it should contain -1 as a value.
 * For non-empty cells (days of the month), it should contain the day number of the month
 * @param {number} len
 * @param {number | null} fill
 * @returns array of the given length
 * */
const generateArray = (len, fill = null) => {
  return Array.from(
    { length: len },
    (_, idx) => fill === -1 ? fill : idx + 1
  );
}

const isEventToday = (day, eventStartDate) => {
  return calendarStore.getYear === parseInt(eventStartDate.substring(0, 4), 10)
  && calendarStore.getMonth + 1 === parseInt(eventStartDate.substring(5, 7), 10)
  && day === parseInt(eventStartDate.substring(8, 10), 10);
}

/**
 * Handle all the events to get an array of events for the specified day
 * @param {number} day
 * @returns an array of events
 * */
const oneDayEvents = (day) => {
  if (day === -1 || !eventStore.eventsByCategory.length) {
    return [day];
  }

  const todayEvents = [day];
  eventStore.eventsByCategory.forEach((event) => {
    if (day !== -1 && isEventToday(day, event.startDate)) {
      todayEvents.push(event)
    }
  });

  return todayEvents;
}

onMounted(() => {
  getDaysInMonth();
  getFirstDayOfMonth();
  getLastCalendarCells();
});
onUpdated(() => {
  getFirstDayOfMonth();
  getLastCalendarCells();
})
</script>

<template>
  <v-container class="fill-height">
    <h2>{{ calendarStore.selectedMonth.abbr }}, {{ calendarStore.year }}</h2>
      <v-container class="w-100">
        <v-row>
          <v-col
            v-for="day in weekDays"
            class="border"
          >
            {{ day.substring(0, 3) }}
          </v-col>
        </v-row>
        <v-row
          v-for="(week, weekIdx) in chunkedDays"
          :key="weekIdx"
        >
          <v-col
            v-for="(day, dayIdx) in week"
            :key="dayIdx"
            class="border pa-0"
          >
            <event-item :day-events="oneDayEvents(day)"/>
          </v-col>
        </v-row>
      </v-container>
  </v-container>
</template>
