import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Schemes from './pages/Schemes.jsx';
import Grievances from './pages/Grievances.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ApplyScheme from './pages/ApplyScheme.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/grievances" element={<Grievances />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/apply-scheme" element={<ApplyScheme />} />
              
              {/* Placeholder routes for future pages */}
              <Route path="/lodge-grievance" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl text-txt">Lodge Grievance - Coming Soon</h1></div>} />
              <Route path="/track-grievance" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl text-txt">Track Grievance - Coming Soon</h1></div>} />
              <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl text-txt">Contact Us - Coming Soon</h1></div>} />
            </Routes>
          </main>

          <Footer />
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--bg-sec)',
                color: 'var(--txt)',
                border: '1px solid var(--btn)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--btn)',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'white',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;