import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsStoreState {
  readAloud: boolean;
  showTextChat: boolean;
  toggleReadAloud: () => void;
  toggleShowTextChat: () => void;
}

const useSettingsStore = create(
  persist<SettingsStoreState>(
    (set) => ({
      readAloud: false,
      showTextChat: false,
      toggleReadAloud: () => {
        console.log('toggleReadAloud');
        return set((state) => ({ readAloud: !state.readAloud }));
      },
      toggleShowTextChat: () => {
        console.log('toggleShowTextChat');
        return set((state) => ({ showTextChat: !state.showTextChat }));
      },
    }),
    {
      name: '@Settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useSettingsStore;
