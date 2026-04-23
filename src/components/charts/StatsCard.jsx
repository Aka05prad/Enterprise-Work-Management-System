import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatsCard = ({ title, value, subtitle, icon: Icon, iconColor, trend, trendValue }) => {
  const trendConfig = {
    up:   { icon: TrendingUp,   color: 'text-green-600 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-900/30'  },
    down: { icon: TrendingDown, color: 'text-red-600 dark:text-red-400',      bg: 'bg-red-50 dark:bg-red-900/30'      },
    flat: { icon: Minus,        color: 'text-gray-500 dark:text-gray-400',    bg: 'bg-gray-50 dark:bg-gray-800'       },
  };
  const t = trendConfig[trend || 'flat'];
  const TrendIcon = t.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${iconColor || 'bg-primary-50 dark:bg-primary-900/30'}`}>
          {Icon && <Icon size={20} className={iconColor ? 'text-white' : 'text-primary-600 dark:text-primary-400'} />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${t.color} ${t.bg}`}>
            <TrendIcon size={12} />
            {trendValue}
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {value}
        </p>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;