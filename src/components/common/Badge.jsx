const variants = {
  default: 'bg-slate-200/60 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300 border border-slate-300/40 dark:border-slate-600/40',

  primary: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
  
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  
  danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
  
  info: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20',
};

const Badge = ({ children, variant = 'default', className = '' }) => (
  <span
    className={`
      inline-flex items-center gap-1
      px-2.5 py-1
      rounded-full text-xs font-medium
      backdrop-blur-md
      transition-all duration-300
      hover:scale-105
      ${variants[variant]}
      ${className}
    `}
  >
    {/* subtle glow dot */}
    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse" />

    {children}
  </span>
);

export default Badge;