import Spinner from './Spinner';

const variants = {
  primary: `
    relative overflow-hidden
    text-white
    bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500
    shadow-glow
    hover:shadow-glow-lg
  `,

  secondary: `
    bg-white/70 dark:bg-slate-800/60
    backdrop-blur-md
    text-slate-700 dark:text-slate-200
    border border-white/30 dark:border-white/10
    hover:bg-white/90 dark:hover:bg-slate-700/60
  `,

  danger: `
    bg-gradient-to-r from-rose-500 to-red-600
    text-white
    shadow-md
    hover:shadow-lg
  `,

  ghost: `
    bg-transparent
    text-slate-600 dark:text-slate-400
    hover:bg-slate-100/60 dark:hover:bg-slate-800/60
  `,
};



const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-5 py-2 text-sm rounded-lg',
  lg: 'px-7 py-3 text-base rounded-xl',
};


const Button = ({
  children,
  variant = 'primary',
  type = 'button', 
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        dark:focus:ring-offset-slate-900
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-[1.03] active:scale-[0.97]
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {/* ✨ Shine effect (only for primary) */}
      {variant === 'primary' && (
        <span className="absolute inset-0 overflow-hidden rounded-inherit">
          <span className="absolute -left-full top-0 h-full w-1/2 bg-white/20 blur-md transform rotate-12 transition-all duration-700 group-hover:left-[120%]" />
        </span>
      )}

      {/* Loader */}
      {loading && <Spinner size="sm" />}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;