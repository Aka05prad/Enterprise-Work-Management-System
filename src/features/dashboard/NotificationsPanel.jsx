import { useDispatch, useSelector } from 'react-redux';
import { Bell, AtSign, CheckSquare, FolderKanban, MessageSquare, Settings, X, CheckCheck } from 'lucide-react';
import { markNotificationRead, markAllRead, dismissNotification } from './dashboardSlice';
import { timeAgo } from '../../utils/formatDate';

const typeConfig = {
  mention: { icon: AtSign,          color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400' },
  task:    { icon: CheckSquare,      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'         },
  project: { icon: FolderKanban,     color: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'     },
  comment: { icon: MessageSquare,    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400' },
  system:  { icon: Settings,         color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'            },
};

const NotificationsPanel = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((s) => s.dashboard.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch(markAllRead())}
            className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            <CheckCheck size={13} />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700/60">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
            <Bell size={32} strokeWidth={1.5} />
            <p className="text-sm">All caught up!</p>
          </div>
        ) : (
          notifications.map((n) => {
            const cfg = typeConfig[n.type] || typeConfig.system;
            const NIcon = cfg.icon;
            return (
              <div
                key={n.id}
                onClick={() => dispatch(markNotificationRead(n.id))}
                className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors duration-150
                  ${n.read
                    ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    : 'bg-primary-50/60 dark:bg-primary-900/10 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                  }`}
              >
                {/* Icon */}
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${cfg.color}`}>
                  <NIcon size={14} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${n.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100 font-medium'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{timeAgo(n.time)}</p>
                </div>

                {/* Unread dot + dismiss */}
                <div className="shrink-0 flex flex-col items-end gap-2 ml-1">
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-primary-600 mt-1" />
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); dispatch(dismissNotification(n.id)); }}
                    className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;