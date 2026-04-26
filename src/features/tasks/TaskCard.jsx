import { Calendar, Flag, MessageSquare, User } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/formatDate';

const priorityColors = {
  low:      'text-green-500',
  medium:   'text-yellow-500',
  high:     'text-orange-500',
  critical: 'text-red-500',
};

const typeBadge = {
  bug:         'danger',
  feature:     'primary',
  improvement: 'info',
};

const TaskCard = ({ task, onClick, dragging = false }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
        p-3.5 cursor-pointer group
        hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600
        transition-all duration-150
        ${dragging ? 'shadow-xl rotate-1 scale-105 opacity-90' : ''}
      `}
    >
      {/* Type badge */}
      <div className="flex items-center justify-between mb-2">
        <Badge variant={typeBadge[task.type] || 'default'} className="text-[10px]">
          {task.type}
        </Badge>
        <Flag size={13} className={priorityColors[task.priority] || 'text-gray-400'} />
      </div>

      {/* Title */}
      <p data-testid="task-title" className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {/* {task.title} */}
        {String(task.title)}
      </p>

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        {/* Assignee */}
        <div className="flex items-center gap-1.5">
          {task.assignee ? (
            <>
              <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center text-white text-[9px] font-bold">
                {task.assignee.name[0]}
              </div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {task.assignee.name.split(' ')[0]}
              </span>
            </>
          ) : (
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <User size={11} /> Unassigned
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 text-gray-400">
          {/* Comments count */}
          {task.comments?.length > 0 && (
            <span className="flex items-center gap-0.5 text-[11px]">
              <MessageSquare size={11} />
              {task.comments.length}
            </span>
          )}
          {/* Due date */}
          {task.dueDate && (
            <span className={`flex items-center gap-0.5 text-[11px] ${isOverdue ? 'text-red-500' : ''}`}>
              <Calendar size={11} />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;