import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatsCard = ({ title, value, subtitle, icon: Icon, iconColor, trend, trendValue }) => {
  const trendConfig = {
    up:   { icon: TrendingUp,   color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    down: { icon: TrendingDown, color: 'text-rose-500',    bg: 'bg-rose-500/10' },
    flat: { icon: Minus,        color: 'text-slate-400',   bg: 'bg-slate-500/10' },
  };

  const t = trendConfig[trend || 'flat'];
  const TrendIcon = t.icon;

  return (
    <div className="glass card-hover p-5 flex flex-col gap-4 relative overflow-hidden">

      {/* 🌈 subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

      {/* Top Row */}
      <div className="flex items-start justify-between relative z-10">

        {/* Icon */}
        <div className={`p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-glow`}>
          {Icon && <Icon size={18} className="text-white" />}
        </div>

        {/* Trend */}
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${t.color} ${t.bg}`}>
            <TrendIcon size={12} />
            {trendValue}
          </div>
        )}
      </div>

      {/* Value Section */}
      <div className="relative z-10">
        <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </p>

        <p className="text-sm mt-1 text-slate-600 dark:text-slate-400">
          {title === "Projects" ? "Workspaces" : title === "Tasks" ? "Work Units" : title}
        </p>

        {subtitle && (
          <p className="text-xs text-slate-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;