import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Mail, 
  Eye, 
  EyeOff, 
  KeyRound, 
  ArrowRight, 
  ArrowLeft,
  Building2, 
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Rotate3d,
  Compass,
  Copy,
  Check
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { KASIRKU_LOGO_URL } from '../data/initialData';
import { SUPER_ADMIN_CREDENTIALS, DEMO_ACCOUNTS, DemoAccount } from '../data/authData';
import { UserRole } from '../types';
import { GyroscopicDisplayCard } from './GyroscopicDisplayCard';
import { MagneticButton } from './MagneticButton';

export const AuthView: React.FC = () => {
  const { login, register, setIsBantuanModalOpen, tursoStatus, setUnauthView, addToast } = usePOS();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemoUser, setSelectedDemoUser] = useState<string>('naurahdigiss01');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Login Form States
  const [loginUsername, setLoginUsername] = useState('naurahdigiss01');
  const [loginPassword, setLoginPassword] = useState('10ssigidharuan');

  // Register Form States
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('super_admin');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regBranchName, setRegBranchName] = useState('Store Senayan Utama');

  const handleCopyText = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('success', `${label} Disalin`, `"${text}" siap ditempel.`);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Quick auto-fill for any demo account
  const handleSelectAccount = (acc: DemoAccount, autoSubmit = false) => {
    setSelectedDemoUser(acc.username);
    setMode('login');
    setLoginUsername(acc.username);
    setLoginPassword(acc.password);
    setErrorMessage(null);

    if (autoSubmit) {
      executeLogin(acc.username, acc.password);
    }
  };

  const executeLogin = async (usr: string, pass: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await login(usr, pass);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginUsername.trim()) {
      setErrorMessage('Harap masukkan ID Pengguna atau Username.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Harap masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(loginUsername, loginPassword);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim() || !regUsername.trim() || !regEmail.trim()) {
      setErrorMessage('Mohon lengkapi seluruh data nama, username, dan email.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Kata sandi minimal harus 6 karakter demi keamanan.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok dengan kata sandi.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        username: regUsername,
        password: regPassword,
        fullName: regFullName,
        email: regEmail,
        role: regRole,
        branchName: regBranchName,
      });

      if (!res.success) {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal mendaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fc] flex flex-col justify-between items-center p-4 md:p-8 select-none font-sans">
      {/* Top Bar / Header */}
      <header className="w-full max-w-6xl flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#c1c7cd] shadow-2xs flex items-center justify-center p-1.5">
            <img src={KASIRKU_LOGO_URL} alt="Logo KASIRKU" className="max-h-full max-w-full object-contain" />
          </div>
          <div>
            <span className="font-black text-[18px] text-[#2f6481] tracking-tight block leading-tight">KASIRKU</span>
            <span className="text-[11px] font-semibold text-[#71787e] tracking-wider uppercase block leading-none">
              Enterprise Point of Sale
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setUnauthView('landing')}
            className="flex items-center gap-1.5 text-[12px] font-bold text-[#2f6481] hover:text-[#14374a] bg-white border border-[#c1c7cd] hover:bg-[#edeef0] px-3 py-1.5 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#2f6481]" />
            <span>Ke Landing Page</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-[12px] text-[#41484d] bg-white border border-[#c1c7cd] px-3 py-1.5 rounded-xl shadow-2xs">
            <span className={`inline-block w-2 h-2 rounded-full ${tursoStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500 animate-ping'}`} />
            <span className="font-medium hidden md:inline">Database:</span>
            <span className="font-bold text-[#191c1e]">
              {tursoStatus?.connected ? `Turso (${tursoStatus.latencyMs}ms)` : 'Turso libSQL'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container: 3D Gyroscopic Showcase + Auth Form */}
      <div className="w-full max-w-6xl my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: 3D Card Flip & Gyroscopic Display */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cfe2f1] text-[#14374a] text-[12px] font-bold">
              <Rotate3d className="w-3.5 h-3.5" />
              <span>3D Card Flip & Gyroscopic UI</span>
            </div>
            <h1 className="text-[28px] sm:text-[34px] font-black text-[#191c1e] tracking-tight leading-tight">
              Sistem Kasir Modern & Otorisasi 3D
            </h1>
            <p className="text-[14px] text-[#5e666d] leading-relaxed">
              Dilengkapi kartu digital interaktif dengan efek 3D flip 180°, sensor pergerakan gyroscopic berbasis kursor/perangkat, serta tombol magnetic hover berpartikel halus.
            </p>
          </div>

          {/* Interactive 3D Card Component */}
          <div className="w-full flex flex-col items-center">
            <GyroscopicDisplayCard 
              onAutofillLogin={() => handleSelectAccount(DEMO_ACCOUNTS[0], false)} 
            />
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-[11px] font-semibold text-[#41484d]">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#c1c7cd] shadow-2xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#2f6481]" /> Magnetic Hover Effect
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#c1c7cd] shadow-2xs flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#2f6481]" /> Rotatable Interactive Display
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#c1c7cd] shadow-2xs flex items-center gap-1">
              <Rotate3d className="w-3 h-3 text-[#2f6481]" /> 3D Flip Perspective
            </span>
          </div>
        </div>

        {/* Right Column: Authentication Card Box */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-white border border-[#c1c7cd] rounded-2xl shadow-xs overflow-hidden">
            {/* Header Banner inside Card */}
            <div className="bg-[#f3f3f6] border-b border-[#c1c7cd] px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[17px] font-black text-[#191c1e] tracking-tight">
                    {mode === 'login' ? 'Otorisasi Akses Kasir' : 'Registrasi Operator & Kasir'}
                  </h2>
                  <p className="text-[12px] text-[#71787e] mt-0.5">
                    {mode === 'login' 
                      ? 'Pilih akun demo atau masukkan kredensial' 
                      : 'Daftarkan pengguna baru untuk akses POS'}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#cfe2f1] text-[#2f6481] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="mt-3.5 grid grid-cols-2 p-1 bg-[#e7e8eb] rounded-lg text-[13px] font-semibold">
                <button
                  type="button"
                  id="tab-login"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className={`py-2 rounded-md transition-all cursor-pointer text-center ${
                    mode === 'login' 
                      ? 'bg-white text-[#2f6481] shadow-xs font-bold' 
                      : 'text-[#71787e] hover:text-[#191c1e]'
                  }`}
                >
                  Masuk (Login)
                </button>
                <button
                  type="button"
                  id="tab-register"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className={`py-2 rounded-md transition-all cursor-pointer text-center ${
                    mode === 'register' 
                      ? 'bg-white text-[#2f6481] shadow-xs font-bold' 
                      : 'text-[#71787e] hover:text-[#191c1e]'
                  }`}
                >
                  Daftar Akun Baru
                </button>
              </div>
            </div>

            {/* Quick Demo Credentials Selector */}
            {mode === 'login' && (
              <div className="px-6 pt-4">
                <div className="bg-[#f0f7fb] border border-[#a1d4f5] rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#2f6481]" />
                      <span className="text-[12px] font-bold text-[#14374a]">
                        Pilih Kredensial Akses Cepat:
                      </span>
                    </div>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#cfe2f1] text-[#14374a]">
                      3 Akun Siap Pakai
                    </span>
                  </div>

                  {/* 3 Quick Role Badges */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {DEMO_ACCOUNTS.map((acc) => {
                      const isSelected = selectedDemoUser === acc.username;
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => handleSelectAccount(acc, false)}
                          className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#2f6481] bg-white shadow-2xs font-bold text-[#2f6481]'
                              : 'border-[#c1c7cd] bg-white/70 hover:bg-white text-[#41484d]'
                          }`}
                        >
                          <div className="text-[11px] font-bold truncate">
                            {acc.roleLabel.replace('Administrator', 'Admin')}
                          </div>
                          <div className="text-[9px] text-[#71787e] font-mono truncate">
                            {acc.username}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Display selected account credentials */}
                  {(() => {
                    const currentDemo = DEMO_ACCOUNTS.find((a) => a.username === selectedDemoUser) || DEMO_ACCOUNTS[0];
                    return (
                      <div className="bg-white/90 p-2.5 rounded-lg border border-[#a1d4f5]/60 flex items-center justify-between gap-2 text-[11px]">
                        <div className="space-y-0.5 font-mono text-[12px]">
                          <div>
                            <span className="text-[#71787e] font-sans text-[10px] mr-1">User:</span>
                            <span className="font-bold text-[#191c1e]">{currentDemo.username}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(currentDemo.username, 'Username', `${currentDemo.username}-u`)}
                              className="ml-1.5 inline-block text-[#71787e] hover:text-[#191c1e]"
                              title="Salin Username"
                            >
                              {copiedKey === `${currentDemo.username}-u` ? (
                                <Check className="w-3 h-3 text-emerald-600 inline" />
                              ) : (
                                <Copy className="w-3 h-3 inline" />
                              )}
                            </button>
                          </div>
                          <div>
                            <span className="text-[#71787e] font-sans text-[10px] mr-1">Pass:</span>
                            <span className="font-bold text-[#191c1e]">{currentDemo.password}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(currentDemo.password, 'Kata Sandi', `${currentDemo.username}-p`)}
                              className="ml-1.5 inline-block text-[#71787e] hover:text-[#191c1e]"
                              title="Salin Kata Sandi"
                            >
                              {copiedKey === `${currentDemo.username}-p` ? (
                                <Check className="w-3 h-3 text-emerald-600 inline" />
                              ) : (
                                <Copy className="w-3 h-3 inline" />
                              )}
                            </button>
                          </div>
                        </div>

                        <MagneticButton
                          type="button"
                          onClick={() => handleSelectAccount(currentDemo, true)}
                          burstColors={['#2f6481', '#fbbf24', '#ffffff', '#38bdf8']}
                          className="px-2.5 py-1.5 text-[11px] font-bold text-white bg-[#2f6481] hover:bg-[#244f66] rounded-md transition-colors flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Masuk Langsung</span>
                        </MagneticButton>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Form Content */}
            <div className="p-6">
              {/* Error Message Alert */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-[#ffdad6] border border-[#ffb4ab] text-[#ba1a1a] text-[13px] flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {mode === 'login' ? (
                /* ================= LOGIN FORM ================= */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label 
                      htmlFor="login-username" 
                      className="block text-[13px] font-semibold text-[#191c1e] mb-1.5"
                    >
                      ID Kasir / Username <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#71787e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="login-username"
                        type="text"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        placeholder="naurahdigiss01"
                        autoComplete="username"
                        className="w-full bg-white border border-[#c1c7cd] rounded-lg pl-10 pr-3.5 py-2.5 text-[14px] text-[#191c1e] placeholder-[#71787e] focus:outline-none focus:ring-2 focus:ring-[#2f6481] focus:border-[#2f6481] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label 
                        htmlFor="login-password" 
                        className="block text-[13px] font-semibold text-[#191c1e]"
                      >
                        Kata Sandi <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleSelectAccount(DEMO_ACCOUNTS[0], false)}
                        className="text-[11px] font-semibold text-[#2f6481] hover:underline cursor-pointer"
                      >
                        Isi kredensial super admin
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#71787e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="10ssigidharuan"
                        autoComplete="current-password"
                        className="w-full bg-white border border-[#c1c7cd] rounded-lg pl-10 pr-10 py-2.5 text-[14px] text-[#191c1e] placeholder-[#71787e] focus:outline-none focus:ring-2 focus:ring-[#2f6481] focus:border-[#2f6481] transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71787e] hover:text-[#191c1e] p-1 cursor-pointer"
                        title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[13px] pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-[#41484d]">
                      <input
                        type="checkbox"
                        id="remember-me"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-[#c1c7cd] text-[#2f6481] focus:ring-[#2f6481]"
                      />
                      <span>Ingat sesi di perangkat ini</span>
                    </label>
                  </div>

                  {/* Submit Button with Magnetic Hover and Particle Burst */}
                  <MagneticButton
                    type="submit"
                    id="btn-submit-login"
                    disabled={isLoading}
                    magneticStrength={0.32}
                    burstColors={['#2f6481', '#10b981', '#a1d4f5', '#ffffff']}
                    className="w-full mt-2 bg-[#2f6481] hover:bg-[#244f66] active:bg-[#1a3a4c] text-white font-bold py-3 px-4 rounded-xl text-[14px] shadow-xs flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Masuk ke Terminal Kasir</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </MagneticButton>
                </form>
              ) : (
                /* ================= REGISTER FORM ================= */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label htmlFor="reg-fullname" className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                      Nama Lengkap Operator <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#71787e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-fullname"
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Naurah Digital"
                        className="w-full bg-white border border-[#c1c7cd] rounded-lg pl-10 pr-3.5 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2f6481] focus:border-[#2f6481]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="reg-username" className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                        Username <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <input
                        id="reg-username"
                        type="text"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="naurahdigiss01"
                        className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2f6481] focus:border-[#2f6481]"
                      />
                    </div>
                    <div>
                      <label htmlFor="reg-role" className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                        Peran (Role)
                      </label>
                      <select
                        id="reg-role"
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as UserRole)}
                        className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3 py-2 text-[13px] font-semibold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#2f6481]"
                      >
                        <option value="super_admin">Super Administrator</option>
                        <option value="admin">Administrator Toko</option>
                        <option value="kasir">Kasir Front-Office</option>
                        <option value="manajer">Manajer Operasional</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-email" className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                      Email Resmi <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#71787e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-email"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="operator@kasirku.co.id"
                        className="w-full bg-white border border-[#c1c7cd] rounded-lg pl-10 pr-3.5 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2f6481] focus:border-[#2f6481]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="reg-password" className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                        Kata Sandi <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min. 6 huruf"
                        className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3 py-2 text-[14px] font-mono focus:outline-none focus:ring-2 focus:ring-[#2f6481]"
                      />
                    </div>
                    <div>
                      <label htmlFor="reg-confirm" className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                        Konfirmasi Sandi <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <input
                        id="reg-confirm"
                        type={showPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Ulangi sandi"
                        className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3 py-2 text-[14px] font-mono focus:outline-none focus:ring-2 focus:ring-[#2f6481]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-branch" className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                      Lokasi Toko / Cabang
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-[#71787e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-branch"
                        type="text"
                        value={regBranchName}
                        onChange={(e) => setRegBranchName(e.target.value)}
                        placeholder="Cabang Senayan Utama"
                        className="w-full bg-white border border-[#c1c7cd] rounded-lg pl-10 pr-3.5 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2f6481] focus:border-[#2f6481]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[12px] text-[#71787e] pt-1">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Standar keamanan ISO 27001
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#2f6481] font-semibold hover:underline cursor-pointer"
                    >
                      {showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                    </button>
                  </div>

                  {/* Register Button with Magnetic Hover & Particle Burst */}
                  <MagneticButton
                    type="submit"
                    id="btn-submit-register"
                    disabled={isLoading}
                    magneticStrength={0.32}
                    burstColors={['#2f6481', '#10b981', '#38bdf8', '#fbbf24']}
                    className="w-full mt-2 bg-[#2f6481] hover:bg-[#244f66] active:bg-[#1a3a4c] text-white font-bold py-3 px-4 rounded-xl text-[14px] shadow-xs flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Daftarkan & Langsung Masuk</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </MagneticButton>
                </form>
              )}
            </div>

            {/* Footer Security Badges */}
            <div className="px-6 py-3 bg-[#f3f3f6] border-t border-[#c1c7cd] flex items-center justify-between text-[11px] text-[#71787e]">
              <span>Enkripsi Sesi 256-Bit</span>
              <button
                type="button"
                onClick={() => setIsBantuanModalOpen(true)}
                className="flex items-center gap-1 text-[#2f6481] font-semibold hover:underline cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Panduan Masuk</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Page Footer */}
      <footer className="text-center text-[12px] text-[#71787e] py-3 space-y-0.5">
        <p>© 2026 KASIRKU Enterprise • Sistem Kasir & Manajemen Inventaris Terpusat</p>
        <p className="text-[11px]">Dirancang untuk ritel modern, kafe, restoran, dan multi-outlet enterprise.</p>
      </footer>
    </div>
  );
};
