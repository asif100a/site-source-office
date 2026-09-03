import type { MapRegion, WorkerHomeJob } from "@/types";

const DEFAULT_WORKER_MAP_REGION: MapRegion = {
  latitude: 51.5072,
  longitude: -0.1276,
  latitudeDelta: 6,
  longitudeDelta: 6,
};

const NEARBY_DELTA = 0.08;
const MIN_DELTA = 0.04;
const COORDINATE_PADDING = 1.4;

type Coordinate = {
  latitude: number;
  longitude: number;
};

const isValidCoordinate = (coordinate?: Coordinate | null) =>
  Number.isFinite(coordinate?.latitude) &&
  Number.isFinite(coordinate?.longitude) &&
  coordinate?.latitude !== 0 &&
  coordinate?.longitude !== 0;

export const getWorkerMapRegion = (
  userLocation: Coordinate | null,
  jobs: WorkerHomeJob[],
): MapRegion => {
  if (isValidCoordinate(userLocation)) {
    return {
      latitude: userLocation?.latitude ?? 0,
      longitude: userLocation?.longitude ?? 0,
      latitudeDelta: NEARBY_DELTA,
      longitudeDelta: NEARBY_DELTA,
    };
  }

  const coordinates = jobs
    .map((job) => job.coordinate)
    .filter(isValidCoordinate);

  if (!coordinates.length) {
    return DEFAULT_WORKER_MAP_REGION;
  }

  const latitudes = coordinates.map((coordinate) => coordinate.latitude);
  const longitudes = coordinates.map((coordinate) => coordinate.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);

  return {
    latitude: (minLatitude + maxLatitude) / 2,
    longitude: (minLongitude + maxLongitude) / 2,
    latitudeDelta: Math.max(
      MIN_DELTA,
      (maxLatitude - minLatitude) * COORDINATE_PADDING,
    ),
    longitudeDelta: Math.max(
      MIN_DELTA,
      (maxLongitude - minLongitude) * COORDINATE_PADDING,
    ),
  };
};

export const getWorkerMapPosition = (
  coordinate: Coordinate,
  region: MapRegion,
) => {
  const topPercent =
    ((region.latitude + region.latitudeDelta / 2 - coordinate.latitude) /
      region.latitudeDelta) *
    100;
  const leftPercent =
    ((coordinate.longitude - (region.longitude - region.longitudeDelta / 2)) /
      region.longitudeDelta) *
    100;

  return {
    top: `${Math.max(8, Math.min(82, topPercent))}%`,
    left: `${Math.max(8, Math.min(92, leftPercent))}%`,
  };
};
