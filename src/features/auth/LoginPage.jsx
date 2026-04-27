// import { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { useDispatch } from 'react-redux';
// import { useNavigate, Link } from 'react-router-dom';
// import { loginUser } from './authSlice';
// import { useAuth } from '../../hooks/useAuth';
// import Input from '../../components/common/Input';
// import Button from '../../components/common/Button';

// const schema = yup.object({
//   email: yup.string().email('Enter a valid email').required('Email is required'),
//   password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
// });

// const LoginPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isAuthenticated, loading, error, clearError } = useAuth();


//   const { register, handleSubmit, formState: { errors } } = useForm({
//   resolver: yupResolver(schema),
//   mode: 'onSubmit',
//   reValidateMode: 'onChange',
//   defaultValues: { email: '', password: '' },
// });

//   useEffect(() => {
//     if (isAuthenticated) navigate('/dashboard', { replace: true });
//     return () => clearError();
//   }, [isAuthenticated]);

 
//   const onSubmit = (data) => dispatch(loginUser(data));

//   // Demo credentials helper
//   const fillDemo = (role) => {
//     const creds = {
//       admin:    { email: 'admin@ewms.com',    password: 'admin123' },
//       manager:  { email: 'manager@ewms.com',  password: 'manager123' },
//       employee: { email: 'employee@ewms.com', password: 'employee123' },
//     };
//     dispatch(loginUser(creds[role]));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
//       <div className="w-full max-w-md">
//         {/* Card */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="inline-flex w-14 h-14 bg-primary-600 rounded-2xl items-center justify-center mb-4">
//               <span className="text-white text-2xl font-bold">EW</span>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
//               Sign in to your EWMS account
//             </p>
//           </div>

//           {/* Error banner */}
//           {error && (
//             <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
//               {error}
//             </div>
//           )}

//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <Input
//               id="email"
//               label="Email address"
//               type="email"
//               placeholder="you@company.com"
//               error={errors.email?.message}
//               {...register('email')}
//             />
//             <Input
//               id="password"
//               label="Password"
//               type="password"
//               placeholder="••••••••"
//               error={errors.password?.message}
//               {...register('password')}
//             />
//             <Button type="submit" loading={loading} className="w-full" size="lg">
//               Sign in
//             </Button>
//           </form>

//           {/* Demo logins */}
//           <div className="mt-6">
//             <p className="text-xs text-center text-gray-400 mb-3">
//               — Quick demo login —
//             </p>
//             <div className="grid grid-cols-3 gap-2">
//               {['admin', 'manager', 'employee'].map((role) => (
//                 <button
//                   key={role}
//                   onClick={() => fillDemo(role)}
//                   disabled={loading}
//                   className="py-2 px-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 capitalize transition-colors disabled:opacity-50"
//                 >
//                   {role}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Link to signup */}
//           <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
//             Don't have an account?{' '}
//             <Link to="/signup" className="text-primary-600 font-medium hover:underline">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

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
import { Sparkles, Zap, Shield, BarChart3 } from 'lucide-react';

const schema = yup.object({
  email:    yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

const features = [
  { icon: Zap,       text: 'Real-time collaboration' },
  { icon: Shield,    text: 'Role-based access control' },
  { icon: BarChart3, text: 'Advanced analytics' },
];

const LoginPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { isAuthenticated, loading, error, clearError } = useAuth();

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

  const fillDemo = (role) => {
    const creds = {
      admin:    { email: 'admin@ewms.com',    password: 'admin123'    },
      manager:  { email: 'manager@ewms.com',  password: 'manager123'  },
      employee: { email: 'employee@ewms.com', password: 'employee123' },
    };
    dispatch(loginUser(creds[role]));
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — branding ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 40%, #8b5cf6 70%, #a855f7 100%)' }}
      >
        {/* Animated blobs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-300/15 rounded-full blur-2xl animate-pulse" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center border border-white/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">EWMS</span>
          </div>

          {/* Hero text */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-bold text-white leading-tight">
                Manage work<br />
                <span className="text-purple-200">like a pro.</span>
              </h1>
              <p className="text-white/70 text-lg mt-4 leading-relaxed">
                Your team's command center for projects, tasks, and real-time collaboration.
              </p>
            </div>

            {/* Feature pills */}
            <div className="space-y-3">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 animate-fade-up">
                  <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center border border-white/20">
                    <Icon size={15} className="text-white" />
                  </div>
                  <span className="text-white/80 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stats */}
          <div className="flex items-center gap-8">
            {[['12+', 'Projects'], ['68+', 'Tasks'], ['9', 'Members']].map(([n, l]) => (
              <div key={l}>
                <p className="text-2xl font-bold text-white">{n}</p>
                <p className="text-white/60 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">EWMS</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue to your workspace</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400 animate-scale-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input id="email" label="Email address" type="email"
              placeholder="you@company.com"
              error={errors.email?.message} {...register('email')} />
            <Input id="password" label="Password" type="password"
              placeholder="••••••••"
              error={errors.password?.message} {...register('password')} />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl text-white font-semibold text-sm
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Demo buttons */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400 font-medium">Quick demo</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'admin',    color: 'from-red-500 to-rose-600',    label: '👑 Admin' },
                { role: 'manager',  color: 'from-amber-500 to-orange-600', label: '⚡ Manager' },
                { role: 'employee', color: 'from-green-500 to-emerald-600',label: '👤 Employee' },
              ].map(({ role, color, label }) => (
                <button
                  key={role}
                  onClick={() => fillDemo(role)}
                  disabled={loading}
                  className={`py-2.5 px-3 rounded-xl text-white text-xs font-semibold
                    bg-gradient-to-r ${color}
                    hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200
                    disabled:opacity-50 shadow-sm`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;