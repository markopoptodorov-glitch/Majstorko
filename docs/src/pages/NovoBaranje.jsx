import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useLanguage } from '../LanguageContext';
import { Field, inputCls, ErrorBox, SuccessBox, SubmitButton, IconSearch } from '../components';

const PHONE_RE = /^[+]?[\d][\d\s/-]{6,14}$/;

export default function NovoBaranje() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    category_id: '',
    city_id: '',
    budget_from: '',
    budget_to: '',
    preferred_date: '',
    description: '',
    contact_name: '',
    contact_phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api('/api/categories').then(setCategories).catch(() => {});
    api('/api/cities').then(setCities).catch(() => {});
  }, []);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!PHONE_RE.test(form.contact_phone.trim())) {
      setError(t('novoBaranje.phoneError'));
      return;
    }
    if (form.budget_to && Number(form.budget_to) < Number(form.budget_from)) {
      setError(t('novoBaranje.budgetError'));
      return;
    }

    setLoading(true);
    try {
      await api('/api/requests', { method: 'POST', body: form });
      setSuccess(t('novoBaranje.success'));
      setForm({
        category_id: '', city_id: '', budget_from: '', budget_to: '',
        preferred_date: '', description: '', contact_name: '', contact_phone: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-lg px-4 py-6 sm:py-10">
      <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-amber-200/70 bg-amber-50 px-3.5 py-3 sm:mb-5 sm:gap-3 sm:px-4 sm:py-3.5">
        <IconSearch className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
        <p className="text-xs leading-relaxed text-amber-900 sm:text-sm">
          {t('novoBaranje.infoBannerPre')}{' '}
          <Link to="/majstori" className="font-bold underline">
            {t('novoBaranje.infoBannerLink')}
          </Link>{' '}
          {t('novoBaranje.infoBannerPost')}
        </p>
      </div>

      <div className="card-shadow rounded-2xl border border-stone-200/70 bg-white p-5 sm:rounded-3xl sm:p-8">
        <h1 className="text-xl font-extrabold tracking-tight text-stone-900 sm:text-2xl">{t('novoBaranje.title')}</h1>
        <p className="mt-1 text-xs text-stone-500 sm:text-sm">
          {t('novoBaranje.subtitle')}
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
          <Field label={t('novoBaranje.categoryLabel')} required>
            <select
              className={inputCls}
              value={form.category_id}
              onChange={(e) => set('category_id', e.target.value)}
              required
            >
              <option value="">{t('novoBaranje.categoryPlaceholder')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>

          <Field label={t('novoBaranje.cityLabel')} required>
            <select
              className={inputCls}
              value={form.city_id}
              onChange={(e) => set('city_id', e.target.value)}
              required
            >
              <option value="">{t('novoBaranje.cityPlaceholder')}</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t('novoBaranje.budgetFromLabel')} required>
              <input
                type="number"
                min="1"
                className={inputCls}
                value={form.budget_from}
                onChange={(e) => set('budget_from', e.target.value)}
                placeholder={t('novoBaranje.budgetFromPlaceholder')}
                required
              />
            </Field>
            <Field label={t('novoBaranje.budgetToLabel')} hint={t('novoBaranje.budgetToHint')}>
              <input
                type="number"
                min="1"
                className={inputCls}
                value={form.budget_to}
                onChange={(e) => set('budget_to', e.target.value)}
                placeholder={t('novoBaranje.budgetToPlaceholder')}
              />
            </Field>
          </div>

          <Field label={t('novoBaranje.dateLabel')} required>
            <input
              type="date"
              className={inputCls}
              min={today}
              value={form.preferred_date}
              onChange={(e) => set('preferred_date', e.target.value)}
              required
            />
          </Field>

          <Field label={t('novoBaranje.descriptionLabel')}>
            <textarea
              className={inputCls}
              rows={4}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder={t('novoBaranje.descriptionPlaceholder')}
            />
          </Field>

          <Field label={t('novoBaranje.nameLabel')} required>
            <input
              type="text"
              className={inputCls}
              value={form.contact_name}
              onChange={(e) => set('contact_name', e.target.value)}
              required
            />
          </Field>

          <Field label={t('field.contactPhone')} required>
            <input
              type="tel"
              className={inputCls}
              value={form.contact_phone}
              onChange={(e) => set('contact_phone', e.target.value)}
              placeholder="070 123 456"
              required
            />
          </Field>

          <ErrorBox message={error} />
          <SuccessBox message={success} />
          {success && (
            <p className="text-center text-sm">
              <Link to="/moi-baranja" className="font-bold text-amber-600 hover:underline">
                {t('novoBaranje.viewMyRequests')}
              </Link>
            </p>
          )}
          <SubmitButton loading={loading}>{t('novoBaranje.submit')}</SubmitButton>
        </form>
      </div>
    </div>
  );
}
