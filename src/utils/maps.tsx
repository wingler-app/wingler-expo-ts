import type { Position } from '@/types';

export function getMidpoint(pos1: Position, pos2: Position): Position {
  const lat1 = pos1.latitude * (Math.PI / 180); // Convert degrees to radians
  const lon1 = pos1.longitude * (Math.PI / 180);
  const lat2 = pos2.latitude * (Math.PI / 180);
  const lon2 = pos2.longitude * (Math.PI / 180);

  const dLon = lon2 - lon1;

  const Bx = Math.cos(lat2) * Math.cos(dLon);
  const By = Math.cos(lat2) * Math.sin(dLon);

  const midLat = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By),
  );
  const midLon = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

  // Convert back to degrees
  const midLatInDegrees = midLat * (180 / Math.PI);
  const midLonInDegrees = midLon * (180 / Math.PI);

  // Calculate the deltas
  const latDelta = Math.abs(pos1.latitude - pos2.latitude) * 1.2; // 20% padding
  const lonDelta = Math.abs(pos1.longitude - pos2.longitude) * 1.2;
  return {
    latitude: midLatInDegrees,
    longitude: midLonInDegrees,
    latitudeDelta: latDelta,
    longitudeDelta: lonDelta,
  };
}
