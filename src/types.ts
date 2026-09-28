export type NavigationTab = 
  | 'dashboard' 
  | 'kasir' 
  | 'produk' 
  | 'kategori' 
  | 'stok' 
  | 'riwayat' 
  | 'laporan' 
  | 'pengaturan'
  | 'bantuan';

export type PaymentMethod = 'cash' | 'debit' | 'qris' | 'transfer';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  minStockAlert: number;
  image: string;
  description?: string;
  unit?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
  iconName?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
  discount?: number;
}

export interface TransactionItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO string or formatted date
  cashier: string;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentAmount: number;
  change: number;
  status: 'Sukses' | 'Dibatalkan' | 'Pending';
  notes?: string;
  customerName?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  receiptFooter: string;
  taxRatePercent: number; // e.g. 10 for 10%
  activeCashierName: string;
  currencyPrefix: string;
  enableSoundEffects: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export type UserRole = 'super_admin' | 'admin' | 'kasir' | 'manajer';

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  branchName?: string;
  avatarInitials: string;
  createdAt: string;
  lastLogin?: string;
}

export interface TursoDatabaseStatus {
  connected: boolean;
  url: string;
  provider: string;
  region: string;
  latencyMs: number;
  counts: {
    products: number;
    categories: number;
    transactions: number;
    users: number;
  };
}
