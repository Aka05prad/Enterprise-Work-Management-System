import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search } from 'lucide-react';
import { fetchTasks } from './tasksSlice';
import { fetchProjects } from '../projects/projectsSlice';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import TaskCard from './TaskCard';
import TaskFormModal from './TaskFormModal';
import TaskDetailModal from './TaskDetailModal';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../hooks/useAuth';

const STATUS_FILTERS = ['all', 'todo', 'in_progress', 'in_review', 'done'];
const TYPE_FILTERS   = ['all', 'feature', 'bug', 'improvement'];

const { user, isAdmin, isManager } = useAuth();

const TasksPage = () => {
  const dispatch = useDispatch();
  const { list: tasks, loading } = useSelector((s) => s.tasks);

  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter,   setTypeFilter]   = useState('all');
  const [formOpen,     setFormOpen]     = useState(false);
  const [detailOpen,   setDetailOpen]   = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask,  setEditingTask]  = useState(null);
  const debouncedSearch = useDebounce(search, 350);

  
  useEffect(() => {
  if (!tasks || tasks.length === 0) {
    dispatch(fetchTasks());
  }
  dispatch(fetchProjects());
}, []);

  // const filtered = tasks.filter((t) => {
  //   const matchSearch = t.title.toLowerCase().includes(debouncedSearch.toLowerCase());
  //   const matchStatus = statusFilter === 'all' || t.status === statusFilter;
  //   const matchType   = typeFilter   === 'all' || t.type   === typeFilter;
  //   return matchSearch && matchStatus && matchType;
  // });
const visibleTasks = isAdmin
  ? tasks
  : isManager
    ? tasks.filter(t =>
        t.assignee?.id === user.id ||
        t.reporter?.id === user.id  ||
        projects.find(p =>
          p.id === t.projectId &&
          (p.manager?.id === user.id || p.members?.some(m => m.id === user.id))
        )
      )
    : tasks.filter(t => t.assignee?.id === user.id);

    const filtered = visibleProjects.filter((p) => {  const matchSearch = t.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchType   = typeFilter   === 'all' || t.type   === typeFilter;
    return matchSearch && matchStatus && matchType; });
  const pill = (val, current, set, label) => (
    <button
    // aria-label="New task"
      key={val}
      onClick={() => set(val)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
        current === val
          ? 'bg-primary-600 text-white'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'
      }`}
    >
      {label || val.replace('_', ' ')}
    </button>
  );

  return (
    <PageWrapper
      title="All tasks"
      subtitle={`${tasks.length} tasks across all projects`}
      actions={
        <Button onClick={() => { setEditingTask(null); setFormOpen(true); }}>
          <Plus size={16} /> New task
        </Button>
      }
    >
      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-medium">Status:</span>
          {STATUS_FILTERS.map((f) => pill(f, statusFilter, setStatusFilter))}
          <span className="text-xs text-gray-400 font-medium ml-2">Type:</span>
          {TYPE_FILTERS.map((f) => pill(f, typeFilter, setTypeFilter))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <Spinner size="lg" className="h-64" />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No tasks match your filters</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => { setSelectedTask(task); setDetailOpen(true); }}
            />
          ))}
        </div>
      )}

      <TaskFormModal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingTask(null); }}
        task={editingTask}
      />
      <TaskDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        task={selectedTask}
        onEdit={() => { setEditingTask(selectedTask); setDetailOpen(false); setFormOpen(true); }}
      />
    </PageWrapper>
  );
};

export default TasksPage;