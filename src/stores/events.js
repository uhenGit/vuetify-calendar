import { defineStore } from 'pinia';

const API = 'https://learning.banzait.com/back/api/Event/';

export const useEventStore = defineStore(
 'eventData',
  {
    state: () => ({
      events: [],
      selectedCategoryIds: [],
      status: 'success',
    }),
    getters: {
      eventsByCategory: (state) => {
        return !state.selectedCategoryIds.length
          ? state.events
          : state.events.filter(({ categoryId }) => {
            return state.selectedCategoryIds.includes(categoryId)
          });
      },
      categories: () => (
        [
          {
            id: '4d115ae7-ef38-45b7-baf3-8fd9e080a596',
            name: 'Conference',
            color: 'green'
          },
          {
            id: 'd6ef1e8d-c49f-4231-91cb-c3363a943fd8',
            name: 'Holiday',
            color: 'red',
          },
          {
            id: '23585758-9bdc-4d54-8b98-670c6f1dda5f',
            name: 'Study',
            color: 'primary',
          },
        ]
      ),
    },
    actions: {
      setCategory(category) {
        this.selectedCategoryIds = category;
      },

      async loadEvents() {
        const endpoint = 'All';
        try {
          const headers = new Headers({
            'Content-Type': 'application/json',
            'Authority': `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            'Access-Control-Allow-Origin': '*',
            });
          this.status = 'loading';
          const response = await fetch(`${API}${endpoint}`, {
            method: 'POST',
            headers,
          });
          this.events = await response.json();
          console.log('load result: ', this.events);
          this.status = 'success';
        } catch (err) {
          this.status = 'error';
          console.log('load error: ', err);
        }
      },

      async createEvent(event) {
        try {
          const headers = new Headers({
            'Content-Type': 'application/json',
            'Authority': `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            'Access-Control-Origin': '*',
          })
          this.status = 'loading';
          const endpoint = 'Create';
          const response = await fetch(`${API}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(event),
          });
          const res = await response.json();
          console.log('create res: ', res);
          this.status = 'success';
        } catch (err) {
          this.status = 'error';
          console.log('create error: ', err);
        }
      },
    },
  }
)
