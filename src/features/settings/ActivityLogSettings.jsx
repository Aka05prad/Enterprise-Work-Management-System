import { useWebSocket } from '../../context/WebSocketContext';
import { useNotifications } from '../../context/NotificationsContext';
import { Zap, Activity, Trash2, RefreshCw } from 'lucide-react';
import { timeAgo } from '../../utils/formatDate';
import Button from '../../components/common/Button';

const TYPE_COLORS = {
  task_assigned:    'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
  task_completed:   'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
  project_update:   'text-violet-600 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-400',
  mention:          'text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400',
  deadline_warning: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
  new_member:       'text-teal-600 bg-teal-50 dark:bg-teal-900/20 dark:text-teal-400',
  comment:          'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',
  echo:             'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400',
};

const ActivityLogSettings = () => {
  const { eventLog, connected, connect, disconnect } = useWebSocket();
  const { notifications, clearAll } = useNotifications();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Real-time activity log</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Live stream of WebSocket events received this session.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={connected ? disconnect : connect}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              connected
                ? 'border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 hover:bg-green-100'
                : 'border-gray-200 text-gray-600 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50'
            }`}
          >
            {connected ? (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative rounded-full h-1.5 w-1.5 bg-green-500" />
                </span>
                Live
              </>
            ) : (
              <><RefreshCw size={11} /> Reconnect</>
            )}
          </button>
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Trash2 size={11} /> Clear log
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Events received', value: eventLog.length,                             icon: Zap,      color: 'text-primary-600' },
          { label: 'Notifications',   value: notifications.length,                        icon: Activity, color: 'text-blue-600'    },
          { label: 'Unread',          value: notifications.filter((n) => !n.read).length, icon: Activity, color: 'text-red-500'     },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
            <Icon size={18} className={`${color} mx-auto mb-1`} />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Event list */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
          <Activity size={15} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Event stream</h3>
          <span className="text-xs text-gray-400">({eventLog.length} total)</span>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-gray-700/50 max-h-96 overflow-y-auto">
          {eventLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
              <Zap size={28} strokeWidth={1.5} />
              <p className="text-sm">Waiting for events…</p>
              <p className="text-xs text-gray-300 dark:text-gray-600">
                {connected ? 'First event fires in ~12 seconds' : 'Connect to start receiving events'}
              </p>
            </div>
          ) : (
            eventLog.map((event, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide mt-0.5 ${TYPE_COLORS[event.type] || 'bg-gray-100 text-gray-500'}`}>
                  {event.type?.replace(/_/g, ' ')}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{event.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {event.sender && (
                      <span className="text-xs text-gray-400">from {event.sender}</span>
                    )}
                    <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                    <span className="text-xs text-gray-400">{timeAgo(event.receivedAt)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(TYPE_COLORS).slice(0, 7).map(([type, cls]) => (
          <span key={type} className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${cls}`}>
            {type.replace(/_/g, ' ')}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogSettings;