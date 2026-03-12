import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './shared/components/layout/Layout';
import DashboardPage from './features/dashboard/DashboardPage';
import POSPage from './features/pos/POSPage';
import InventoryPage from './features/inventory/InventoryPage';
import CustomersPage from './features/customers/CustomersPage';
import ReportsPage from './features/reports/ReportsPage';
import SettingsPage from './features/settings/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pos" element={<POSPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
