import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel = 'Continue shopping',
  actionTo = '/shop',
  onAction,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'mx-auto max-w-lg px-4 py-20 sm:py-24 text-center',
        className
      )}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
        <Icon className="h-7 w-7 text-brand-500" aria-hidden />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-brand-950">
        {title}
      </h1>
      <p className="mt-3 text-brand-500 leading-relaxed">{description}</p>
      {children}
      {(onAction || actionTo) && (
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {onAction ? (
            <Button size="lg" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : (
            <Link to={actionTo!}>
              <Button size="lg">{actionLabel}</Button>
            </Link>
          )}
          <Link to="/">
            <Button size="lg" variant="outline">
              Back to home
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
