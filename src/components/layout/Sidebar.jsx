import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, CheckSquare,
  Users, BarChart2, Settings, X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin','manager','employee'] },
  { to: '/projects',  icon: FolderKanban,    label: 'Projects',  roles: ['admin','manager','employee'] },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tasks',     roles: ['admin','manager','employee'] },
  { to: '/users',     icon: Users,           label: 'Users',     roles: ['admin'] },
  { to: '/analytics', icon: BarChart2,       label: 'Analytics', roles: ['admin','manager'] },
  { to: '/settings',  icon: Settings,        label: 'Settings',  roles: ['admin','manager','employee'] },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const visibleItems = navItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700 z-50
          flex flex-col transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar header */}
        {/* <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700"> */}
          {/* <div className="flex items-center gap-2 font-bold text-primary-600 text-lg">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">EW</span>
            </div>
            EWMS
          </div> */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
           <div className="flex items-center gap-3 font-semibold tracking-tight">
          <div className="
            w-9 h-9 rounded-xl
            bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500
            flex items-center justify-center
            text-white text-sm font-bold
            shadow-glow
          ">
            TF
          </div>

          <span className="text-lg gradient-text">
            TaskForge
          </span>
        </div>
          {/* <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <X size={16} />
          </button> */}
            <button
          onClick={onClose}
          className="
            p-1.5 rounded-xl
            text-slate-400
            hover:bg-white/20 dark:hover:bg-white/10
            transition-all duration-200
            lg:hidden
          "
        >
          <X size={16} />
        </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150
                ${isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;