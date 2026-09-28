/**
 * Map ↔ world conversion for the stylised Novi Sad map (viewBox 1000×700).
 * One unit ≈ 7.5 m; anchored on Trg slobode.
 */
const ORIGIN = { x: 540, y: 330, lat: 45.2551, lng: 19.8451 };

export const toLatLng = ([x, y]: [number, number]) => ({
  lat: +(ORIGIN.lat - (y - ORIGIN.y) * 0.0000676).toFixed(5),
  lng: +(ORIGIN.lng + (x - ORIGIN.x) * 0.000096).toFixed(5),
});
