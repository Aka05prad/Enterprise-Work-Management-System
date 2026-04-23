import { useSelector } from 'react-redux';

const CompletionRing = () => {
  const { completedTasks, totalTasks } = useSelector((s) => s.dashboard.metrics);
  const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // SVG ring math
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col items-center justify-center gap-3">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm self-start">
        Completion rate
      </h3>

      <div className="relative flex items-center justify-center">
        <svg width="140" height="140" className="-rotate-90">
          {/* Track */}
          <circle cx="70" cy="70" r={r} fill="none" stroke="currentColor"
            strokeWidth="10" className="text-gray-100 dark:text-gray-700" />
          {/* Progress */}
          <circle
            cx="70" cy="70" r={r} fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="10"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{pct}%</span>
          <span className="text-xs text-gray-400">done</span>
        </div>
      </div>

      <div className="w-full flex justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
        <span><span className="font-semibold text-gray-800 dark:text-gray-200">{completedTasks}</span> completed</span>
        <span><span className="font-semibold text-gray-800 dark:text-gray-200">{totalTasks - completedTasks}</span> remaining</span>
      </div>
    </div>
  );
};

export default CompletionRing;