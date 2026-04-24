import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { changeUserStatus, deleteUser } from './usersSlice';
import { formatDate, timeAgo } from '../../utils/formatDate';
import {
  Mail, Phone, Building2, Calendar,
  CheckSquare, FolderKanban, ShieldCheck,
  UserX, UserCheck, Trash2, Edit2,
} from 'lucide-react';

const roleBadge   = { admin: 'danger', manager: 'warning', employee: 'info' };
const statusBadge = { active: 'success', inactive: 'default', suspended: 'danger' };

const UserDetailModal = ({ isOpen, onClose, user, onEdit }) => {
  const dispatch = useDispatch();
  if (!user) return null;

  const completionRate = user.tasksAssigned > 0
    ? Math.round((user.tasksCompleted / user.tasksAssigned) * 100)
    : 0;

  const handleStatusChange = async (status) => {
    await dispatch(changeUserStatus({ id: user.id, status }));
    toast.success(`User ${status === 'active' ? 'activated' : status === 'suspended' ? 'suspended' : 'deactivated'}`);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete ${user.name}?`)) return;
    await dispatch(deleteUser(user.id));
    toast.success('User deleted');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <div className="space-y-5">

        {/* Profile header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {user.name[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant={roleBadge[user.role] || 'default'}>
                <ShieldCheck size={10} className="mr-1 inline" />
                {user.role}
              </Badge>
              <Badge variant={statusBadge[user.status] || 'default'}>{user.status}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
            >
              <Edit2 size={15} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Contact & meta */}
        <div className="grid grid-cols-1 gap-2">
          {[
            { icon: Mail,      label: 'Email',      value: user.email },
            { icon: Phone,     label: 'Phone',      value: user.phone || '—' },
            { icon: Building2, label: 'Department', value: user.department },
            { icon: Calendar,  label: 'Joined',     value: formatDate(user.joinedAt) },
            { icon: Calendar,  label: 'Last active',value: timeAgo(user.lastActive) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
              <Icon size={15} className="text-gray-400 shrink-0" />
              <span className="text-xs text-gray-400 w-24 shrink-0">{label}</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{value}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Projects',   value: user.projectsCount },
            { label: 'Assigned',   value: user.tasksAssigned },
            { label: 'Completed',  value: user.tasksCompleted },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</span>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Completion rate bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Task completion rate</span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{completionRate}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Status actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          {user.status !== 'active' && (
            <Button
              variant="secondary" size="sm"
              onClick={() => handleStatusChange('active')}
              className="flex-1"
            >
              <UserCheck size={14} /> Activate
            </Button>
          )}
          {user.status !== 'suspended' && (
            <Button
              variant="danger" size="sm"
              onClick={() => handleStatusChange('suspended')}
              className="flex-1"
            >
              <UserX size={14} /> Suspend
            </Button>
          )}
          {user.status !== 'inactive' && (
            <Button
              variant="secondary" size="sm"
              onClick={() => handleStatusChange('inactive')}
              className="flex-1"
            >
              <UserX size={14} /> Deactivate
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailModal;