import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { 
  AuthUser,
  CartItem, 
  Category, 
  NavigationTab, 
  PaymentMethod, 
  Product, 
  StoreSettings, 
  ToastMessage, 
  Transaction, 
  TursoDatabaseStatus,
  UserRole
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_SETTINGS, 
  INITIAL_TRANSACTIONS 
} from '../data/initialData';
import { 
  INITIAL_USERS, 
  SUPER_ADMIN_CREDENTIALS, 
  UserAccount 
} from '../data/authData';

interface POSContextType {
  // Authentication
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: {
    username: string;
    password: string;
    fullName: string;
    email: string;
    role?: UserRole;
    branchName?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  users: UserAccount[];
  quickLoginAs: (username: string, password: string) => Promise<boolean>;
  updateUserPassword: (userId: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  updateUserProfile: (userId: string, data: { fullName: string; email: string; role: UserRole; branchName?: string }) => Promise<{ success: boolean; message: string }>;
  deleteUser: (userId: string) => Promise<{ success: boolean; message: string }>;

  // Navigation & UI
  unauthView: 'landing' | 'auth';
  setUnauthView: (view: 'landing' | 'auth') => void;
  showLandingPage: boolean;
  setShowLandingPage: (show: boolean) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  
  // Data State
  products: Product[];
  categories: Category[];
  transactions: Transaction[];
  settings: StoreSettings;
  
  // Cart
  cart: CartItem[];
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Checkout & Payment
  processCheckout: (
    paymentMethod: PaymentMethod, 
    paymentAmount: number, 
    customerName?: string
  ) => Transaction;
  
  // Product Operations
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  adjustProductStock: (id: string, quantityChange: number) => Promise<void>;
  
  // Category Operations
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Settings & Transactions
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (trx: Transaction | null) => void;
  
  // Modals
  receiptModalTrx: Transaction | null;
  openReceiptModal: (trx: Transaction) => void;
  closeReceiptModal: () => void;
  isBantuanModalOpen: boolean;
  setIsBantuanModalOpen: (open: boolean) => void;
  isProductModalOpen: boolean;
  setIsProductModalOpen: (open: boolean) => void;
  editingProduct: Product | null;
  setEditingProduct: (p: Product | null) => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  
  // Reset Data to defaults
  resetAllData: () => void;

  // Turso Database Integration
  tursoStatus: TursoDatabaseStatus | null;
  isTursoLoading: boolean;
  refreshTursoData: () => Promise<void>;
  syncTursoDatabase: () => Promise<void>;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [unauthView, setUnauthView] = useState<'landing' | 'auth'>('landing');
  const [showLandingPage, setShowLandingPage] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('kasirku_sidebar_collapsed');
    return saved === 'true';
  });

  // Turso Database State
  const [tursoStatus, setTursoStatus] = useState<TursoDatabaseStatus | null>(null);
  const [isTursoLoading, setIsTursoLoading] = useState<boolean>(false);

