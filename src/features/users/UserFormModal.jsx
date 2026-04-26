import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { createUser, updateUser } from './usersSlice';

const DEPARTMENTS = [
  'Engineering', 'Design', 'Product', 'Marketing',
  'HR', 'Finance', 'Operations', 'Management',
];

const createSchema = yup.object({
  name:       yup.string().min(2).required('Name is required'),
  email:      yup.string().email().required('Email is required'),
  role:       yup.string().required(),
  department: yup.string().required('Department is required'),
  phone:      yup.string(),
  password:   yup.string().min(6).required('Password is required'),
});

const editSchema = yup.object({
  name:       yup.string().min(2).required('Name is required'),
  email:      yup.string().email().required('Email is required'),
  role:       yup.string().required(),
  department: yup.string().required('Department is required'),
  phone:      yup.string(),
});

const sel = 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500';

const UserFormModal = ({ isOpen, onClose, user = null }) => {
  const dispatch = useDispatch();
  const isEdit   = !!user;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(isEdit ? editSchema : createSchema),
    defaultValues: {
      name: '', email: '', role: 'employee',
      department: '', phone: '', password: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name, email: user.email, role: user.role,
        department: user.department, phone: user.phone || '',
      });
    } else {
      reset({ name: '', email: '', role: 'employee', department: '', phone: '', password: '' });
    }
  }, [user, isOpen]);

  const onSubmit = async (data) => {
    if (isEdit) {
      await dispatch(updateUser({ id: user.id, changes: data }));
      toast.success('User updated successfully!');
    } else {
      await dispatch(createUser(data));
      toast.success('User created successfully!');
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit user' : 'Add new user'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="name" label="Full name" placeholder="e.g. Jane Smith"
          error={errors.name?.message} {...register('name')}
        />
        <Input
           id="email" label="Email address" type="email" placeholder="jane@company.com"
          error={errors.email?.message} {...register('email')}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Role */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select className={sel} {...register('role')}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Department */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
            <select className={sel} {...register('department')}>
              <option value="">Select…</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.department && <p className="text-xs text-red-500">{errors.department.message}</p>}
          </div>
        </div>

        <Input
          label="Phone (optional)" placeholder="+91 98765 43210"
          {...register('phone')}
        />

        {!isEdit && (
          <Input
             id="password" label="Temporary password" type="password" placeholder="Min 6 characters"
            error={errors.password?.message} {...register('password')}
          />
        )}

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create user'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;