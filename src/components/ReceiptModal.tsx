import React from 'react';
import { Printer, X, Download } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatRupiah, formatDateTimeIndo } from '../utils/formatters';

export const ReceiptModal: React.FC = () => {
  const { isReceiptModalOpen, closeReceiptModal, receiptTransaction, settings } = usePOS();

  if (!isReceiptModalOpen || !receiptTransaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-[#c1c7cd] flex flex-col my-8 print:shadow-none print:border-none print:max-w-none print:w-full print:m-0 animate-in fade-in zoom-in duration-150">
        {/* Top Dialog Bar - hidden in print */}
        <div className="px-5 py-3 border-b border-[#c1c7cd] flex justify-between items-center bg-[#f3f3f6] print:hidden">
          <span className="text-[14px] font-bold text-[#191c1e]">Preview Struk Kasir</span>
          <button
            onClick={closeReceiptModal}
            className="text-[#71787e] hover:text-[#191c1e] p-1 rounded-full hover:bg-[#e1e2e5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thermal Slip Body */}
        <div className="p-6 bg-white font-mono text-[12px] text-[#191c1e] leading-relaxed receipt-container select-text">
          {/* Header */}
          <div className="text-center mb-4">
            <h3 className="font-bold text-[18px] tracking-tight">{settings.storeName}</h3>
            <p className="text-[11px] text-[#71787e]">{settings.address}</p>
            <p className="text-[11px] text-[#71787e]">Telp: {settings.phone}</p>
          </div>

          <div className="border-t border-b border-black/30 border-dashed py-2 my-2 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>No. Nota:</span>
              <span className="font-bold">#{receiptTransaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu:</span>
              <span>{formatDateTimeIndo(receiptTransaction.date)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kasir:</span>
              <span>{receiptTransaction.cashier}</span>
            </div>
            <div className="flex justify-between">
              <span>Pelanggan:</span>
              <span>{receiptTransaction.customerName || 'Umum'}</span>
            </div>
          </div>

          {/* Items */}
          <div className="py-2 space-y-2 border-b border-black/30 border-dashed">
            {receiptTransaction.items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="font-bold text-[12px]">{item.name}</div>
                <div className="flex justify-between text-[11px] text-[#41484d]">
                  <span>
                    {item.quantity} x {formatRupiah(item.price)}
                  </span>
                  <span className="font-bold text-[#191c1e]">{formatRupiah(item.total)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="py-2.5 space-y-1.5 border-b border-black/30 border-dashed text-[12px]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatRupiah(receiptTransaction.subtotal)}</span>
            </div>
            {receiptTransaction.tax > 0 && (
              <div className="flex justify-between">
                <span>Pajak (PB1 10%)</span>
                <span>{formatRupiah(receiptTransaction.tax)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-[14px] pt-1">
              <span>TOTAL</span>
              <span>{formatRupiah(receiptTransaction.total)}</span>
            </div>
          </div>

          {/* Payment Detail */}
          <div className="py-2 space-y-1 text-[11px] border-b border-black/30 border-dashed">
            <div className="flex justify-between">
              <span>Metode Bayar:</span>
              <span className="uppercase font-bold">{receiptTransaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Bayar:</span>
              <span>{formatRupiah(receiptTransaction.paymentAmount)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Kembalian:</span>
              <span>{formatRupiah(receiptTransaction.change)}</span>
            </div>
          </div>

          {/* Footer message and barcode imitation */}
          <div className="text-center pt-4 space-y-2">
            <p className="text-[11px] italic">{settings.receiptFooter}</p>
            {/* Barcode visual */}
            <div className="flex justify-center items-center py-2">
              <div className="flex gap-[2px] items-center h-8">
                {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2, 4, 1, 2, 3].map((w, i) => (
                  <div 
                    key={i} 
                    className="bg-black h-full" 
                    style={{ width: `${w}px` }} 
                  />
                ))}
              </div>
            </div>
            <p className="text-[10px] text-[#71787e] tracking-widest">*{receiptTransaction.id}*</p>
          </div>
        </div>

        {/* Action Buttons - hidden in print */}
        <div className="p-4 border-t border-[#c1c7cd] bg-[#f3f3f6] flex gap-2 print:hidden">
          <button
            onClick={closeReceiptModal}
            className="flex-1 py-2.5 bg-white border border-[#c1c7cd] rounded-xl text-[13px] font-semibold text-[#41484d] hover:bg-[#edeef0] transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-[#2f6481] hover:bg-[#0e4c68] text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk</span>
          </button>
        </div>
      </div>
    </div>
  );
};
