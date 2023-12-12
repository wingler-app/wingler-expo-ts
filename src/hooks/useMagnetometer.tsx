import type { MagnetometerMeasurement } from 'expo-sensors';
import { Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';

interface MagnetoMeterResponse {
  magnetometer: MagnetometerMeasurement | null;
  angle: number;
  degree: number;
  direction: string;
}

const useMagnetometer = (): MagnetoMeterResponse => {
  const [angle, setAngle] = useState<number>(0);
  const [degree, setDegree] = useState<number>(0);
  const [direction, setDirection] = useState<string>('N');
  const [magnetometer, setMagnetometer] =
    useState<MagnetometerMeasurement | null>(null);

  const getAngle = (myMagnetometer: MagnetometerMeasurement) => {
    let myAngle = 0;
    if (myMagnetometer) {
      const { x, y } = myMagnetometer;
      if (Math.atan2(y, x) >= 0) {
        myAngle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        myAngle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(myAngle);
  };

  const getDegree = (val: number) => {
    return val - 90 >= 0 ? val - 90 : val + 271;
  };

  const getDirection = (val: number) => {
    if (val >= 22.5 && val < 67.5) {
      return 'NE';
    }
    if (val >= 67.5 && val < 112.5) {
      return 'E';
    }
    if (val >= 112.5 && val < 157.5) {
      return 'SE';
    }
    if (val >= 157.5 && val < 202.5) {
      return 'S';
    }
    if (val >= 202.5 && val < 247.5) {
      return 'SW';
    }
    if (val >= 247.5 && val < 292.5) {
      return 'W';
    }
    if (val >= 292.5 && val < 337.5) {
      return 'NW';
    }

    return 'N';
  };

  useEffect(() => {
    const sub = Magnetometer.addListener((data) => {
      setMagnetometer(data);
      const newAngle = getAngle(data);
      const newDegree = getDegree(newAngle);
      setAngle(newAngle);
      setDegree(newDegree);
      setDirection(getDirection(newDegree));
    });

    Magnetometer.setUpdateInterval(1000);

    return () => {
      if (sub) sub.remove();
    };
  }, []);

  return { magnetometer, angle, degree, direction };
};

export default useMagnetometer;
