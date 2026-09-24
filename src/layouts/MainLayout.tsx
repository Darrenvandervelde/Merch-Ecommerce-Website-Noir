import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ToastContainer } from '../components/common/Toast';
import { SkipLink } from '../components/common/SkipLink';
import { ScrollToTop } from '../components/common/ScrollToTop';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <ScrollToTop />
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
