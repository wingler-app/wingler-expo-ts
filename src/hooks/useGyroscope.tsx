import { Gyroscope } from 'expo-sensors';
import { useEffect, useState } from 'react';

const useGyroscope = () => {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const setSpeed = (speed: number) => Gyroscope.setUpdateInterval(speed);

  useEffect(() => {
    const sub = Gyroscope.addListener((gyroscopeData) => {
      setData(gyroscopeData);
    });

    Gyroscope.setUpdateInterval(1000);

    return () => {
      if (sub) sub.remove();
    };
  }, []);

  return { x, y, z, setSpeed };
};

export default useGyroscope;
