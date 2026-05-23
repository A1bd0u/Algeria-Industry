import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HelpWidget from './components/HelpWidget';
import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';
import HeroSlider from './components/HeroSlider';
import { SLIDES_BY_PATH, DEFAULT_SLIDES } from './constants/slides';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Directory from './pages/Directory';
import CompanyProfile from './pages/CompanyProfile';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Tenders from './pages/Tenders';
import Exhibitors from './pages/Exhibitors';
import Catalogues from './pages/Catalogues';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSuccess from './pages/RegisterSuccess';
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import VirtualShow from './pages/VirtualShow';
import Resources from './pages/Resources';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import Events from './pages/Events';
import BecomeExhibitor from './pages/BecomeExhibitor';
import ConsolePro from './pages/ConsolePro';
import SearchResults from './pages/SearchResults';
import TenderDetail from './pages/TenderDetail';
import BlogDetail from './pages/BlogDetail';
import RFQForm from './pages/RFQForm';
import Compare from './pages/Compare';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

import { CurrencyProvider } from './context/CurrencyContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { AuthProvider } from './context/AuthContext';
import { TrackingProvider } from './context/TrackingContext';
import ComparisonBar from './components/ComparisonBar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Create a client for React Query (API data management)
const queryClient = new QueryClient();

// Placeholder components for other pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="min-h-[60vh] flex items-center justify-center bg-neutral-bg">
    <div className="text-center">
      <h2 className="text-3xl font-black text-primary mb-4 uppercase tracking-tighter">{title}</h2>
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Cette page est en cours de développement technique.</p>
    </div>
  </div>
);

import Breadcrumbs from './components/Breadcrumbs';

export default function App() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentSlides = SLIDES_BY_PATH[location.pathname] || DEFAULT_SLIDES;
  const isExtranet = location.pathname.startsWith('/extranet');

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      document.documentElement.lang = lng;
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
      
      if (lng === 'ar') {
        document.body.classList.add('font-arabic');
      } else {
        document.body.classList.remove('font-arabic');
      }
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    // Initial call
    handleLanguageChange(i18n.language);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TrackingProvider>
          <CurrencyProvider>
            <ComparisonProvider>
              <ScrollToTop />
              <div className="flex flex-col min-h-screen">
              {!isExtranet && <Navbar />}
              {!isExtranet && <HeroSlider slides={currentSlides} />}
              <Breadcrumbs />
              <main className="flex-grow">
                <AnimatePresence mode="wait">
                  <Routes location={location}>
                      <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                      <Route path="/directory" element={<PageTransition><Directory /></PageTransition>} />
                      <Route path="/directory/:id" element={<PageTransition><CompanyProfile /></PageTransition>} />
                      <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
                      <Route path="/products/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
                      <Route path="/exhibitors" element={<PageTransition><Exhibitors /></PageTransition>} />
                      <Route path="/tenders" element={<PageTransition><Tenders /></PageTransition>} />
                      <Route path="/tenders/:id" element={<PageTransition><TenderDetail /></PageTransition>} />
                      <Route path="/search" element={<PageTransition><SearchResults /></PageTransition>} />
                      <Route path="/dashboard/*" element={
                        <ProtectedRoute>
                          <PageTransition>
                            <Dashboard />
                          </PageTransition>
                        </ProtectedRoute>
                      } />
                      <Route path="/virtual-show" element={<PageTransition><VirtualShow /></PageTransition>} />
                      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                      <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                      <Route path="/register-success" element={<PageTransition><RegisterSuccess /></PageTransition>} />
                      <Route path="/subscriptions" element={<PageTransition><Subscriptions /></PageTransition>} />
                      <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:id" element={<PageTransition><BlogDetail /></PageTransition>} />
                      <Route path="/rfq" element={<PageTransition><RFQForm /></PageTransition>} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/extranet" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <ConsolePro />
                        </ProtectedRoute>
                      } />
                      <Route path="/become-exhibitor" element={<PageTransition><BecomeExhibitor /></PageTransition>} />
                      <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
                      <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
                      <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
                      <Route path="/compare" element={<PageTransition><Compare /></PageTransition>} />
                      <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                    </Routes>
                  </AnimatePresence>
                </main>
                {!isExtranet && <Footer />}
                <HelpWidget />
                <BackToTop />
                {!isExtranet && <ComparisonBar />}
              </div>
            </ComparisonProvider>
          </CurrencyProvider>
        </TrackingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
