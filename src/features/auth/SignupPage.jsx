import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from './authSlice';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Sparkles, ShieldCheck, Users, User } from 'lucide-react';

const schema = yup.object({
  name:            yup.string().min(2, 'Minimum 2 characters').required('Name is required'),
  email:           yup.string().email('Enter a valid email').required('Email is required'),
  department:      yup.string().required('Department is required'),
  role:            yup.string().oneOf(['admin', 'manager', 'employee']).required('Role is required'),
  password:        yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

const DEPARTMENTS = [
  'Engineering', 'Design', 'Product', 'Marketing',
  'HR', 'Finance', 'Operations', 'Management',
];

const ROLE_OPTIONS = [
  {
    value:       'employee',
    label:       'Employee',
    description: 'View and manage assigned tasks',
    icon:        User,
    color:       'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
    activeColor: 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/30',
    iconColor:   'text-green-600 dark:text-green-400',
    badgeColor:  'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  },
  {
    value:       'manager',
    label:       'Manager',
    description: 'Manage projects and team tasks',
    icon:        Users,
    color:       'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
    activeColor: 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30',
    iconColor:   'text-blue-600 dark:text-blue-400',
    badgeColor:  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  {
    value:       'admin',
    label:       'Admin',
    description: 'Full access — users, analytics, all data',
    icon:        ShieldCheck,
    color:       'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20',
    activeColor: 'border-purple-500 bg-purple-50 dark:border-purple-400 dark:bg-purple-900/30',
    iconColor:   'text-purple-600 dark:text-purple-400',
    badgeColor:  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  },
];

const sel = 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500';

const SignupPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { isAuthenticated, loading, error, clearError } = useAuth();

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '', email: '', department: '',
      role: 'employee', password: '', confirmPassword: '',
    },
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
    return () => clearError();
  }, [isAuthenticated]);

  const onSubmit = ({ confirmPassword, ...data }) =>
    dispatch(signupUser(data));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Join your team on TaskForge
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="name" label="Full name"
                placeholder="Akankshya Pradhan"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                id="email" label="Email address" type="email"
                placeholder="you@company.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Department
              </label>
              <select className={sel} {...register('department')}>
                <option value="">Select department…</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.department && (
                <p className="text-xs text-red-500">{errors.department.message}</p>
              )}
            </div>

            {/* ── Role selector ──────────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select your role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map(({ value, label, description, icon: Icon, color, activeColor, iconColor, badgeColor }) => {
                  const isSelected = selectedRole === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue('role', value, { shouldValidate: false })}
                      className={`
                        flex flex-col items-center gap-2 p-3 rounded-xl border-2
                        transition-all duration-150 text-center
                        ${isSelected ? activeColor : color}
                        hover:scale-105 active:scale-100
                      `}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-white dark:bg-gray-800' : 'bg-white/60 dark:bg-gray-700/60'}`}>
                        <Icon size={16} className={iconColor} />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                          {label}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5 hidden sm:block">
                          {description}
                        </p>
                      </div>
                      {isSelected && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Hidden input to register the role value with react-hook-form */}
              <input type="hidden" {...register('role')} />
              {errors.role && (
                <p className="text-xs text-red-500">{errors.role.message}</p>
              )}
            </div>
            {/* ───────────────────────────────────────────────────── */}

            {/* Password + Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="password" label="Password" type="password"
                placeholder="Min 6 characters"
                error={errors.password?.message}
                {...register('password')}
              />
              <Input
                id="confirmPassword" label="Confirm password" type="password"
                placeholder="Repeat password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            {/* Role summary pill */}
            {selectedRole && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Signing up as:
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize
                  ${selectedRole === 'admin'    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                    selectedRole === 'manager'  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'}`}
                >
                  {selectedRole}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl text-white font-semibold text-sm
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-300 hover:-translate-y-0.5
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Creating account…
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;