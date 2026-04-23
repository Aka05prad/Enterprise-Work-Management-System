import { useSelector } from 'react-redux';
import { FolderKanban, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import Badge from '../../components/common/Badge';

const statusBadge = { active: 'success', on_hold: 'warning', completed: 'info', cancelled: 'danger' };

const ProjectsProgressCard = () => {
  const projects = useSelector((s) => s.dashboard.projectsSummary);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <FolderKanban size={18} className="text-gray-600 dark:text-gray-400" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Active projects</h3>
      </div>

      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p.id} className="group">
            {/* Name + badge */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${p.color}`} />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {p.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <Badge variant={statusBadge[p.status] || 'default'}>
                  {p.status.replace('_', ' ')}
                </Badge>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {p.progress}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${p.color}`}
                style={{ width: `${p.progress}%` }}
              />
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-400">{p.tasks} tasks</span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={10} />
                {formatDate(p.due)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsProgressCard;