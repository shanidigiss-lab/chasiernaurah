import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  KeyRound, 
  ArrowRight, 
  Database, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Zap, 
  ShoppingBag, 
  Receipt, 
  TrendingUp, 
  Layers, 
  Server, 
  ChevronRight,
  Shield,
  Clock,
  ArrowUpRight,
  Store,
  QrCode,
  Sliders,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { KASIRKU_LOGO_URL } from '../data/initialData';
import { DEMO_ACCOUNTS, DemoAccount } from '../data/authData';
import { GyroscopicDisplayCard } from './GyroscopicDisplayCard';
import { MagneticButton } from './MagneticButton';

interface LandingPageViewProps {
  isInsideApp?: boolean;
  onBackToApp?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ 
  isInsideApp = false,
  onBackToApp
}) => {
  const { 
    setUnauthView, 
    quickLoginAs, 
    tursoStatus, 
    isAuthenticated, 
    currentUser, 
    products, 
    transactions,
    addToast,
    setShowLandingPage,
    setIsBantuanModalOpen
  } = usePOS();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [loggingInUser, setLoggingInUser] = useState<string | null>(null);

  const togglePasswordVisibility = (username: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  const handleCopy = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    addToast('success', `${label} Disalin`, `"${text}" telah disalin ke clipboard.`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleDirectLogin = async (acc: DemoAccount) => {
    setLoggingInUser(acc.username);
    try {
      const ok = await quickLoginAs(acc.username, acc.password);
      if (ok) {
        addToast('success', 'Login Berhasil', `Masuk sebagai ${acc.fullName} (${acc.roleLabel}).`);
      }
    } finally {
      setLoggingInUser(null);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fc] text-[#191c1e] font-sans antialiased selection:bg-[#a1d4f5] selection:text-[#001e2d]">
      {/* ================= TOP NAVIGATION ================= */}
      <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#c1c7cd] px-4 md:px-8 py-3.5 transition-all shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#c1c7cd] shadow-2xs flex items-center justify-center p-1.5">
              <img src={KASIRKU_LOGO_URL} alt="Logo KASIRKU" className="max-h-full max-w-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-[20px] text-[#2f6481] tracking-tight leading-none">KASIRKU</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#cfe2f1] text-[#14374a] uppercase tracking-wider">
                  Turso Edge
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#71787e] tracking-wide block">
                Enterprise Point of Sale & Inventori
              </span>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-[#41484d]">
            <button 
              type="button" 
              onClick={() => scrollToSection('fitur-pos')}
              className="hover:text-[#2f6481] transition-colors cursor-pointer"
            >
              Fitur Utama
            </button>
            <button 
              type="button" 
              onClick={() => scrollToSection('akses-kredensial')}
              className="hover:text-[#2f6481] transition-colors cursor-pointer flex items-center gap-1.5 text-[#2f6481] font-bold bg-[#cfe2f1]/50 px-2.5 py-1 rounded-lg"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Akses Username & Sandi</span>
            </button>
            <button 
              type="button" 
              onClick={() => scrollToSection('arsitektur-turso')}
              className="hover:text-[#2f6481] transition-colors cursor-pointer"
            >
              Database Turso Cloud
            </button>
            <button 
              type="button" 
              onClick={() => setIsBantuanModalOpen(true)}
              className="hover:text-[#2f6481] transition-colors cursor-pointer flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#71787e]" />
              <span>Panduan</span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Live Turso Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-[11px] font-bold text-emerald-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Turso Online</span>
              {tursoStatus?.latencyMs !== undefined && (
                <span className="font-mono text-[10px] text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200">
                  {tursoStatus.latencyMs}ms
                </span>
              )}
            </div>

            {isInsideApp || isAuthenticated ? (
              <MagneticButton
                type="button"
                onClick={() => {
                  if (onBackToApp) onBackToApp();
                  else setShowLandingPage(false);
                }}
                className="bg-[#2f6481] hover:bg-[#25526b] text-white px-4 py-2 rounded-xl text-[13px] font-bold shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Masuk ke Dashboard ({currentUser?.avatarInitials || 'POS'})</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollToSection('akses-kredensial')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#c1c7cd] hover:bg-[#edeef0] text-[13px] font-bold text-[#191c1e] transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#2f6481]" />
                  <span>Lihat Akun Demo</span>
                </button>

                <MagneticButton
                  type="button"
                  onClick={() => setUnauthView('auth')}
                  burstColors={['#2f6481', '#10b981', '#38bdf8', '#fbbf24']}
                  className="bg-[#2f6481] hover:bg-[#25526b] active:bg-[#1a3a4c] text-white px-4 py-2 rounded-xl text-[13px] font-bold shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>Buka Terminal Kasir</span>
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 px-4 md:px-8 border-b border-[#c1c7cd] bg-gradient-to-b from-white via-[#f8f9fc] to-[#f3f3f6]">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#cfe2f1]/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-6">
          {/* Badge announcement */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#c1c7cd] shadow-2xs text-[12px] font-bold text-[#2f6481] animate-in fade-in slide-in-from-top-3 duration-500">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Terhubung Langsung ke Turso Database Cloud (AWS Tokyo)</span>
            <span className="text-[#c1c7cd]">|</span>
            <span className="text-[#5e666d] font-semibold">libSQL Serverless v1.0</span>
          </div>

          {/* Main Title */}
          <h1 className="text-[34px] sm:text-[46px] md:text-[56px] font-black text-[#191c1e] tracking-tight leading-[1.1] max-w-4xl">
            Sistem Kasir Pintar & Modern untuk{' '}
            <span className="text-[#2f6481] underline decoration-[#cfe2f1] decoration-wavy decoration-from-font">
              Ritel Multi-Outlet
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] sm:text-[18px] text-[#41484d] max-w-2xl leading-relaxed">
            Kelola transaksi kasir secepat kilat, lacak mutasi stok inventaris otomatis, 
            dan pantau keuntungan harian dengan persistensi cloud instan berbasis Turso libSQL.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <MagneticButton
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  if (onBackToApp) onBackToApp();
                  else setShowLandingPage(false);
                } else {
                  setUnauthView('auth');
                }
              }}
              magneticStrength={0.28}
              burstColors={['#2f6481', '#10b981', '#38bdf8', '#fbbf24']}
              className="bg-[#2f6481] hover:bg-[#25526b] active:bg-[#1a3a4c] text-white px-6 py-3.5 rounded-xl text-[15px] font-bold shadow-md flex items-center gap-2.5 cursor-pointer"
            >
              <span>{isAuthenticated ? 'Lanjutkan ke Terminal Kasir' : 'Buka Terminal Kasir'}</span>
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>

            <button
              type="button"
              onClick={() => scrollToSection('akses-kredensial')}
              className="bg-white hover:bg-[#edeef0] text-[#191c1e] border border-[#c1c7cd] px-5 py-3.5 rounded-xl text-[15px] font-bold shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-[#2f6481]" />
              <span>Lihat Akses Username & Password</span>
            </button>
          </div>

          {/* Mini Highlights */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl w-full text-left">
            <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#c1c7cd] shadow-2xs">
              <span className="text-[11px] font-bold text-[#71787e] uppercase block">Latensi Database</span>
              <span className="text-[18px] font-black text-emerald-700">
                {tursoStatus?.latencyMs !== undefined ? `${tursoStatus.latencyMs} ms` : '< 400 ms'}
              </span>
              <span className="text-[11px] text-[#5e666d]">AWS Tokyo Serverless</span>
            </div>
            <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#c1c7cd] shadow-2xs">
              <span className="text-[11px] font-bold text-[#71787e] uppercase block">Katalog Produk</span>
              <span className="text-[18px] font-black text-[#191c1e]">{products.length} Item</span>
              <span className="text-[11px] text-[#5e666d]">SKU & Barcode Aktif</span>
            </div>
            <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#c1c7cd] shadow-2xs">
              <span className="text-[11px] font-bold text-[#71787e] uppercase block">Riwayat Transaksi</span>
              <span className="text-[18px] font-black text-[#191c1e]">{transactions.length} Nota</span>
              <span className="text-[11px] text-[#5e666d]">Tersimpan di Cloud</span>
            </div>
            <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#c1c7cd] shadow-2xs">
              <span className="text-[11px] font-bold text-[#71787e] uppercase block">Level Hak Akses</span>
              <span className="text-[18px] font-black text-[#2f6481]">3 Peran Staf</span>
              <span className="text-[11px] text-[#5e666d]">Admin, Spv & Kasir</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= USERNAME & PASSWORD ACCESS SECTION ================= */}
      <section id="akses-kredensial" className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cfe2f1] text-[#14374a] text-[12px] font-bold uppercase tracking-wider">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Kredensial Siap Pakai</span>
          </div>
          <h2 className="text-[28px] sm:text-[38px] font-black text-[#191c1e] tracking-tight">
            Akses Username & Kata Sandi Kasir
          </h2>
          <p className="text-[15px] text-[#41484d] leading-relaxed">
            Akun-akun berikut telah dikonfigurasi dan tersimpan di database Turso. 
            Anda dapat langsung menyalin kredensial atau mengklik <b>"Masuk 1-Klik"</b> untuk mencoba peran masing-masing:
          </p>
        </div>

        {/* 3 Credential Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEMO_ACCOUNTS.map((acc) => {
            const isPasswordVisible = !!visiblePasswords[acc.username];
            const isCurrentLoggingIn = loggingInUser === acc.username;

            return (
              <div 
                key={acc.id}
                className="bg-white rounded-2xl border-2 border-[#c1c7cd] hover:border-[#2f6481] p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${acc.badgeBg} ${acc.badgeText}`}>
                      {acc.roleLabel}
                    </span>
                    <span className="text-[11px] text-[#71787e] font-mono">
                      {acc.branchName}
                    </span>
                  </div>

                  {/* User Profile Header */}
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#2f6481] text-white flex items-center justify-center font-black text-[18px] shadow-2xs shrink-0">
                      {acc.avatarInitials}
                    </div>
                    <div>
                      <h3 className="font-bold text-[17px] text-[#191c1e] leading-tight">
                        {acc.fullName}
                      </h3>
                      <p className="text-[12px] text-[#5e666d]">
                        Peran: <span className="font-semibold text-[#191c1e]">{acc.roleLabel}</span>
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[13px] text-[#41484d] leading-snug mb-5">
                    {acc.description}
                  </p>

                  {/* Credentials Box */}
                  <div className="bg-[#f8f9fc] rounded-xl border border-[#c1c7cd] p-3.5 space-y-3 mb-5">
                    {/* Username Field */}
                    <div className="flex items-center justify-between text-[13px]">
                      <div>
                        <span className="text-[11px] font-bold text-[#71787e] uppercase block">Username / ID</span>
                        <span className="font-mono font-bold text-[#191c1e] text-[14px]">
                          {acc.username}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.username, 'Username', `${acc.username}-user`)}
                        className="p-1.5 rounded-lg border border-[#c1c7cd] bg-white hover:bg-[#edeef0] text-[#41484d] transition-colors cursor-pointer"
                        title="Salin Username"
                      >
                        {copiedField === `${acc.username}-user` ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Password Field */}
                    <div className="flex items-center justify-between text-[13px] pt-2 border-t border-[#edeef0]">
                      <div>
                        <span className="text-[11px] font-bold text-[#71787e] uppercase block">Kata Sandi (Password)</span>
                        <span className="font-mono font-bold text-[#191c1e] text-[14px]">
                          {isPasswordVisible ? acc.password : '••••••••••••'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(acc.username)}
                          className="p-1.5 rounded-lg border border-[#c1c7cd] bg-white hover:bg-[#edeef0] text-[#41484d] transition-colors cursor-pointer"
                          title={isPasswordVisible ? "Sembunyikan Kata Sandi" : "Tampilkan Kata Sandi"}
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(acc.password, 'Kata Sandi', `${acc.username}-pass`)}
                          className="p-1.5 rounded-lg border border-[#c1c7cd] bg-white hover:bg-[#edeef0] text-[#41484d] transition-colors cursor-pointer"
                          title="Salin Kata Sandi"
                        >
                          {copiedField === `${acc.username}-pass` ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Permissions Checklist */}
                  <div className="space-y-1.5 mb-6">
                    <span className="text-[11px] font-bold text-[#71787e] uppercase tracking-wider block">
                      Hak Akses Utama:
                    </span>
                    {acc.permissions.map((perm, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[12px] text-[#41484d]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1-Click Login Action */}
                <MagneticButton
                  type="button"
                  onClick={() => handleDirectLogin(acc)}
                  disabled={isCurrentLoggingIn}
                  magneticStrength={0.25}
                  burstColors={['#2f6481', '#10b981', '#38bdf8']}
                  className="w-full bg-[#2f6481] hover:bg-[#25526b] active:bg-[#1a3a4c] text-white py-2.5 px-4 rounded-xl text-[13px] font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isCurrentLoggingIn ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Masuk 1-Klik sebagai {acc.roleLabel.split(' ')[0]}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </MagneticButton>
              </div>
            );
          })}
        </div>

        {/* Custom Registration Banner */}
        <div className="mt-8 p-6 bg-white rounded-2xl border border-[#c1c7cd] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#cfe2f1] text-[#14374a] flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[16px] text-[#191c1e]">
                Ingin Menambahkan Akun Operator atau Kasir Baru?
              </h4>
              <p className="text-[13px] text-[#5e666d]">
                Daftarkan akun staf baru langsung ke database Turso dengan memilih peran Super Admin, Supervisor, atau Kasir.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUnauthView('auth')}
            className="px-5 py-2.5 rounded-xl bg-white border border-[#c1c7cd] hover:bg-[#edeef0] text-[#191c1e] text-[13px] font-bold transition-colors cursor-pointer shrink-0 shadow-2xs flex items-center gap-2"
          >
            <span>Buka Formulir Pendaftaran</span>
            <ArrowRight className="w-4 h-4 text-[#2f6481]" />
          </button>
        </div>
      </section>

      {/* ================= INTERACTIVE 3D GYROSCOPIC PREVIEW ================= */}
      <section className="py-16 px-4 md:px-8 border-y border-[#c1c7cd] bg-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text side */}
          <div className="lg:w-1/2 space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[12px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pengalaman UI Moderen 3D</span>
            </div>
            <h2 className="text-[28px] sm:text-[36px] font-black text-[#191c1e] tracking-tight leading-tight">
              Terminal Kasir Interaktif dengan Animasi Halus & Responsif
            </h2>
            <p className="text-[15px] text-[#41484d] leading-relaxed">
              KASIRKU dirancang dengan standar desain tinggi: efek rotasi 3D interaktif, 
              magnetic hover pada tombol aksi kasir, dan efek partikel halus yang memberikan kepuasan kerja bagi operator kasir setiap checkout nota berhasil.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-emerald-100 text-emerald-700 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-[#191c1e]">Pencarian Cepat Barcode & Kategori</h4>
                  <p className="text-[12px] text-[#5e666d]">Ketik SKU atau klik kartu produk untuk memasukkan barang ke pesanan tanpa jeda.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-emerald-100 text-emerald-700 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-[#191c1e]">Kalkulator Kembalian & Multi-Payment</h4>
                  <p className="text-[12px] text-[#5e666d]">Dukungan pembayaran Tunai, QRIS dinamis, Kartu Debit, dan Transfer Bank.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-emerald-100 text-emerald-700 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-[#191c1e]">Cetak Struk Thermal Standar Ritel</h4>
                  <p className="text-[12px] text-[#5e666d]">Format struk kasir rapi 58mm/80mm siap dicetak ke printer POS Bluetooth maupun USB.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Display Card preview */}
          <div className="lg:w-1/2 flex items-center justify-center">
            <GyroscopicDisplayCard
              badgeText="LIVE POS SIMULATOR"
              title="Terminal Kasir Enterprise"
              subtitle="Siap melayani transaksi antrean tinggi dengan kalkulasi pajak PB1 otomatis."
              rating={4.9}
              accentColor="#2f6481"
            />
          </div>
        </div>
      </section>

      {/* ================= KEY FEATURES GRID ================= */}
      <section id="fitur-pos" className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cfe2f1] text-[#14374a] text-[12px] font-bold uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            <span>Fitur Lengkap Enterprise</span>
          </div>
          <h2 className="text-[28px] sm:text-[38px] font-black text-[#191c1e] tracking-tight">
            Semua yang Dibutuhkan Kasir & Pemilik Usaha
          </h2>
          <p className="text-[15px] text-[#41484d]">
            Arsitektur terintegrasi mulai dari penjualan, inventori gudang, hingga laporan laba rugi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white border border-[#c1c7cd] shadow-2xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#2f6481] text-white flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[18px] text-[#191c1e]">Terminal Kasir Cepat</h3>
            <p className="text-[13px] text-[#41484d] leading-relaxed">
              Antarmuka kasir intuitif dengan penataan kategori fleksibel, tombol pintasan diskon, dan pencarian kilat SKU produk.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white border border-[#c1c7cd] shadow-2xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[18px] text-[#191c1e]">Turso libSQL Cloud Sync</h3>
            <p className="text-[13px] text-[#41484d] leading-relaxed">
              Data transaksi, stok, dan pengaturan toko tersinkronisasi otomatis ke cloud cluster Turso dengan latensi rendah.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white border border-[#c1c7cd] shadow-2xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[18px] text-[#191c1e]">Manajemen Stok & Alert Kritis</h3>
            <p className="text-[13px] text-[#41484d] leading-relaxed">
              Pengurangan stok otomatis saat transaksi. Notifikasi instan saat jumlah stok menyentuh batas minimum pemesanan ulang.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white border border-[#c1c7cd] shadow-2xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-700 text-white flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[18px] text-[#191c1e]">Laporan Finansial & Grafik</h3>
            <p className="text-[13px] text-[#41484d] leading-relaxed">
              Visualisasi grafik penjualan harian, margin laba kotor, produk terlaris, dan rekapitulasi metode pembayaran nota.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-white border border-[#c1c7cd] shadow-2xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-700 text-white flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[18px] text-[#191c1e]">Struk Thermal & PDF Nota</h3>
            <p className="text-[13px] text-[#41484d] leading-relaxed">
              Cetak nota kasir thermal langsung dari browser atau simpan bukti transaksi sebagai format digital siap kirim WhatsApp.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-white border border-[#c1c7cd] shadow-2xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-700 text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[18px] text-[#191c1e]">Kontrol Otorisasi Pengguna (RBAC)</h3>
            <p className="text-[13px] text-[#41484d] leading-relaxed">
              Batasi akses menu kasir berdasarkan peran jabatan staf: Super Administrator, Supervisor Toko, dan Kasir Shift.
            </p>
          </div>
        </div>
      </section>

      {/* ================= ARCHITECTURE SECTION ================= */}
      <section id="arsitektur-turso" className="py-16 px-4 md:px-8 border-t border-[#c1c7cd] bg-[#f3f3f6]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-[24px] sm:text-[30px] font-black text-[#191c1e] tracking-tight">
              Arsitektur Sistem & Database Turso
            </h3>
            <p className="text-[14px] text-[#41484d]">
              Kombinasi modern full-stack: React frontend, Express API server, dan Turso Serverless Database.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#c1c7cd] p-6 md:p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-[#f8f9fc] border border-[#edeef0] space-y-2">
                <span className="text-[11px] font-bold text-[#71787e] uppercase tracking-wider block">Klien Frontend</span>
                <h4 className="font-bold text-[16px] text-[#191c1e]">React 18 + Vite + Tailwind</h4>
                <p className="text-[12px] text-[#5e666d]">State POS instan dengan cache lokal zero-latency.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8f9fc] border border-[#edeef0] space-y-2">
                <span className="text-[11px] font-bold text-[#71787e] uppercase tracking-wider block">API Gateway</span>
                <h4 className="font-bold text-[16px] text-[#191c1e]">Express Server (TypeScript)</h4>
                <p className="text-[12px] text-[#5e666d]">Atomic transaction & validasi stok berkala.</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Cloud Database</span>
                <h4 className="font-bold text-[16px] text-emerald-950">Turso libSQL Edge</h4>
                <p className="text-[12px] text-emerald-800">Cluster Tokyo • AWS `ap-northeast-1`.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#191c1e] text-white font-mono text-[12px] overflow-x-auto space-y-1">
              <div className="text-emerald-400 font-bold">// Status Koneksi Aktif Turso Cloud Database:</div>
              <div>Database Endpoint : {tursoStatus?.url || 'libsql://mykasirdb-naurahdigiss-droid.aws-ap-northeast-1.turso.io'}</div>
              <div>Status Server      : {tursoStatus?.connected ? 'CONNECTED (HTTP/2 libSQL Over TLS)' : 'CONNECTING...'}</div>
              <div>Region Node        : AWS Tokyo (ap-northeast-1)</div>
              <div>Latensi Rata-Rata  : {tursoStatus?.latencyMs !== undefined ? `${tursoStatus.latencyMs} ms` : 'Measuring...'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-[#2f6481] text-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-[30px] sm:text-[40px] font-black tracking-tight leading-tight">
            Mulai Gunakan KASIRKU Hari Ini
          </h2>
          <p className="text-[16px] text-[#cfe2f1] max-w-xl mx-auto">
            Gunakan akun demo yang telah disediakan atau daftarkan akun baru untuk mengelola kasir toko Anda dengan mudah.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <MagneticButton
              type="button"
              onClick={() => setUnauthView('auth')}
              burstColors={['#ffffff', '#38bdf8', '#fbbf24']}
              className="bg-white hover:bg-[#edeef0] text-[#191c1e] px-7 py-3.5 rounded-xl text-[15px] font-bold shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Buka Terminal Kasir Sekarang</span>
              <ArrowRight className="w-5 h-5 text-[#2f6481]" />
            </MagneticButton>

            <button
              type="button"
              onClick={() => scrollToSection('akses-kredensial')}
              className="bg-[#244f66] hover:bg-[#1a3a4c] text-white border border-[#487a96] px-5 py-3.5 rounded-xl text-[15px] font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Salin Username & Password</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-[#c1c7cd] py-8 px-4 md:px-8 text-[12px] text-[#71787e]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#2f6481] text-white flex items-center justify-center font-bold text-[10px]">
              K
            </div>
            <span className="font-bold text-[#191c1e]">KASIRKU POS Retail Enterprise</span>
            <span>• © 2026 Hak Cipta Dilindungi</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => scrollToSection('akses-kredensial')}
              className="hover:text-[#191c1e] transition-colors cursor-pointer"
            >
              Kredensial Login
            </button>
            <button
              type="button"
              onClick={() => setIsBantuanModalOpen(true)}
              className="hover:text-[#191c1e] transition-colors cursor-pointer"
            >
              Pusat Bantuan
            </button>
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Turso libSQL Online
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
