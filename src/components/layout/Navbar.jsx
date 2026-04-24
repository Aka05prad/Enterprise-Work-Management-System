// import { Bell, Menu, Moon, Sun, LogOut, User } from 'lucide-react';
// import { useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { useTheme } from '../../hooks/useTheme';
// import Badge from '../common/Badge';
// import { useSelector, useDispatch } from 'react-redux';
// import { markAllRead } from '../../features/dashboard/dashboardSlice';

// const Navbar = ({ onMenuClick }) => {
//   const { user, logout, isAdmin } = useAuth();
//   const { theme, toggleTheme } = useTheme();
//   const notifications = useSelector((s) => s.dashboard?.notifications || []);
// const unreadCount = notifications.filter((n) => !n.read).length;
// const dispatch = useDispatch();
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const roleColors = { admin: 'danger', manager: 'warning', employee: 'info' };

//   return (
//     <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-4 sticky top-0 z-30">
//       {/* Hamburger (mobile) */}
//      <button
//   onClick={() => dispatch(markAllRead())}
//   className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//   title="Mark all notifications as read"
// >
//   <Bell size={18} />
//   {unreadCount > 0 && (
//     <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
//       {unreadCount}
//     </span>
//   )}
// </button>

//       {/* Brand */}
//       <div className="flex items-center gap-2 font-bold text-primary-600 text-lg tracking-tight">
//         <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
//           <span className="text-white text-xs font-bold">EW</span>
//         </div>
//         <span className="hidden sm:block">EWMS</span>
//       </div>

//       <div className="flex-1" />

//       {/* Right controls */}
//       <div className="flex items-center gap-2">
//         {/* Theme toggle */}
//         <button
//           onClick={toggleTheme}
//           className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//           title="Toggle theme"
//         >
//           {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
//         </button>

//         {/* Notifications */}
//         <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
//           <Bell size={18} />
//           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
//         </button>

//         {/* User avatar dropdown */}
//         <div className="relative">
//           <button
//             onClick={() => setDropdownOpen((o) => !o)}
//             className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//           >
//             <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
//               {user?.name?.[0]?.toUpperCase() || 'U'}
//             </div>
//             <div className="hidden md:block text-left">
//               <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">
//                 {user?.name}
//               </p>
//               <Badge variant={roleColors[user?.role] || 'default'}>
//                 {user?.role}
//               </Badge>
//             </div>
//           </button>

//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
//               <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
//                 <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.name}</p>
//                 <p className="text-xs text-gray-500 truncate">{user?.email}</p>
//               </div>
//               <button
//                 onClick={() => { setDropdownOpen(false); logout(); }}
//                 className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
//               >
//                 <LogOut size={15} />
//                 Sign out
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

import { useState } from 'react';
import { Menu, Moon, Sun, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../context/ThemeContext';
import Badge from '../common/Badge';
import NotificationsDropdown from './NotificationsDropdown';
import ConnectionBadge from '../common/ConnectionBadge';

const roleColors = { admin: 'danger', manager: 'warning', employee: 'info' };

const Navbar = ({ onMenuClick }) => {
  const navigate                    = useNavigate();
  const { user, logout }            = useAuth();
  const { theme, toggleTheme }      = useThemeContext();
  const [dropdownOpen, setDropdown] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-3 sticky top-0 z-30">
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2 font-bold text-primary-600 text-lg tracking-tight">
        <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">EW</span>
        </div>
        <span className="hidden sm:block">EWMS</span>
      </div>

      <div className="flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-1.5">
        {/* Live connection badge */}
        <ConnectionBadge />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Live notifications dropdown */}
        <NotificationsDropdown />

        {/* User avatar + dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdown((o) => !o)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">
                {user?.name}
              </p>
              <Badge variant={roleColors[user?.role] || 'default'} className="text-[10px]">
                {user?.role}
              </Badge>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
              <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { setDropdown(false); navigate('/settings'); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings size={14} /> Settings
              </button>
              <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
              <button
                onClick={() => { setDropdown(false); logout(); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;