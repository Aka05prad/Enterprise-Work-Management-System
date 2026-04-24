import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProfile } from '../auth/authSlice';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Camera, User } from 'lucide-react';

const schema = yup.object({
  name:       yup.string().min(2).required('Name is required'),
  email:      yup.string().email().required('Email is required'),
  department: yup.string().required('Department is required'),
  phone:      yup.string(),
  bio:        yup.string().max(200, 'Max 200 characters'),
});

const DEPARTMENTS = [
  'Engineering','Design','Product','Marketing','HR','Finance','Operations','Management',
];

const sel = 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500';

const ProfileSettings = () => {
  const dispatch    = useDispatch();
  const { user }    = useAuth();
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name:       user?.name       || '',
      email:      user?.email      || '',
      department: user?.department || '',
      phone:      user?.phone      || '',
      bio:        user?.bio        || '',
    },
  });

  const onSubmit = async (data) => {
    await dispatch(updateProfile(data));
    toast.success('Profile updated successfully!');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Profile information</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Update your personal details and public profile.</p>
      </div>

      {/* Avatar upload */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              : (user?.name?.[0]?.toUpperCase() || <User size={32} />)
            }
          </div>
          <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow">
            <Camera size={13} className="text-gray-600 dark:text-gray-400" />
            <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
          </label>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF · max 2MB</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full name" placeholder="Your full name" error={errors.name?.message} {...register('name')} />
          <Input label="Email address" type="email" placeholder="you@company.com" error={errors.email?.message} {...register('email')} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
            <select className={sel} {...register('department')}>
              <option value="">Select…</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.department && <p className="text-xs text-red-500">{errors.department.message}</p>}
          </div>
          <Input label="Phone" placeholder="+91 98765 43210" {...register('phone')} />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <textarea
            rows={3}
            placeholder="A short bio about yourself…"
            maxLength={200}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            {...register('bio')}
          />
          {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
        </div>

        {/* Read-only role badge */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
          <div className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-500 dark:text-gray-400 capitalize">
            {user?.role} — contact an admin to change your role
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Save profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;