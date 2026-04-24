import { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, X, Zap } from 'lucide-react';
import { useNotifications } from '../../context/NotificationsContext';
import { timeAgo } from '../../utils/formatDate';

const TYPE_STYLES = {
  task_assigned:    'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  task_completed:   'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
  project_update:   'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400',
  mention:          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  deadline_warning: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
  new_member:       'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400',
  comment:          'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400',
  echo:             'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  default:          'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

const NotificationsDropdown = () => {
  const { notifications, unreadCount, markRead, markAllRead, dismiss, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-gray-600 dark:text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary-600 text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  title="Mark all as read"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <CheckCheck size={14} />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  title="Clear all"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-96 divide-y divide-gray-50 dark:divide-gray-700/50">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                <Bell size={32} strokeWidth={1.5} />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs text-gray-300 dark:text-gray-600 flex items-center gap-1">
                  <Zap size={10} /> Real-time events will appear here
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`
                    flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
                    ${n.read
                      ? 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                      : 'bg-primary-50/70 dark:bg-primary-900/10 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                    }
                  `}
                >
                  {/* Type dot */}
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-primary-500'}`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${n.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100 font-medium'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {n.sender && (
                        <span className="text-xs text-gray-400">{n.sender}</span>
                      )}
                      <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                      <span className="text-xs text-gray-400">{timeAgo(n.time)}</span>
                      {n.source === 'realtime' && (
                        <>
                          <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                          <span className="flex items-center gap-0.5 text-[10px] text-green-500 font-medium">
                            <Zap size={9} /> live
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                    className="p-1 rounded text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition-colors shrink-0 mt-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 text-center">
              <span className="text-xs text-gray-400">
                {notifications.length} total · {unreadCount} unread
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;