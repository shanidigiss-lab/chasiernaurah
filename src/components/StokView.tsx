import React, { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Plus, 
  Minus, 
  RefreshCw,
  XCircle
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatRupiah } from '../utils/formatters';

export const StokView: React.FC = () => {
  const { products, adjustProductStock, updateProduct } = usePOS();
  const [stockSearch, setStockSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');
  const [customStockModal, setCustomStockModal] = useState<{ id: string; name: string; current: number } | null>(null);
  const [customStockVal, setCustomStockVal] = useState('');

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStockAlert).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const totalItemsInStock = products.reduce((sum, p) => sum + p.stock, 0);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = !stockSearch || 
      p.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(stockSearch.toLowerCase());
    
    if (filterType === 'low') return matchesSearch && p.stock > 0 && p.stock <= p.minStockAlert;
    if (filterType === 'out') return matchesSearch && p.stock === 0;
    return matchesSearch;
  });

  const handleSaveExactStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStockModal) return;
    const newStock = parseInt(customStockVal, 10);
    if (!isNaN(newStock) && newStock >= 0) {
      updateProduct(customStockModal.id, { stock: newStock });
    }
    setCustomStockModal(null);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#191c1e] tracking-tight">
          Inventaris & Manajemen Stok
        </h2>
        <p className="text-[15px] text-[#41484d] mt-0.5">
          Pantau ketersediaan barang dan lakukan restock dengan cepat.
        </p>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setFilterType('all')}
          className={`p-5 bg-white rounded-xl border transition-all cursor-pointer shadow-xs ${filterType === 'all' ? 'border-[#2f6481] ring-2 ring-[#a1d4f5]' : 'border-[#c1c7cd]'}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#cfe2f1] text-[#265c79] rounded-lg">
              <Boxes className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-semibold text-[#41484d]">Total Stok Unit</span>
          </div>
          <div className="text-[24px] font-bold text-[#191c1e] font-mono">{totalItemsInStock}</div>
          <span className="text-[12px] text-[#71787e]">Dari {products.length} produk katalog</span>
        </div>

        <div 
          onClick={() => setFilterType('low')}
          className={`p-5 bg-white rounded-xl border transition-all cursor-pointer shadow-xs ${filterType === 'low' ? 'border-[#ba1a1a] ring-2 ring-[#ffdad6]' : 'border-[#c1c7cd]'}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#ffdad6] text-[#ba1a1a] rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-semibold text-[#ba1a1a]">Stok Menipis</span>
          </div>
          <div className="text-[24px] font-bold text-[#ba1a1a] font-mono">{lowStockCount}</div>
          <span className="text-[12px] text-[#ba1a1a]">Kurang dari batas minimum</span>
        </div>

        <div 
          onClick={() => setFilterType('out')}
          className={`p-5 bg-white rounded-xl border transition-all cursor-pointer shadow-xs ${filterType === 'out' ? 'border-[#ba1a1a] ring-2 ring-[#ffdad6]' : 'border-[#c1c7cd]'}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#edeef0] text-[#71787e] rounded-lg">
              <XCircle className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-semibold text-[#41484d]">Stok Habis (0)</span>
          </div>
          <div className="text-[24px] font-bold text-[#191c1e] font-mono">{outOfStockCount}</div>
          <span className="text-[12px] text-[#71787e]">Harus segera dipesan ulang</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-[#c1c7cd] rounded-xl p-4 flex flex-col md:flex-row gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71787e]" />
          <input
            type="text"
            value={stockSearch}
            onChange={(e) => setStockSearch(e.target.value)}
            placeholder="Cari nama produk atau SKU..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#c1c7cd] rounded-lg text-[14px] text-[#191c1e] focus:ring-1 focus:ring-[#2f6481]"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors ${filterType === 'all' ? 'bg-[#2f6481] text-white' : 'bg-white border border-[#c1c7cd] text-[#41484d]'}`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType('low')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors ${filterType === 'low' ? 'bg-[#ba1a1a] text-white' : 'bg-white border border-[#c1c7cd] text-[#ba1a1a]'}`}
          >
            Stok Menipis ({lowStockCount})
          </button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white border border-[#c1c7cd] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f3f3f6] border-b border-[#c1c7cd] text-[13px] text-[#41484d] font-semibold">
              <tr>
                <th className="py-3.5 px-4">Produk</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4 text-center">Batas Minimum</th>
                <th className="py-3.5 px-4 text-center">Stok Saat Ini</th>
                <th className="py-3.5 px-4 text-center">Aksi Cepat Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edeef0] text-[13px]">
              {filteredProducts.map((p) => {
                const isLow = p.stock <= p.minStockAlert;
                const isOut = p.stock === 0;

                return (
                  <tr key={p.id} className="hover:bg-[#f8f9fc] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-[#edeef0] border border-[#c1c7cd]"
                        />
                        <div>
                          <p className="font-semibold text-[#191c1e] text-[14px]">{p.name}</p>
                          <p className="text-[12px] text-[#71787e]">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#71787e]">
                      {p.sku}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[#71787e]">
                      {p.minStockAlert}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`
                          inline-flex items-center justify-center px-3 py-1 rounded-full font-bold text-[13px] font-mono
                          ${
                            isOut
                              ? 'bg-[#ba1a1a] text-white'
                              : isLow
                              ? 'bg-[#ffdad6] text-[#ba1a1a]'
                              : 'bg-[#cfe2f1] text-[#265c79]'
                          }
                        `}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => adjustProductStock(p.id, -1)}
                          disabled={p.stock <= 0}
                          className="p-1.5 bg-[#f3f3f6] hover:bg-[#e1e2e5] text-[#41484d] rounded-lg disabled:opacity-40 transition-colors"
                          title="Kurangi 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => adjustProductStock(p.id, 5)}
                          className="px-2 py-1 bg-[#2f6481]/10 hover:bg-[#2f6481]/20 text-[#2f6481] font-bold rounded-lg text-[12px] transition-colors"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => adjustProductStock(p.id, 10)}
                          className="px-2 py-1 bg-[#2f6481]/10 hover:bg-[#2f6481]/20 text-[#2f6481] font-bold rounded-lg text-[12px] transition-colors"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => adjustProductStock(p.id, 25)}
                          className="px-2 py-1 bg-[#2f6481]/10 hover:bg-[#2f6481]/20 text-[#2f6481] font-bold rounded-lg text-[12px] transition-colors"
                        >
                          +25
                        </button>
                        <button
                          onClick={() => {
                            setCustomStockModal({ id: p.id, name: p.name, current: p.stock });
                            setCustomStockVal(p.stock.toString());
                          }}
                          className="p-1.5 text-[#2f6481] hover:bg-[#cfe2f1] rounded-lg transition-colors ml-1"
                          title="Set Jumlah Tepat"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Set Exact Stock Modal */}
      {customStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-[#c1c7cd]">
            <h3 className="text-[18px] font-bold text-[#191c1e] mb-1">Set Stok Produk</h3>
            <p className="text-[13px] text-[#71787e] mb-4">{customStockModal.name}</p>
            <form onSubmit={handleSaveExactStock} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                  Jumlah Stok Baru
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={customStockVal}
                  onChange={(e) => setCustomStockVal(e.target.value)}
                  className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 font-mono text-[16px] font-bold focus:ring-2 focus:ring-[#2f6481]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCustomStockModal(null)}
                  className="flex-1 py-2.5 border border-[#c1c7cd] rounded-lg text-[13px] font-semibold text-[#41484d]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2f6481] hover:bg-[#0e4c68] text-white rounded-lg text-[13px] font-bold"
                >
                  Simpan Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
