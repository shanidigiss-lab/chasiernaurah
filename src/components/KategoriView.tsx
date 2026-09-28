import React, { useState } from 'react';
import { Plus, Tag, Edit, Trash2, X, Package } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const KategoriView: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = usePOS();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');

  const handleOpenAdd = () => {
    setEditingId(null);
    setCategoryName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: { id: string; name: string }) => {
    setEditingId(cat.id);
    setCategoryName(cat.name);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingId) {
      updateCategory(editingId, {
        name: categoryName.trim(),
        slug: categoryName.trim().toLowerCase().replace(/\s+/g, '-'),
      });
    } else {
      addCategory({
        name: categoryName.trim(),
        slug: categoryName.trim().toLowerCase().replace(/\s+/g, '-'),
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Hapus kategori "${name}"?`)) {
      deleteCategory(id);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] md:text-[32px] font-bold text-[#191c1e] tracking-tight">
            Kategori Produk
          </h2>
          <p className="text-[15px] text-[#41484d] mt-0.5">
            Kelompokkan menu dan barang dagangan Anda.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 bg-[#2f6481] hover:bg-[#0e4c68] text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const productCount = products.filter(
            (p) => p.category.toLowerCase() === cat.name.toLowerCase()
          ).length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-[#c1c7cd] p-5 shadow-xs hover:shadow-md transition-shadow flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#cfe2f1] text-[#265c79] flex items-center justify-center font-bold">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#191c1e]">{cat.name}</h3>
                  <p className="text-[13px] text-[#71787e] flex items-center gap-1 mt-0.5">
                    <Package className="w-3.5 h-3.5" />
                    {productCount} Produk
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-2 text-[#2f6481] hover:bg-[#cfe2f1] rounded-lg transition-colors cursor-pointer"
                  title="Edit Kategori"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors cursor-pointer"
                  title="Hapus Kategori"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-[#c1c7cd] animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[18px] font-bold text-[#191c1e]">
                {editingId ? 'Edit Kategori' : 'Tambah Kategori'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#71787e] hover:text-[#191c1e]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Contoh: Aneka Jus & Smoothies"
                  className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3.5 py-2 text-[14px] focus:ring-2 focus:ring-[#2f6481]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-[#c1c7cd] rounded-lg text-[13px] font-semibold text-[#41484d] hover:bg-[#f3f3f6]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2f6481] hover:bg-[#0e4c68] text-white rounded-lg text-[13px] font-bold"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
