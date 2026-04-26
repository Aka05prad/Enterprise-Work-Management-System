import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { createProject, updateProject } from './projectsSlice';

const schema = yup.object({
  name:        yup.string().min(2).required('Project name is required'),
  description: yup.string().required('Description is required'),
  status:      yup.string().required(),
  priority:    yup.string().required(),
  dueDate:     yup.string().required('Due date is required'),
  color:       yup.string().required(),
});

const COLORS = ['#6366f1','#3b82f6','#22c55e','#f59e0b','#ec4899','#ef4444','#8b5cf6','#14b8a6'];

const ProjectFormModal = ({ isOpen, onClose, project = null }) => {
  const dispatch = useDispatch();
  const isEdit = !!project;

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '', description: '', status: 'active', priority: 'medium',
      dueDate: '', color: '#6366f1', tags: '',
    },
  });

  const selectedColor = watch('color');

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        dueDate: project.dueDate,
        color: project.color,
        tags: project.tags?.join(', ') || '',
      });
    } else {
      reset({ name: '', description: '', status: 'active', priority: 'medium', dueDate: '', color: '#6366f1', tags: '' });
    }
  }, [project, isOpen]);

  const onSubmit = async (data) => {
    const payload = { ...data, tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [] };
    if (isEdit) {
      await dispatch(updateProject({ id: project.id, changes: payload }));
      toast.success('Project updated!');
    } else {
      await dispatch(createProject(payload));
      toast.success('Project created!');
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit project' : 'Create project'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Project name" placeholder="e.g. Apollo Redesign" error={errors.name?.message} {...register('name')} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            rows={3}
            placeholder="What is this project about?"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            {...register('description')}
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" {...register('status')}>
              <option value="active">Active</option>
              <option value="on_hold">On hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          {/* Priority */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
            <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <Input label="Due date" type="date" error={errors.dueDate?.message} {...register('dueDate')} />
        <Input label="Tags (comma separated)" placeholder="frontend, design, api" {...register('tags')} />

        {/* Color picker */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project color</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c} type="button"
                onClick={() => setValue('color', c)}
                className={`w-7 h-7 rounded-full transition-all duration-150 ${selectedColor === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>{isEdit ? 'Save changes' : 'Create project'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectFormModal;