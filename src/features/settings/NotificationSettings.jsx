import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNotifications } from '../../context/NotificationsContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { Bell, Mail, Smartphone, Volume2, VolumeX, Zap, WifiOff } from 'lucide-react';
import Button from '../../components/common/Button';

const Toggle = ({ checked, onChange, label, description, icon: Icon }) => (
  <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mt-0.5">
          <Icon size={15} className="text-gray-600 dark:text-gray-400" />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 mt-0.5
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}
      `}
    >
      <span className={`
        absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
        transition-transform duration-200
        ${checked ? 'translate-x-5' : 'translate-x-0'}
      `} />
    </button>
  </div>
);

const NotificationSettings = () => {
  const { soundEnabled, toggleSound } = useNotifications();
  const { connected, connect, disconnect } = useWebSocket();

  const [prefs, setPrefs] = useState({
    emailTaskAssigned:   true,
    emailTaskCompleted:  false,
    emailProjectUpdates: true,
    emailWeeklyDigest:   true,
    pushMentions:        true,
    pushDeadlines:       true,
    pushComments:        false,
    inAppAll:            true,
  });

  const toggle = (key) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    toast.success('Notification preference saved');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Notification preferences</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Control when and how you receive notifications.</p>
      </div>

      {/* Real-time connection control */}
      <div className={`p-4 rounded-xl border-2 ${connected ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30'}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${connected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-200 dark:bg-gray-600'}`}>
              {connected ? <Zap size={16} className="text-green-600" /> : <WifiOff size={16} className="text-gray-500" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Real-time updates {connected ? '— Live' : '— Disconnected'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {connected
                  ? 'Receiving live task, project, and team events via WebSocket'
                  : 'Connect to receive live updates from your team'
                }
              </p>
            </div>
          </div>
          <Button
            variant={connected ? 'danger' : 'primary'}
            size="sm"
            onClick={connected ? disconnect : connect}
          >
            {connected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>

        {connected && (
          <div className="mt-3 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              WebSocket simulation active — events fire every 12–130s
            </span>
          </div>
        )}
      </div>

      {/* Sound */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <Toggle
          checked={soundEnabled}
          onChange={toggleSound}
          label="Notification sounds"
          description="Play a sound when new notifications arrive"
          icon={soundEnabled ? Volume2 : VolumeX}
        />
      </div>

      {/* In-app */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4">
        <div className="flex items-center gap-2 py-3 border-b border-gray-100 dark:border-gray-700">
          <Bell size={15} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">In-app notifications</h3>
        </div>
        <Toggle checked={prefs.inAppAll} onChange={() => toggle('inAppAll')} label="All in-app notifications" description="Show toast alerts and notification badge" />
      </div>

      {/* Email */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4">
        <div className="flex items-center gap-2 py-3 border-b border-gray-100 dark:border-gray-700">
          <Mail size={15} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Email notifications</h3>
        </div>
        <Toggle checked={prefs.emailTaskAssigned}   onChange={() => toggle('emailTaskAssigned')}   label="Task assigned to you"     description="Get an email when a task is assigned to you" />
        <Toggle checked={prefs.emailTaskCompleted}  onChange={() => toggle('emailTaskCompleted')}  label="Task completed"           description="When tasks you created are completed" />
        <Toggle checked={prefs.emailProjectUpdates} onChange={() => toggle('emailProjectUpdates')} label="Project status changes"   description="When a project's status or phase changes" />
        <Toggle checked={prefs.emailWeeklyDigest}   onChange={() => toggle('emailWeeklyDigest')}   label="Weekly digest"           description="Summary of your work every Monday" />
      </div>

      {/* Push */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4">
        <div className="flex items-center gap-2 py-3 border-b border-gray-100 dark:border-gray-700">
          <Smartphone size={15} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Push notifications</h3>
        </div>
        <Toggle checked={prefs.pushMentions}  onChange={() => toggle('pushMentions')}  label="Mentions"       description="When someone @mentions you" />
        <Toggle checked={prefs.pushDeadlines} onChange={() => toggle('pushDeadlines')} label="Deadline alerts" description="48h and 24h before task due dates" />
        <Toggle checked={prefs.pushComments}  onChange={() => toggle('pushComments')}  label="Comments"       description="New comments on your tasks" />
      </div>
    </div>
  );
};

export default NotificationSettings;