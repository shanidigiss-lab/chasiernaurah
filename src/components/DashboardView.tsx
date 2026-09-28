import React, { useState } from 'react';
import { 
  CreditCard, 
  Receipt, 
  ShoppingBag, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  Plus, 
  ChevronRight,
  Coffee,
  Croissant,
  Milk,
  Package,
  Rotate3d,
  ShieldCheck
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatRupiah, formatDateIndo, formatTimeIndo } from '../utils/formatters';
import { WEEKLY_SALES_DATA } from '../data/initialData';
import { GyroscopicDisplayCard } from './GyroscopicDisplayCard';
import { MagneticButton } from './MagneticButton';

export const DashboardView: React.FC = () => {
  const { 
    transactions, 
    products, 
    setActiveTab, 
    setSelectedTransaction,
    openReceiptModal
  } = usePOS();

  const [chartPeriod, setChartPeriod] = useState<'7days' | 'month'>('7days');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Derive dynamic stats from transactions or defaults matching the design
  const todayTotalRevenue = transactions.reduce((sum, t) => sum + t.total, 0) || 4250000;
  const totalTransactionsCount = transactions.length >= 10 ? transactions.length : 142;
  const totalItemsSold = transactions.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0), 0) || 328;
  const lowStockProducts = products.filter((p) => p.stock <= p.minStockAlert);
  const lowStockCount = lowStockProducts.length;

  // Recent transactions list
  const recentTransactions = transactions.slice(0, 5);

  // SVG Chart Dimensions
  const chartData = chartPeriod === '7days' 
    ? WEEKLY_SALES_DATA 
    : [
        { day: 'Mgg 1', revenueInJuta: 14.5, fullAmount: 14500000 },
        { day: 'Mgg 2', revenueInJuta: 16.8, fullAmount: 16800000 },
        { day: 'Mgg 3', revenueInJuta: 19.2, fullAmount: 19200000 },
        { day: 'Mgg 4', revenueInJuta: 22.4, fullAmount: 22400000 },
      ];

  const maxVal = Math.max(...chartData.map((d) => d.revenueInJuta)) * 1.15;
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;

  const points = chartData.map((d, index) => {
    const x = paddingX + (index * (svgWidth - paddingX * 2)) / (chartData.length - 1);
    const y = svgHeight - paddingY - (d.revenueInJuta / maxVal) * (svgHeight - paddingY * 2);
    return { x, y, ...d };
  });

  // SVG Path generation
  const pathD = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (p.x - prev.x) / 2;
    const cpY2 = p.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  const getProductIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('kopi') || lower.includes('coffee') || lower.includes('cappuccino') || lower.includes('americano')) {
      return <Coffee className="w-5 h-5 text-[#41484d]" />;
    }
    if (lower.includes('roti') || lower.includes('croissant') || lower.includes('toast')) {
      return <Croissant className="w-5 h-5 text-[#41484d]" />;
    }
    if (lower.includes('susu') || lower.includes('milk')) {
      return <Milk className="w-5 h-5 text-[#41484d]" />;
    }
    return <Package className="w-5 h-5 text-[#41484d]" />;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] md:text-[32px] font-bold text-[#191c1e] tracking-tight">Overview</h2>
          <p className="text-[15px] text-[#41484d] mt-0.5">Ringkasan aktivitas penjualan Anda hari ini.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-[#41484d] bg-[#edeef0] px-3.5 py-2 rounded-full border border-[#c1c7cd] flex items-center gap-1.5 shadow-2xs">
            <Calendar className="w-4 h-4 text-[#41484d]" />
            {formatDateIndo(new Date()) || '24 Okt 2023'}
          </span>
          <MagneticButton
            id="btn-dashboard-new-transaction"
            onClick={() => setActiveTab('kasir')}
            magneticStrength={0.28}
            burstColors={['#2f6481', '#eab308', '#ffffff', '#38bdf8']}
            className="bg-[#2f6481] hover:bg-[#0e4c68] text-white text-[14px] font-semibold px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Transaksi Baru</span>
          </MagneticButton>
        </div>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1: Total Penjualan */}
        <div className="bg-white p-5 rounded-xl border border-[#c1c7cd] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CreditCard className="w-20 h-20 text-[#2f6481]" />
          </div>
          <div className="flex items-center gap-3 mb-2 text-[#41484d]">
            <div className="bg-[#a1d4f5] text-[#001e2d] p-2 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-[14px] font-semibold text-[#41484d]">Total Penjualan</h3>
          </div>
          <div className="text-[24px] font-bold text-[#191c1e] mb-1">
            {formatRupiah(todayTotalRevenue)}
          </div>
          <div className="text-[13px] text-[#4f616d] flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-emerald-700">+12.5%</span> dari kemarin
          </div>
        </div>

        {/* Stat Card 2: Total Transaksi */}
        <div className="bg-white p-5 rounded-xl border border-[#c1c7cd] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Receipt className="w-20 h-20 text-[#725380]" />
          </div>
          <div className="flex items-center gap-3 mb-2 text-[#41484d]">
            <div className="bg-[#f6d9ff] text-[#2a0f39] p-2 rounded-lg">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-[14px] font-semibold text-[#41484d]">Total Transaksi</h3>
          </div>
          <div className="text-[24px] font-bold text-[#191c1e] mb-1">
            {totalTransactionsCount}
          </div>
          <div className="text-[13px] text-[#4f616d] flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-emerald-700">+5%</span> dari kemarin
          </div>
        </div>

        {/* Stat Card 3: Produk Terjual */}
        <div className="bg-white p-5 rounded-xl border border-[#c1c7cd] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShoppingBag className="w-20 h-20 text-[#4f616d]" />
          </div>
          <div className="flex items-center gap-3 mb-2 text-[#41484d]">
            <div className="bg-[#cfe2f1] text-[#0a1e28] p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-[14px] font-semibold text-[#41484d]">Produk Terjual</h3>
          </div>
          <div className="text-[24px] font-bold text-[#191c1e] mb-1">
            {totalItemsSold}
          </div>
          <div className="text-[13px] text-[#71787e]">Item terjual hari ini</div>
        </div>

        {/* Stat Card 4: Stok Menipis */}
        <div 
          onClick={() => setActiveTab('stok')}
          className="bg-white p-5 rounded-xl border border-[#c1c7cd] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle className="w-20 h-20 text-[#ba1a1a]" />
          </div>
          <div className="flex items-center gap-3 mb-2 text-[#41484d]">
            <div className="bg-[#ffdad6] text-[#93000a] p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-[14px] font-semibold text-[#41484d]">Stok Menipis</h3>
          </div>
          <div className="text-[24px] font-bold text-[#ba1a1a] mb-1">
            {lowStockCount || 8}
          </div>
          <div className="text-[13px] text-[#ba1a1a] font-medium flex items-center gap-1">
            Perlu restock segera
          </div>
        </div>
      </div>

      {/* Main Dashboard Area: Chart & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chart & Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <div className="bg-white rounded-xl border border-[#c1c7cd] shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-[18px] font-bold text-[#191c1e]">Penjualan Mingguan</h3>
                <p className="text-[13px] text-[#71787e]">Pendapatan 7 hari terakhir</p>
              </div>
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value as '7days' | 'month')}
                className="bg-[#f3f3f6] border border-[#c1c7cd] rounded-lg text-[13px] font-semibold px-3 py-1.5 text-[#191c1e] focus:ring-1 focus:ring-[#2f6481] focus:border-[#2f6481] cursor-pointer"
              >
                <option value="7days">7 Hari Terakhir</option>
                <option value="month">Bulan Ini</option>
              </select>
            </div>

            {/* SVG Interactive Line Chart */}
            <div className="w-full relative h-[250px] flex items-center justify-center">
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f6481" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2f6481" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y Grid Lines */}
                {[0, 1, 2, 3, 4].map((step) => {
                  const y = svgHeight - paddingY - (step / 4) * (svgHeight - paddingY * 2);
                  const labelVal = ((step / 4) * maxVal).toFixed(1);
                  return (
                    <g key={step}>
                      <line 
                        x1={paddingX} 
                        y1={y} 
                        x2={svgWidth - paddingX} 
                        y2={y} 
                        stroke="#e1e2e5" 
                        strokeDasharray="3 3" 
                        strokeWidth="1"
                      />
                      <text 
                        x={paddingX - 10} 
                        y={y + 4} 
                        fontSize="11" 
                        fill="#71787e" 
                        textAnchor="end"
                      >
                        {labelVal}
                      </text>
                    </g>
                  );
                })}

                {/* Area Fill */}
                <path d={areaD} fill="url(#chartGradient)" />

                {/* Main Curve Line */}
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke="#2f6481" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />

                {/* Data Points */}
                {points.map((p, idx) => (
                  <g key={idx} className="cursor-pointer">
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={hoveredPoint === idx ? 6 : 4}
                      fill="#ffffff"
                      stroke="#2f6481"
                      strokeWidth="2"
                      className="transition-all duration-150"
                      onMouseEnter={() => setHoveredPoint(idx)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <text 
                      x={p.x} 
                      y={svgHeight - 6} 
                      fontSize="12" 
                      fontWeight="500"
                      fill="#71787e" 
                      textAnchor="middle"
                    >
                      {p.day}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Tooltip Hover Overlay */}
              {hoveredPoint !== null && points[hoveredPoint] && (
                <div 
                  className="absolute bg-[#191c1e] text-white text-[12px] rounded-lg px-3 py-1.5 shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
                  style={{
                    left: `${(points[hoveredPoint].x / svgWidth) * 100}%`,
                    top: `${(points[hoveredPoint].y / svgHeight) * 100}%`,
                  }}
                >
                  <p className="font-bold text-[#a1d4f5]">
                    {formatRupiah(points[hoveredPoint].fullAmount)}
                  </p>
                  <p className="text-[10px] text-gray-300">
                    {points[hoveredPoint].day} - {points[hoveredPoint].revenueInJuta} Juta
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="bg-white rounded-xl border border-[#c1c7cd] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#c1c7cd] flex justify-between items-center bg-white">
              <h3 className="text-[18px] font-bold text-[#191c1e]">Transaksi Terbaru</h3>
              <button
                onClick={() => setActiveTab('riwayat')}
                className="text-[#2f6481] hover:text-[#0e4c68] text-[13px] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Lihat Semua <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f3f3f6] text-[#41484d] text-[13px] font-semibold border-b border-[#c1c7cd]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Waktu</th>
                    <th className="py-3 px-4 font-semibold">ID Transaksi</th>
                    <th className="py-3 px-4 font-semibold">Kasir</th>
                    <th className="py-3 px-4 font-semibold text-right">Total</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] divide-y divide-[#edeef0]">
                  {recentTransactions.map((trx) => (
                    <tr 
                      key={trx.id}
                      onClick={() => {
                        setSelectedTransaction(trx);
                        openReceiptModal(trx);
                      }}
                      className="hover:bg-[#f9f9fc] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 text-[#71787e] font-medium">
                        {formatTimeIndo(trx.date) || '10:45 AM'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#191c1e] font-semibold">
                        #{trx.id}
                      </td>
                      <td className="py-3.5 px-4 text-[#191c1e] font-medium">
                        {trx.cashier}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#191c1e]">
                        {formatRupiah(trx.total)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#cfe2f1] text-[#265c79]">
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Gyroscopic Card & Low Stock Alerts */}
        <div className="space-y-6">
          {/* 3D Gyroscopic Terminal Pass Showcase */}
          <div className="bg-white rounded-xl border border-[#c1c7cd] shadow-xs p-5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-2.5 mb-1 border-b border-[#edeef0]">
              <div className="flex items-center gap-2">
                <Rotate3d className="w-4 h-4 text-[#2f6481]" />
                <h3 className="text-[15px] font-bold text-[#191c1e]">Kartu Otorisasi 3D</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#cfe2f1] text-[#14374a]">
                Interactive
              </span>
            </div>
            <GyroscopicDisplayCard />
          </div>

          <div className="bg-white rounded-xl border border-[#c1c7cd] shadow-xs overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#c1c7cd] bg-[#ffdad6]/20">
              <div className="flex items-center gap-2 text-[#ba1a1a] mb-1">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-[18px] font-bold">Stok Menipis</h3>
              </div>
              <p className="text-[13px] text-[#71787e]">Produk dengan stok kurang dari 10.</p>
            </div>

            <div className="divide-y divide-[#edeef0] flex-1">
              {lowStockProducts.slice(0, 5).map((prod) => (
                <div 
                  key={prod.id}
                  onClick={() => setActiveTab('stok')}
                  className="p-4 flex items-center justify-between hover:bg-[#f9f9fc] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#edeef0] rounded-lg flex items-center justify-center text-[#41484d] border border-[#c1c7cd] shrink-0">
                      {getProductIcon(prod.name)}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#191c1e] leading-snug">
                        {prod.name}
                      </div>
                      <div className="text-[12px] text-[#71787e]">{prod.category}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-[#ba1a1a] font-bold text-[18px]">
                      {prod.stock}
                    </div>
                    <div className="text-[11px] font-semibold text-[#71787e]">Sisa</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#c1c7cd] bg-white text-center mt-auto">
              <button 
                onClick={() => setActiveTab('stok')}
                className="text-[#2f6481] hover:text-[#0e4c68] text-[13px] font-bold hover:underline w-full py-1.5 transition-colors cursor-pointer"
              >
                Kelola Stok Produk
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
