import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useLanguage } from '../LanguageContext';
import {
  Chip, formatBudget, formatDate, IconCalendar, IconWallet, IconPlus, IconClipboard,
} from '../components';

export default function MoiBaranja() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    api('/api/requests/mine')
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function close(id) {
    if (!confirm(t('moiBaranja.confirmClose'))) return;
    try {
      await api(`/api/requests/${id}`, { method: 'DELETE' });
      load();
    } catch {
      /* игнорирај */
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-stone-900 sm:text-2xl">{t('moiBaranja.title')}</h1>
          <p className="mt-1 text-xs text-stone-500 sm:text-sm">
            {t('moiBaranja.subtitle')}
          </p>
        </div>
        <Link
          to="/novo-baranje"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 px-4 py-2 text-xs font-bold text-stone-900 shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl sm:px-5 sm:py-2.5 sm:text-sm"
        >
          <IconPlus className="h-4 w-4" />
          {t('moiBaranja.newRequest')}
        </Link>
      </div>

      <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
        {loading && (
          <div className="space-y-3 sm:space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-stone-200/60 sm:h-32 sm:rounded-3xl" />
            ))}
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="card-shadow rounded-2xl border border-stone-200/70 bg-white px-5 py-8 text-center sm:rounded-3xl sm:px-6 sm:py-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 sm:h-14 sm:w-14">
              <IconClipboard className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-stone-900 sm:mt-4 sm:text-lg">{t('moiBaranja.emptyTitle')}</h3>
            <p className="mt-1.5 text-xs text-stone-500 sm:text-sm">
              {t('moiBaranja.emptyText')}
            </p>
            <Link
              to="/majstori"
              className="mt-4 inline-block rounded-xl bg-gradient-to-b from-stone-800 to-stone-950 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-stone-900/25 transition-all hover:-translate-y-0.5 sm:mt-5 sm:px-6 sm:py-3 sm:text-sm"
            >
              {t('moiBaranja.searchLink')}
            </Link>
          </div>
        )}

        {requests.map((r) => (
          <div
            key={r.id}
            className="card-shadow rounded-2xl border border-stone-200/70 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 sm:rounded-3xl sm:p-6"
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>{r.category_name}</Chip>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold sm:px-3 sm:py-1 sm:text-xs ${
                      r.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                        : 'bg-stone-100 text-stone-500 ring-1 ring-stone-200'
                    }`}
                  >
                    {r.status === 'active' ? t('moiBaranja.statusActive') : t('moiBaranja.statusClosed')}
                  </span>
                </div>
                <h2 className="mt-2 text-base font-extrabold tracking-tight text-stone-900 sm:mt-2.5 sm:text-lg">
                  {r.category_name} — {r.city_name}
                </h2>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-stone-600 sm:mt-2 sm:gap-x-5 sm:gap-y-1.5 sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <IconCalendar className="h-3.5 w-3.5 text-amber-500 sm:h-4 sm:w-4" />
                    {formatDate(r.preferred_date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconWallet className="h-3.5 w-3.5 text-amber-500 sm:h-4 sm:w-4" />
                    {formatBudget(r.budget_from, r.budget_to, t)}
                  </span>
                </div>
                {r.description && (
                  <p className="mt-2.5 whitespace-pre-line rounded-xl bg-stone-50 px-3.5 py-2.5 text-xs leading-relaxed text-stone-700 sm:mt-3 sm:px-4 sm:py-3 sm:text-sm">
                    {r.description}
                  </p>
                )}
              </div>
              {r.status === 'active' && (
                <button
                  onClick={() => close(r.id)}
                  className="self-start rounded-xl border border-stone-200 px-3.5 py-1.5 text-xs font-semibold text-stone-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:px-4 sm:py-2 sm:text-sm"
                >
                  {t('moiBaranja.closeButton')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
