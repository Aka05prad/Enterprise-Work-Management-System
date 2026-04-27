import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { addComment, deleteTask } from './tasksSlice';
import { toast } from 'react-toastify';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatDateTime, formatDate } from '../../utils/formatDate';
import {
  Calendar, User, Tag, MessageSquare,
  Trash2, Edit2, Clock, Paperclip, Flag,
} from 'lucide-react';

const priorityConfig = {
  low:      { color: 'success', label: 'Low' },
  medium:   { color: 'warning', label: 'Medium' },
  high:     { color: 'danger',  label: 'High' },
  critical: { color: 'danger',  label: 'Critical' },
};

const typeConfig = {
  bug:         { color: 'danger',  label: 'Bug' },
  feature:     { color: 'primary', label: 'Feature' },
  improvement: { color: 'info',    label: 'Improvement' },
};

const statusConfig = {
  todo:        { color: 'default', label: 'To do' },
  in_progress: { color: 'primary', label: 'In progress' },
  in_review:   { color: 'warning', label: 'In review' },
  done:        { color: 'success', label: 'Done' },
};

const TaskDetailModal = ({ isOpen, onClose, task, onEdit }) => {
  const dispatch          = useDispatch();
  // const { user, isAdmin } = useAuth();
  const { user, isAdmin, isManager } = useAuth();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!task) return null;

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    await dispatch(addComment({ taskId: task.id, text: comment.trim(), author: user.name }));
    setComment('');
    setSubmitting(false);
    toast.success('Comment added!');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    await dispatch(deleteTask(task.id));
    toast.success('Task deleted');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
      <div className="space-y-5">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug flex-1">
              {task.title}
            </h2>
            
            {/* ── Role-based permissions ─────────────────────────── */}
{(() => {
  const canEdit =
    isAdmin ||
    isManager ||
    task.assignee?.id === user?.id;

  const canDelete =
    isAdmin ||
    (isManager && task.reporter?.id === user?.id);

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {canEdit && (
        <button
          onClick={onEdit}
          title="Edit task"
          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
        >
          <Edit2 size={15} />
        </button>
      )}
      {canDelete && (
        <button
          onClick={handleDelete}
          title="Delete task"
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
})()}
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant={typeConfig[task.type]?.color}>{typeConfig[task.type]?.label}</Badge>
            <Badge variant={priorityConfig[task.priority]?.color}>
              <Flag size={10} className="mr-1 inline" />
              {priorityConfig[task.priority]?.label}
            </Badge>
            <Badge variant={statusConfig[task.status]?.color}>
              {statusConfig[task.status]?.label}
            </Badge>
            {task.tags?.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {task.description}
          </div>
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: User,     label: 'Assignee', value: task.assignee?.name || 'Unassigned' },
            { icon: User,     label: 'Reporter',  value: task.reporter?.name || '—' },
            { icon: Calendar, label: 'Due date',  value: formatDate(task.dueDate) },
            { icon: Clock,    label: 'Created',   value: formatDate(task.createdAt) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-2.5 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
              <Icon size={15} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Attachments placeholder */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Paperclip size={14} />
          <span>No attachments</span>
        </div>

        {/* Comments */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
            <MessageSquare size={15} />
            Comments ({task.comments?.length || 0})
          </h4>

          {/* Comment list */}
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            {(!task.comments || task.comments.length === 0) ? (
              <p className="text-sm text-gray-400 italic">No comments yet. Be the first!</p>
            ) : (
              task.comments.map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {c.author?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{c.author}</span>
                      <span className="text-xs text-gray-400">{formatDateTime(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add comment */}
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 flex gap-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleAddComment(); }}
                placeholder="Add a comment… (Ctrl+Enter to submit)"
                rows={2}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              <Button onClick={handleAddComment} loading={submitting} size="sm" className="self-end">
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;