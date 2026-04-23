import { useSelector } from 'react-redux';
import { useState } from 'react';
import { ArrowLeft, Plus, LayoutGrid, List } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import KanbanBoard from './KanbanBoard';
import TaskFormModal from '../tasks/TaskFormModal';
import TaskDetailModal from '../tasks/TaskDetailModal';
import TaskCard from '../tasks/TaskCard';
import { formatDate } from '../../utils/formatDate';

const statusBadge = { active: 'success', on_hold: 'warning', completed: 'info', cancelled: 'danger' };

const ProjectDetail = ({ project, onBack }) => {
  const tasks       = useSelector((s) => s.tasks.list.filter((t) => t.projectId === project.id));
  const [view,      setView]      = useState('kanban');  // 'kanban' | 'list'
  const [formOpen,  setFormOpen]  = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask,  setEditingTask]  = useState(null);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: project.color }}>
            {project.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{project.name}</h1>
              <Badge variant={statusBadge[project.status]}>{project.status.replace('_', ' ')}</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {tasks.length} tasks · Due {formatDate(project.dueDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => setView('kanban')}
              className={`p-1.5 rounded-md transition-colors ${view === 'kanban' ? 'bg-white dark:bg-gray-600 shadow text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Kanban view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white dark:bg-gray-600 shadow text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="List view"
            >
              <List size={16} />
            </button>
          </div>
          <Button onClick={() => { setEditingTask(null); setFormOpen(true); }} size="sm">
            <Plus size={15} /> Add task
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Overall progress</span>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{project.progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%`, backgroundColor: project.color }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>{project.completedTasks} completed</span>
          <span>{project.taskCount - project.completedTasks} remaining</span>
        </div>
      </div>

      {/* Board or list */}
      {view === 'kanban' ? (
        <KanbanBoard tasks={tasks} projectId={project.id} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {tasks.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-400">
              No tasks yet — add one!
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => { setSelectedTask(task); setDetailOpen(true); }}
              />
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <TaskFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        task={editingTask}
        defaultProjectId={project.id}
      />
      <TaskDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        task={selectedTask}
        onEdit={() => { setEditingTask(selectedTask); setDetailOpen(false); setFormOpen(true); }}
      />
    </div>
  );
};

export default ProjectDetail;