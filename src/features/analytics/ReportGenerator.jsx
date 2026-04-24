import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FileText, Download, Loader } from 'lucide-react';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';
import { toast } from 'react-toastify';

const REPORT_TYPES = [
  { id: 'project_summary',  label: 'Project summary',   description: 'Status and progress for all projects' },
  { id: 'task_breakdown',   label: 'Task breakdown',    description: 'Tasks by status, type, and priority'  },
  { id: 'team_performance', label: 'Team performance',  description: 'Completion rates per team member'     },
  { id: 'overdue_report',   label: 'Overdue report',    description: 'All overdue tasks with assignees'     },
];

const generateCSV = (type, projects, tasks, users) => {
  const rows = [];

  if (type === 'project_summary') {
    rows.push(['Project', 'Status', 'Priority', 'Progress %', 'Total Tasks', 'Completed', 'Due Date', 'Manager'].join(','));
    projects.forEach((p) =>
      rows.push([p.name, p.status, p.priority, p.progress, p.taskCount, p.completedTasks, p.dueDate, p.manager?.name].join(','))
    );
  } else if (type === 'task_breakdown') {
    rows.push(['Title', 'Project', 'Type', 'Status', 'Priority', 'Assignee', 'Due Date'].join(','));
    tasks.forEach((t) => {
      const proj = projects.find((p) => p.id === t.projectId);
      rows.push([`"${t.title}"`, proj?.name || '—', t.type, t.status, t.priority, t.assignee?.name || 'Unassigned', t.dueDate || '—'].join(','));
    });
  } else if (type === 'team_performance') {
    rows.push(['Name', 'Role', 'Department', 'Tasks Assigned', 'Tasks Completed', 'Completion Rate %', 'Projects'].join(','));
    users.forEach((u) => {
      const rate = u.tasksAssigned > 0 ? Math.round((u.tasksCompleted / u.tasksAssigned) * 100) : 0;
      rows.push([u.name, u.role, u.department, u.tasksAssigned, u.tasksCompleted, rate, u.projectsCount].join(','));
    });
  } else if (type === 'overdue_report') {
    rows.push(['Title', 'Project', 'Assignee', 'Priority', 'Due Date', 'Days Overdue'].join(','));
    const today = new Date();
    tasks
      .filter((t) => t.dueDate && new Date(t.dueDate) < today && t.status !== 'done')
      .forEach((t) => {
        const proj = projects.find((p) => p.id === t.projectId);
        const days = Math.floor((today - new Date(t.dueDate)) / 86400000);
        rows.push([`"${t.title}"`, proj?.name || '—', t.assignee?.name || 'Unassigned', t.priority, t.dueDate, days].join(','));
      });
  }

  return rows.join('\n');
};

const ReportGenerator = () => {
  const projects = useSelector((s) => s.projects.list);
  const tasks    = useSelector((s) => s.tasks.list);
  const users    = useSelector((s) => s.users.list);

  const [selectedType, setSelectedType] = useState('project_summary');
  const [generating,   setGenerating]   = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 900)); // Simulate generation

    const csv      = generateCSV(selectedType, projects, tasks, users);
    const blob     = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url      = URL.createObjectURL(blob);
    const link     = document.createElement('a');
    const label    = REPORT_TYPES.find((r) => r.id === selectedType)?.label || 'report';
    link.href      = url;
    link.download  = `ewms_${selectedType}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setGenerating(false);
    toast.success(`${label} downloaded!`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-2 mb-5">
        <FileText size={18} className="text-gray-600 dark:text-gray-400" />
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Generate report</h3>
          <p className="text-xs text-gray-400">Export data as CSV</p>
        </div>
      </div>

      {/* Report type cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {REPORT_TYPES.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedType(r.id)}
            className={`text-left p-3.5 rounded-xl border-2 transition-all duration-150 ${
              selectedType === r.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
            }`}
          >
            <p className={`text-sm font-semibold ${selectedType === r.id ? 'text-primary-700 dark:text-primary-300' : 'text-gray-800 dark:text-gray-200'}`}>
              {r.label}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{r.description}</p>
          </button>
        ))}
      </div>

      {/* Preview info */}
      <div className="mb-5 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl text-xs text-gray-500 dark:text-gray-400">
        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Report contents:</p>
        {selectedType === 'project_summary'  && <p>{projects.length} projects · {new Date().toDateString()}</p>}
        {selectedType === 'task_breakdown'   && <p>{tasks.length} tasks across {projects.length} projects</p>}
        {selectedType === 'team_performance' && <p>{users.length} team members</p>}
        {selectedType === 'overdue_report'   && (
          <p>
            {tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length} overdue tasks
          </p>
        )}
      </div>

      <Button onClick={handleGenerate} loading={generating} className="w-full">
        {generating ? (
          <><Loader size={15} className="animate-spin" /> Generating…</>
        ) : (
          <><Download size={15} /> Download CSV</>
        )}
      </Button>
    </div>
  );
};

export default ReportGenerator;