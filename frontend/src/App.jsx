import { Routes, Route, Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { IconWrench, IconLogOut, LanguageSwitch } from './components';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import NovoBaranje from './pages/NovoBaranje';
import Majstori from './pages/Majstori';
import MojOglas from './pages/MojOglas';
import Baranja from './pages/Baranja';
import MoiBaranja from './pages/MoiBaranja';

function RequireAuth({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/najava" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

const navCls = ({ isActive }) =>
  `rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-sm ${
    isActive
      ? 'bg-stone-950 text-amber-400 shadow-lg shadow-stone-900/20'
      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
  }`;

function Nav() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-2 gap-y-1.5 px-3 py-2.5 sm:px-4 sm:py-3">
        <Link to="/" className="group flex items-center gap-2">
          <span className="badge-3d flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-stone-800 to-stone-950 text-amber-400 shadow-lg shadow-stone-900/20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 sm:h-9 sm:w-9 sm:rounded-xl">
            <IconWrench className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
          </span>
          <span className="text-base font-extrabold tracking-tight text-stone-900 sm:text-lg">
            {t('brand.name')}
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 sm:gap-1">
          {user?.role === 'client' && (
            <>
              <NavLink to="/majstori" className={navCls}>{t('nav.search')}</NavLink>
              <NavLink to="/novo-baranje" className={navCls}>{t('nav.postRequest')}</NavLink>
              <NavLink to="/moi-baranja" className={navCls}>{t('nav.myRequests')}</NavLink>
            </>
          )}
          {user?.role === 'worker' && (
            <>
              <NavLink to="/baranja" className={navCls}>{t('nav.requests')}</NavLink>
              <NavLink to="/moj-oglas" className={navCls}>{t('nav.myListing')}</NavLink>
            </>
          )}
          {!user && (
            <>
              <NavLink to="/majstori" className={navCls}>{t('nav.search')}</NavLink>
              <NavLink to="/najava" className={navCls}>{t('nav.login')}</NavLink>
              <NavLink
                to="/registracija"
                className="btn-glossy ml-0.5 rounded-lg bg-gradient-to-b from-amber-400 to-amber-500 px-3 py-1.5 text-xs font-bold text-stone-900 shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/40 active:scale-[0.97] sm:ml-1 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
              >
                {t('nav.register')}
              </NavLink>
            </>
          )}
          {user && (
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title={t('nav.logout')}
              className="ml-0.5 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-500 transition hover:bg-red-50 hover:text-red-600 sm:ml-1 sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-sm"
            >
              <IconLogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t('nav.logout')}</span>
            </button>
          )}
          <span className="ml-0.5 sm:ml-1">
            <LanguageSwitch />
          </span>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/registracija" element={<Register />} />
          <Route path="/najava" element={<Login />} />
          <Route path="/majstori" element={<Majstori />} />
          <Route
            path="/novo-baranje"
            element={
              <RequireAuth role="client">
                <NovoBaranje />
              </RequireAuth>
            }
          />
          <Route
            path="/moi-baranja"
            element={
              <RequireAuth role="client">
                <MoiBaranja />
              </RequireAuth>
            }
          />
          <Route
            path="/moj-oglas"
            element={
              <RequireAuth role="worker">
                <MojOglas />
              </RequireAuth>
            }
          />
          <Route
            path="/baranja"
            element={
              <RequireAuth role="worker">
                <Baranja />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-stone-200/70 bg-white py-6 sm:py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 text-center">
          <span className="text-sm font-extrabold tracking-tight text-stone-900">
            {t('brand.name')}
          </span>
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} — {t('footer.tagline')}
          </p>
        </div>
      </footer>
    </div>
  );
}
