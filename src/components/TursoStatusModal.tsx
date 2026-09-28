import React from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Server, 
  Layers, 
  ShoppingBag, 
  Receipt, 
  Users, 
  X,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { usePOS } from '../context/POSContext';

interface TursoStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TursoStatusModal: React.FC<TursoStatusModalProps> = ({ isOpen, onClose }) => {
  const { tursoStatus, isTursoLoading, refreshTursoData, syncTursoDatabase } = usePOS();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#c1c7cd] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 bg-[#f3f3f6] border-b border-[#c1c7cd] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2f6481] text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#191c1e] leading-tight">
                Integrasi Database Turso Cloud
              </h3>
              <p className="text-[12px] text-[#5e666d]">
                libSQL Serverless Distributed Edge Database
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5e666d] hover:text-[#191c1e] hover:bg-[#edeef0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Connection Status Card */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-800 tracking-wider uppercase block">
                  Status Koneksi Live
                </span>
                <h4 className="text-[15px] font-black text-emerald-950">
                  {tursoStatus?.connected ? 'Terhubung Aktif ke Turso Database' : 'Koneksi Cloud Sedang Memuat...'}
                </h4>
                <p className="text-[12px] text-emerald-800">
                  Latency Ping:{' '}
                  <span className="font-bold font-mono">
                    {tursoStatus?.latencyMs !== undefined ? `${tursoStatus.latencyMs} ms` : 'Mengukur...'}
                  </span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>

          {/* Database Specs */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#41484d] uppercase tracking-wider block">
              Parameter Server & Cluster
            </label>
            <div className="bg-[#f8f9fc] rounded-xl border border-[#c1c7cd] divide-y divide-[#edeef0] text-[13px]">
              <div className="p-3 flex items-center justify-between">
                <span className="text-[#5e666d] flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#2f6481]" />
                  Database Endpoint
                </span>
                <span className="font-mono text-[12px] text-[#191c1e] font-semibold truncate max-w-[280px]">
                  {tursoStatus?.url || 'libsql://mykasirdb-naurahdigiss-droid.aws-ap-northeast-1.turso.io'}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-[#5e666d] flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#2f6481]" />
                  Wilayah Cloud / Region
                </span>
                <span className="font-semibold text-[#191c1e]">
                  AWS Tokyo (ap-northeast-1)
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-[#5e666d] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2f6481]" />
                  Protokol Keamanan
                </span>
                <span className="font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                  Ed25519 JWT Token Validated
                </span>
              </div>
            </div>
          </div>

          {/* Synchronized Entities Counter */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#41484d] uppercase tracking-wider block">
              Data Tersinkronisasi di Turso
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#c1c7cd] text-center shadow-2xs">
                <ShoppingBag className="w-5 h-5 mx-auto text-[#2f6481] mb-1" />
                <span className="text-[20px] font-black text-[#191c1e] block">
                  {tursoStatus?.counts?.products ?? '-'}
                </span>
                <span className="text-[11px] text-[#5e666d]">Katalog Produk</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#c1c7cd] text-center shadow-2xs">
                <Layers className="w-5 h-5 mx-auto text-[#2f6481] mb-1" />
                <span className="text-[20px] font-black text-[#191c1e] block">
                  {tursoStatus?.counts?.categories ?? '-'}
                </span>
                <span className="text-[11px] text-[#5e666d]">Kategori Toko</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#c1c7cd] text-center shadow-2xs">
                <Receipt className="w-5 h-5 mx-auto text-[#2f6481] mb-1" />
                <span className="text-[20px] font-black text-[#191c1e] block">
                  {tursoStatus?.counts?.transactions ?? '-'}
                </span>
                <span className="text-[11px] text-[#5e666d]">Nota Transaksi</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#c1c7cd] text-center shadow-2xs">
                <Users className="w-5 h-5 mx-auto text-[#2f6481] mb-1" />
                <span className="text-[20px] font-black text-[#191c1e] block">
                  {tursoStatus?.counts?.users ?? '-'}
                </span>
                <span className="text-[11px] text-[#5e666d]">Pengguna Terdaftar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#f3f3f6] border-t border-[#c1c7cd] flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={syncTursoDatabase}
            disabled={isTursoLoading}
            className="px-4 py-2 rounded-xl bg-white border border-[#c1c7cd] text-[#191c1e] text-[13px] font-bold hover:bg-[#edeef0] transition-colors cursor-pointer flex items-center gap-2 shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-[#2f6481] ${isTursoLoading ? 'animate-spin' : ''}`} />
            <span>Sinkronkan Struktur Tabel</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshTursoData}
              disabled={isTursoLoading}
              className="px-4 py-2 rounded-xl bg-[#2f6481] text-white text-[13px] font-bold hover:bg-[#25526b] transition-colors cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isTursoLoading ? 'animate-spin' : ''}`} />
              <span>{isTursoLoading ? 'Memuat Data...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
