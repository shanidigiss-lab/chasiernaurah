import { AuthUser, UserRole } from '../types';

export interface UserAccount extends AuthUser {
  passwordHash: string;
}

export const SUPER_ADMIN_CREDENTIALS = {
  username: 'naurahdigiss01',
  password: '10ssigidharuan',
};

export interface DemoAccount {
  id: string;
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
  roleLabel: string;
  branchName: string;
  description: string;
  avatarInitials: string;
  badgeBg: string;
  badgeText: string;
  permissions: string[];
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'usr-superadmin-01',
    username: 'naurahdigiss01',
    password: '10ssigidharuan',
    fullName: 'Naurah Digital',
    role: 'super_admin',
    roleLabel: 'Super Administrator',
    branchName: 'Headquarters / Pusat',
    description: 'Akses penuh ke seluruh sistem POS: kelola produk, transaksi, laporan keuangan eksekutif, dan sinkronisasi database Turso Cloud.',
    avatarInitials: 'ND',
    badgeBg: 'bg-[#cfe2f1]',
    badgeText: 'text-[#14374a]',
    permissions: [
      'Akses Penuh Seluruh Modul POS',
      'Manajemen Produk & Harga Jual',
      'Integrasi Turso Cloud Database',
      'Kelola Akun, Username & Password Staf',
      'Laporan Finansial & Margin Laba',
    ],
  },
  {
    id: 'usr-spv-01',
    username: 'spv_siti',
    password: 'spv123',
    fullName: 'Siti Maryam',
    role: 'admin',
    roleLabel: 'Supervisor Toko',
    branchName: 'Store Senayan Utama',
    description: 'Pengawasan operasional toko, audit stok gudang, otorisasi diskon nota, dan pemantauan riwayat transaksi shift harian.',
    avatarInitials: 'SM',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    permissions: [
      'Terminal Kasir & Scanner Barcode',
      'Manajemen Stok Masuk & Alert Kritis',
      'Laporan Riwayat Transaksi Lengkap',
      'Otorisasi Retur & Koreksi Nota',
    ],
  },
  {
    id: 'usr-kasir-01',
    username: 'kasir_budi',
    password: 'kasir123',
    fullName: 'Budi Santoso',
    role: 'kasir',
    roleLabel: 'Kasir Shift 1',
    branchName: 'Store Senayan Utama',
    description: 'Operasional meja kasir, checkout cepat pelanggan, transaksi pembayaran tunai/QRIS/kartu, serta cetak struk thermal.',
    avatarInitials: 'BS',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    permissions: [
      'Terminal Transaksi Kasir Instan',
      'Kalkulator Kembalian & Multi-Payment',
      'Cetak Struk Nota Thermal 58/80mm',
      'Pencarian Cepat SKU & Kategori',
    ],
  },
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-superadmin-01',
    username: 'naurahdigiss01',
    passwordHash: '10ssigidharuan',
    fullName: 'Naurah Digital (Super Admin)',
    email: 'naurahdigiss01@kasirku.co.id',
    role: 'super_admin',
    roleLabel: 'Super Administrator',
    branchName: 'Headquarters / Pusat',
    avatarInitials: 'ND',
    createdAt: '2026-01-01T08:00:00.000Z',
    lastLogin: '2026-09-07T20:30:00.000Z',
  },
  {
    id: 'usr-kasir-01',
    username: 'kasir_budi',
    passwordHash: 'kasir123',
    fullName: 'Budi Santoso',
    email: 'budi.kasir@kasirku.co.id',
    role: 'kasir',
    roleLabel: 'Kasir Shift 1',
    branchName: 'Store Senayan Utama',
    avatarInitials: 'BS',
    createdAt: '2026-02-15T09:00:00.000Z',
    lastLogin: '2026-09-07T14:10:00.000Z',
  },
  {
    id: 'usr-spv-01',
    username: 'spv_siti',
    passwordHash: 'spv123',
    fullName: 'Siti Maryam',
    email: 'siti.maryam@kasirku.co.id',
    role: 'admin',
    roleLabel: 'Supervisor Toko',
    branchName: 'Store Senayan Utama',
    avatarInitials: 'SM',
    createdAt: '2026-02-10T10:00:00.000Z',
    lastLogin: '2026-09-06T18:45:00.000Z',
  }
];
