import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Shield, Eye, EyeOff, CheckCircle } from 'lucide-react';

const schema = yup.object({
  currentPassword: yup.string().min(6).required('Current password is required'),
  newPassword:     yup.string()
    .min(8, 'At least 8 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Please confirm your password'),
});

const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8)        score++;
  if (pwd.length >= 12)       score++;
  if (/[A-Z]/.test(pwd))      score++;
  if (/[0-9]/.test(pwd))      score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: '',         color: ''                   },
    { label: 'Weak',     color: 'bg-red-500'         },
    { label: 'Fair',     color: 'bg-orange-500'      },
    { label: 'Good',     color: 'bg-yellow-500'      },
    { label: 'Strong',   color: 'bg-green-500'       },
    { label: 'Very strong', color: 'bg-emerald-600'  },
  ];
  return { score, ...map[score] };
};

const PasswordSettings = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPwd,      setNewPwd]      = useState('');

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const watchNew = watch('newPassword', '');
  const strength = getStrength(watchNew);

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    if (data.currentPassword.length < 6) {
      toast.error('Current password is incorrect');
      return;
    }
    reset();
    setNewPwd('');
    toast.success('Password changed successfully!');
  };

  const requirements = [
    { label: 'At least 8 characters', met: watchNew.length >= 8 },
    { label: 'One uppercase letter',   met: /[A-Z]/.test(watchNew) },
    { label: 'One number',             met: /[0-9]/.test(watchNew) },
    { label: 'One special character',  met: /[^A-Za-z0-9]/.test(watchNew) },
  ];

  const EyeToggle = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Choose a strong password you don't use elsewhere.</p>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <Shield size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          After changing your password you'll remain logged in on this device. Other sessions will be invalidated.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        {/* Current password */}
        <div className="relative">
          <Input
            label="Current password"
            type={showCurrent ? 'text' : 'password'}
            placeholder="Your current password"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <EyeToggle show={showCurrent} onToggle={() => setShowCurrent((v) => !v)} />
        </div>

        {/* New password */}
        <div className="space-y-2">
          <div className="relative">
            <Input
              label="New password"
              type={showNew ? 'text' : 'password'}
              placeholder="Min 8 characters"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <EyeToggle show={showNew} onToggle={() => setShowNew((v) => !v)} />
          </div>

          {/* Strength meter */}
          {watchNew && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                      i <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs font-medium ${
                strength.score <= 1 ? 'text-red-500' :
                strength.score <= 2 ? 'text-orange-500' :
                strength.score <= 3 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {strength.label}
              </p>
            </div>
          )}

          {/* Requirements checklist */}
          {watchNew && (
            <div className="space-y-1 pt-1">
              {requirements.map(({ label, met }) => (
                <div key={label} className="flex items-center gap-2">
                  <CheckCircle
                    size={13}
                    className={met ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}
                  />
                  <span className={`text-xs ${met ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="relative">
          <Input
            label="Confirm new password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Repeat new password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <EyeToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
        </div>

        <div className="pt-2">
          <Button type="submit" loading={isSubmitting}>
            Update password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordSettings;