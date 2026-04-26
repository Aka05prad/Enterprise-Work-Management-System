import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { createTask, updateTask } from './tasksSlice';

const schema = yup.object({
  title:     yup.string().min(3).required('Title is required'),
  description: yup.string(),
  type:      yup.string().required(),
  status:    yup.string().required(),
  priority:  yup.string().required(),
  projectId: yup.string().required('Project is required'),
  dueDate:   yup.string(),
  tags:      yup.string(),
});

const MOCK_MEMBERS = [
  { id: '1', name: 'Alice Admin' },
  { id: '2', name: 'Mark Manager' },
  { id: '3', name: 'Eve Employee' },
];

const TaskFormModal = ({ isOpen, onClose, task = null, defaultProjectId = '' }) => {
  const dispatch  = useDispatch();
  const projects  = useSelector((s) => s.projects.list);
  const isEdit    = !!task;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '', description: '', type: 'feature', status: 'todo',
      priority: 'medium', projectId: defaultProjectId, dueDate: '', tags: '', assigneeId: '',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title, description: task.description || '',
        type: task.type, status: task.status, priority: task.priority,
        projectId: task.projectId, dueDate: task.dueDate || '',
        tags: task.tags?.join(', ') || '',
        assigneeId: task.assignee?.id || '',
      });
    } else {
      reset({ title: '', description: '', type: 'feature', status: 'todo', priority: 'medium', projectId: defaultProjectId, dueDate: '', tags: '', assigneeId: '' });
    }
  }, [task, isOpen, defaultProjectId]);

  const onSubmit = async (data) => {
    const assignee = MOCK_MEMBERS.find((m) => m.id === data.assigneeId) || null;
    const payload  = {
      ...data,
      assignee,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
    };
    if (isEdit) {
      await dispatch(updateTask({ id: task.id, changes: payload }));
      toast.success('Task updated!');
    } else {
      await dispatch(createTask(payload));
      toast.success('Task created!');
    }
    onClose();
  };

  const sel = 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit task' : 'Create task'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Task title" placeholder="e.g. Fix login redirect bug" error={errors.title?.message} {...register('title')} />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea rows={3} placeholder="Describe the task in detail…"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            {...register('description')} />
        </div>

        {/* Project */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
          <select className={sel} {...register('projectId')}>
            <option value="">Select project…</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {errors.projectId && <p className="text-xs text-red-500">{errors.projectId.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
            <select className={sel} {...register('type')}>
              <option value="feature">Feature</option>
              <option value="bug">Bug</option>
              <option value="improvement">Improvement</option>
            </select>
          </div>
          {/* Priority */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
            <select className={sel} {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select className={sel} {...register('status')}>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="in_review">In review</option>
              <option value="done">Done</option>
            </select>
          </div>
          {/* Assignee */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Assignee</label>
            <select className={sel} {...register('assigneeId')}>
              <option value="">Unassigned</option>
              {MOCK_MEMBERS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>

        <Input label="Due date" type="date" {...register('dueDate')} />
        <Input label="Tags (comma separated)" placeholder="frontend, bug, api" {...register('tags')} />

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>{isEdit ? 'Save changes' : 'Create task'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;