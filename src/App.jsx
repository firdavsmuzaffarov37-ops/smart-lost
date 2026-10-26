import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Toast from './components/common/Toast';
import MobileBottomNav from './components/common/MobileBottomNav';

import DashboardPage from './pages/DashboardPage';
import LostItemsPage from './pages/LostItemsPage';
import FoundItemsPage from './pages/FoundItemsPage';
import ReportLostPage from './pages/ReportLostPage';
import ReportFoundPage from './pages/ReportFoundPage';
import MapPage from './pages/MapPage';
import AiMatchingPage from './pages/AiMatchingPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import MessagesPage from './pages/MessagesPage';
import MyReportsPage from './pages/MyReportsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function AppLayout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
        {children}
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Voiceon-inspired fixed left sidebar */}
      <Sidebar />

      {/* Main app body */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-16">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav bar for phone/tablet */}
      <MobileBottomNav />

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/lost" element={<LostItemsPage />} />
            <Route path="/found" element={<FoundItemsPage />} />
            <Route path="/report/lost" element={<ReportLostPage />} />
            <Route path="/report/found" element={<ReportFoundPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/matching" element={<AiMatchingPage />} />
            <Route path="/item/:id" element={<ItemDetailsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/my-reports" element={<MyReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </AppProvider>
    </BrowserRouter>
  );
}
