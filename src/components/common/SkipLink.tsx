/** Skip to main content — first focusable control for keyboard users */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-900 focus:text-white focus:rounded-md focus:text-sm focus:font-medium"
    >
      Skip to main content
    </a>
  );
}
