import { writable } from "svelte/store";

interface AppStore {
  showSidebar: boolean;
}

const createAppStore = () => {
  const { subscribe, update } = writable<AppStore>({
    showSidebar: true,
  });

  return {
    subscribe,
    toggleSidebar: (state: boolean) => {
      update((currentState) => {
        currentState.showSidebar = state;

        return currentState;
      });
    },
  };
};

export const appStore = createAppStore();
