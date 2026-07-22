import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import { api } from '../api';
import {
  IconSearch, IconMapPin, IconPhone, IconImage, IconClipboard,
  Avatar, Chip, Combobox, priceTypeLabel,
} from '../components';
import { CityMap, CITY_COORDS } from '../maps';

const searchInputCls =
  'w-full rounded-xl border-0 bg-white px-4 py-3.5 text-sm font-semibold text-stone-900 placeholder:font-semibold placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-amber-400/30';

function ListingCard({ l }) {
  const { t } = useLanguage();
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div className="card-shadow group rounded-2xl border border-stone-200/70 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/60 hover:[box-shadow:0_2px_4px_rgb(0_0_0/0.05),0_24px_48px_-12px_rgb(0_0_0/0.18)] sm:rounded-3xl sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex items-start gap-3 sm:flex-1 sm:gap-4">
          <Avatar name={l.display_name} />

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-extrabold tracking-tight text-stone-900 sm:text-lg">
              {l.display_name}
            </h2>
            {l.company_name && (
              <p className="text-xs font-medium text-stone-500 sm:text-sm">{l.company_name}</p>
            )}
            <div className="mt-1.5 flex flex-wrap gap-1.5 sm:mt-2">
              {l.categories.map((c) => (
                <Chip key={c.id}>{c.name}</Chip>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-stone-50 px-3.5 py-2 text-right sm:rounded-2xl sm:px-4 sm:py-2.5">
          <div className="text-lg font-extrabold tracking-tight text-stone-900 sm:text-xl">
            {Number(l.price).toLocaleString('mk-MK')}
            <span className="ml-1 text-xs font-semibold text-stone-500 sm:text-sm">{t('common.currency')}</span>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 sm:text-xs">
            {priceTypeLabel(l.price_type, t)}
          </div>
        </div>
      </div>

      <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-stone-600 sm:mt-3 sm:text-sm">
        <IconMapPin className="h-3.5 w-3.5 flex-shrink-0 text-amber-500 sm:h-4 sm:w-4" />
        {l.all_macedonia
          ? t('majstori.allMacedonia')
          : l.cities.map((c) => c.name).join(', ')}
      </p>

      {l.conditions && (
        <p className="mt-2 whitespace-pre-line rounded-xl bg-stone-50 px-3.5 py-2.5 text-xs leading-relaxed text-stone-700 sm:px-4 sm:py-3 sm:text-sm">
          {l.conditions}
        </p>
      )}

      {l.images.length > 0 && (
        <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 sm:mt-3">
          {l.images.map((img) => (
            <a key={img.id} href={img.url} target="_blank" rel="noreferrer" className="group/img">
              <img
                src={img.url}
                alt={t('majstori.previousWorkAlt')}
                className="h-16 w-16 flex-shrink-0 rounded-xl object-cover ring-1 ring-stone-200 transition-transform group-hover/img:scale-105 sm:h-20 sm:w-20"
              />
            </a>
          ))}
        </div>
      )}

      <div className="mt-3 sm:mt-4">
        {showPhone ? (
          <a
            href={`tel:${l.contact_phone.replace(/[\s/-]/g, '')}`}
            className="btn-glossy inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 active:scale-[0.97] sm:w-auto sm:px-5 sm:py-2.5 sm:text-sm"
          >
            <IconPhone className="h-4 w-4" />
            {l.contact_phone}
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

export default function Majstori() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [cityId, setCityId] = useState('');
  const [sort, setSort] = useState('newest');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [searchedCityId, setSearchedCityId] = useState('');

  useEffect(() => {
    api('/api/categories').then(setCategories).catch(() => {});
    api('/api/cities').then(setCities).catch(() => {});
    search(); // почетно вчитување: сите мајстори
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function search(catId = categoryId, ctId = cityId) {
    setLoading(true);
    const params = new URLSearchParams();
    if (catId) params.set('category_id', catId);
    if (ctId) params.set('city_id', ctId);
    api(`/api/listings?${params}`)
      .then((data) => {
        setListings(data);
        setSearched(true);
        setSearchedCityId(ctId);
      })
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }

  const sorted = useMemo(() => {
    const arr = [...listings];
    if (sort === 'cheap') arr.sort((a, b) => a.price - b.price);
    if (sort === 'expensive') arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [listings, sort]);

  const searchedCityName = useMemo(
    () => cities.find((c) => String(c.id) === String(searchedCityId))?.name || '',
    [cities, searchedCityId]
  );
  const showMap =
    !loading && searchedCityName && CITY_COORDS[searchedCityName] && sorted.length > 0;

  return (
    <div>
      {/* ===== Пребарувачки панел (Booking-стил) ===== */}
      <section className="bg-stone-950 pb-10 pt-6 sm:pb-16 sm:pt-10">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-3xl">
            {t('majstori.title')}
          </h1>
          <p className="mt-1 text-xs text-stone-400 sm:text-sm">
            {t('majstori.subtitle')}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              search();
            }}
            className="mt-4 grid gap-2 rounded-2xl bg-amber-400 p-2 shadow-2xl shadow-amber-500/20 sm:mt-5 sm:grid-cols-[1fr_1fr_auto]"
          >
            <Combobox
              options={categories}
              value={categoryId}
              onChange={setCategoryId}
              placeholder={t('majstori.categoryPlaceholder')}
              inputClassName={searchInputCls}
            />
            <Combobox
              options={cities}
              value={cityId}
              onChange={setCityId}
              placeholder={t('majstori.cityPlaceholder')}
              inputClassName={searchInputCls}
            />
            <button
              type="submit"
              className="btn-glossy flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-stone-800 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <IconSearch className="h-4 w-4 text-amber-400" />
              {t('majstori.searchButton')}
            </button>
          </form>
        </div>
      </section>

      {/* ===== Резултати ===== */}
      <section className="mx-auto -mt-6 max-w-4xl px-4 pb-10 sm:-mt-8 sm:pb-16">
        <div className="card-shadow flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-stone-200/70 bg-white px-4 py-3 sm:gap-3 sm:px-5 sm:py-3.5">
          <p className="text-xs font-semibold text-stone-700 sm:text-sm">
            {loading
              ? t('majstori.searching')
              : `${sorted.length} ${sorted.length === 1 ? t('majstori.countSingular') : t('majstori.countPlural')}`}
          </p>
          <select
            className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-400/30 sm:px-3"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">{t('majstori.sortNewest')}</option>
            <option value="cheap">{t('majstori.sortCheap')}</option>
            <option value="expensive">{t('majstori.sortExpensive')}</option>
          </select>
        </div>

        {showMap && (
          <div className="card-shadow mt-4 overflow-hidden rounded-2xl border border-stone-200/70 bg-white sm:mt-5 sm:rounded-3xl">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5 sm:py-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-stone-900 sm:text-sm">
                <IconMapPin className="h-4 w-4 text-amber-500" />
                {t('majstori.workersIn', { city: searchedCityName })}
              </p>
              <span className="text-[10px] font-medium text-stone-400 sm:text-xs">{t('majstori.approxLocations')}</span>
            </div>
            <CityMap cityName={searchedCityName} listings={sorted} />
          </div>
        )}

        <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
          {loading && (
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-stone-200/60 sm:h-40 sm:rounded-3xl" />
              ))}
            </div>
          )}

          {!loading && sorted.length === 0 && searched && (
            <div className="card-shadow rounded-2xl border border-stone-200/70 bg-white px-5 py-8 text-center sm:rounded-3xl sm:px-6 sm:py-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 sm:h-14 sm:w-14">
                <IconImage className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mt-3 text-base font-bold text-stone-900 sm:mt-4 sm:text-lg">
                {t('majstori.emptyTitle')}
              </h3>
              <p className="mx-auto mt-1.5 max-w-sm text-xs text-stone-500 sm:text-sm">
                {t('majstori.emptyText')}
              </p>
              <Link
                to={user?.role === 'client' ? '/novo-baranje' : '/registracija'}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 px-5 py-2.5 text-xs font-bold text-stone-900 shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 sm:mt-5 sm:px-6 sm:py-3 sm:text-sm"
              >
                <IconClipboard className="h-4 w-4" />
                {t('majstori.postRequest')}
              </Link>
            </div>
          )}

          {!loading && sorted.map((l) => <ListingCard key={l.id} l={l} />)}
        </div>

        {!loading && sorted.length > 0 && (
          <p className="mt-6 text-center text-xs text-stone-500 sm:mt-8 sm:text-sm">
            {t('majstori.notFoundPre')}{' '}
            <Link
              to={user?.role === 'client' ? '/novo-baranje' : '/registracija'}
              className="font-bold text-amber-600 hover:underline"
            >
              {t('majstori.notFoundLink')}
            </Link>{' '}
            {t('majstori.notFoundPost')}
          </p>
        )}
      </section>
    </div>
  );
}
