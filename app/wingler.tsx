import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import * as TaskManager from 'expo-task-manager';

import WinglerBot from '@/components/templates/WinglerBot';

const LOCATION_TASK_NAME = 'background-location-task';

const requestPermissions = async () => {
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
      });
    }
  }
};

requestPermissions();
type LocationData = {
  locations: LocationObject[];
};

type LocationObject = {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
};

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data as LocationData;
    if (locations[0]) {
      console.log(locations[0].coords);
      AsyncStorage.setItem('@Coords', JSON.stringify(locations[0].coords));
    }
    // do something with the locations captured in the background
  }
});

const Wingler = () => (
  <>
    <Stack.Screen
      options={{
        title: 'Wingler bot',
      }}
    />
    {/* <WinglerBot navigation={undefined} route={undefined} /> */}
    {/* @ts-ignore */}
    <WinglerBot />
  </>
);

export default Wingler;
