import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Menu, 
  Check, 
  AlertTriangle,
  X,
  ShieldCheck,
  LogOut,
  Settings as SettingsIcon,
  ChevronDown,
  Database,
  Store
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { KASIRKU_LOGO_URL } from '../data/initialData';
import { TursoStatusModal } from './TursoStatusModal';

interface TopHeaderProps {
  placeholder?: string;
  showSearchBar?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ 
  placeholder = "Cari SKU, Nama Produk, atau Transaksi...",
  showSearchBar = true
}) => {
  const { 
    globalSearch, 
    setGlobalSearch, 
    toggleSidebar,
    isSidebarCollapsed,
    setIsBantuanModalOpen,
    currentUser,
    logout,
    products,
    setActiveTab,
    tursoStatus,
    setShowLandingPage
  } = usePOS();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTursoModalOpen, setIsTursoModalOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    if (window.confirm('Apakah Anda yakin ingin keluar dari sesi kasir?')) {
      logout();
    }
  };

  return (
    <>
    <header className="sticky top-0 z-30 w-full h-16 bg-[#ffffff] border-b border-[#c1c7cd] px-4 md:px-6 flex items-center justify-between shadow-2xs">
      {/* Left side: Hamburger Toggle + Logo (on mobile) + Search Bar */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        {/* Dedicated Hamburger Menu Button (Visible everywhere) */}
        <button
          type="button"
          id="topheader-hamburger-btn"
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-[#41484d] hover:text-[#191c1e] hover:bg-[#edeef0] transition-colors cursor-pointer shrink-0"
          title={`Toggle Menu Navigasi (${isSidebarCollapsed ? 'Perluas' : 'Ciutkan'} - Ctrl+B)`}
          aria-label="Toggle menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2 shrink-0">
          <img src={KASIRKU_LOGO_URL} alt="Logo" className="h-7 w-auto object-contain" />
          <span className="font-black text-[18px] text-[#2f6481] tracking-tight">KASIRKU</span>
        </div>

        {/* Global Search Bar */}
        {showSearchBar && (
          <div className="relative w-full max-w-sm hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71787e] pointer-events-none" />
            <input
              type="text"
              id="topheader-search-input"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-9 py-2 bg-[#ffffff] border border-[#c1c7cd] rounded-lg text-[14px] text-[#191c1e] placeholder-[#71787e] focus:outline-none focus:border-[#2f6481] focus:ring-1 focus:ring-[#2f6481] transition-all"
            />
            {globalSearch && (
              <button 
                type="button"
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71787e] hover:text-[#191c1e] p-1 rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right side: Turso Database Pill, Notifications, Quick Help, and Logged-in User Profile */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Turso Database Cloud Status Pill */}
        <button
          type="button"
          id="btn-turso-status"
          onClick={() => setIsTursoModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#c1c7cd] bg-[#ffffff] hover:bg-[#edeef0] text-[12px] font-semibold text-[#191c1e] transition-all cursor-pointer shadow-2xs group"
          title="Status Database Turso Cloud (Klik untuk detail)"
        >
          <Database className="w-4 h-4 text-[#2f6481] group-hover:scale-110 transition-transform" />
          <span className={`w-2 h-2 rounded-full ${tursoStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500 animate-ping'}`} />
          <span className="hidden sm:inline font-bold">Turso</span>
          {tursoStatus?.latencyMs !== undefined ? (
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-bold">
              {tursoStatus.latencyMs}ms
            </span>
          ) : (
            <span className="text-[10px] text-[#5e666d] hidden sm:inline">Cloud</span>
          )}
        </button>

        {/* Landing Page Quick Link */}
        <button
          type="button"
          onClick={() => setShowLandingPage(true)}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#c1c7cd] hover:bg-[#edeef0] text-[12px] font-bold text-[#2f6481] transition-colors cursor-pointer shadow-2xs"
          title="Buka Landing Page Enterprise KASIRKU"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Landing Page</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            id="btn-notifications"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#41484d] hover:bg-[#edeef0] transition-colors relative cursor-pointer"
            title="Notifikasi Peringatan Stok"
          >
            <Bell className="w-5 h-5" />
            {lowStockCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#c1c7cd] py-2 z-50 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#edeef0] flex items-center justify-between">
                <span className="font-bold text-[14px] text-[#191c1e]">Pemberitahuan Sistem</span>
                <span className="text-[11px] font-semibold bg-[#ffdad6] text-[#ba1a1a] px-2 py-0.5 rounded-full">
                  {lowStockCount} Peringatan
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#edeef0]">
                {lowStockCount > 0 ? (
                  products
                    .filter((p) => p.stock <= p.minStockAlert)
                    .map((p) => (
                      <div 
                        key={p.id} 
                        onClick={() => {
                          setActiveTab('stok');
                          setIsNotificationOpen(false);
                        }}
                        className="px-4 py-3 hover:bg-[#f3f3f6] transition-colors cursor-pointer flex items-start gap-3"
                      >
                        <div className="p-1.5 bg-[#ffdad6] text-[#ba1a1a] rounded-md shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#191c1e] truncate">{p.name}</p>
                          <p className="text-[12px] text-[#ba1a1a]">
                            Sisa stok: <span className="font-bold">{p.stock}</span> (Batas: {p.minStockAlert})
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="px-4 py-6 text-center text-[#71787e] text-[13px]">
                    <Check className="w-8 h-8 text-emerald-600 mx-auto mb-1 opacity-80" />
                    Semua stok produk dalam kondisi aman.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Shortcut Help Button */}
        <button
          type="button"
          id="btn-quick-help"
          onClick={() => setIsBantuanModalOpen(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#41484d] hover:bg-[#edeef0] transition-colors cursor-pointer"
          title="Bantuan & Pintasan Kasir"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* User Profile Menu & Role Badge */}
        <div className="relative ml-1 pl-3 border-l border-[#c1c7cd]" ref={userMenuRef}>
          <button
            type="button"
            id="topheader-user-badge"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#edeef0] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2f6481] text-white flex items-center justify-center font-bold text-[12px] shrink-0">
              {currentUser?.avatarInitials || 'SA'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-[#191c1e] leading-tight">
                  {currentUser?.fullName || 'Naurah Digital'}
                </span>
                {currentUser?.role === 'super_admin' && (
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#cfe2f1] text-[#14374a] leading-none">
                    Super Admin
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#71787e] leading-tight font-mono">
                @{currentUser?.username || 'naurahdigiss01'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#71787e] hidden md:block" />
          </button>

          {/* User Profile Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#c1c7cd] py-2 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#edeef0] bg-[#f8f9fc]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#2f6481] text-white flex items-center justify-center font-bold text-[13px]">
                    {currentUser?.avatarInitials || 'SA'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#191c1e] truncate leading-tight">
                      {currentUser?.fullName || 'Naurah Digital'}
                    </p>
                    <p className="text-[11px] text-[#71787e] truncate font-mono">
                      @{currentUser?.username || 'naurahdigiss01'}
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#edeef0] flex items-center justify-between text-[11px]">
                  <span className="text-[#71787e]">Hak Akses:</span>
                  <span className="font-bold text-[#2f6481] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {currentUser?.roleLabel || 'Super Administrator'}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowLandingPage(true);
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-[13px] font-semibold text-[#2f6481] hover:bg-[#edeef0] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Store className="w-4 h-4 text-[#2f6481]" />
                  <span>Lihat Landing Page POS</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('pengaturan');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-[13px] font-semibold text-[#41484d] hover:bg-[#edeef0] hover:text-[#191c1e] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <SettingsIcon className="w-4 h-4 text-[#71787e]" />
                  <span>Pengaturan Sistem</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsBantuanModalOpen(true);
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-[13px] font-semibold text-[#41484d] hover:bg-[#edeef0] hover:text-[#191c1e] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <HelpCircle className="w-4 h-4 text-[#71787e]" />
                  <span>Bantuan & Panduan</span>
                </button>
              </div>

              <div className="border-t border-[#edeef0] pt-1">
                <button
                  type="button"
                  id="topheader-btn-logout"
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-[13px] font-semibold text-[#ba1a1a] hover:bg-[#ffdad6] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-[#ba1a1a]" />
                  <span>Keluar dari Sesi</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
    <TursoStatusModal 
      isOpen={isTursoModalOpen} 
      onClose={() => setIsTursoModalOpen(false)} 
    />
  </>
  );
};
