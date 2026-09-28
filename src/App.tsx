import React from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { KasirView } from './components/KasirView';
import { ProdukView } from './components/ProdukView';
import { KategoriView } from './components/KategoriView';
import { StokView } from './components/StokView';
import { RiwayatView } from './components/RiwayatView';
import { LaporanView } from './components/LaporanView';
import { PengaturanView } from './components/PengaturanView';
import { ReceiptModal } from './components/ReceiptModal';
import { BantuanModal } from './components/BantuanModal';
import { ToastContainer } from './components/ToastContainer';
import { AuthView } from './components/AuthView';
import { LandingPageView } from './components/LandingPageView';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    isAuthenticated, 
    isSidebarCollapsed, 
    unauthView, 
    showLandingPage, 
    setShowLandingPage 
  } = usePOS();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'kasir':
        return <KasirView />;
      case 'produk':
        return <ProdukView />;
      case 'kategori':
        return <KategoriView />;
      case 'stok':
        return <StokView />;
      case 'riwayat':
        return <RiwayatView />;
      case 'laporan':
        return <LaporanView />;
      case 'pengaturan':
        return <PengaturanView />;
      default:
        return <DashboardView />;
    }
  };

  // If user is not authenticated: show Landing Page by default, or AuthView when requested
  if (!isAuthenticated) {
    if (unauthView === 'landing') {
      return (
        <div className="min-h-screen w-screen overflow-x-hidden bg-[#f8f9fc] text-[#191c1e] antialiased">
          <LandingPageView />
          <BantuanModal />
          <ToastContainer />
        </div>
      );
    }

    return (
      <div className="min-h-screen w-screen overflow-x-hidden bg-[#f8f9fc] text-[#191c1e] antialiased">
        <AuthView />
        <BantuanModal />
        <ToastContainer />
      </div>
    );
  }

  // If authenticated user wants to inspect Landing Page
  if (showLandingPage) {
    return (
      <div className="min-h-screen w-screen overflow-x-hidden bg-[#f8f9fc] text-[#191c1e] antialiased">
        <LandingPageView isInsideApp={true} onBackToApp={() => setShowLandingPage(false)} />
        <BantuanModal />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8f9fc] text-[#191c1e] antialiased select-none font-sans">
      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main Content Area (Dynamically offset based on sidebar collapsed state) */}
      <div 
        className={`
          flex-1 flex flex-col h-screen overflow-hidden transition-all duration-200 ease-in-out
          ${isSidebarCollapsed ? 'md:ml-[76px]' : 'md:ml-[280px]'}
        `}
      >
        {/* Top Header Bar with Hamburger Button & Search */}
        <TopHeader 
          showSearchBar={activeTab === 'kasir' || activeTab === 'produk' || activeTab === 'dashboard'} 
          placeholder={
            activeTab === 'kasir' 
              ? "Cari menu atau SKU di kasir..." 
              : activeTab === 'produk'
              ? "Cari produk katalog atau SKU..."
              : "Cari SKU, Nama Produk, atau Transaksi..."
          }
        />

        {/* Dynamic View Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <ReceiptModal />
      <BantuanModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <POSProvider>
      <MainLayout />
    </POSProvider>
  );
}
