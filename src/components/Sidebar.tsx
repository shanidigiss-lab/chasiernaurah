import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  Tag, 
  Boxes, 
  History, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut,
  X,
  Menu,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Compass
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { NavigationTab } from '../types';
import { KASIRKU_LOGO_URL } from '../data/initialData';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen, 
    isSidebarCollapsed,
    toggleSidebar,
    setIsBantuanModalOpen,
    currentUser,
    logout,
    setShowLandingPage
  } = usePOS();

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kasir', label: 'Kasir', icon: Store },
    { id: 'produk', label: 'Produk', icon: Package },
    { id: 'kategori', label: 'Kategori', icon: Tag },
    { id: 'stok', label: 'Stok', icon: Boxes },
    { id: 'riwayat', label: 'Riwayat Penjualan', icon: History },
    { id: 'laporan', label: 'Laporan', icon: BarChart3 },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari sesi kasir?')) {
      logout();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Sidebar (Desktop collapsible & Mobile drawer) */}
      <aside 
        className={`
          fixed left-0 top-0 h-screen bg-[#f3f3f6] border-r border-[#c1c7cd] 
          flex flex-col py-4 z-50 transition-all duration-200 ease-in-out select-none
          ${isMobileMenuOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full md:translate-x-0'}
          ${isSidebarCollapsed ? 'md:w-[76px]' : 'md:w-[280px]'}
        `}
      >
        {/* Mobile Close Button */}
        <div className="md:hidden absolute top-4 right-4 z-10">
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 text-[#41484d] hover:bg-[#e1e2e5] rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Header with Brand + Hamburger Menu Toggle */}
        <div className={`px-4 mb-4 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#c1c7cd] shadow-2xs flex items-center justify-center p-1.5 shrink-0">
                <img 
                  src={KASIRKU_LOGO_URL} 
                  alt="KASIRKU Logo" 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-[17px] font-black tracking-tight text-[#2f6481] leading-tight truncate">
                  KASIRKU
                </h1>
                <span className="text-[11px] font-bold text-[#71787e] tracking-wider uppercase block leading-none truncate">
                  Enterprise POS
                </span>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white border border-[#c1c7cd] shadow-2xs flex items-center justify-center p-1.5 shrink-0 mb-1">
              <img 
                src={KASIRKU_LOGO_URL} 
                alt="KASIRKU Logo" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}

          {/* Desktop Hamburger Toggle Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            id="sidebar-hamburger-toggle"
            className="hidden md:flex p-2 rounded-lg text-[#41484d] hover:text-[#191c1e] hover:bg-[#e1e2e5] transition-colors cursor-pointer"
            title={isSidebarCollapsed ? "Perluas Menu (Ctrl+B)" : "Ciutkan Menu (Ctrl+B)"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`
                  w-full flex items-center rounded-xl text-[14px] font-semibold transition-all duration-150 cursor-pointer
                  ${isSidebarCollapsed ? 'justify-center py-3 px-0' : 'gap-3.5 px-3.5 py-2.5 text-left'}
                  ${
                    isActive
                      ? 'bg-[#cfe2f1] text-[#265c79] shadow-2xs font-bold'
                      : 'text-[#41484d] hover:text-[#191c1e] hover:bg-[#e7e8eb]'
                  }
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#265c79]' : 'text-[#41484d]'}`} />
                {!isSidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card & Footer Navigation */}
        <div className="mt-auto px-3 pt-3 border-t border-[#c1c7cd] space-y-2">
          {/* User Profile info */}
          {currentUser && (
            <div 
              onClick={() => setActiveTab('pengaturan')}
              className={`
                rounded-xl bg-white border border-[#c1c7cd] p-2.5 cursor-pointer hover:border-[#2f6481] transition-all shadow-2xs
                ${isSidebarCollapsed ? 'flex justify-center p-2' : 'flex items-center gap-2.5'}
              `}
              title="Profil Pengguna"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2f6481] text-white flex items-center justify-center font-bold text-[12px] shrink-0">
                {currentUser.avatarInitials}
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[13px] font-bold text-[#191c1e] truncate block leading-tight">
                      {currentUser.fullName}
                    </span>
                    {currentUser.role === 'super_admin' && (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2f6481] shrink-0" title="Super Admin" />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-[#71787e] block truncate leading-none mt-0.5">
                    {currentUser.roleLabel}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Landing Page Preview button */}
          <button
            onClick={() => {
              setShowLandingPage(true);
              setIsMobileMenuOpen(false);
            }}
            title={isSidebarCollapsed ? "Landing Page" : undefined}
            className={`
              w-full flex items-center rounded-xl text-[13px] font-semibold text-[#2f6481] hover:text-[#14374a] hover:bg-[#e7e8eb] transition-all cursor-pointer
              ${isSidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2 text-left'}
            `}
          >
            <Compass className="w-4 h-4 text-[#2f6481] shrink-0" />
            {!isSidebarCollapsed && <span>Landing Page</span>}
          </button>

          {/* Help button */}
          <button
            onClick={() => {
              setIsBantuanModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            title={isSidebarCollapsed ? "Bantuan" : undefined}
            className={`
              w-full flex items-center rounded-xl text-[13px] font-semibold text-[#41484d] hover:text-[#191c1e] hover:bg-[#e7e8eb] transition-all cursor-pointer
              ${isSidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2 text-left'}
            `}
          >
            <HelpCircle className="w-4 h-4 text-[#41484d] shrink-0" />
            {!isSidebarCollapsed && <span>Panduan POS</span>}
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogoutClick}
            id="sidebar-btn-logout"
            title={isSidebarCollapsed ? "Keluar Sesi" : undefined}
            className={`
              w-full flex items-center rounded-xl text-[13px] font-semibold text-[#ba1a1a] hover:bg-[#ffdad6] transition-all cursor-pointer
              ${isSidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2 text-left'}
            `}
          >
            <LogOut className="w-4 h-4 text-[#ba1a1a] shrink-0" />
            {!isSidebarCollapsed && <span>Keluar Sesi</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
