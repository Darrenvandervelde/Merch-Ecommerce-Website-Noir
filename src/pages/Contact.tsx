import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '../components/common/Button';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    // In production: POST to backend / email service
    await new Promise((r) => setTimeout(r, 800));
    setStatus('success');
    reset();
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-brand-950">Contact</h1>
      <p className="mt-3 text-brand-500">
        Questions about an order or product? We’re here to help.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            {...register('name')}
            className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            {...register('subject')}
            className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            {...register('message')}
            rows={5}
            className="w-full px-3 py-2 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        <Button type="submit" size="lg" isLoading={isSubmitting}>
          Send message
        </Button>

        {status === 'success' && (
          <p className="text-green-600 text-sm">
            Message sent. We’ll get back to you soon.
          </p>
        )}
      </form>
    </div>
  );
}
