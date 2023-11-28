import type { RefObject } from 'react';
import type { FlatList } from 'react-native';
import { create } from 'zustand';

import type { RhinoInferenceObject } from '@/types';

interface State {
  chatRef: RefObject<FlatList<RhinoInferenceObject>> | null;
  setChatRef: (chatRef: RefObject<FlatList<RhinoInferenceObject>>) => void;
}

export const useRefStore = create<State>((set) => ({
  chatRef: { current: null },
  setChatRef: (chatRef) => set({ chatRef }),
}));
