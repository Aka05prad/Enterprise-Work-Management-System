import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from './authSlice';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, clearError } = useAuth();

  // const { register, handleSubmit, formState: { errors } } = useForm({
  //   resolver: yupResolver(schema),
  // });
  const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema),
  mode: 'onSubmit',
  reValidateMode: 'onChange',
  defaultValues: { email: '', password: '' },
});

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
    return () => clearError();
  }, [isAuthenticated]);

 
  const onSubmit = (data) => dispatch(loginUser(data));

  // Demo credentials helper
  const fillDemo = (role) => {
    const creds = {
      admin:    { email: 'admin@ewms.com',    password: 'admin123' },
      manager:  { email: 'manager@ewms.com',  password: 'manager123' },
      employee: { email: 'employee@ewms.com', password: 'employee123' },
    };
    dispatch(loginUser(creds[role]));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 bg-primary-600 rounded-2xl items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">EW</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Sign in to your EWMS account
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign in
            </Button>
          </form>

          {/* Demo logins */}
          <div className="mt-6">
            <p className="text-xs text-center text-gray-400 mb-3">
              — Quick demo login —
            </p>
            <div className="grid grid-cols-3 gap-2">
              {['admin', 'manager', 'employee'].map((role) => (
                <button
                  key={role}
                  onClick={() => fillDemo(role)}
                  disabled={loading}
                  className="py-2 px-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 capitalize transition-colors disabled:opacity-50"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Link to signup */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;