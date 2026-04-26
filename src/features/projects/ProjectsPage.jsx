import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Filter } from 'lucide-react';
import { fetchProjects } from './projectsSlice';
import { fetchTasks } from '../tasks/tasksSlice';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import ProjectCard from './ProjectCard';
import ProjectFormModal from './ProjectFormModal';
import ProjectDetail from './ProjectDetail';
import { useDebounce } from '../../hooks/useDebounce';

const FILTERS = ['all', 'active', 'on_hold', 'completed', 'cancelled'];

const ProjectsPage = () => {
  const dispatch  = useDispatch();
  const { list: projects, loading } = useSelector((s) => s.projects);

  const [formOpen,       setFormOpen]       = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [search,         setSearch]         = useState('');
  const [filter,         setFilter]         = useState('all');
  const debouncedSearch = useDebounce(search, 350);

//   jest.mock('../../features/projects/projectsSlice', () => {
//   const original = jest.requireActual('../../features/projects/projectsSlice');

//   return {
//     ...original,

//     createProject: (data) => async (dispatch) => {
//       dispatch({ type: 'projects/createProject/pending' });

//       await Promise.resolve();

//       dispatch({
//         type: 'projects/createProject/fulfilled',
//         payload: {
//           id: 'p123',
//           ...data,
//         },
//       });
//     },
//   };
// });

  // useEffect(() => {
  //   dispatch(fetchProjects());
  //   dispatch(fetchTasks());
  // }, []);
  useEffect(() => {
  if (!projects || projects.length === 0) {
    dispatch(fetchProjects());
  }
  dispatch(fetchTasks());
}, []);

  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  // Show project detail view
  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <PageWrapper
      title="Projects"
      subtitle={`${projects.length} total projects`}
      actions={
        <Button onClick={() => { setEditingProject(null); setFormOpen(true); }}>
          <Plus size={16} /> New project
        </Button>
      }
    >
      {/* Search + filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
            // aria-label="New project"
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Spinner size="lg" className="h-64" />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Filter size={28} className="text-gray-300" />
          </div>
          <p className="text-sm">No projects match your search</p>
          <Button variant="secondary" size="sm" onClick={() => { setSearch(''); setFilter('all'); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Project form modal */}
      <ProjectFormModal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingProject(null); }}
        project={editingProject}
      />
    </PageWrapper>
  );
};

export default ProjectsPage;