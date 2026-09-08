import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center">
      <p className="text-sm font-medium tracking-widest text-brand-500 uppercase">
        404
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-950">
        Page not found
      </h1>
      <p className="mt-3 text-brand-500">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link to="/">
          <Button>Go home</Button>
        </Link>
        <Link to="/shop">
          <Button variant="outline">Shop</Button>
        </Link>
      </div>
    </div>
  );
}
