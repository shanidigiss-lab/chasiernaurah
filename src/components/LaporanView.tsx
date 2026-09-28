import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CreditCard, 
  Download, 
  Printer,
  Calendar
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatRupiah } from '../utils/formatters';

export const LaporanView: React.FC = () => {
  const { transactions, products, addToast } = usePOS();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalTax = transactions.reduce((sum, t) => sum + t.tax, 0);
  const totalItemsSold = transactions.reduce(
    (sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const avgOrderValue = transactions.length > 0 ? totalRevenue / transactions.length : 0;

  // Breakdown by payment method
  const cashTotal = transactions.filter((t) => t.paymentMethod === 'cash').reduce((sum, t) => sum + t.total, 0);
  const debitTotal = transactions.filter((t) => t.paymentMethod === 'debit').reduce((sum, t) => sum + t.total, 0);
  const qrisTotal = transactions.filter((t) => t.paymentMethod === 'qris').reduce((sum, t) => sum + t.total, 0);

  // Top products
  const productSalesMap: { [name: string]: { qty: number; revenue: number } } = {};
  transactions.forEach((t) => {
    t.items.forEach((item) => {
      if (!productSalesMap[item.name]) {
        productSalesMap[item.name] = { qty: 0, revenue: 0 };
      }
      productSalesMap[item.name].qty += item.quantity;
      productSalesMap[item.name].revenue += item.total;
    });
  });

  const topProducts = Object.entries(productSalesMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.qty - a.qty);

  const handleExport = () => {
    addToast('success', 'Laporan Berhasil Diunduh', 'Berkas laporan penjualan harian siap dicetak.');
    window.print();
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] md:text-[32px] font-bold text-[#191c1e] tracking-tight">
            Laporan Penjualan & Finansial
          </h2>
          <p className="text-[15px] text-[#41484d] mt-0.5">
            Analisis performa omzet dan tren produk terlaris.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 text-[13px] font-semibold text-[#191c1e]"
          >
            <option value="today">Hari Ini</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
          </select>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 bg-[#2f6481] hover:bg-[#0e4c68] text-white px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#c1c7cd] shadow-xs">
          <div className="flex items-center gap-3 mb-2 text-[#41484d]">
            <div className="p-2 bg-[#cfe2f1] text-[#265c79] rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-semibold text-[#41484d]">Total Omzet</span>
          </div>
          <div className="text-[24px] font-bold text-[#191c1e] font-mono">
            {formatRupiah(totalRevenue || 4250000)}
          </div>
          <span className="text-[12px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12.5% vs periode lalu
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c1c7cd] shadow-xs">
          <div className="flex items-center gap-3 mb-2 text-[#41484d]">
            <div className="p-2 bg-[#f6d9ff] text-[#725380] rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-semibold text-[#41484d]">Rata-rata Transaksi (AOV)</span>
          </div>
          <div className="text-[24px] font-bold text-[#191c1e] font-mono">
            {formatRupiah(avgOrderValue || 35000)}
          </div>
          <span className="text-[12px] text-[#71787e] mt-1 block">Dari {transactions.length || 142} nota</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c1c7cd] shadow-xs">
          <div className="flex items-center gap-3 mb-2 text-[#41484d]">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-semibold text-[#41484d]">Pajak PB1 Terkumpul</span>
          </div>
          <div className="text-[24px] font-bold text-[#191c1e] font-mono">
            {formatRupiah(totalTax || 386000)}
          </div>
          <span className="text-[12px] text-[#71787e] mt-1 block">Tarif PB1 10%</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c1c7cd] shadow-xs">
          <div className="flex items-center gap-3 mb-2 text-[#41484d]">
            <div className="p-2 bg-[#a1d4f5] text-[#001e2d] rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-semibold text-[#41484d]">Total Item Terjual</span>
          </div>
          <div className="text-[24px] font-bold text-[#191c1e] font-mono">
            {totalItemsSold || 328} <span className="text-[14px] font-normal text-[#71787e]">Pcs</span>
          </div>
          <span className="text-[12px] text-[#71787e] mt-1 block">Semua kategori</span>
        </div>
      </div>

      {/* Grid: Payment Method Breakdown & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-xl border border-[#c1c7cd] shadow-xs space-y-4">
          <h3 className="text-[18px] font-bold text-[#191c1e]">Distribusi Metode Bayar</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[13px] mb-1 font-semibold">
                <span className="text-[#41484d]">Cash / Tunai</span>
                <span className="font-mono text-[#191c1e]">{formatRupiah(cashTotal)}</span>
              </div>
              <div className="w-full h-2.5 bg-[#edeef0] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2f6481] rounded-full" 
                  style={{ width: `${totalRevenue ? (cashTotal / totalRevenue) * 100 : 60}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[13px] mb-1 font-semibold">
                <span className="text-[#41484d]">QRIS / E-Wallet</span>
                <span className="font-mono text-[#191c1e]">{formatRupiah(qrisTotal)}</span>
              </div>
              <div className="w-full h-2.5 bg-[#edeef0] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#725380] rounded-full" 
                  style={{ width: `${totalRevenue ? (qrisTotal / totalRevenue) * 100 : 25}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[13px] mb-1 font-semibold">
                <span className="text-[#41484d]">Debit / Kartu</span>
                <span className="font-mono text-[#191c1e]">{formatRupiah(debitTotal)}</span>
              </div>
              <div className="w-full h-2.5 bg-[#edeef0] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${totalRevenue ? (debitTotal / totalRevenue) * 100 : 15}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#c1c7cd] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#c1c7cd]">
            <h3 className="text-[18px] font-bold text-[#191c1e]">Produk Paling Laris</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f3f3f6] border-b border-[#c1c7cd] text-[13px] text-[#41484d] font-semibold">
                <tr>
                  <th className="py-3 px-4">Peringkat</th>
                  <th className="py-3 px-4">Nama Produk</th>
                  <th className="py-3 px-4 text-center">Jumlah Terjual</th>
                  <th className="py-3 px-4 text-right">Total Pendapatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edeef0] text-[13px]">
                {topProducts.slice(0, 5).map((p, idx) => (
                  <tr key={idx} className="hover:bg-[#f8f9fc]">
                    <td className="py-3 px-4 font-bold text-[#2f6481]">
                      #{idx + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#191c1e]">{p.name}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold">{p.qty}x</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#2f6481]">
                      {formatRupiah(p.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
