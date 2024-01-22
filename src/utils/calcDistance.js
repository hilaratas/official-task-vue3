//export default function (lat1, lon1, lat2, lon2) {
export default function (a, b) {
  // Радиус Земли в километрах
  const R = 6371;

  // Переводим градусы в радианы
  const toRadians = angle => angle * (Math.PI / 180);

  // Разница широт и долгот в радианах
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);

  // Вычисление расстояния с использованием формулы Haversine
  const d =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d));

  // Расстояние в километрах
  const distance = R * c;

  return distance;
}