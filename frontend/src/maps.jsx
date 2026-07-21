import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* Координати на градовите (лат, лонг) */
export const CITY_COORDS = {
  'Скопје': [41.9973, 21.428],
  'Битола': [41.0297, 21.3292],
  'Куманово': [42.1322, 21.7144],
  'Прилеп': [41.3464, 21.5542],
  'Тетово': [42.0106, 20.9714],
  'Велес': [41.7153, 21.7756],
  'Штип': [41.7414, 22.1997],
  'Охрид': [41.1231, 20.8016],
  'Гостивар': [41.7965, 20.9082],
  'Струмица': [41.4378, 22.6427],
  'Кавадарци': [41.4331, 22.0117],
  'Кочани': [41.9164, 22.4128],
  'Виница': [41.8828, 22.5092],
  'Струга': [41.1778, 20.6783],
  'Кичево': [41.5125, 20.9633],
  'Радовиш': [41.6382, 22.4647],
  'Гевгелија': [41.1392, 22.5025],
  'Дебар': [41.525, 20.5272],
  'Крива Паланка': [42.2017, 22.3317],
  'Свети Николе': [41.8653, 21.9422],
  'Неготино': [41.4844, 22.0908],
  'Делчево': [41.9661, 22.7744],
  'Ресен': [41.0889, 21.0122],
  'Пробиштип': [42.0031, 22.1786],
  'Берово': [41.7078, 22.8564],
  'Кратово': [42.0781, 22.1808],
  'Крушево': [41.3689, 21.2489],
  'Македонски Брод': [41.5136, 21.2153],
  'Валандово': [41.3169, 22.5611],
  'Богданци': [41.2031, 22.5758],
  'Демир Капија': [41.4064, 22.2422],
  'Демир Хисар': [41.2208, 21.2031],
  'Пехчево': [41.7614, 22.8894],
  'Македонска Каменица': [42.0208, 22.5875],
};

const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

function dot(cls, delayMs) {
  return L.divIcon({
    className: '',
    html: `<span class="${cls}" style="animation-delay:${delayMs}ms,${delayMs}ms"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

/* Детерминистички „случаен" поместај — исти пинови при секое рендерирање */
function jitter(seed) {
  const x = Math.sin(seed * 9973.7) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * 0.024;
}

/* Мапа на цела Македонија со пинови на сите градови (декоративна, за насловна) */
export function MacedoniaMap() {
  const ref = useRef(null);

  useEffect(() => {
    const map = L.map(ref.current, {
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
    });
    L.tileLayer(DARK_TILES, { attribution: ATTRIBUTION, subdomains: 'abcd', maxZoom: 19 }).addTo(map);
    map.fitBounds(
      [
        [40.85, 20.42],
        [42.38, 23.05],
      ],
      { padding: [12, 12] }
    );

    Object.entries(CITY_COORDS).forEach(([name, coords], i) => {
      L.marker(coords, { icon: dot('city-dot', i * 70) })
        .addTo(map)
        .bindTooltip(name, { direction: 'top', offset: [0, -8], className: 'map-tip' });
    });

    return () => map.remove();
  }, []);

  return <div ref={ref} className="relative z-0 h-56 w-full sm:h-96" />;
}

/* Мапа на избран град со пинови каде се пронајдени мајстори */
export function CityMap({ cityName, listings }) {
  const ref = useRef(null);

  useEffect(() => {
    const center = CITY_COORDS[cityName];
    if (!center || !ref.current) return;

    const map = L.map(ref.current, { scrollWheelZoom: false });
    L.tileLayer(LIGHT_TILES, { attribution: ATTRIBUTION, subdomains: 'abcd', maxZoom: 19 }).addTo(map);
    map.setView(center, 14);

    listings.forEach((l, i) => {
      // Немаме вистински адреси — пиновите се приближни, распрскани околу центарот
      const lat = center[0] + jitter(l.id * 2 + 1);
      const lng = center[1] + jitter(l.id * 2 + 2) * 1.4;
      L.marker([lat, lng], { icon: dot('majstor-dot', i * 120) })
        .addTo(map)
        .bindTooltip(
          `${l.display_name} · ${Number(l.price).toLocaleString('mk-MK')} ден.`,
          { direction: 'top', offset: [0, -10], className: 'map-tip' }
        );
    });

    return () => map.remove();
  }, [cityName, listings]);

  return <div ref={ref} className="relative z-0 h-48 w-full sm:h-80" />;
}
