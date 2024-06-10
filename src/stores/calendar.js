import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCalendarStore = defineStore(
  'calendar',
  () => {
    const year = ref(new Date().getFullYear());
    const month = ref(new Date().getMonth());

    const getYear = computed(() => year.value);
    const getMonth = computed(() => month.value);

    const months = [
      { idx: 0, abbr: 'Jan' },
      { idx: 1, abbr: 'Feb' },
      { idx: 2, abbr: 'Mar' },
      { idx: 3, abbr: 'Apr' },
      { idx: 4, abbr: 'May' },
      { idx: 5, abbr: 'Jun' },
      { idx: 6, abbr: 'Jul' },
      { idx: 7, abbr: 'Aug' },
      { idx: 8, abbr: 'Sep' },
      { idx: 9, abbr: 'Oct' },
      { idx: 10, abbr: 'Nov' },
      { idx: 11, abbr: 'Dec' },
    ];

    const selectedMonth = computed(
      () => months.find(({ idx }) => idx === getMonth.value)
    );

    const incrementYear = (value) => {
      year.value += value;
    }
    const decrementYear = (value) => {
      year.value -= value;
    }
    const incrementMonth = () => {
      if (month.value === 11) {
        incrementYear(1);
        month.value = 0;

        return;
      }

      month.value += 1;
    }
    const decrementMonth = () => {
      if (month.value === 0) {
        decrementYear(1);
        month.value = 11;

        return;
      }

      month.value -= 1;
    }

    const setMonth = (value) => {
      month.value = value;
    }
    const setYear = (value) => {
      year.value = value;
    }
    const resetDate = () => {
      const currentDate = new Date();
      setMonth(currentDate.getMonth());
      setYear(currentDate.getFullYear());
    }

    return {
      year,
      month,
      months,
      getYear,
      getMonth,
      selectedMonth,
      incrementYear,
      incrementMonth,
      decrementMonth,
      setMonth,
      setYear,
      resetDate,
    };
  }
)
