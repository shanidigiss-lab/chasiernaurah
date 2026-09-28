import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Image as ImageIcon 
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatRupiah } from '../utils/formatters';
import { Product } from '../types';

export const ProdukView: React.FC = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    isProductModalOpen,
    setIsProductModalOpen,
    editingProduct,
    setEditingProduct
  } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form State for Add / Edit Modal
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formMinStock, setFormMinStock] = useState('10');
  const [formImage, setFormImage] = useState('');
  const [formDesc, setFormDesc] = useState('');

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = !selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku(`SKU-${Math.floor(100 + Math.random() * 900)}`);
    setFormCategory(categories[0]?.name || 'Minuman');
    setFormPrice('');
    setFormStock('20');
    setFormMinStock('10');
    setFormImage('https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=80');
    setFormDesc('');
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSku(product.sku);
    setFormCategory(product.category);
    setFormPrice(product.price.toString());
    setFormStock(product.stock.toString());
    setFormMinStock(product.minStockAlert.toString());
    setFormImage(product.image);
    setFormDesc(product.description || '');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSku.trim() || !formPrice) return;

    const priceNum = parseFloat(formPrice) || 0;
    const stockNum = parseInt(formStock, 10) || 0;
    const minStockNum = parseInt(formMinStock, 10) || 10;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName.trim(),
        sku: formSku.trim().toUpperCase(),
        category: formCategory,
        price: priceNum,
        stock: stockNum,
        minStockAlert: minStockNum,
        image: formImage || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=80',
        description: formDesc,
      });
    } else {
      addProduct({
        name: formName.trim(),
        sku: formSku.trim().toUpperCase(),
        category: formCategory,
        price: priceNum,
        stock: stockNum,
        minStockAlert: minStockNum,
        image: formImage || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=80',
        description: formDesc,
        unit: 'Pcs',
      });
    }

    setIsProductModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      deleteProduct(id);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('minum')) return 'bg-[#cfe2f1] text-[#265c79]';
    if (lower.includes('makan')) return 'bg-[#f6d9ff] text-[#725380]';
    if (lower.includes('snack') || lower.includes('ringan')) return 'bg-[#a1d4f5]/40 text-[#2f6481]';
    if (lower.includes('kue') || lower.includes('pastry')) return 'bg-amber-100 text-amber-800';
    return 'bg-[#edeef0] text-[#41484d]';
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] md:text-[32px] font-bold text-[#191c1e] tracking-tight">
            Manajemen Produk
          </h2>
          <p className="text-[15px] text-[#41484d] mt-0.5">
            Kelola inventaris dan daftar harga produk Anda.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 bg-[#2f6481] hover:bg-[#0e4c68] text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Controls Section */}
      <div className="bg-white border border-[#c1c7cd] rounded-xl p-4 flex flex-col md:flex-row gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71787e] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama produk atau SKU..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#c1c7cd] rounded-lg text-[14px] text-[#191c1e] placeholder-[#71787e] focus:ring-1 focus:ring-[#2f6481] focus:border-[#2f6481] transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-[#c1c7cd] rounded-lg px-4 py-2 text-[14px] text-[#191c1e] min-w-[160px] focus:ring-1 focus:ring-[#2f6481] focus:border-[#2f6481] cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
            }}
            className="inline-flex items-center justify-center gap-2 bg-white text-[#41484d] border border-[#c1c7cd] text-[14px] font-semibold px-4 py-2 rounded-lg hover:bg-[#f3f3f6] transition-colors cursor-pointer"
            title="Reset Filter"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white border border-[#c1c7cd] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f3f3f6] border-b border-[#c1c7cd] text-[13px] text-[#41484d] font-semibold">
                <th className="py-3.5 px-4">Nama Produk</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-right">Harga</th>
                <th className="py-3.5 px-4 text-center">Stok</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edeef0] text-[13px]">
              {paginatedProducts.map((product) => {
                const isLowStock = product.stock <= product.minStockAlert;

                return (
                  <tr key={product.id} className="hover:bg-[#f8f9fc] transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-10 h-10 rounded-lg object-cover bg-[#edeef0] shrink-0 border border-[#c1c7cd]"
                        />
                        <div>
                          <p className="font-semibold text-[#191c1e] text-[14px]">{product.name}</p>
                          {product.description && (
                            <p className="text-[12px] text-[#71787e] truncate max-w-xs">{product.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#71787e] font-semibold">
                      {product.sku}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold ${getCategoryBadgeClass(product.category)}`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-right text-[#191c1e]">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`
                          inline-flex items-center justify-center px-2.5 py-0.5 rounded-full font-bold text-[12px] font-mono
                          ${
                            isLowStock
                              ? 'bg-[#ffdad6] text-[#ba1a1a]'
                              : 'bg-[#cfe2f1] text-[#265c79]'
                          }
                        `}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 text-[#2f6481] hover:bg-[#cfe2f1] rounded-lg transition-colors cursor-pointer"
                          title="Edit Produk"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors cursor-pointer"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="bg-[#f3f3f6] p-4 border-t border-[#c1c7cd] flex items-center justify-between">
          <span className="text-[13px] text-[#41484d]">
            Menampilkan {paginatedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} dari {filteredProducts.length} produk
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-[#c1c7cd] rounded-lg bg-white hover:bg-[#edeef0] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#41484d]" />
            </button>
            <span className="text-[13px] font-semibold text-[#191c1e] px-2">
              Hal {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-[#c1c7cd] rounded-lg bg-white hover:bg-[#edeef0] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-[#41484d]" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-[#c1c7cd] my-8 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#c1c7cd] flex justify-between items-center bg-white">
              <h3 className="text-[18px] font-bold text-[#191c1e]">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#71787e] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#f3f3f6] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-[13px] font-bold text-[#191c1e] mb-1">
                  Nama Produk <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Kopi Susu Gula Aren"
                  className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 text-[14px] focus:ring-2 focus:ring-[#2f6481] focus:border-[#2f6481]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#191c1e] mb-1">
                    SKU (Unik) <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value.toUpperCase())}
                    placeholder="SKU-001"
                    className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 font-mono text-[14px] uppercase focus:ring-2 focus:ring-[#2f6481] focus:border-[#2f6481]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#191c1e] mb-1">
                    Kategori <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    required
                    className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 text-[14px] focus:ring-2 focus:ring-[#2f6481] focus:border-[#2f6481]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#191c1e] mb-1">
                    Harga Jual (Rp) <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="25000"
                    className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 font-mono text-[14px] focus:ring-2 focus:ring-[#2f6481] focus:border-[#2f6481]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#191c1e] mb-1">
                    Stok Awal <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="50"
                    className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 font-mono text-[14px] focus:ring-2 focus:ring-[#2f6481] focus:border-[#2f6481]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#191c1e] mb-1">
                  URL Gambar Produk
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 text-[13px] focus:ring-2 focus:ring-[#2f6481] focus:border-[#2f6481]"
                  />
                  {formImage && (
                    <img
                      src={formImage}
                      alt="Preview"
                      className="w-10 h-10 rounded-lg object-cover border border-[#c1c7cd]"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#191c1e] mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Keterangan singkat rasa atau komposisi..."
                  className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 text-[13px] focus:ring-2 focus:ring-[#2f6481] focus:border-[#2f6481]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#edeef0] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-[#c1c7cd] text-[#41484d] font-semibold text-[14px] hover:bg-[#f3f3f6] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#2f6481] text-white font-semibold text-[14px] hover:bg-[#0e4c68] transition-colors shadow-xs cursor-pointer"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
