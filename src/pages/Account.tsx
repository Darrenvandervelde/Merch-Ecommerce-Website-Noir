import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export function Account() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-brand-950">Account</h1>
      <p className="mt-3 text-brand-500">
        Authentication is ready for a real backend. For now this is a placeholder
        that shows the structure.
      </p>

      <div className="mt-10 space-y-4">
        <div className="p-6 border border-brand-200 rounded-lg">
          <h2 className="font-semibold">Order history</h2>
          <p className="mt-1 text-sm text-brand-500">
            Once logged in, past orders will appear here.
          </p>
        </div>
        <div className="p-6 border border-brand-200 rounded-lg">
          <h2 className="font-semibold">Saved addresses</h2>
          <p className="mt-1 text-sm text-brand-500">
            Manage shipping addresses for faster checkout.
          </p>
        </div>
        <div className="p-6 border border-brand-200 rounded-lg">
          <h2 className="font-semibold">Login / Register</h2>
          <p className="mt-1 text-sm text-brand-500 mb-4">
            Connect a real auth API (e.g. your backend or Auth0 / Clerk / Supabase).
          </p>
          <div className="flex gap-3">
            <Button variant="outline" disabled>
              Log in
            </Button>
            <Button variant="outline" disabled>
              Register
            </Button>
          </div>
        </div>
      </div>

      <Link to="/" className="mt-8 inline-block text-sm text-brand-600 hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
