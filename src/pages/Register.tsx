import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/common/Button';

const schema = z
  .object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    email: z.string().email('Valid email required'),
    password: z.string().min(6, 'At least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export function Register() {
  useDocumentTitle('Register');
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const addToast = useToastStore((s) => s.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await registerApi({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      setAuth(res.token, res.user);
      addToast(
        res.user.role === 'admin'
          ? 'Account created - you are the admin'
          : 'Account created',
        'success'
      );
      navigate('/account', { replace: true });
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Registration failed', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-brand-950">
        Create account
      </h1>
      <p className="mt-2 text-brand-500 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-900 font-medium underline">
          Log in
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First name</label>
            <input
              {...register('firstName')}
              className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last name</label>
            <input
              {...register('lastName')}
              className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            {...register('password')}
            type="password"
            autoComplete="new-password"
            className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm password</label>
          <input
            {...register('confirmPassword')}
            type="password"
            autoComplete="new-password"
            className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-xs text-brand-400">
        The first registered user automatically becomes an admin.
      </p>
    </div>
  );
}
