import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedJobs from './components/FeaturedJobs';
import HowItWorks from './components/HowItWorks';
import EmployerCTA from './components/EmployerCTA';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import JobsPage from './pages/JobsPage';
import EmployerDashboard from './pages/EmployerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateApplications from './pages/CandidateApplications';
import ApplicationDetail from './pages/ApplicationDetail';
import AdminDashboard from './pages/AdminDashboard'; // ADD THIS
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Hero />
                  <FeaturedJobs />
                  <HowItWorks />
                  <EmployerCTA />
                  <Footer />
                </>
              } />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/jobs" element={<JobsPage />} />

              {/* Employer Routes */}
              <Route
                path="/employer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Candidate Routes */}
              <Route
                path="/candidate/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <CandidateDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidate/applications"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <CandidateApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidate/applications/:id"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <ApplicationDetail />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes - NEW */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['employer']} requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;