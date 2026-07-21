/* Декоративен глобус: се врти при вчитување и застанува на Македонија */

const MERIDIANS = [0, 30, 60, 90, 120, 150];

export default function HeroGlobe({ className = '' }) {
  return (
    <div className={`globe-scene ${className}`} aria-hidden="true">
      <div className="globe">
        <div className="globe-core" />
        {MERIDIANS.map((deg) => (
          <div key={deg} className="globe-ring" style={{ transform: `rotateY(${deg}deg)` }} />
        ))}
        <div className="globe-ring globe-ring-equator" style={{ transform: 'rotateX(90deg)' }} />
        <div className="globe-marker">
          <span className="globe-patch" />
          <span className="globe-pin" />
        </div>
      </div>
    </div>
  );
}
