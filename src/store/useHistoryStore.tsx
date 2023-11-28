import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoCrypto from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { BotQA, RhinoInferenceObject } from '@/types';

interface HistoryStoreState {
  history: RhinoInferenceObject[];
  addToHistory: (botQA: BotQA) => void;
  clearHistory: () => void;
  changeById: (id: string, newBotQA: BotQA) => void;
}

const useHistoryStore = create(
  persist<HistoryStoreState>(
    (set) => ({
      history: [] as RhinoInferenceObject[],
      addToHistory: (botQA: BotQA) => {
        const obj: RhinoInferenceObject = {
          botQA,
          id: ExpoCrypto.getRandomBytes(16).toString(),
        };
        set((state) => ({
          history: [...state.history, obj],
        }));
      },
      clearHistory: () => set({ history: [] }),
      changeById: (id: string, botQA: BotQA) =>
        set((state) => ({
          history: state.history.map((prev) =>
            prev.id === id ? { botQA, id } : prev,
          ),
        })),
    }),
    {
      name: '@HistoryStore',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useHistoryStore;
