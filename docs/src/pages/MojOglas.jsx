import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getToken } from '../api';
import { useLanguage } from '../LanguageContext';
import { STATIC_CATEGORIES, STATIC_CITIES } from '../staticData';
import {
  Field, inputCls, ErrorBox, SuccessBox, SubmitButton, priceTypeLabel,
  IconCheck, IconMapPin, IconImage,
} from '../components';

const PHONE_RE = /^[+]?[\d][\d\s/-]{6,14}$/;

export default function MojOglas() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState(STATIC_CATEGORIES);
  const [cities, setCities] = useState(STATIC_CITIES);
  const [existing, setExisting] = useState(null);

  const [categoryIds, setCategoryIds] = useState([]);
  const [allMacedonia, setAllMacedonia] = useState(false);
  const [cityIds, setCityIds] = useState([]);
  const [priceType, setPriceType] = useState('hourly');
  const [price, setPrice] = useState('');
  const [conditions, setConditions] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [images, setImages] = useState([]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api('/api/categories').then(setCategories).catch(() => {});
    api('/api/cities').then(setCities).catch(() => {});
    api('/api/listings/mine').then((listing) => {
      setExisting(listing);
      if (listing) {
        setCategoryIds(listing.categories.map((c) => c.id));
        setAllMacedonia(!!listing.all_macedonia);
        setCityIds(listing.cities.map((c) => c.id));
        setPriceType(listing.price_type);
        setPrice(String(listing.price));
        setConditions(listing.conditions || '');
        setDisplayName(listing.display_name);
        setCompanyName(listing.company_name || '');
        setPhone(listing.contact_phone);
      }
    }).catch(() => {});
  }, []);

  function toggle(list, setList, id) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (categoryIds.length === 0) {
      setError(t('mojOglas.categoryError'));
      return;
    }
    if (!allMacedonia && cityIds.length === 0) {
      setError(t('mojOglas.cityError'));
      return;
    }
    if (!PHONE_RE.test(phone.trim())) {
      setError(t('novoBaranje.phoneError'));
      return;
    }

    const fd = new FormData();
    fd.set('display_name', displayName);
    fd.set('company_name', companyName);
    fd.set('contact_phone', phone);
    fd.set('price_type', priceType);
    fd.set('price', price);
    fd.set('conditions', conditions);
    fd.set('all_macedonia', allMacedonia ? '1' : '0');
    fd.set('category_ids', JSON.stringify(categoryIds));
    fd.set('city_ids', JSON.stringify(cityIds));
    for (const file of images) fd.append('images', file);

    setLoading(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || t('mojOglas.genericError'));
      setSuccess(t('mojOglas.success'));
      setImages([]);
      api('/api/listings/mine').then(setExisting).catch(() => {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 sm:py-10">
      {existing && (
        <div className="card-shadow mb-4 rounded-2xl border border-emerald-200/70 bg-white p-3.5 sm:mb-5 sm:p-4">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:h-9 sm:w-9">
              <IconCheck className="h-4 w-4" />
            </span>
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-stone-900">
                {t('mojOglas.activeListing', { name: existing.display_name })}
              </p>
              <p className="mt-0.5 text-stone-500">
                {existing.categories.map((c) => c.name).join(', ')} ·{' '}
                {Number(existing.price).toLocaleString('mk-MK')} {t('common.currency')}{' '}
                {priceTypeLabel(existing.price_type, t)}
              </p>
              <Link to="/baranja" className="mt-1 inline-block font-bold text-amber-600 hover:underline">
                {t('mojOglas.viewRequests')}
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="card-shadow rounded-2xl border border-stone-200/70 bg-white p-5 sm:rounded-3xl sm:p-8">
        <h1 className="text-xl font-extrabold tracking-tight text-stone-900 sm:text-2xl">{t('mojOglas.title')}</h1>
        <p className="mt-1 text-xs text-stone-500 sm:text-sm">
          {t('mojOglas.subtitle')}
          {existing && t('mojOglas.replaceNotice')}
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
          <Field label={t('mojOglas.categoryLabel')} required>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => toggle(categoryIds, setCategoryIds, c.id)}
                  className={`flex items-center justify-between gap-1.5 rounded-xl border-2 px-2.5 py-2 text-left text-xs font-semibold transition-all sm:gap-2 sm:px-3.5 sm:py-2.5 sm:text-sm ${
                    categoryIds.includes(c.id)
                      ? 'border-amber-400 bg-amber-50 text-stone-900 shadow-md shadow-amber-400/15'
                      : 'border-stone-200 text-stone-600 hover:-translate-y-0.5 hover:border-stone-300'
                  }`}
                >
                  {c.name}
                  {categoryIds.includes(c.id) && (
                    <IconCheck className="h-3.5 w-3.5 flex-shrink-0 text-amber-500 sm:h-4 sm:w-4" />
                  )}
                </button>
              ))}
            </div>
          </Field>

          <Field label={t('mojOglas.areaLabel')} required>
            <button
              type="button"
              onClick={() => setAllMacedonia(!allMacedonia)}
              className={`mb-2 flex w-full items-center gap-2 rounded-xl border-2 px-3.5 py-2.5 text-xs font-bold transition-all sm:gap-2.5 sm:px-4 sm:py-3 sm:text-sm ${
                allMacedonia
                  ? 'border-amber-400 bg-amber-50 text-stone-900 shadow-md shadow-amber-400/15'
                  : 'border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              <IconMapPin className={`h-4 w-4 ${allMacedonia ? 'text-amber-500' : 'text-stone-400'}`} />
              {t('mojOglas.allMacedoniaButton')}
              {allMacedonia && <IconCheck className="ml-auto h-4 w-4 text-amber-500" />}
            </button>
            {!allMacedonia && (
              <div className="grid max-h-56 grid-cols-2 gap-1.5 overflow-y-auto rounded-xl border border-stone-200 p-2">
                {cities.map((c) => (
                  <label
                    key={c.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                      cityIds.includes(c.id)
                        ? 'bg-amber-50 text-stone-900'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-amber-500"
                      checked={cityIds.includes(c.id)}
                      onChange={() => toggle(cityIds, setCityIds, c.id)}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t('mojOglas.priceTypeLabel')} required>
              <select className={inputCls} value={priceType} onChange={(e) => setPriceType(e.target.value)}>
                <option value="hourly">{t('priceType.hourly')}</option>
                <option value="per_m2">{t('priceType.per_m2')}</option>
                <option value="flat">{t('priceType.flat')}</option>
              </select>
            </Field>
            <Field label={t('mojOglas.priceLabel')} required>
              <input
                type="number"
                min="1"
                className={inputCls}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={t('mojOglas.pricePlaceholder')}
                required
              />
            </Field>
          </div>

          <Field label={t('mojOglas.conditionsLabel')}>
            <textarea
              className={inputCls}
              rows={3}
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder={t('mojOglas.conditionsPlaceholder')}
            />
          </Field>

          <Field label={t('mojOglas.nameLabel')} required>
            <input
              type="text"
              className={inputCls}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </Field>

          <Field label={t('mojOglas.companyLabel')}>
            <input
              type="text"
              className={inputCls}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </Field>

          <Field label={t('field.contactPhone')} required>
            <input
              type="tel"
              className={inputCls}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="070 123 456"
              required
            />
          </Field>

          <Field
            label={t('mojOglas.imagesLabel')}
            hint={
              existing?.images?.length && images.length === 0
                ? t('mojOglas.imagesKeepHint', { count: existing.images.length })
                : t('mojOglas.imagesHint')
            }
          >
            {existing?.images?.length > 0 && images.length === 0 && (
              <div className="mb-2.5 flex gap-2 overflow-x-auto pb-1">
                {existing.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt=""
                    className="h-16 w-16 flex-shrink-0 rounded-lg object-cover ring-1 ring-stone-200"
                  />
                ))}
              </div>
            )}
            <label className="flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-stone-300 px-4 py-6 text-sm font-semibold text-stone-500 transition hover:border-amber-400 hover:bg-amber-50/50 hover:text-amber-700">
              <IconImage className="h-5 w-5" />
              {images.length > 0
                ? t('mojOglas.imagesSelected', { count: images.length })
                : t('mojOglas.imagesUpload')}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => setImages([...e.target.files].slice(0, 6))}
              />
            </label>
          </Field>

          <ErrorBox message={error} />
          <SuccessBox message={success} />
          <SubmitButton loading={loading}>{t('mojOglas.submit')}</SubmitButton>
        </form>
      </div>
    </div>
  );
}
