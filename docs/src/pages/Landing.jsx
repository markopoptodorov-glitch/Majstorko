import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import { MacedoniaMap, CITY_COORDS } from '../maps';
import HeroGlobe from '../HeroGlobe';
import {
  IconSearch, IconWrench, IconArrowRight, IconPhone, IconCheck,
  IconShield, IconSparkles, IconMapPin, useTilt,
} from '../components';

const POPULAR_KEYS = [
  'landing.category.molar',
  'landing.category.electrician',
  'landing.category.plumber',
  'landing.category.tiler',
  'landing.category.carpenter',
  'landing.category.ac',
];

function StepCard({ icon: Icon, step, title, text }) {
  const tilt = useTilt(5);
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={tilt.style}
      className="tilt-card tilt-glow card-shadow group relative overflow-hidden rounded-2xl border border-stone-200/70 bg-white p-4 transition-shadow duration-300 hover:[box-shadow:0_2px_4px_rgb(0_0_0/0.05),0_24px_48px_-12px_rgb(0_0_0/0.18)] sm:rounded-3xl sm:p-6"
    >
      <span className="absolute -right-1 -top-2 text-5xl font-extrabold text-stone-100 transition-colors group-hover:text-amber-100 sm:-right-2 sm:-top-4 sm:text-7xl">
        {step}
      </span>
      <div className="badge-3d relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-stone-800 to-stone-950 text-amber-400 shadow-lg shadow-stone-900/20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 sm:h-12 sm:w-12 sm:rounded-2xl">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <h3 className="relative mt-3 text-base font-bold text-stone-900 sm:mt-4 sm:text-lg">{title}</h3>
      <p className="relative mt-1 text-xs leading-relaxed text-stone-600 sm:mt-1.5 sm:text-sm">{text}</p>
    </div>
  );
}

