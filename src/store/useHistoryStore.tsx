import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoCrypto from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { BotQA, RhinoInferenceObject } from '@/types';

export interface Command {
  type: string;
  command: string;
}

interface HistoryStoreState {
  history: RhinoInferenceObject[];
  commands: Command[];
  lastId: string | null;
  addToHistory: (botQA: BotQA) => void;
  addCommand: (command: Command) => void;
  clearHistory: () => void;
  changeById: (id: string, newBotQA: BotQA) => void;
}

const useHistoryStore = create(
  persist<HistoryStoreState>(
    (set) => ({
      history: [] as RhinoInferenceObject[],
      commands: [] as Command[],
      lastId: null,
      addToHistory: (botQA: BotQA) => {
        const id = ExpoCrypto.getRandomBytes(16).toString();
        const obj: RhinoInferenceObject = {
          botQA,
          id,
        };
        set((state) => ({
          history: [...state.history, obj],
          lastId: id,
        }));
      },
      addCommand: (command: Command) => {
        set((state) => ({
          commands: [...state.commands, command],
        }));
      },
      clearHistory: () => set({ history: [], commands: [] }),
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
