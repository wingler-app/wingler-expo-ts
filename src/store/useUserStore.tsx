import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Coords {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

interface UserStoreState {
  coords: Coords;
  setCoords: (coords: Coords) => void;
}

const useUserStore = create(
  persist<UserStoreState>(
    (set) => ({
      coords: {
        latitude: 0,
        longitude: 0,
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      setCoords: (coords: Coords) => {
        return set(() => ({ coords }));
      },
    }),
    {
      name: '@UserCords',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useUserStore;