function RoleCard({ to, tone, icon: Icon, title, text, cta }) {
  const tilt = useTilt(4);
  const dark = tone === 'dark';
  return (
    <Link
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={tilt.style}
      to={to}
      className={`tilt-card tilt-glow ${dark ? 'tilt-glow-dark' : ''} card-shadow group relative overflow-hidden rounded-2xl p-5 transition-shadow duration-300 sm:rounded-3xl sm:p-8 ${
        dark
          ? 'bg-gradient-to-br from-stone-800 to-stone-950 hover:shadow-2xl hover:shadow-stone-900/50'
          : 'bg-gradient-to-br from-amber-400 to-amber-500 hover:shadow-2xl hover:shadow-amber-500/40'
      }`}
    >
      <div
        className={`pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150 ${
          dark ? 'bg-amber-400/20' : 'bg-white/15'
        }`}
      />
      <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${dark ? 'text-amber-400' : 'text-stone-900/80'}`} />
      <h3 className={`mt-3 text-lg font-extrabold sm:mt-4 sm:text-2xl ${dark ? 'text-white' : 'text-stone-950'}`}>{title}</h3>
      <p className={`mt-1.5 max-w-xs text-xs font-medium leading-relaxed sm:mt-2 sm:text-sm ${dark ? 'text-stone-400' : 'text-stone-900/70'}`}>
        {text}
      </p>
      <span className={`mt-3 inline-flex items-center gap-2 text-xs font-bold sm:mt-5 sm:text-sm ${dark ? 'text-amber-400' : 'text-stone-950'}`}>
        {cta}
        <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
      </span>
    </Link>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const workerLink = user?.role === 'worker' ? '/baranja' : '/registracija?uloga=worker';
  const heroRef = useRef(null);

  function onHeroMouseMove(e) {
    const rect = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    heroRef.current.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <div>
      {/* ===== Hero ===== */}
      <section
        ref={heroRef}
        onMouseMove={onHeroMouseMove}
        className="relative overflow-hidden bg-stone-950"
      >
        {/* точкеста текстура + светлечка мрлја што го следи глушецот */}
        <div className="bg-dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
        <div className="spotlight hidden sm:block" />

        {/* декоративни светлечки форми */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl" />
        <HeroGlobe className="pointer-events-none opacity-70 sm:opacity-80" />
        <div className="animate-float pointer-events-none absolute right-[8%] top-24 hidden h-24 w-24 rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-transparent shadow-[inset_0_1px_0_rgb(255_255_255_/_0.15)] backdrop-blur-sm lg:block" />
        <div className="animate-float-slow pointer-events-none absolute left-[6%] top-40 hidden h-16 w-16 rounded-2xl border border-white/10 bg-white/5 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.1)] backdrop-blur-sm lg:block" />
        <div className="animate-float pointer-events-none absolute bottom-10 left-[16%] hidden h-10 w-10 rounded-xl border border-amber-400/20 bg-amber-400/10 backdrop-blur-sm [animation-delay:-2s] lg:block" />
        <div className="animate-float-slow pointer-events-none absolute bottom-24 right-[18%] hidden h-8 w-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm [animation-delay:-5s] lg:block" />

        <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-10 text-center sm:pb-28 sm:pt-24">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-amber-300 backdrop-blur sm:mb-6 sm:px-4 sm:text-xs">
            <IconSparkles className="h-3.5 w-3.5" />
            {t('landing.badge')}
          </div>

          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            {t('landing.heroPre')}{' '}
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              {t('landing.heroHighlight')}
            </span>{' '}
            {t('landing.heroPost')}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone-400 sm:mt-5 sm:text-lg">
            {t('landing.subtitle')}
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:mt-9 sm:flex-row sm:gap-3">
            <Link
              to="/majstori"
              className="btn-glossy group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 px-6 py-3.5 text-sm font-bold text-stone-900 shadow-2xl shadow-amber-500/40 transition-all hover:-translate-y-1 hover:shadow-amber-400/50 active:translate-y-0 active:scale-[0.98] sm:w-auto sm:px-8 sm:py-4 sm:text-base"
            >
              <IconSearch className="h-4 w-4 sm:h-5 sm:w-5" />
              {t('landing.searchCta')}
              <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to={workerLink}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition-all hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 active:translate-y-0 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
            >
              <IconWrench className="h-4 w-4 text-amber-400 sm:h-5 sm:w-5" />
              {t('landing.workerCta')}
            </Link>
          </div>

          {/* популарни категории */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:mt-10 sm:gap-2">
            {POPULAR_KEYS.map((key) => (
              <Link
                key={key}
                to="/majstori"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-stone-300 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-amber-400/40 hover:text-amber-300 sm:px-4 sm:py-1.5 sm:text-sm"
              >
                {t(key)}
              </Link>
            ))}
          </div>
        </div>

        {/* мек премин кон светла позадина */}
        <div className="h-8 rounded-t-[2.5rem] bg-stone-50" />
      </section>

      {/* ===== Како функционира ===== */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:py-20">
        <h2 className="text-center text-xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
          {t('landing.howTitle')}
        </h2>
        <p className="mt-1.5 text-center text-xs text-stone-500 sm:mt-2 sm:text-base">
          {t('landing.howSubtitle')}
        </p>

        <div className="mt-6 grid gap-3.5 sm:mt-10 sm:grid-cols-3 sm:gap-5">
          <StepCard icon={IconSearch} step="01" title={t('landing.step1Title')} text={t('landing.step1Text')} />
          <StepCard icon={IconPhone} step="02" title={t('landing.step2Title')} text={t('landing.step2Text')} />
          <StepCard icon={IconCheck} step="03" title={t('landing.step3Title')} text={t('landing.step3Text')} />
        </div>
      </section>

      {/* ===== Двете улоги ===== */}
      <section className="mx-auto max-w-5xl px-4 pb-10 sm:pb-24">
        <div className="grid gap-3.5 [perspective:1200px] sm:grid-cols-2 sm:gap-5">
          <RoleCard
            to="/majstori"
            tone="amber"
            icon={IconSearch}
            title={t('landing.clientCardTitle')}
            text={t('landing.clientCardText')}
            cta={t('landing.clientCardCta')}
          />
          <RoleCard
            to={workerLink}
            tone="dark"
            icon={IconWrench}
            title={t('landing.workerCardTitle')}
            text={t('landing.workerCardText')}
            cta={t('landing.workerCardCta')}
          />
        </div>
      </section>

      {/* ===== Мапа на Македонија ===== */}
      <section className="mx-auto max-w-5xl px-4 pb-10 sm:pb-24">
        <div className="card-shadow overflow-hidden rounded-3xl bg-stone-950">
          <div className="px-4 pt-6 text-center sm:px-10 sm:pt-8">
            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-3xl">
              {t('landing.mapPre')}{' '}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                {t('landing.mapHighlight')}
              </span>
            </h2>
            <p className="mt-1.5 text-xs text-stone-400 sm:mt-2 sm:text-sm">
              {t('landing.mapSubtitle', { count: Object.keys(CITY_COORDS).length })}
            </p>
          </div>
          <div className="p-3 sm:p-4">
            <div className="overflow-hidden rounded-2xl">
              <MacedoniaMap />
            </div>
          </div>
        </div>

        {/* доверба */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-stone-500 sm:mt-10 sm:gap-x-8 sm:gap-y-3 sm:text-sm">
          <span className="flex items-center gap-1.5 sm:gap-2">
            <IconShield className="h-3.5 w-3.5 text-amber-500 sm:h-4 sm:w-4" /> {t('landing.trustNoFees')}
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2">
            <IconPhone className="h-3.5 w-3.5 text-amber-500 sm:h-4 sm:w-4" /> {t('landing.trustDirect')}
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2">
            <IconMapPin className="h-3.5 w-3.5 text-amber-500 sm:h-4 sm:w-4" /> {t('landing.trustCoverage')}
          </span>
        </div>
      </section>
    </div>
  );
}
