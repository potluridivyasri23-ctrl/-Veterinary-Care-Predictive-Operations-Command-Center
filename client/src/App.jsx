import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import OwnersPage from './pages/OwnersPage';
import TasksPage from './pages/TasksPage';
import BillingPage from './pages/BillingPage';
import AIPage from './pages/AIPage';
import ReportsPage from './pages/ReportsPage';
import AnimalsPage from './pages/AnimalsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import TreatmentsPage from './pages/TreatmentsPage';
import VaccinationsPage from './pages/VaccinationsPage';
import FollowUpsPage from './pages/FollowUpsPage';
import WorkflowQueuesPage from './pages/WorkflowQueuesPage';
import ForecastPage from './pages/ForecastPage';
import RiskAnalysisPage from './pages/RiskAnalysisPage';
import ScenarioPlanningPage from './pages/ScenarioPlanningPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import AlertsPage from './pages/AlertsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import ConfigurationPage from './pages/ConfigurationPage';
import AnomaliesPage from './pages/AnomaliesPage';
import NotificationsPage from './pages/NotificationsPage';
import UserManagementPage from './pages/UserManagementPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './layouts/Layout';

import { isPathAllowed } from './utils/rbac';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function RoleGuard({ path, children }) {
  const { user } = useAuth();
  if (!isPathAllowed(user?.role, path)) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
        <div style={{ fontSize: 54, marginBottom: 12 }}>🔒</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Access Restricted</h2>
        <p style={{ fontSize: 14, margin: '0 0 20px' }}>Your role (<strong>{user?.role}</strong>) does not have permission to view this page.</p>
        <a href="/" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          ← Return to Dashboard
        </a>
      </div>
    );
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="appointments" element={<RoleGuard path="/appointments"><AppointmentsPage /></RoleGuard>} />
            <Route path="owners" element={<RoleGuard path="/owners"><OwnersPage /></RoleGuard>} />
            <Route path="tasks" element={<RoleGuard path="/tasks"><TasksPage /></RoleGuard>} />
            <Route path="billing" element={<RoleGuard path="/billing"><BillingPage /></RoleGuard>} />
            <Route path="animals" element={<RoleGuard path="/animals"><AnimalsPage /></RoleGuard>} />
            <Route path="medical-records" element={<RoleGuard path="/medical-records"><MedicalRecordsPage /></RoleGuard>} />
            <Route path="diagnostics" element={<RoleGuard path="/diagnostics"><DiagnosticsPage /></RoleGuard>} />
            <Route path="treatments" element={<RoleGuard path="/treatments"><TreatmentsPage /></RoleGuard>} />
            <Route path="vaccinations" element={<RoleGuard path="/vaccinations"><VaccinationsPage /></RoleGuard>} />
            <Route path="follow-ups" element={<RoleGuard path="/follow-ups"><FollowUpsPage /></RoleGuard>} />
            <Route path="workflow-queues" element={<RoleGuard path="/workflow-queues"><WorkflowQueuesPage /></RoleGuard>} />
            <Route path="forecast" element={<RoleGuard path="/forecast"><ForecastPage /></RoleGuard>} />
            <Route path="risk-analysis" element={<RoleGuard path="/risk-analysis"><RiskAnalysisPage /></RoleGuard>} />
            <Route path="scenario-planning" element={<RoleGuard path="/scenario-planning"><ScenarioPlanningPage /></RoleGuard>} />
            <Route path="analytics" element={<RoleGuard path="/analytics"><AnalyticsDashboardPage /></RoleGuard>} />
            <Route path="alerts" element={<RoleGuard path="/alerts"><AlertsPage /></RoleGuard>} />
            <Route path="anomalies" element={<RoleGuard path="/anomalies"><AnomaliesPage /></RoleGuard>} />
            <Route path="notifications" element={<RoleGuard path="/notifications"><NotificationsPage /></RoleGuard>} />
            <Route path="users" element={<RoleGuard path="/users"><UserManagementPage /></RoleGuard>} />
            <Route path="audit-logs" element={<RoleGuard path="/audit-logs"><AuditLogsPage /></RoleGuard>} />
            <Route path="configurations" element={<RoleGuard path="/configurations"><ConfigurationPage /></RoleGuard>} />
            <Route path="ai" element={<RoleGuard path="/ai"><AIPage /></RoleGuard>} />
            <Route path="reports" element={<RoleGuard path="/reports"><ReportsPage /></RoleGuard>} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
