import { useSelector } from 'react-redux';
import { Activity } from 'lucide-react';
import { timeAgo } from '../../utils/formatDate';

const ActivityFeed = () => {
  const activity = useSelector((s) => s.dashboard.activity);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <Activity size={18} className="text-gray-600 dark:text-gray-400" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Recent activity</h3>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <ol className="relative border-l border-gray-200 dark:border-gray-700 space-y-0">
          {activity.map((item, idx) => (
            <li key={item.id} className="mb-5 ml-5">
              {/* Avatar dot */}
              <span className={`absolute -left-3.5 flex items-center justify-center w-7 h-7 rounded-full ring-2 ring-white dark:ring-gray-800 ${item.color} text-white text-xs font-bold`}>
                {item.avatar}
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {item.user}
                  </span>{' '}
                  <span className="text-gray-500 dark:text-gray-400">{item.action}</span>{' '}
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    {item.target}
                  </span>
                </p>
                <time className="text-xs text-gray-400 dark:text-gray-500">
                  {timeAgo(item.time)}
                </time>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default ActivityFeed;