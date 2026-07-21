import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import { Field, inputCls, ErrorBox, SubmitButton } from '../components';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'client' ? '/majstori' : '/baranja');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:py-12">
      <div className="card-shadow rounded-2xl border border-stone-200/70 bg-white p-5 sm:rounded-3xl sm:p-8">
        <h1 className="text-xl font-extrabold tracking-tight text-stone-900 sm:text-2xl">{t('login.title')}</h1>
        <p className="mt-1 text-xs text-stone-500 sm:text-sm">{t('login.subtitle')}</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field label={t('field.email')} required>
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field label={t('field.password')} required>
            <input
              type="password"
              className={inputCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          <ErrorBox message={error} />
          <SubmitButton loading={loading}>{t('login.submit')}</SubmitButton>
        </form>

        <p className="mt-5 text-center text-sm text-stone-500">
          {t('login.noAccount')}{' '}
          <Link to="/registracija" className="font-bold text-amber-600 hover:underline">
            {t('login.registerLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
