import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus, Search, Users, ShieldCheck,
  MoreVertical, Edit2, Eye, Trash2,
  UserCheck, UserX, Filter,
} from 'lucide-react';
import { fetchUsers, deleteUser, changeUserStatus } from './usersSlice';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import UserFormModal from './UserFormModal';
import UserDetailModal from './UserDetailModal';
import { timeAgo, formatDate } from '../../utils/formatDate';
import { useDebounce } from '../../hooks/useDebounce';
import { toast } from 'react-toastify';

const roleBadge   = { admin: 'danger', manager: 'warning', employee: 'info' };
const statusBadge = { active: 'success', inactive: 'default', suspended: 'danger' };
const STATUS_DOT  = { active: 'bg-green-500', inactive: 'bg-gray-400', suspended: 'bg-red-500' };

const ROLE_FILTERS   = ['all', 'admin', 'manager', 'employee'];
const STATUS_FILTERS = ['all', 'active', 'inactive', 'suspended'];

const UsersPage = () => {
  const dispatch = useDispatch();
  const { list: users, loading } = useSelector((s) => s.users);

  const [search,       setSearch]       = useState('');
  const [roleFilter,   setRoleFilter]   = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy,       setSortBy]       = useState('name');
  const [formOpen,     setFormOpen]     = useState(false);
  const [detailOpen,   setDetailOpen]   = useState(false);
  const [editingUser,  setEditingUser]  = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuOpen,     setMenuOpen]     = useState(null); // user id
  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => { dispatch(fetchUsers()); }, []);

  // ── Derived stats ─────────────────────────────────────────────────────────
  const stats = {
    total:    users.length,
    active:   users.filter((u) => u.status === 'active').length,
    admins:   users.filter((u) => u.role === 'admin').length,
    managers: users.filter((u) => u.role === 'manager').length,
  };

  // ── Filtering & sorting ───────────────────────────────────────────────────
  const filtered = users
    .filter((u) => {
      const q = debouncedSearch.toLowerCase();
      const matchSearch = u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q);
      const matchRole   = roleFilter   === 'all' || u.role   === roleFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name')       return a.name.localeCompare(b.name);
      if (sortBy === 'joined')     return new Date(b.joinedAt) - new Date(a.joinedAt);
      if (sortBy === 'lastActive') return new Date(b.lastActive) - new Date(a.lastActive);
      if (sortBy === 'tasks')      return b.tasksCompleted - a.tasksCompleted;
      return 0;
    });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEdit = (u) => {
    setEditingUser(u);
    setMenuOpen(null);
    setFormOpen(true);
  };

  const handleView = (u) => {
    setSelectedUser(u);
    setMenuOpen(null);
    setDetailOpen(true);
  };

  const handleDelete = async (u) => {
    setMenuOpen(null);
    if (!window.confirm(`Delete ${u.name}?`)) return;
    await dispatch(deleteUser(u.id));
    toast.success('User deleted');
  };

  const handleStatusToggle = async (u, status) => {
    setMenuOpen(null);
    await dispatch(changeUserStatus({ id: u.id, status }));
    toast.success(`User ${status}`);
  };

  const pill = (val, current, set) => (
    <button
      key={val}
      onClick={() => set(val)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
        current === val
          ? 'bg-primary-600 text-white'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'
      }`}
    >
      {val}
    </button>
  );

  return (
    <PageWrapper
      title="User management"
      subtitle="Admin-only — manage team members, roles, and access"
      actions={
        <Button onClick={() => { setEditingUser(null); setFormOpen(true); }}>
          <Plus size={16} /> Add user
        </Button>
      }
    >
      {/* ── Summary cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total members', value: stats.total,    icon: Users,      color: 'bg-violet-500' },
          { label: 'Active',        value: stats.active,   icon: UserCheck,  color: 'bg-green-500'  },
          { label: 'Admins',        value: stats.admins,   icon: ShieldCheck,color: 'bg-red-500'    },
          { label: 'Managers',      value: stats.managers, icon: Users,      color: 'bg-blue-500'   },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search + filters ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, department…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="name">Sort: Name</option>
            <option value="joined">Sort: Joined</option>
            <option value="lastActive">Sort: Last active</option>
            <option value="tasks">Sort: Tasks done</option>
          </select>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-medium">Role:</span>
          {ROLE_FILTERS.map((f) => pill(f, roleFilter, setRoleFilter))}
          <span className="text-xs text-gray-400 font-medium ml-2">Status:</span>
          {STATUS_FILTERS.map((f) => pill(f, statusFilter, setStatusFilter))}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      {loading ? (
        <Spinner size="lg" className="h-64" />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <Filter size={32} strokeWidth={1.5} />
          <p className="text-sm">No users match your filters</p>
          <Button variant="secondary" size="sm" onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all'); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table header */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  {['Member', 'Role', 'Department', 'Status', 'Last active', 'Tasks', 'Joined', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                    onClick={() => handleView(user)}
                  >
                    {/* Member */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <Badge variant={roleBadge[user.role]}>{user.role}</Badge>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {user.department}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${STATUS_DOT[user.status]}`} />
                        <Badge variant={statusBadge[user.status]}>{user.status}</Badge>
                      </div>
                    </td>

                    {/* Last active */}
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                      {timeAgo(user.lastActive)}
                    </td>

                    {/* Tasks */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {user.tasksCompleted}/{user.tasksAssigned}
                        </span>
                        <div className="w-14 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-600 rounded-full"
                            style={{
                              width: user.tasksAssigned > 0
                                ? `${Math.round((user.tasksCompleted / user.tasksAssigned) * 100)}%`
                                : '0%',
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                      {formatDate(user.joinedAt)}
                    </td>

                    {/* Actions kebab */}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <MoreVertical size={15} />
                        </button>

                        {menuOpen === user.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                            <button onClick={() => handleView(user)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <Eye size={13} /> View profile
                            </button>
                            <button onClick={() => handleEdit(user)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <Edit2 size={13} /> Edit
                            </button>
                            {user.status === 'active' ? (
                              <button onClick={() => handleStatusToggle(user, 'suspended')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                                <UserX size={13} /> Suspend
                              </button>
                            ) : (
                              <button onClick={() => handleStatusToggle(user, 'active')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                                <UserCheck size={13} /> Activate
                              </button>
                            )}
                            <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                            <button onClick={() => handleDelete(user)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400">
            <span>Showing {filtered.length} of {users.length} members</span>
            <span>{stats.active} active right now</span>
          </div>
        </div>
      )}

      {/* Modals */}
      <UserFormModal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingUser(null); }}
        user={editingUser}
      />
      <UserDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        user={selectedUser}
        onEdit={() => { setDetailOpen(false); handleEdit(selectedUser); }}
      />
    </PageWrapper>
  );
};

export default UsersPage;