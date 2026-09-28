import React, { useState } from 'react';
import { 
  Store, 
  User, 
  Receipt, 
  Percent, 
  RotateCcw, 
  Check, 
  Building,
  ShieldCheck,
  LogOut,
  KeyRound,
  Database,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { StoreSettings } from '../types';
import { UserAccessManager } from './UserAccessManager';

export const PengaturanView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    resetAllData, 
    addToast, 
    currentUser, 
    logout,
    tursoStatus,
    isTursoLoading,
    syncTursoDatabase,
    refreshTursoData
  } = usePOS();
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof StoreSettings, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    addToast('success', 'Pengaturan Disimpan', 'Konfigurasi toko dan printer struk berhasil diperbarui.');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#191c1e] tracking-tight">
          Pengaturan Toko & POS
        </h2>
        <p className="text-[15px] text-[#41484d] mt-0.5">
          Atur identitas outlet, akun operator, format nota kasir, dan tarif pajak PB1.
        </p>
      </div>

      {/* Active User / Operator Card */}
      {currentUser && (
        <div className="bg-white rounded-xl border border-[#c1c7cd] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#2f6481] text-white flex items-center justify-center font-black text-[20px] shadow-xs shrink-0">
              {currentUser.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-bold text-[#191c1e]">{currentUser.fullName}</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#cfe2f1] text-[#14374a] uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {currentUser.roleLabel}
                </span>
              </div>
              <p className="text-[13px] text-[#71787e] font-mono mt-0.5">
                Username: @{currentUser.username} • {currentUser.email}
              </p>
              <p className="text-[12px] text-[#41484d] mt-0.5">
                Penugasan: <span className="font-semibold">{currentUser.branchName || 'Cabang Utama'}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Keluar dari sesi akun ini dan kembali ke halaman login?')) {
                logout();
              }
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-[#ffb4ab] text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg text-[13px] font-semibold transition-colors cursor-pointer self-start md:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Ganti Akun / Keluar</span>
          </button>
        </div>
      )}

      {/* User Access & Password Management */}
      <UserAccessManager />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Identitas Toko */}
        <div className="bg-white rounded-xl border border-[#c1c7cd] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#edeef0]">
            <Building className="w-5 h-5 text-[#2f6481]" />
            <h3 className="text-[16px] font-bold text-[#191c1e]">Informasi Outlet / Bisnis</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                Nama Usaha / Toko
              </label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 text-[14px] focus:ring-2 focus:ring-[#2f6481]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                Nomor Telepon
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 text-[14px] focus:ring-2 focus:ring-[#2f6481]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#191c1e] mb-1">
              Alamat Lengkap
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 text-[14px] focus:ring-2 focus:ring-[#2f6481]"
            />
          </div>
        </div>

        {/* Card 2: Kasir & Pajak */}
        <div className="bg-white rounded-xl border border-[#c1c7cd] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#edeef0]">
            <User className="w-5 h-5 text-[#2f6481]" />
            <h3 className="text-[16px] font-bold text-[#191c1e]">Kasir & Pajak Transaksi</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                Nama Kasir Aktif
              </label>
              <input
                type="text"
                required
                value={formData.activeCashierName}
                onChange={(e) => handleChange('activeCashierName', e.target.value)}
                className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 text-[14px] focus:ring-2 focus:ring-[#2f6481]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                Tarif Pajak PB1 / Resto (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.taxRatePercent}
                  onChange={(e) => handleChange('taxRatePercent', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-[#c1c7cd] rounded-lg pl-3.5 pr-10 py-2 font-mono text-[14px] focus:ring-2 focus:ring-[#2f6481]"
                />
                <Percent className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71787e]" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Footer Struk Thermal */}
        <div className="bg-white rounded-xl border border-[#c1c7cd] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#edeef0]">
            <Receipt className="w-5 h-5 text-[#2f6481]" />
            <h3 className="text-[16px] font-bold text-[#191c1e]">Pengaturan Format Struk</h3>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#191c1e] mb-1">
              Pesan Footer Struk
            </label>
            <input
              type="text"
              value={formData.receiptFooter}
              onChange={(e) => handleChange('receiptFooter', e.target.value)}
              placeholder="Terima kasih atas kunjungan Anda!"
              className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 text-[14px] focus:ring-2 focus:ring-[#2f6481]"
            />
          </div>
        </div>

        {/* Card 4: Turso Database Cloud Status */}
        <div className="bg-white rounded-xl border border-[#c1c7cd] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#edeef0]">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-[#2f6481]" />
              <div>
                <h3 className="text-[16px] font-bold text-[#191c1e]">Integrasi Turso Database Cloud</h3>
                <p className="text-[12px] text-[#5e666d]">libSQL Serverless Distributed Edge Database</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${tursoStatus?.connected ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                <span className={`w-2 h-2 rounded-full ${tursoStatus?.connected ? 'bg-emerald-600 animate-pulse' : 'bg-blue-600'}`} />
                {tursoStatus?.connected ? 'TERHUBUNG' : 'SYNCING'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
            <div className="p-3 bg-[#f8f9fc] rounded-lg border border-[#edeef0] space-y-1">
              <span className="text-[#5e666d] block text-[11px] font-semibold uppercase tracking-wider">Database URL</span>
              <span className="font-mono text-[12px] text-[#191c1e] font-semibold break-all">
                {tursoStatus?.url || 'libsql://mykasirdb-naurahdigiss-droid.aws-ap-northeast-1.turso.io'}
              </span>
            </div>
            <div className="p-3 bg-[#f8f9fc] rounded-lg border border-[#edeef0] space-y-1">
              <span className="text-[#5e666d] block text-[11px] font-semibold uppercase tracking-wider">Region & Latensi</span>
              <span className="text-[#191c1e] font-semibold block">
                AWS Tokyo (ap-northeast-1) • Latensi: {tursoStatus?.latencyMs !== undefined ? `${tursoStatus.latencyMs} ms` : '-'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-4 text-[12px] text-[#5e666d]">
              <span>Produk: <b>{tursoStatus?.counts?.products ?? 0}</b></span>
              <span>Kategori: <b>{tursoStatus?.counts?.categories ?? 0}</b></span>
              <span>Transaksi: <b>{tursoStatus?.counts?.transactions ?? 0}</b></span>
              <span>Akun: <b>{tursoStatus?.counts?.users ?? 0}</b></span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={syncTursoDatabase}
                disabled={isTursoLoading}
                className="px-3.5 py-1.5 rounded-lg border border-[#c1c7cd] bg-white hover:bg-[#edeef0] text-[#191c1e] text-[12px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#2f6481] ${isTursoLoading ? 'animate-spin' : ''}`} />
                <span>Sinkronkan Struktur</span>
              </button>
              <button
                type="button"
                onClick={refreshTursoData}
                disabled={isTursoLoading}
                className="px-3.5 py-1.5 rounded-lg bg-[#2f6481] hover:bg-[#25526b] text-white text-[12px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTursoLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Submit */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset semua data ke kondisi awal pabrik?')) {
                resetAllData();
              }
            }}
            className="flex items-center gap-2 text-[#ba1a1a] hover:bg-[#ffdad6] px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Database POS</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#2f6481] hover:bg-[#0e4c68] text-white px-6 py-2.5 rounded-lg text-[14px] font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : null}
            <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Pengaturan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