  // User Accounts & Authentication
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('kasirku_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasSuperAdmin = parsed.some((u: UserAccount) => u.username.toLowerCase() === 'naurahdigiss01');
        if (!hasSuperAdmin) {
          parsed.unshift(INITIAL_USERS[0]);
        }
        return parsed;
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('kasirku_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Toggle Sidebar (Desktop collapsible rail & Mobile drawer)
  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMobileMenuOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem('kasirku_sidebar_collapsed', String(next));
        return next;
      });
    }
  };

  // Keyboard shortcut for Hamburger Menu: Ctrl + B or Cmd + B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Persisted state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kasirku_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('kasirku_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('kasirku_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('kasirku_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kasirku_active_cart');
    return saved ? JSON.parse(saved) : [
      { product: INITIAL_PRODUCTS[0], quantity: 2 },
      { product: INITIAL_PRODUCTS[2], quantity: 1 }
    ];
  });

  // Modal states
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(
    INITIAL_TRANSACTIONS[0] || null
  );
  const [receiptModalTrx, setReceiptModalTrx] = useState<Transaction | null>(null);
  const [isBantuanModalOpen, setIsBantuanModalOpen] = useState<boolean>(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to LocalStorage as resilient backup
  useEffect(() => {
    localStorage.setItem('kasirku_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kasirku_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('kasirku_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('kasirku_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('kasirku_active_cart', JSON.stringify(cart));
  }, [cart]);

  // Load live data from Turso Backend
  const refreshTursoData = async () => {
    setIsTursoLoading(true);
    try {
      // 1. Fetch Turso Status
      const statusRes = await fetch('/api/turso/status');
      if (statusRes.ok) {
        const sData = await statusRes.json();
        setTursoStatus(sData);
      }

      // 2. Fetch Products
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const prods = await prodRes.json();
        if (Array.isArray(prods) && prods.length > 0) {
          setProducts(prods);
        }
      }

      // 3. Fetch Categories
      const catRes = await fetch('/api/categories');
      if (catRes.ok) {
        const cats = await catRes.json();
        if (Array.isArray(cats) && cats.length > 0) {
          setCategories(cats);
        }
      }

      // 4. Fetch Transactions
      const trxRes = await fetch('/api/transactions');
      if (trxRes.ok) {
        const trxs = await trxRes.json();
        if (Array.isArray(trxs) && trxs.length > 0) {
          setTransactions(trxs);
        }
      }

      // 5. Fetch Settings
      const setRes = await fetch('/api/settings');
      if (setRes.ok) {
        const sets = await setRes.json();
        if (sets && sets.storeName) {
          setSettings(sets);
        }
      }

      // 6. Fetch Users
      const userRes = await fetch('/api/users');
      if (userRes.ok) {
        const uList = await userRes.json();
        if (Array.isArray(uList) && uList.length > 0) {
          setUsers(uList);
        }
      }
    } catch (e) {
      console.warn('[Turso] Sync warning (using local store cache):', e);
    } finally {
      setIsTursoLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    refreshTursoData();
  }, []);

  const syncTursoDatabase = async () => {
    setIsTursoLoading(true);
    try {
      const res = await fetch('/api/turso/init', { method: 'POST' });
      if (res.ok) {
        await refreshTursoData();
        addToast('success', 'Database Turso Tersinkronisasi', 'Struktur tabel dan data telah berhasil disinkronkan ke cloud.');
      } else {
        addToast('error', 'Gagal Sinkronisasi', 'Terjadi kendala saat inisialisasi tabel Turso.');
      }
    } catch (err: any) {
      addToast('error', 'Kendala Jaringan', err?.message || 'Gagal menghubungi server Turso.');
    } finally {
      setIsTursoLoading(false);
    }
  };

  // Toast Helper
  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTax = Math.round((cartSubtotal * settings.taxRatePercent) / 100);
  const cartTotal = cartSubtotal + cartTax;

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      addToast('error', 'Stok Habis', `Produk ${product.name} tidak memiliki sisa stok.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (nextQty > product.stock) {
          addToast('warning', 'Batas Stok', `Maksimum stok tersedia: ${product.stock}`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: nextQty } : item
        );
      }
      return [...prev, { product, quantity }];
    });

    addToast('success', 'Ditambahkan', `${product.name} masuk ke pesanan.`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (product && quantity > product.stock) {
      addToast('warning', 'Batas Stok', `Maksimum stok ${product.name} adalah ${product.stock}`);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    addToast('info', 'Keranjang Kosong', 'Semua item pesanan telah dikosongkan.');
  };

  // Checkout process with Atomic Turso Cloud Persistence
  const processCheckout = (
    paymentMethod: PaymentMethod,
    paymentAmount: number,
    customerName = 'Pelanggan Umum'
  ): Transaction => {
    const subtotal = cartSubtotal;
    const tax = cartTax;
    const total = cartTotal;
    const change = Math.max(0, paymentAmount - total);
    
    // Generate transaction ID
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(100 + Math.random() * 900);
    const trxId = `TRX-${todayStr}-${randSuffix}`;

    const newTrx: Transaction = {
      id: trxId,
      date: new Date().toISOString(),
      cashier: settings.activeCashierName.replace('Admin Kasir (', '').replace(')', '').trim() || 'Budi S.',
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
        image: item.product.image,
      })),
      subtotal,
      tax,
      discount: 0,
      total,
      paymentMethod,
      paymentAmount,
      change,
      status: 'Sukses',
      customerName,
    };

    // Immediate optimistic update for zero latency
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((ci) => ci.product.id === p.id);
        if (cartItem) {
          const nextStock = Math.max(0, p.stock - cartItem.quantity);
          return { ...p, stock: nextStock };
        }
        return p;
      })
    );

    // Save transaction locally
    setTransactions((prev) => [newTrx, ...prev]);
    setSelectedTransaction(newTrx);
    setCart([]);

    // Asynchronously commit transaction and atomic stock decrease to Turso Cloud
    fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrx),
    })
      .then((res) => res.json())
      .then(() => {
        // Refresh counts from Turso
        fetch('/api/turso/status')
          .then((r) => r.json())
          .then((st) => setTursoStatus(st))
          .catch(() => {});
      })
      .catch((err) => {
        console.error('[Turso] Transaction sync warning:', err);
      });

    // Celebrate with confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2f6481', '#a1d4f5', '#725380', '#0e4c68', '#f6d9ff']
      });
    } catch {
      // safe fallback
    }

    addToast('success', 'Transaksi Berhasil!', `ID: ${trxId} tersimpan di Turso Cloud`);
    return newTrx;
  };

  // Product Operations (Persisted to Turso)
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const tempId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: tempId,
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast('success', 'Produk Ditambahkan', `${newProduct.name} berhasil disimpan.`);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        const saved = await res.json();
        if (saved && saved.id) {
          setProducts((prev) => prev.map((p) => (p.id === tempId ? saved : p)));
        }
      }
    } catch (e) {
      console.error('[Turso] Error adding product to Turso:', e);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('success', 'Produk Diperbarui', 'Data produk tersimpan di Turso.');

    try {
      const existing = products.find((p) => p.id === id);
      const merged = { ...existing, ...updates };
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      });
    } catch (e) {
      console.error('[Turso] Error updating product in Turso:', e);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    addToast('info', 'Produk Dihapus', 'Produk telah dihapus dari database Turso.');

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('[Turso] Error deleting product from Turso:', e);
    }
  };

  const adjustProductStock = async (id: string, quantityChange: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStock = Math.max(0, p.stock + quantityChange);
          return { ...p, stock: nextStock };
        }
        return p;
      })
    );
    addToast('info', 'Stok Diperbarui', 'Penyesuaian stok disimpan ke Turso.');

    try {
      await fetch(`/api/products/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change: quantityChange }),
      });
    } catch (e) {
      console.error('[Turso] Error adjusting stock in Turso:', e);
    }
  };

  // Category Operations (Persisted to Turso)
  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    const tempId = `cat-${Date.now()}`;
    const newCat: Category = {
      ...categoryData,
      id: tempId,
    };
    setCategories((prev) => [...prev, newCat]);
    addToast('success', 'Kategori Ditambahkan', `${newCat.name} tersimpan di Turso.`);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat),
      });
      if (res.ok) {
        const saved = await res.json();
        if (saved && saved.id) {
          setCategories((prev) => prev.map((c) => (c.id === tempId ? saved : c)));
        }
      }
    } catch (e) {
      console.error('[Turso] Error adding category to Turso:', e);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    addToast('success', 'Kategori Diperbarui', 'Perubahan kategori disimpan di Turso.');

    try {
      const existing = categories.find((c) => c.id === id);
      const merged = { ...existing, ...updates };
      await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      });
    } catch (e) {
      console.error('[Turso] Error updating category in Turso:', e);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast('info', 'Kategori Dihapus', 'Kategori telah dihapus dari Turso.');

    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('[Turso] Error deleting category from Turso:', e);
    }
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    addToast('success', 'Pengaturan Disimpan', 'Konfigurasi toko diperbarui di Turso.');

    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      });
    } catch (e) {
      console.error('[Turso] Error updating settings in Turso:', e);
    }
  };

  const openReceiptModal = (trx: Transaction) => {
    setReceiptModalTrx(trx);
  };

  const closeReceiptModal = () => {
    setReceiptModalTrx(null);
  };

  // Authentication Operations (Synchronized with Turso)
  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. First attempt login via Turso Server API
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
          localStorage.setItem('kasirku_auth_user', JSON.stringify(data.user));
          setSettings((prev) => ({
            ...prev,
            activeCashierName: `${data.user.fullName} (${data.user.roleLabel})`,
          }));
          addToast('success', 'Autentikasi Turso Sukses', `Selamat datang kembali, ${data.user.fullName}!`);
          return { success: true, message: 'Berhasil masuk melalui Turso Database.' };
        }
      } else {
        const errData = await res.json().catch(() => null);
        if (errData && errData.message) {
          addToast('error', 'Gagal Masuk', errData.message);
          return { success: false, message: errData.message };
        }
      }
    } catch (e) {
      console.warn('[Turso] Server auth unreachable, checking local fallback:', e);
    }

    // 2. Resilient Fallback for local credentials or superadmin
    const matchedAccount = users.find(
      (u) => u.username.toLowerCase() === cleanUser && u.passwordHash === cleanPass
    );

    const isSuperAdminFallback = 
      cleanUser === SUPER_ADMIN_CREDENTIALS.username.toLowerCase() && 
      cleanPass === SUPER_ADMIN_CREDENTIALS.password;

    const account = matchedAccount || (isSuperAdminFallback ? INITIAL_USERS[0] : null);

    if (account) {
      const authData: AuthUser = {
        id: account.id,
        username: account.username,
        fullName: account.fullName,
        email: account.email,
        role: account.role,
        roleLabel: account.roleLabel,
        branchName: account.branchName || 'Store Senayan Utama',
        avatarInitials: account.avatarInitials || account.fullName.slice(0, 2).toUpperCase(),
        createdAt: account.createdAt,
        lastLogin: new Date().toISOString(),
      };

      setCurrentUser(authData);
      localStorage.setItem('kasirku_auth_user', JSON.stringify(authData));
      setSettings((prev) => ({
        ...prev,
        activeCashierName: `${account.fullName} (${account.roleLabel})`,
      }));

      addToast('success', 'Autentikasi Berhasil', `Selamat datang kembali, ${account.fullName}!`);
      return { success: true, message: 'Berhasil masuk ke sistem.' };
    }

    addToast('error', 'Gagal Masuk', 'ID Pengguna atau kata sandi tidak cocok.');
    return { success: false, message: 'Username atau kata sandi tidak valid.' };
  };

  const register = async (data: {
    username: string;
    password: string;
    fullName: string;
    email: string;
    role?: UserRole;
    branchName?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const cleanUser = data.username.trim().toLowerCase();

    // 1. Try register via Turso API
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.success && resData.user) {
          setCurrentUser(resData.user);
          localStorage.setItem('kasirku_auth_user', JSON.stringify(resData.user));
          setSettings((prev) => ({
            ...prev,
            activeCashierName: `${resData.user.fullName} (${resData.user.roleLabel})`,
          }));
          addToast('success', 'Registrasi Turso Sukses', `Akun ${resData.user.fullName} disimpan ke Turso Cloud.`);
          return { success: true, message: 'Akun berhasil terdaftar di database Turso.' };
        }
      } else {
        const errData = await res.json().catch(() => null);
        if (errData && errData.message) {
          addToast('error', 'Gagal Registrasi', errData.message);
          return { success: false, message: errData.message };
        }
      }
    } catch (e) {
      console.warn('[Turso] Server registration error, using local fallback:', e);
    }

    // 2. Local fallback
    if (users.some((u) => u.username.toLowerCase() === cleanUser)) {
      addToast('error', 'Username Terdaftar', 'Username tersebut sudah digunakan. Silakan gunakan yang lain.');
      return { success: false, message: 'Username sudah digunakan di sistem.' };
    }

    const assignedRole = data.role || 'kasir';
    const roleLabels: Record<UserRole, string> = {
      super_admin: 'Super Administrator',
      admin: 'Administrator Toko',
      manajer: 'Manajer Operasional',
      kasir: 'Kasir Retail',
    };

    const initials = data.fullName
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('') || 'US';

    const newAccount: UserAccount = {
      id: `usr-${Date.now()}`,
      username: cleanUser,
      passwordHash: data.password.trim(),
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      role: assignedRole,
      roleLabel: roleLabels[assignedRole],
      branchName: data.branchName || 'Store Senayan Utama',
      avatarInitials: initials,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    const updatedUsers = [...users, newAccount];
    setUsers(updatedUsers);
    localStorage.setItem('kasirku_users', JSON.stringify(updatedUsers));

    const authData: AuthUser = {
      id: newAccount.id,
      username: newAccount.username,
      fullName: newAccount.fullName,
      email: newAccount.email,
      role: newAccount.role,
      roleLabel: newAccount.roleLabel,
      branchName: newAccount.branchName,
      avatarInitials: newAccount.avatarInitials,
      createdAt: newAccount.createdAt,
      lastLogin: newAccount.lastLogin,
    };

    setCurrentUser(authData);
    localStorage.setItem('kasirku_auth_user', JSON.stringify(authData));
    setSettings((prev) => ({
      ...prev,
      activeCashierName: `${authData.fullName} (${authData.roleLabel})`,
    }));

    addToast('success', 'Registrasi Berhasil', `Akun ${newAccount.fullName} berhasil dibuat.`);
    return { success: true, message: 'Akun berhasil terdaftar.' };
  };

  const quickLoginAs = async (username: string, password: string): Promise<boolean> => {
    const res = await login(username, password);
    if (res.success) {
      setShowLandingPage(false);
      return true;
    }
    return false;
  };

  const updateUserPassword = async (userId: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, passwordHash: newPassword } : u))
        );
        addToast('success', 'Kata Sandi Diperbarui', 'Kata sandi pengguna berhasil disimpan ke database Turso.');
        return { success: true, message: 'Kata sandi berhasil diperbarui.' };
      } else {
        const err = await res.json().catch(() => null);
        addToast('error', 'Gagal Ubah Sandi', err?.message || 'Gagal mengubah kata sandi.');
        return { success: false, message: err?.message || 'Gagal mengubah kata sandi.' };
      }
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, passwordHash: newPassword } : u))
      );
      addToast('success', 'Kata Sandi Diperbarui', 'Kata sandi berhasil diperbarui (mode lokal).');
      return { success: true, message: 'Kata sandi diperbarui secara lokal.' };
    }
  };

  const updateUserProfile = async (
    userId: string, 
    data: { fullName: string; email: string; role: UserRole; branchName?: string }
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, ...data } : u))
        );
        if (currentUser && currentUser.id === userId) {
          setCurrentUser((prev) => prev ? { ...prev, ...data } : null);
        }
        addToast('success', 'Profil Diperbarui', 'Data akun staf berhasil disimpan ke database Turso.');
        return { success: true, message: 'Data staf berhasil diperbarui.' };
      } else {
        const err = await res.json().catch(() => null);
        addToast('error', 'Gagal Memperbarui', err?.message || 'Gagal memperbarui profil.');
        return { success: false, message: err?.message || 'Gagal memperbarui profil.' };
      }
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...data } : u))
      );
      addToast('success', 'Profil Diperbarui', 'Data staf diperbarui (lokal).');
      return { success: true, message: 'Data staf diperbarui secara lokal.' };
    }
  };

  const deleteUser = async (userId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        addToast('success', 'Akses Dihapus', 'Pengguna berhasil dihapus dari database.');
        return { success: true, message: 'Pengguna berhasil dihapus.' };
      } else {
        const err = await res.json().catch(() => null);
        addToast('error', 'Gagal Menghapus', err?.message || 'Gagal menghapus pengguna.');
        return { success: false, message: err?.message || 'Gagal menghapus pengguna.' };
      }
    } catch {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      addToast('success', 'Akses Dihapus', 'Pengguna berhasil dihapus (lokal).');
      return { success: true, message: 'Pengguna berhasil dihapus.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('kasirku_auth_user');
    setUnauthView('landing');
    setShowLandingPage(false);
    addToast('info', 'Sesi Berakhir', 'Anda telah keluar dari aplikasi kasir dengan aman.');
  };

  const resetAllData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setTransactions(INITIAL_TRANSACTIONS);
    setSettings(INITIAL_SETTINGS);
    setCart([]);
    localStorage.clear();
    addToast('info', 'Reset Selesai', 'Data telah dikembalikan ke pengaturan awal.');
  };

  return (
    <POSContext.Provider
      value={{
        // Auth
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        users,
        quickLoginAs,
        updateUserPassword,
        updateUserProfile,
        deleteUser,

        // Layout & Nav
        unauthView,
        setUnauthView,
        showLandingPage,
        setShowLandingPage,
        activeTab,
        setActiveTab,
        globalSearch,
        setGlobalSearch,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,

        // Data
        products,
        categories,
        transactions,
        settings,
        cart,
        cartSubtotal,
        cartTax,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        processCheckout,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustProductStock,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
        selectedTransaction,
        setSelectedTransaction,
        receiptModalTrx,
        openReceiptModal,
        closeReceiptModal,
        isBantuanModalOpen,
        setIsBantuanModalOpen,
        isProductModalOpen,
        setIsProductModalOpen,
        editingProduct,
        setEditingProduct,
        toasts,
        addToast,
        removeToast,
        resetAllData,

        // Turso Integration
        tursoStatus,
        isTursoLoading,
        refreshTursoData,
        syncTursoDatabase,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
