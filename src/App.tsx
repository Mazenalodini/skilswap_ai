import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'));
const Learning = lazy(() => import('./pages/Learning'));
const Community = lazy(() => import('./pages/Community'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const BrowseRequests = lazy(() => import('./pages/BrowseRequests'));
const ServiceRequest = lazy(() => import('./pages/ServiceRequest'));
const SkillAssessment = lazy(() => import('./pages/SkillAssessment'));
const Messages = lazy(() => import('./pages/Messages'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Disputes = lazy(() => import('./pages/Disputes'));
const DebugPage = lazy(() => import('./pages/Debug'));

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="جاري التحميل..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16 pb-20">
        <Suspense fallback={<LoadingSpinner message="جاري تحميل الصفحة..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/profile/:userId?" element={user ? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
            <Route path="/learning" element={user ? <Learning /> : <Navigate to="/login" replace />} />
            <Route path="/community" element={<Community />} />
            <Route path="/browse-requests" element={user ? <BrowseRequests /> : <Navigate to="/login" replace />} />
            <Route path="/request-service" element={user ? <ServiceRequest /> : <Navigate to="/login" replace />} />
            <Route path="/skill-assessment/:skill" element={user ? <SkillAssessment /> : <Navigate to="/login" replace />} />
            <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" replace />} />
            <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" replace />} />
            <Route path="/disputes" element={user ? <Disputes /> : <Navigate to="/login" replace />} />
            <Route path="/debug" element={<DebugPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ErrorBoundary>
          <Router>
            <AppContent />
          </Router>
        </ErrorBoundary>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
