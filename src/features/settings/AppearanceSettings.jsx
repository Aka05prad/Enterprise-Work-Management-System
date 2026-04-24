import { useThemeContext } from '../../context/ThemeContext';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const ACCENT_COLORS = [
  { name: 'indigo', label: 'Indigo',  hex: '#6366f1' },
  { name: 'blue',   label: 'Blue',    hex: '#3b82f6' },
  { name: 'violet', label: 'Violet',  hex: '#8b5cf6' },
  { name: 'rose',   label: 'Rose',    hex: '#f43f5e' },
  { name: 'teal',   label: 'Teal',    hex: '#14b8a6' },
  { name: 'amber',  label: 'Amber',   hex: '#f59e0b' },
  { name: 'green',  label: 'Green',   hex: '#22c55e' },
  { name: 'pink',   label: 'Pink',    hex: '#ec4899' },
];

const FONT_SIZES = [
  { id: 'sm',   label: 'Small',   preview: 'Aa' },
  { id: 'base', label: 'Default', preview: 'Aa' },
  { id: 'lg',   label: 'Large',   preview: 'Aa' },
];

const THEME_OPTIONS = [
  { id: 'light', label: 'Light',  icon: Sun   },
  { id: 'dark',  label: 'Dark',   icon: Moon  },
  { id: 'system',label: 'System', icon: Monitor },
];

const AppearanceSettings = () => {
  const { theme, setTheme, accentColor, setAccentColor, fontSize, setFontSize } = useThemeContext();

  const handleThemeChange = (t) => {
    if (t === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } else {
      setTheme(t);
    }
    toast.success(`Theme set to ${t}`);
  };

  const Section = ({ title, subtitle, children }) => (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Customize how EWMS looks for you.</p>
      </div>

      {/* Theme */}
      <Section title="Color theme" subtitle="Choose your preferred color scheme">
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {THEME_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleThemeChange(id)}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150
                ${(theme === id) || (id === 'light' && theme === 'light') || (id === 'dark' && theme === 'dark')
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }
              `}
            >
              <Icon size={22} className={theme === id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'} />
              <span className={`text-xs font-medium ${theme === id ? 'text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </Section>

      <div className="border-t border-gray-100 dark:border-gray-700" />

      {/* Accent color */}
      <Section title="Accent color" subtitle="Used for buttons, links, and highlights">
        <div className="flex flex-wrap gap-3">
          {ACCENT_COLORS.map(({ name, label, hex }) => (
            <button
              key={name}
              onClick={() => { setAccentColor(name); toast.success(`Accent set to ${label}`); }}
              title={label}
              className="relative w-9 h-9 rounded-full transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              style={{ backgroundColor: hex }}
            >
              {accentColor === name && (
                <Check size={16} className="absolute inset-0 m-auto text-white" strokeWidth={3} />
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Note: accent color change requires Tailwind customization to fully apply. Preview shows selection only.
        </p>
      </Section>

      <div className="border-t border-gray-100 dark:border-gray-700" />

      {/* Font size */}
      <Section title="Font size" subtitle="Adjust the base text size across the app">
        <div className="flex gap-3">
          {FONT_SIZES.map(({ id, label, preview }) => (
            <button
              key={id}
              onClick={() => { setFontSize(id); toast.success(`Font size set to ${label}`); }}
              className={`
                flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl border-2 transition-all duration-150
                ${fontSize === id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                }
              `}
            >
              <span
                className={`font-bold text-gray-800 dark:text-gray-200 ${
                  id === 'sm' ? 'text-sm' : id === 'lg' ? 'text-xl' : 'text-base'
                }`}
              >
                {preview}
              </span>
              <span className={`text-xs font-medium ${fontSize === id ? 'text-primary-700 dark:text-primary-300' : 'text-gray-500'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default AppearanceSettings;