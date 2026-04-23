import { MoreVertical, Users, CheckSquare, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/formatDate';
import { useDispatch } from 'react-redux';
import { deleteProject } from './projectsSlice';
import { toast } from 'react-toastify';

const statusBadge = { active: 'success', on_hold: 'warning', completed: 'info', cancelled: 'danger' };
const priorityBadge = { low: 'success', medium: 'warning', high: 'danger', critical: 'danger' };

const ProjectCard = ({ project, onClick, onEdit }) => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (!window.confirm(`Delete "${project.name}"?`)) return;
    await dispatch(deleteProject(project.id));
    toast.success('Project deleted');
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(project);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 cursor-pointer hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 group flex flex-col gap-4"
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ backgroundColor: project.color }}>
            {project.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
              {project.name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{project.manager?.name}</p>
          </div>
        </div>

        {/* Kebab menu */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
              <button onClick={handleEdit} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Edit2 size={13} /> Edit
              </button>
              <button onClick={handleDelete} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
        {project.description}
      </p>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-400">Progress</span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{project.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%`, backgroundColor: project.color }}
          />
        </div>
      </div>

      {/* Tags */}
      {project.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <CheckSquare size={12} />
            {project.completedTasks}/{project.taskCount} tasks
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(project.dueDate)}
          </span>
        </div>
        <div className="flex gap-1.5">
          <Badge variant={statusBadge[project.status] || 'default'}>
            {project.status.replace('_', ' ')}
          </Badge>
          <Badge variant={priorityBadge[project.priority] || 'default'}>
            {project.priority}
          </Badge>
        </div>
      </div>

      {/* Members avatars */}
      {project.members?.length > 0 && (
        <div className="flex items-center gap-1">
          {project.members.slice(0, 4).map((m, i) => (
            <div
              key={m.id}
              title={m.name}
              style={{ zIndex: 4 - i }}
              className="relative w-6 h-6 rounded-full bg-primary-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-[9px] font-bold -ml-1 first:ml-0"
            >
              {m.name[0]}
            </div>
          ))}
          {project.members.length > 4 && (
            <span className="text-xs text-gray-400 ml-1">+{project.members.length - 4}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;