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

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
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
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="owners" element={<OwnersPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="animals" element={<AnimalsPage />} />
            <Route path="medical-records" element={<MedicalRecordsPage />} />
            <Route path="diagnostics" element={<DiagnosticsPage />} />
            <Route path="treatments" element={<TreatmentsPage />} />
            <Route path="vaccinations" element={<VaccinationsPage />} />
            <Route path="follow-ups" element={<FollowUpsPage />} />
            <Route path="workflow-queues" element={<WorkflowQueuesPage />} />
            <Route path="forecast" element={<ForecastPage />} />
            <Route path="risk-analysis" element={<RiskAnalysisPage />} />
            <Route path="scenario-planning" element={<ScenarioPlanningPage />} />
            <Route path="analytics" element={<AnalyticsDashboardPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="anomalies" element={<AnomaliesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="configurations" element={<ConfigurationPage />} />
            <Route path="ai" element={<AIPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
