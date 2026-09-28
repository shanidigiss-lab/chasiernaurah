import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  QrCode, 
  Banknote, 
  CheckCircle2,
  X
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatRupiah, formatNumber, parseRupiahInput } from '../utils/formatters';
import { PaymentMethod } from '../types';
import { MagneticButton } from './MagneticButton';
import { createParticleBurst } from '../utils/particleBurst';

export const KasirView: React.FC = () => {
  const { 
    products, 
    categories, 
    cart, 
    cartSubtotal, 
    cartTax, 
    cartTotal, 
    addToCart, 
    updateCartQuantity, 
    clearCart,
    processCheckout,
    openReceiptModal,
    globalSearch
  } = usePOS();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [paymentInput, setPaymentInput] = useState<string>('100000');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('cash');
  const [customerName, setCustomerName] = useState<string>('Pelanggan Umum');
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [lastTrx, setLastTrx] = useState<any>(null);

  // Filter products by category and global search
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !globalSearch || 
      product.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      product.sku.toLowerCase().includes(globalSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const parsedPaymentAmount = parseRupiahInput(paymentInput);
  const changeAmount = Math.max(0, parsedPaymentAmount - cartTotal);
  const isPaymentSufficient = parsedPaymentAmount >= cartTotal && cart.length > 0;

  const handlePaymentChange = (val: string) => {
    const numeric = parseRupiahInput(val);
    setPaymentInput(numeric.toString());
  };

  const setQuickCash = (amount: number) => {
    setPaymentInput(amount.toString());
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (parsedPaymentAmount < cartTotal && selectedPaymentMethod === 'cash') {
      alert('Jumlah pembayaran kurang dari total tagihan.');
      return;
    }

    const effectivePay = selectedPaymentMethod === 'cash' ? parsedPaymentAmount : cartTotal;
    const completedTrx = processCheckout(selectedPaymentMethod, effectivePay, customerName);
    setLastTrx(completedTrx);
    setShowSuccessDialog(true);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[#f8f9fc]">
      {/* Left: Product Catalog */}
      <div className="flex-1 flex flex-col p-4 md:p-6 gap-5 overflow-y-auto min-w-0">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none shrink-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`
              px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer shadow-2xs
              ${
                selectedCategory === 'all'
                  ? 'bg-[#2f6481] text-white shadow-xs'
                  : 'bg-white border border-[#c1c7cd] text-[#41484d] hover:bg-[#f3f3f6]'
              }
            `}
          >
            Semua Kategori
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`
                px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer shadow-2xs
                ${
                  selectedCategory === cat.name
                    ? 'bg-[#2f6481] text-white shadow-xs'
                    : 'bg-white border border-[#c1c7cd] text-[#41484d] hover:bg-[#f3f3f6]'
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            const isLowStock = product.stock <= product.minStockAlert;
            const isOutOfStock = product.stock === 0;

            return (
              <div
                key={product.id}
                onClick={(e) => {
                  if (!isOutOfStock) {
                    createParticleBurst(e.clientX, e.clientY, ['#2f6481', '#a1d4f5', '#10b981'], 16);
                    addToCart(product);
                  }
                }}
                className={`
                  bg-white rounded-xl border border-[#c1c7cd] overflow-hidden shadow-xs hover:shadow-md 
                  hover:border-[#2f6481] transition-all cursor-pointer group flex flex-col relative select-none
                  ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}
                `}
              >
                {/* Stock Badge */}
                <div
                  className={`
                    absolute top-2 right-2 px-2 py-0.5 rounded text-[11px] font-bold z-10 shadow-2xs
                    ${
                      isOutOfStock
                        ? 'bg-[#ba1a1a] text-white'
                        : isLowStock
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#cfe2f1] text-[#265c79]'
                    }
                  `}
                >
                  {isOutOfStock ? 'Habis' : isLowStock ? `Sisa ${product.stock}` : `Stok: ${product.stock}`}
                </div>

                {/* Product Image */}
                <div className="h-32 w-full bg-[#f3f3f6] relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="font-mono text-[#71787e] text-[11px] block mb-0.5">
                      {product.sku}
                    </span>
                    <h3 className="text-[14px] text-[#191c1e] font-semibold line-clamp-2 leading-snug mb-2">
                      {product.name}
                    </h3>
                  </div>
                  <div className="mt-auto pt-1 flex items-center justify-between border-t border-[#edeef0]">
                    <span className="text-[14px] font-bold text-[#2f6481]">
                      {formatRupiah(product.price)}
                    </span>
                    <span className="text-[11px] text-[#71787e]">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-16 text-center text-[#71787e]">
            <p className="text-[16px] font-semibold mb-1">Tidak ada produk ditemukan</p>
            <p className="text-[13px]">Coba cari dengan kata kunci lain atau pilih kategori Semua.</p>
          </div>
        )}
      </div>

      {/* Right: Active Cart Panel */}
      <aside className="w-full lg:w-[380px] xl:w-[400px] bg-white border-t lg:border-t-0 lg:border-l border-[#c1c7cd] flex flex-col shrink-0 shadow-lg lg:shadow-none z-20">
        {/* Cart Header */}
        <div className="p-4 border-b border-[#c1c7cd] flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-[#191c1e]">Pesanan Baru</h2>
            <span className="text-[12px] text-[#71787e] font-mono">
              Trx: #{new Date().getFullYear()}{new Date().getMonth() + 1}{new Date().getDate()}-001
            </span>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[#ba1a1a] hover:bg-[#ffdad6] p-2 rounded-lg transition-colors cursor-pointer"
              title="Kosongkan Keranjang"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#f8f9fc] max-h-[35vh] lg:max-h-none">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-[#71787e] my-auto">
              <Banknote className="w-12 h-12 mx-auto mb-2 opacity-30 text-[#2f6481]" />
              <p className="text-[14px] font-semibold text-[#191c1e]">Keranjang Kosong</p>
              <p className="text-[12px] text-[#71787e] mt-0.5">Pilih produk di katalog untuk menambahkan pesanan.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#c1c7cd] shadow-2xs relative group"
              >
                <div className="w-14 h-14 rounded-md bg-[#edeef0] overflow-hidden shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-bold text-[#191c1e] truncate leading-tight">
                    {item.product.name}
                  </h4>
                  <span className="font-mono text-[12px] text-[#2f6481] block mt-0.5">
                    {formatRupiah(item.product.price)}
                  </span>
                </div>
                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[13px] font-bold text-[#191c1e] font-mono">
                    {formatRupiah(item.product.price * item.quantity)}
                  </span>
                  <div className="flex items-center bg-[#f3f3f6] border border-[#c1c7cd] rounded-md overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-[#41484d] hover:bg-[#e1e2e5] transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center font-mono text-[12px] font-bold text-[#191c1e]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-[#41484d] hover:bg-[#e1e2e5] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment Summary & Actions */}
        <div className="border-t border-[#c1c7cd] bg-white p-4 flex flex-col gap-3 shrink-0">
          {/* Payment Method Selector */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#f3f3f6] rounded-lg border border-[#c1c7cd]">
            <button
              onClick={() => setSelectedPaymentMethod('cash')}
              className={`
                py-1.5 rounded-md text-[12px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer
                ${selectedPaymentMethod === 'cash' ? 'bg-[#2f6481] text-white shadow-xs' : 'text-[#41484d] hover:text-[#191c1e]'}
              `}
            >
              <Banknote className="w-3.5 h-3.5" /> Cash
            </button>
            <button
              onClick={() => {
                setSelectedPaymentMethod('debit');
                setPaymentInput(cartTotal.toString());
              }}
              className={`
                py-1.5 rounded-md text-[12px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer
                ${selectedPaymentMethod === 'debit' ? 'bg-[#2f6481] text-white shadow-xs' : 'text-[#41484d] hover:text-[#191c1e]'}
              `}
            >
              <CreditCard className="w-3.5 h-3.5" /> Debit
            </button>
            <button
              onClick={() => {
                setSelectedPaymentMethod('qris');
                setPaymentInput(cartTotal.toString());
              }}
              className={`
                py-1.5 rounded-md text-[12px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer
                ${selectedPaymentMethod === 'qris' ? 'bg-[#2f6481] text-white shadow-xs' : 'text-[#41484d] hover:text-[#191c1e]'}
              `}
            >
              <QrCode className="w-3.5 h-3.5" /> QRIS
            </button>
          </div>

          {/* Subtotals & Taxes */}
          <div className="space-y-1.5 text-[13px]">
            <div className="flex justify-between items-center text-[#71787e]">
              <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} item)</span>
              <span className="font-mono font-medium text-[#191c1e]">{formatRupiah(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-[#71787e]">
              <span>Pajak (PB1 10%)</span>
              <span className="font-mono font-medium text-[#191c1e]">{formatRupiah(cartTax)}</span>
            </div>
            <div className="flex justify-between items-end pt-2 border-t border-[#c1c7cd] border-dashed">
              <span className="text-[14px] font-bold text-[#191c1e]">Total Tagihan</span>
              <span className="text-[24px] font-bold text-[#2f6481] font-mono leading-none">
                {formatRupiah(cartTotal)}
              </span>
            </div>
          </div>

          {/* Cash Payment Inputs */}
          {selectedPaymentMethod === 'cash' && (
            <>
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-[#41484d]">Jumlah Pembayaran</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] font-bold text-[#71787e]">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={formatNumber(parsedPaymentAmount)}
                    onChange={(e) => handlePaymentChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#ffffff] border-2 border-[#c1c7cd] rounded-lg text-right font-mono text-[20px] font-bold text-[#191c1e] focus:outline-none focus:border-[#2f6481] focus:ring-2 focus:ring-[#a1d4f5]"
                  />
                </div>
              </div>

              {/* Automatic Change Calculator */}
              <div className="flex justify-between items-center bg-[#cfe2f1]/40 px-3.5 py-2.5 rounded-lg border border-[#cfe2f1]">
                <span className="text-[13px] font-bold text-[#265c79]">Kembalian</span>
                <span className="font-mono text-[16px] font-bold text-[#265c79]">
                  {formatRupiah(changeAmount)}
                </span>
              </div>

              {/* Quick Cash Chips */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setQuickCash(cartTotal)}
                  className="py-1.5 border border-[#c1c7cd] rounded-lg bg-white hover:bg-[#edeef0] text-[12px] font-semibold text-[#191c1e] transition-colors cursor-pointer"
                >
                  Uang Pas
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCash(100000)}
                  className="py-1.5 border border-[#c1c7cd] rounded-lg bg-white hover:bg-[#edeef0] text-[12px] font-mono font-semibold text-[#191c1e] transition-colors cursor-pointer"
                >
                  100.000
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCash(50000)}
                  className="py-1.5 border border-[#c1c7cd] rounded-lg bg-white hover:bg-[#edeef0] text-[12px] font-mono font-semibold text-[#191c1e] transition-colors cursor-pointer"
                >
                  50.000
                </button>
              </div>
            </>
          )}

          {/* Pay Button with Magnetic Hover & Particle Explosion */}
          <MagneticButton
            id="btn-kasir-checkout-pay"
            disabled={cart.length === 0 || (!isPaymentSufficient && selectedPaymentMethod === 'cash')}
            onClick={handleCheckout}
            magneticStrength={0.3}
            burstColors={['#2f6481', '#10b981', '#fbbf24', '#ffffff', '#38bdf8']}
            className={`
              w-full h-13 rounded-xl text-[16px] font-bold flex items-center justify-center gap-2 transition-all shadow-sm
              ${
                cart.length > 0 && (isPaymentSufficient || selectedPaymentMethod !== 'cash')
                  ? 'bg-[#2f6481] hover:bg-[#0e4c68] text-white shadow-md'
                  : 'bg-[#edeef0] text-[#71787e] cursor-not-allowed border border-[#c1c7cd]'
              }
            `}
          >
            <Banknote className="w-5 h-5" />
            <span>BAYAR {cartTotal > 0 ? `(${formatRupiah(cartTotal)})` : ''}</span>
          </MagneticButton>
        </div>
      </aside>

      {/* Payment Success Dialog */}
      {showSuccessDialog && lastTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center border border-[#c1c7cd] animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-[#cfe2f1] text-[#2f6481] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-[#2f6481]" />
            </div>
            <h3 className="text-[22px] font-bold text-[#191c1e]">Pembayaran Berhasil!</h3>
            <p className="text-[13px] text-[#71787e] mt-1 mb-4">
              ID Transaksi: <span className="font-mono font-bold text-[#2f6481]">{lastTrx.id}</span>
            </p>

            <div className="bg-[#f8f9fc] border border-[#c1c7cd] rounded-xl p-4 space-y-2 mb-6 text-left text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#71787e]">Metode Pembayaran:</span>
                <span className="font-bold uppercase text-[#191c1e]">{lastTrx.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71787e]">Total Belanja:</span>
                <span className="font-mono font-bold text-[#191c1e]">{formatRupiah(lastTrx.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71787e]">Uang Diterima:</span>
                <span className="font-mono font-bold text-[#191c1e]">{formatRupiah(lastTrx.paymentAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-[#edeef0] pt-2 text-[14px]">
                <span className="font-bold text-[#265c79]">Kembalian:</span>
                <span className="font-mono font-bold text-[#265c79]">{formatRupiah(lastTrx.change)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  setShowSuccessDialog(false);
                  openReceiptModal(lastTrx);
                }}
                className="flex-1 py-3 px-4 bg-[#2f6481] hover:bg-[#0e4c68] text-white font-bold rounded-xl transition-colors cursor-pointer text-[14px]"
              >
                Cetak Struk
              </button>
              <button
                onClick={() => setShowSuccessDialog(false)}
                className="flex-1 py-3 px-4 bg-[#edeef0] hover:bg-[#e1e2e5] text-[#191c1e] font-bold rounded-xl transition-colors cursor-pointer text-[14px]"
              >
                Pesanan Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
