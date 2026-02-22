import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

// Public Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Admin Layout
import AdminLayout from "./components/admin/AdminLayout";

// Public Pages
import Home from "./pages/Home";
import Schemes from "./pages/Schemes";
import SchemeDetail from "./pages/SchemeDetail";
import Grievances from "./pages/Grievances";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ApplyScheme from "./pages/ApplyScheme";
import LodgeGrievance from "./pages/LodgeGrievance";
import TrackGrievance from "./pages/TrackGrievance";
import Contact from "./pages/Contact";
import SuccessStories from "./pages/SuccessStories";

// Admin Pages
import AdminDashboard from "./pages/Admindashboard";
import ApplicationsManagement from "./pages/admin/ApplicationsManagement";
import GrievancesManagement from "./pages/admin/Grievancesmanagement";
import SchemesManagement from "./pages/admin/SchemesManagement";
import SchemeForm from "./pages/admin/SchemeForm";
import ContactQueries from "./pages/admin/ContactQueries";

const toastOptions = {
  duration: 3000,
  style: {
    background: "var(--bg-sec)",
    color: "var(--txt)",
    border: "1px solid var(--btn)",
    fontSize: "14px",
  },
  success: { iconTheme: { primary: "var(--btn)", secondary: "white" } },
  error: { iconTheme: { primary: "#ef4444", secondary: "white" } },
};

// Wrapper for public pages that shows Navbar + Footer
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ─── Public Routes (with Navbar + Footer) ─── */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/schemes"
            element={
              <PublicLayout>
                <Schemes />
              </PublicLayout>
            }
          />
          <Route
            path="/scheme/:id"
            element={
              <PublicLayout>
                <SchemeDetail />
              </PublicLayout>
            }
          />
          <Route
            path="/grievances"
            element={
              <PublicLayout>
                <Grievances />
              </PublicLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PublicLayout>
                <Dashboard />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicLayout>
                <Signup />
              </PublicLayout>
            }
          />
          <Route
            path="/apply-scheme"
            element={
              <PublicLayout>
                <ApplyScheme />
              </PublicLayout>
            }
          />
          <Route
            path="/lodge-grievance"
            element={
              <PublicLayout>
                <LodgeGrievance />
              </PublicLayout>
            }
          />
          <Route
            path="/track-grievance"
            element={
              <PublicLayout>
                <TrackGrievance />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            }
          />
          <Route
            path="/success-stories"
            element={
              <PublicLayout>
                <SuccessStories />
              </PublicLayout>
            }
          />

          {/* ─── Admin Routes (sidebar layout, no public navbar) ─── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="applications" element={<ApplicationsManagement />} />
            <Route path="grievances" element={<GrievancesManagement />} />
            <Route path="schemes" element={<SchemesManagement />} />
            <Route path="schemes/add" element={<SchemeForm mode="add" />} />
            <Route
              path="schemes/edit/:id"
              element={<SchemeForm mode="edit" />}
            />
            <Route path="queries" element={<ContactQueries />} />
            {/* Placeholder routes for future pages */}
            <Route
              path="users"
              element={
                <div className="p-8 text-txt-dim">
                  Users Management — Coming Soon
                </div>
              }
            />
            <Route
              path="analytics"
              element={
                <div className="p-8 text-txt-dim">Analytics — Coming Soon</div>
              }
            />
            <Route
              path="settings"
              element={
                <div className="p-8 text-txt-dim">Settings — Coming Soon</div>
              }
            />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster position="top-right" toastOptions={toastOptions} />
      </Router>
    </AuthProvider>
  );
}

export default App;
