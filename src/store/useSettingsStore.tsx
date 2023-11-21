import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsStoreState {
  readAloud: boolean;
  toggleReadAloud: () => void;
}

const useSettingsStore = create(
  persist<SettingsStoreState>(
    (set) => ({
      readAloud: false,
      toggleReadAloud: () => {
        console.log('toggleReadAloud');
        return set((state) => ({ readAloud: !state.readAloud }));
      },
    }),
    {
      name: '@Settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useSettingsStore;
