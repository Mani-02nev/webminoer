import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import CertificatePreviewPage from './pages/CertificatePreviewPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ProgramsPage from './pages/ProgramsPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import AdminGeneratorPage from './pages/AdminGeneratorPage';
import AttendancePage from './pages/AttendancePage';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const location = useLocation();

  return (
    <div className="bg-dark-bg min-h-screen flex flex-col font-body text-text-primary selection:bg-brand-500 selection:text-white">
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/certificate-preview" element={<CertificatePreviewPage />} />
            <Route path="/certificate/:id" element={<CertificatePreviewPage />} />
            <Route path="/verify" element={<VerifyCertificatePage />} />
            <Route path="/verify/:id" element={<VerifyCertificatePage />} />
            <Route path="/admin" element={<AdminGeneratorPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default App;
