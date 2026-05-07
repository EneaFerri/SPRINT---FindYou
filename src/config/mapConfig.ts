export const bergamoMapConfig = {
  center: [45.6983, 9.6773] as [number, number],
  zoom: 10,
  bounds: {
    north: 45.9,
    south: 45.38,
    east: 10.08,
    west: 9.35,
  },
};

export const tileProviders = {
  openStreetMap: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  futureProviders: [
    'Google Maps Platform adapter - disabled in demo, no API key included',
    'Mapbox adapter - future commercial tile layer',
    'Sentinel/Copernicus adapter - future authorized satellite imagery',
    'Private orthophoto adapter - future internal or licensed imagery',
  ],
};
