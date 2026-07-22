import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useLanguage } from '../LanguageContext';
import {
  inputCls, Chip, formatBudget, formatDate,
  IconMapPin, IconCalendar, IconUser, IconPhone, IconClipboard, IconWrench,
} from '../components';

function RequestCard({ r }) {
  const { t } = useLanguage();
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div className="card-shadow rounded-2xl border border-stone-200/70 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/60 hover:[box-shadow:0_2px_4px_rgb(0_0_0/0.05),0_24px_48px_-12px_rgb(0_0_0/0.18)] sm:rounded-3xl sm:p-6">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0 flex-1">
          <Chip>{r.category_name}</Chip>
          <h2 className="mt-2 text-base font-extrabold tracking-tight text-stone-900 sm:mt-2.5 sm:text-lg">
            {r.category_name} — {r.city_name}
          </h2>
        </div>
        <div className="rounded-xl bg-stone-50 px-3.5 py-2 text-right sm:rounded-2xl sm:px-4 sm:py-2.5">
          <div className="text-base font-extrabold tracking-tight text-stone-900 sm:text-lg">
            {formatBudget(r.budget_from, r.budget_to, t)}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 sm:text-xs">{t('baranja.budgetLabel')}</div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-stone-600 sm:mt-2.5 sm:gap-x-5 sm:gap-y-1.5 sm:text-sm">
        <span className="flex items-center gap-1.5">
          <IconMapPin className="h-3.5 w-3.5 text-amber-500 sm:h-4 sm:w-4" /> {r.city_name}
        </span>
        <span className="flex items-center gap-1.5">
          <IconCalendar className="h-3.5 w-3.5 text-amber-500 sm:h-4 sm:w-4" /> {formatDate(r.preferred_date)}
        </span>
        <span className="flex items-center gap-1.5">
          <IconUser className="h-3.5 w-3.5 text-amber-500 sm:h-4 sm:w-4" /> {r.contact_name}
        </span>
      </div>

      {r.description && (
        <p className="mt-2.5 whitespace-pre-line rounded-xl bg-stone-50 px-3.5 py-2.5 text-xs leading-relaxed text-stone-700 sm:mt-3 sm:px-4 sm:py-3 sm:text-sm">
          {r.description}
        </p>
      )}

      <div className="mt-3 sm:mt-4">
        {showPhone ? (
          <a
            href={`tel:${r.contact_phone.replace(/[\s/-]/g, '')}`}
            className="btn-glossy inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 active:scale-[0.97] sm:w-auto sm:px-5 sm:py-2.5 sm:text-sm"
          >
            <IconPhone className="h-4 w-4" />
            {r.contact_phone}
          </a>
        ) : (
          <button
            onClick={() => setShowPhone(true)}
            className="btn-glossy inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-stone-800 to-stone-950 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-stone-900/25 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97] sm:w-auto sm:px-5 sm:py-2.5 sm:text-sm"
          >
            <IconPhone className="h-4 w-4 text-amber-400" />
            {t('majstori.showPhone')}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Baranja() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('matching'); // matching | all
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [cityId, setCityId] = useState('');
  const [requests, setRequests] = useState([]);
  const [hasListing, setHasListing] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/categories').then(setCategories).catch(() => {});
    api('/api/cities').then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    if (tab === 'matching') {
      api('/api/requests/matching')
        .then((data) => {
          setHasListing(!!data.listing);
          setRequests(data.requests);
        })
        .catch(() => setRequests([]))
        .finally(() => setLoading(false));
    } else {
      const params = new URLSearchParams();
      if (categoryId) params.set('category_id', categoryId);
      if (cityId) params.set('city_id', cityId);
      api(`/api/requests?${params}`)
        .then(setRequests)
        .catch(() => setRequests([]))
        .finally(() => setLoading(false));
    }
  }, [tab, categoryId, cityId]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <h1 className="text-xl font-extrabold tracking-tight text-stone-900 sm:text-2xl">{t('baranja.title')}</h1>
      <p className="mt-1 text-xs text-stone-500 sm:text-sm">
        {t('baranja.subtitle')}
      </p>

      <div className="mt-4 inline-flex rounded-2xl bg-stone-100 p-1 sm:mt-5">
        {[
          { key: 'matching', label: t('baranja.tabMatching') },
          { key: 'all', label: t('baranja.tabAll') },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all sm:px-4 sm:py-2 sm:text-sm ${
              tab === key
                ? 'bg-white text-stone-900 shadow-md'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'all' && (
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-3">
          <select className={inputCls} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">{t('baranja.allCategories')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select className={inputCls} value={cityId} onChange={(e) => setCityId(e.target.value)}>
            <option value="">{t('baranja.allCities')}</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
        {loading && (
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-stone-200/60 sm:h-36 sm:rounded-3xl" />
            ))}
          </div>
        )}

        {!loading && tab === 'matching' && !hasListing && (
          <div className="card-shadow rounded-2xl border border-amber-200/70 bg-white px-5 py-8 text-center sm:rounded-3xl sm:px-6 sm:py-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 sm:h-14 sm:w-14">
              <IconWrench className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-stone-900 sm:mt-4 sm:text-lg">{t('baranja.noListingTitle')}</h3>
            <p className="mx-auto mt-1.5 max-w-sm text-xs text-stone-500 sm:text-sm">
              {t('baranja.noListingText')}
            </p>
            <Link
              to="/moj-oglas"
              className="mt-4 inline-block rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 px-5 py-2.5 text-xs font-bold text-stone-900 shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 sm:mt-5 sm:px-6 sm:py-3 sm:text-sm"
            >
              {t('baranja.createProfile')}
            </Link>
          </div>
        )}

        {!loading && requests.length === 0 && (tab === 'all' || hasListing) && (
          <div className="card-shadow rounded-2xl border border-stone-200/70 bg-white px-5 py-8 text-center sm:rounded-3xl sm:px-6 sm:py-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 sm:h-14 sm:w-14">
              <IconClipboard className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-stone-900 sm:mt-4 sm:text-lg">{t('baranja.emptyTitle')}</h3>
            <p className="mt-1.5 text-xs text-stone-500 sm:text-sm">
              {t('baranja.emptyText')}
            </p>
          </div>
        )}

        {!loading && requests.map((r) => <RequestCard key={r.id} r={r} />)}
      </div>
    </div>
  );
}
