import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Receipt, 
  Mail, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ChevronLeft, 
  ChevronRight,
  X,
  Send
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatRupiah, formatDateTimeIndo } from '../utils/formatters';
import { Transaction } from '../types';

export const RiwayatView: React.FC = () => {
  const { 
    transactions, 
    selectedTransaction, 
    setSelectedTransaction,
    openReceiptModal,
    addToast
  } = usePOS();

  const [searchTrx, setSearchTrx] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | 'cash' | 'debit' | 'qris'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const itemsPerPage = 6;

  // Filter transactions
  const filtered = transactions.filter((t) => {
    const matchesSearch = !searchTrx || 
      t.id.toLowerCase().includes(searchTrx.toLowerCase()) ||
      t.cashier.toLowerCase().includes(searchTrx.toLowerCase()) ||
      t.items.some((i) => i.name.toLowerCase().includes(searchTrx.toLowerCase()));
    
    const matchesMethod = methodFilter === 'all' || t.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeTrx = selectedTransaction || filtered[0] || null;

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    addToast('success', 'Email Terkirim', `Struk transaksi ${activeTrx?.id} telah dikirimkan ke ${emailInput}.`);
    setIsEmailModalOpen(false);
    setEmailInput('');
  };

  const renderPaymentBadge = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cash':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#cfe2f1] text-[#265c79] font-mono text-[11px] font-bold uppercase">
            <Banknote className="w-3.5 h-3.5" /> Cash
          </span>
        );
      case 'debit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#a1d4f5]/40 text-[#2f6481] font-mono text-[11px] font-bold uppercase">
            <CreditCard className="w-3.5 h-3.5" /> Debit
          </span>
        );
      case 'qris':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f6d9ff] text-[#725380] font-mono text-[11px] font-bold uppercase">
            <QrCode className="w-3.5 h-3.5" /> QRIS
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#edeef0] text-[#41484d] font-mono text-[11px] font-bold uppercase">
            {method}
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8f9fc]">
      {/* Top Header & Search */}
      <div className="px-4 md:px-8 py-5 border-b border-[#c1c7cd] bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-[26px] md:text-[28px] font-bold text-[#191c1e]">Riwayat Penjualan</h2>
          <p className="text-[14px] text-[#41484d] mt-0.5">Kelola dan pantau transaksi historis.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71787e] pointer-events-none" />
            <input
              type="text"
              value={searchTrx}
              onChange={(e) => setSearchTrx(e.target.value)}
              placeholder="Cari ID Transaksi..."
              className="w-full pl-10 pr-4 py-2 bg-[#f3f3f6] border border-[#c1c7cd] rounded-lg text-[13px] text-[#191c1e] placeholder-[#71787e] focus:outline-none focus:border-[#2f6481] focus:ring-1 focus:ring-[#2f6481] transition-colors"
            />
          </div>
          <button 
            onClick={() => setMethodFilter((curr) => curr === 'all' ? 'cash' : curr === 'cash' ? 'debit' : curr === 'debit' ? 'qris' : 'all')}
            className={`
              flex items-center justify-center h-10 px-3 gap-1.5 rounded-lg border border-[#c1c7cd] text-[13px] font-semibold transition-colors shrink-0 cursor-pointer
              ${methodFilter !== 'all' ? 'bg-[#2f6481] text-white' : 'bg-white text-[#41484d] hover:bg-[#f3f3f6]'}
            `}
            title="Filter Metode"
          >
            <Filter className="w-4 h-4" />
            <span className="capitalize">{methodFilter === 'all' ? 'Filter' : methodFilter}</span>
          </button>
        </div>
      </div>

      {/* Grid Content: Table + Detail Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Transaction List (Table) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 min-w-0">
          <div className="bg-white rounded-xl border border-[#c1c7cd] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f3f3f6] border-b border-[#c1c7cd]">
                  <tr className="text-[13px] text-[#41484d] font-semibold">
                    <th className="py-3.5 px-4">ID Transaksi</th>
                    <th className="py-3.5 px-4">Tanggal</th>
                    <th className="py-3.5 px-4">Kasir</th>
                    <th className="py-3.5 px-4">Metode Bayar</th>
                    <th className="py-3.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edeef0] text-[13px]">
                  {paginated.map((trx) => {
                    const isSelected = activeTrx?.id === trx.id;

                    return (
                      <tr
                        key={trx.id}
                        onClick={() => setSelectedTransaction(trx)}
                        className={`
                          transition-colors cursor-pointer
                          ${
                            isSelected
                              ? 'bg-[#cfe2f1]/30 border-l-4 border-l-[#2f6481]'
                              : 'hover:bg-[#f8f9fc]'
                          }
                        `}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-[#2f6481]">
                          {trx.id}
                        </td>
                        <td className="py-3.5 px-4 text-[#41484d]">
                          {formatDateTimeIndo(trx.date)}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#191c1e]">
                          {trx.cashier}
                        </td>
                        <td className="py-3.5 px-4">
                          {renderPaymentBadge(trx.paymentMethod)}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-right text-[#191c1e]">
                          {formatRupiah(trx.total)}
                        </td>
                      </tr>
                    );
                  })}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#71787e]">
                        Tidak ada transaksi yang cocok dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <span className="text-[13px] text-[#71787e]">
              Menampilkan {paginated.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
              {Math.min(currentPage * itemsPerPage, filtered.length)} dari {filtered.length} transaksi
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#c1c7cd] text-[#41484d] hover:bg-[#edeef0] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all cursor-pointer
                    ${
                      currentPage === page
                        ? 'bg-[#2f6481] text-white shadow-xs'
                        : 'border border-[#c1c7cd] text-[#191c1e] hover:bg-[#f3f3f6]'
                    }
                  `}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#c1c7cd] text-[#191c1e] hover:bg-[#edeef0] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-[#41484d]" />
              </button>
            </div>
          </div>
        </div>

        {/* Transaction Detail Sidebar (Fixed on Desktop) */}
        {activeTrx && (
          <aside className="w-full lg:w-[380px] xl:w-[400px] border-l border-[#c1c7cd] bg-white flex flex-col shrink-0 h-full overflow-hidden shadow-md lg:shadow-none">
            {/* Header */}
            <div className="p-4 border-b border-[#c1c7cd] flex justify-between items-center bg-[#f3f3f6]">
              <h3 className="text-[16px] font-bold text-[#191c1e]">Detail Transaksi</h3>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Meta Info */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-[#2f6481] font-bold text-[16px] leading-tight">
                    {activeTrx.id}
                  </p>
                  <p className="text-[12px] text-[#71787e] mt-0.5">
                    {formatDateTimeIndo(activeTrx.date)}
                  </p>
                </div>
                {renderPaymentBadge(activeTrx.paymentMethod)}
              </div>

              {/* Products List */}
              <div>
                <h4 className="text-[12px] font-bold text-[#71787e] uppercase tracking-wider border-b border-[#edeef0] pb-2 mb-3">
                  Daftar Produk ({activeTrx.items.length} item)
                </h4>
                <ul className="space-y-3">
                  {activeTrx.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-start text-[13px]">
                      <div>
                        <p className="font-semibold text-[#191c1e]">{item.name}</p>
                        <p className="text-[12px] text-[#71787e] font-mono">
                          {item.quantity} x {formatRupiah(item.price)}
                        </p>
                      </div>
                      <p className="font-mono font-bold text-[#191c1e]">
                        {formatRupiah(item.total)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Financial Breakdown */}
              <div className="border-t border-[#c1c7cd] pt-3 space-y-1.5 text-[13px]">
                <div className="flex justify-between text-[#71787e]">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-[#191c1e]">
                    {formatRupiah(activeTrx.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#71787e]">
                  <span>Pajak ({activeTrx.tax > 0 ? 'PB1 10%' : '0%'})</span>
                  <span className="font-mono font-medium text-[#191c1e]">
                    {formatRupiah(activeTrx.tax)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#191c1e] font-bold text-[15px] pt-2 border-t border-[#c1c7cd] border-dashed">
                  <span>Total</span>
                  <span className="font-mono text-[18px] text-[#2f6481]">
                    {formatRupiah(activeTrx.total)}
                  </span>
                </div>
              </div>

              {/* Cash Paid & Change */}
              <div className="border-t border-[#c1c7cd] pt-3 space-y-1.5 text-[13px]">
                <div className="flex justify-between text-[#71787e]">
                  <span>Tunai Diterima</span>
                  <span className="font-mono font-medium text-[#191c1e]">
                    {formatRupiah(activeTrx.paymentAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-[#71787e]">
                  <span>Kembalian</span>
                  <span className="font-mono font-bold text-[#265c79]">
                    {formatRupiah(activeTrx.change)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-[#c1c7cd] bg-white space-y-2 shrink-0">
              <button
                onClick={() => openReceiptModal(activeTrx)}
                className="w-full flex items-center justify-center gap-2 bg-[#2f6481] hover:bg-[#0e4c68] text-white py-3 rounded-lg text-[14px] font-bold transition-all shadow-xs cursor-pointer active:scale-[0.98]"
              >
                <Receipt className="w-4 h-4" />
                <span>Cetak Struk</span>
              </button>
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-transparent text-[#2f6481] border border-[#2f6481] hover:bg-[#cfe2f1]/30 py-3 rounded-lg text-[14px] font-bold transition-all cursor-pointer active:scale-[0.98]"
              >
                <Mail className="w-4 h-4" />
                <span>Kirim via Email</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Email Sender Modal */}
      {isEmailModalOpen && activeTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-[#c1c7cd] animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[18px] font-bold text-[#191c1e]">Kirim Struk Digital</h3>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="text-[#71787e] hover:text-[#191c1e]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                  Alamat Email Pelanggan
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="pelanggan@example.com"
                  className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 text-[14px] focus:ring-2 focus:ring-[#2f6481]"
                />
              </div>
              <p className="text-[12px] text-[#71787e]">
                Struk transaksi #{activeTrx.id} senilai {formatRupiah(activeTrx.total)} akan dikirimkan otomatis.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="flex-1 py-2.5 border border-[#c1c7cd] rounded-lg text-[13px] font-semibold text-[#41484d] hover:bg-[#f3f3f6]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2f6481] hover:bg-[#0e4c68] text-white rounded-lg text-[13px] font-bold flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
