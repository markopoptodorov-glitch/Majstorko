import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import {
  Field, inputCls, ErrorBox, SubmitButton, IconSearch, IconWrench, IconCheck,
} from '../components';

export default function Register() {
  const [params] = useSearchParams();
  const initialRole = params.get('uloga') === 'worker' ? 'worker' : 'client';
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(email, password, role);
      navigate(user.role === 'client' ? '/majstori' : '/moj-oglas');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:py-12">
      <div className="card-shadow rounded-2xl border border-stone-200/70 bg-white p-5 sm:rounded-3xl sm:p-8">
        <h1 className="text-xl font-extrabold tracking-tight text-stone-900 sm:text-2xl">{t('register.title')}</h1>
        <p className="mt-1 text-xs text-stone-500 sm:text-sm">{t('register.subtitle')}</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'client', icon: IconSearch, title: t('register.roleClientTitle'), sub: t('register.roleClientSub') },
              { value: 'worker', icon: IconWrench, title: t('register.roleWorkerTitle'), sub: t('register.roleWorkerSub') },
            ].map(({ value, icon: Icon, title, sub }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`group relative rounded-2xl border-2 p-4 text-center transition-all duration-200 ${
                  role === value
                    ? 'border-amber-400 bg-amber-50 shadow-lg shadow-amber-400/20'
                    : 'border-stone-200 hover:-translate-y-0.5 hover:border-stone-300'
                }`}
              >
                {role === value && (
                  <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-stone-900">
                    <IconCheck className="h-3 w-3" />
                  </span>
                )}
                <span
                  className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 ${
                    role === value
                      ? 'badge-3d bg-gradient-to-br from-stone-800 to-stone-950 text-amber-400'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-2 block text-sm font-bold text-stone-900">{title}</span>
                <span className="block text-xs font-medium text-stone-500">{sub}</span>
              </button>
            ))}
          </div>

          <Field label={t('field.email')} required>
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ime@primer.mk"
              required
            />
          </Field>

          <Field label={t('field.password')} required hint={t('field.passwordHint')}>
            <input
              type="password"
              className={inputCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </Field>

          <ErrorBox message={error} />
          <SubmitButton loading={loading}>{t('register.submit')}</SubmitButton>
        </form>

        <p className="mt-5 text-center text-sm text-stone-500">
          {t('register.haveAccount')}{' '}
          <Link to="/najava" className="font-bold text-amber-600 hover:underline">
            {t('register.loginLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
