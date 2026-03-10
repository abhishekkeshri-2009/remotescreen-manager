import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { RequireAuth } from '../components/RequireAuth';
import { LoginPage } from '../pages/LoginPage';
import { AppsPage } from '../pages/AppsPage';
import { ScreensPage } from '../pages/ScreensPage';
import { LayoutBuilderPage } from '../pages/LayoutBuilderPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/apps"
          element={
            <RequireAuth>
              <AppsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/apps/:appId/screens"
          element={
            <RequireAuth>
              <ScreensPage />
            </RequireAuth>
          }
        />
        <Route
          path="/apps/:appId/screens/:screenId/builder"
          element={
            <RequireAuth>
              <LayoutBuilderPage />
            </RequireAuth>
          }
        />
        <Route path="/" element={<Navigate to="/apps" replace />} />
      </Route>
    </Routes>
  );
}

