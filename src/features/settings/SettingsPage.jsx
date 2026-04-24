import { useState } from 'react';
import { User, Lock, Palette, Bell, Activity } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import ProfileSettings      from './ProfileSettings';
import PasswordSettings     from './PasswordSettings';
import AppearanceSettings   from './AppearanceSettings';
import NotificationSettings from './NotificationSettings';
import ActivityLogSettings  from './ActivityLogSettings';

const TABS = [
  { id: 'profile',       label: 'Profile',       icon: User,     component: ProfileSettings      },
  { id: 'password',      label: 'Password',      icon: Lock,     component: PasswordSettings     },
  { id: 'appearance',    label: 'Appearance',    icon: Palette,  component: AppearanceSettings   },
  { id: 'notifications', label: 'Notifications', icon: Bell,     component: NotificationSettings },
  { id: 'activity',      label: 'Activity log',  icon: Activity, component: ActivityLogSettings  },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component;

  return (
    <PageWrapper title="Settings" subtitle="Manage your account, appearance, and preferences">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <nav className="lg:w-52 shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium
                  whitespace-nowrap transition-all duration-150 text-left
                  ${activeTab === id
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content panel */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 min-h-[500px]">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </PageWrapper>
  );
};

export default SettingsPage;