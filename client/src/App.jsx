import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { schemesData } from "./data/mockData";

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
import SuggestScheme from "./pages/SuggestScheme";

// Admin Pages
import AdminDashboard from "./pages/Admindashboard";
import ApplicationsManagement from "./pages/admin/Applicationsmanagement";
import GrievancesManagement from "./pages/admin/Grievancesmanagement";
import SchemesManagement from "./pages/admin/Schemesmanagement";
import SchemeForm from "./pages/admin/SchemeForm";
import ContactQueries from "./pages/admin/Contactqueries";
import Settings from "./pages/admin/Settings";
import UsersManagement from "./pages/admin/Usersmanagement";

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

function PageTitleHandler() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    let title = "Yojna Saathi";

    if (pathname !== "/") {
      const routes = {
        "/suggest": "Suggest Scheme",
        "/schemes": "Schemes",
        "/grievances": "Grievances",
        "/dashboard": "Dashboard",
        "/login": "Login",
        "/signup": "Signup",
        "/apply-scheme": "Apply Scheme",
        "/lodge-grievance": "Lodge Grievance",
        "/track-grievance": "Track Grievance",
        "/contact": "Contact",
        "/success-stories": "Success Stories",
        "/admin/dashboard": "Admin Dashboard",
        "/admin/applications": "Applications Management",
        "/admin/grievances": "Grievances Management",
        "/admin/schemes": "Schemes Management",
        "/admin/schemes/add": "Add Scheme",
        "/admin/queries": "Contact Queries",
        "/admin/users": "Users Management",
        "/admin/analytics": "Analytics",
        "/admin/settings": "Settings",
      };

      if (routes[pathname]) {
        title = `${routes[pathname]} | Yojna Saathi`;
      } else if (pathname.startsWith("/scheme/")) {
        const id = pathname.split("/").pop();
        const scheme = schemesData.find((s) => s.id === parseInt(id));
        title = scheme ? `${scheme.title} | Yojna Saathi` : "Scheme Details | Yojna Saathi";
      } else if (pathname.startsWith("/admin/schemes/edit/")) {
        title = "Edit Scheme | Yojna Saathi";
      }
    }

    document.title = title;
  }, [location]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <PageTitleHandler />
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
            path="/suggest"
            element={
              <PublicLayout>
                <SuggestScheme />
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
            <Route path="users" element={<UsersManagement />} />
            <Route
              path="analytics"
              element={
                <div className="p-8 text-txt-dim">Analytics — Coming Soon</div>
              }
            />
            <Route path="settings" element={<Settings />} />
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
