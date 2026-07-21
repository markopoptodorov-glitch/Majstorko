import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './LanguageContext';

/* ===== 3D наклон при movement на глушец (за картички) ===== */

const RESET_TILT = { transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)' };

export function useTilt(maxTilt = 7) {
  const ref = useRef(null);
  const [style, setStyle] = useState(RESET_TILT);

  function onMouseMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - py) * maxTilt * 2;
    setStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      '--glow-x': `${px * 100}%`,
      '--glow-y': `${py * 100}%`,
    });
  }

  function onMouseLeave() {
    setStyle(RESET_TILT);
  }

  return { ref, style, onMouseMove, onMouseLeave };
}

/* ===== Икони (lucide-стил, stroke SVG) ===== */

function Svg({ children, className = 'h-5 w-5' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IconSearch = ({ className }) => (
  <Svg className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Svg>
);

export const IconWrench = ({ className }) => (
  <Svg className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </Svg>
);

export const IconMapPin = ({ className }) => (
  <Svg className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);

export const IconCalendar = ({ className }) => (
  <Svg className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
);

export const IconPhone = ({ className }) => (
  <Svg className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

export const IconUser = ({ className }) => (
  <Svg className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Svg>
);

export const IconWallet = ({ className }) => (
  <Svg className={className}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </Svg>
);

export const IconCheck = ({ className }) => (
  <Svg className={className}>
    <path d="m20 6-11 11-5-5" />
  </Svg>
);

export const IconArrowRight = ({ className }) => (
  <Svg className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Svg>
);

export const IconPlus = ({ className }) => (
  <Svg className={className}>
    <path d="M5 12h14M12 5v14" />
  </Svg>
);

export const IconSparkles = ({ className }) => (
  <Svg className={className}>
    <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z" />
  </Svg>
);

export const IconShield = ({ className }) => (
  <Svg className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const IconLogOut = ({ className }) => (
  <Svg className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5M21 12H9" />
  </Svg>
);

export const IconImage = ({ className }) => (
  <Svg className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
  </Svg>
);

export const IconBriefcase = ({ className }) => (
  <Svg className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </Svg>
);

export const IconClipboard = ({ className }) => (
  <Svg className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </Svg>
);

export const IconX = ({ className }) => (
  <Svg className={className}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);

export const IconChevronDown = ({ className }) => (
  <Svg className={className}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

/* ===== Избор на јазик ===== */

export function LanguageSwitch() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center rounded-xl bg-stone-100 p-1 text-xs font-bold">
      {['mk', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`rounded-lg px-2.5 py-1.5 uppercase transition-all ${
            lang === code
              ? 'bg-stone-950 text-amber-400 shadow'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

/* ===== Combobox: пишувај или избери од листа ===== */

export function Combobox({ options, value, onChange, placeholder, inputClassName }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(null); // null = прикажи го избраното
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef(null);

  const selected = options.find((o) => String(o.id) === String(value));
  const text = query !== null ? query : selected?.name || '';
  const q = (query || '').trim().toLowerCase();
  const filtered = q ? options.filter((o) => o.name.toLowerCase().includes(q)) : options;
  const activeHighlight = Math.min(highlight, filtered.length - 1);

  function commit(option) {
    onChange(option ? String(option.id) : '');
    setQuery(null);
    setOpen(false);
  }

  // Затвори при клик надвор; ако напишаното точно одговара на опција — избери ја
  useEffect(() => {
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        if (query !== null) {
          const exact = options.find((o) => o.name.toLowerCase() === query.trim().toLowerCase());
          if (exact) onChange(String(exact.id));
          else if (query.trim() === '') onChange('');
        }
        setQuery(null);
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [query, options, onChange]);

  function onKeyDown(e) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeHighlight]) commit(filtered[activeHighlight]);
    } else if (e.key === 'Escape') {
      setQuery(null);
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        className={`${inputClassName || inputCls} pr-16`}
        value={text}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setHighlight(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
      />
      <div className="absolute inset-y-0 right-2.5 flex items-center gap-0.5">
        {(selected || text) && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              commit(null);
            }}
            className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
            title={t('combobox.clear')}
          >
            <IconX className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen((o) => !o)}
          className="rounded-full p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
        >
          <IconChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <ul className="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-stone-200/80 bg-white p-1.5 shadow-2xl shadow-stone-900/15">
          {filtered.length === 0 && (
            <li className="px-3.5 py-2.5 text-sm font-medium text-stone-400">
              {t('combobox.noResults', { query })}
            </li>
          )}
          {filtered.map((o, i) => (
            <li key={o.id}>
              <button
                type="button"
                onMouseEnter={() => setHighlight(i)}
                onClick={() => commit(o)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${
                  i === activeHighlight ? 'bg-amber-50 text-stone-900' : 'text-stone-600'
                }`}
              >
                {o.name}
                {String(o.id) === String(value) && (
                  <IconCheck className="h-4 w-4 text-amber-500" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ===== Стилизирани примитиви ===== */

export const inputCls =
  'w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm transition focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/15';

export function Field({ label, required, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-stone-700">
        {label} {required && <span className="text-amber-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-stone-500">{hint}</span>}
    </label>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {message}
    </div>
  );
}

export function SuccessBox({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
      <IconCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
      {message}
    </div>
  );
}

export function SubmitButton({ children, loading }) {
  const { t } = useLanguage();
  return (
    <button
      type="submit"
      disabled={loading}
      className="btn-glossy group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 px-4 py-3.5 text-sm font-bold text-stone-900 shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/40 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {loading ? t('submitButton.loading') : children}
      {!loading && (
        <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      )}
    </button>
  );
}

export function Chip({ children }) {
  return (
    <span className="rounded-full border border-amber-200/60 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
      {children}
    </span>
  );
}

export function Avatar({ name }) {
  const initials = (name || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <div className="badge-3d flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-stone-800 to-stone-950 text-base font-bold text-amber-400 shadow-lg shadow-stone-900/20 transition-transform duration-300 hover:scale-105 hover:-rotate-3 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-lg">
      {initials}
    </div>
  );
}

export function priceTypeLabel(type, t) {
  return t(`priceType.${type}`);
}

export function formatBudget(from, to, t) {
  const fmt = (n) => Number(n).toLocaleString('mk-MK');
  const currency = t('common.currency');
  return to ? `${fmt(from)} – ${fmt(to)} ${currency}` : `${fmt(from)} ${currency}`;
}

export function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}.${m}.${y}`;
}
