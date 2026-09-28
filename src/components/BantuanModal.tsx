import React from 'react';
import { HelpCircle, X, Store, Package, History, Printer, Search, Zap } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const BantuanModal: React.FC = () => {
  const { isBantuanModalOpen, setIsBantuanModalOpen } = usePOS();

  if (!isBantuanModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#c1c7cd] flex flex-col my-8 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#c1c7cd] flex justify-between items-center bg-[#f3f3f6]">
          <div className="flex items-center gap-2 text-[#2f6481]">
            <HelpCircle className="w-5 h-5" />
            <h3 className="text-[18px] font-bold text-[#191c1e]">Panduan Penggunaan KASIRKU POS</h3>
          </div>
          <button
            onClick={() => setIsBantuanModalOpen(false)}
            className="text-[#71787e] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e1e2e5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] text-[13px] text-[#41484d]">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#cfe2f1] text-[#265c79] rounded-lg shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[#191c1e]">1. Transaksi Kasir Cepat</h4>
                <p className="mt-0.5">
                  Pilih produk dari katalog dengan sekali klik. Masukkan nominal uang yang diterima pelanggan atau gunakan chip uang pas, lalu klik tombol BAYAR.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#f6d9ff] text-[#725380] rounded-lg shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[#191c1e]">2. Tambah & Edit Produk</h4>
                <p className="mt-0.5">
                  Buka menu Produk untuk menambahkan item baru, mengubah SKU, memperbarui harga jual, dan mengatur stok awal.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#a1d4f5] text-[#001e2d] rounded-lg shrink-0">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[#191c1e]">3. Riwayat & Cetak Ulang Struk</h4>
                <p className="mt-0.5">
                  Menu Riwayat Penjualan mencatat seluruh transaksi historis lengkap dengan rincian item, uang diterima, kembalian, dan fitur cetak struk thermal atau kirim email.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[#191c1e]">4. Standar Struk 58mm / 80mm</h4>
                <p className="mt-0.5">
                  Format cetak otomatis disesuaikan untuk printer thermal kasir dan browser standard print view.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#f0f7fb] rounded-xl border border-[#a1d4f5] space-y-1.5">
            <h4 className="font-bold text-[#14374a] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#2f6481]" /> Kredensial Super Admin & Pintasan
            </h4>
            <div className="text-[12px] text-[#2c4e61] space-y-1">
              <p>• <strong>Super Admin Login:</strong> Username <code className="bg-white px-1.5 py-0.5 rounded border border-[#a1d4f5] font-mono">naurahdigiss01</code> / Sandi <code className="bg-white px-1.5 py-0.5 rounded border border-[#a1d4f5] font-mono">10ssigidharuan</code></p>
              <p>• <strong>Hamburger Menu:</strong> Klik ikon hamburger di bilah atas atau tekan tombol <kbd className="bg-white px-1.5 py-0.5 rounded border border-[#a1d4f5] font-mono font-bold">Ctrl + B</kbd> untuk menciutkan / memperluas menu.</p>
              <p>• <strong>Pencarian Cepat:</strong> Gunakan kolom pencarian di header untuk memfilter SKU produk secara seketika.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#c1c7cd] bg-[#f3f3f6] text-right">
          <button
            onClick={() => setIsBantuanModalOpen(false)}
            className="px-5 py-2 bg-[#2f6481] hover:bg-[#0e4c68] text-white text-[13px] font-bold rounded-lg transition-colors cursor-pointer"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
