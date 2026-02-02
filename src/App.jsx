import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedJobs from './components/FeaturedJobs';
import HowItWorks from './components/HowItWorks';
import EmployerCTA from './components/EmployerCTA';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import JobsPage from './pages/JobsPage';  // ← Keep this import
import EmployerDashboard from './pages/EmployerDashboard';
import ProtectedRoute from './components/ProtectedRoute';


const CandidateDashboard = () => (
  <div className="pt-20 min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">My Applications</h1>
      <p className="text-gray-600">Candidate dashboard coming soon...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
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

            {/* Protected Routes */}
            <Route
              path="/employer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;