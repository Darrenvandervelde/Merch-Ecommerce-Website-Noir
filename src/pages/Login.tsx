import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/common/Button';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  useDocumentTitle('Log in');
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const addToast = useToastStore((s) => s.addToast);

  const from = (location.state as { from?: string })?.from || '/account';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await login(data);
      setAuth(res.token, res.user);
      addToast(`Welcome back, ${res.user.firstName}`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Login failed', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-brand-950">Log in</h1>
      <p className="mt-2 text-brand-500 text-sm">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-brand-900 font-medium underline">
          Register
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
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
            autoComplete="current-password"
            className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
          Log in
        </Button>
      </form>
    </div>
  );
}
