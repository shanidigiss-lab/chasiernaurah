import { createClient, Client } from '@libsql/client';
import dotenv from 'dotenv';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_TRANSACTIONS } from '../src/data/initialData';
import { INITIAL_USERS } from '../src/data/authData';

dotenv.config();

const TURSO_URL = process.env.TURSO_DATABASE_URL || 'libsql://mykasirdb-naurahdigiss-droid.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODk5NTMwNTMsImlkIjoiMDFhMGMxNzUtYzYwMS03YzViLWI4NDctNTViZTA1MDRlODZjIiwia2lkIjoicTRBU0ROZlRQdjRGUzNfdzA0d0d2YUVHTUFYTzhwYlQ3dE1NNnlXRUR0ayIsInJpZCI6ImM4OGRiZWRhLTc3NTYtNGNhYi05OWFmLTU3ZmYzYzgyMjVlNCJ9.q6rXPLLCqZ-8PxdHAmkHGJw2BDDiZhDkQlYWDHHOxu1ATmV9LZDNBWrHTtLFxjL3k66rVmMtmDzsnKgy7hQeAQ';

export const turso: Client = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

export async function initTursoDatabase() {
  console.log('[Turso] Connecting to Turso database at:', TURSO_URL);

  // 1. Create tables
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      role_label TEXT,
      branch_name TEXT,
      avatar_initials TEXT,
      created_at TEXT,
      last_login TEXT
    );
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      color TEXT,
      icon_name TEXT
    );
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      min_stock_alert INTEGER NOT NULL DEFAULT 10,
      image TEXT,
      description TEXT,
      unit TEXT DEFAULT 'Pcs'
    );
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      cashier TEXT NOT NULL,
      customer_name TEXT,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL DEFAULT 0,
      discount REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      payment_method TEXT NOT NULL,
      payment_amount REAL NOT NULL,
      change_amount REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Sukses',
      notes TEXT,
      created_at TEXT
    );
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS transaction_items (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      sku TEXT,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      total REAL NOT NULL,
      image TEXT,
      FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE CASCADE
    );
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS store_settings (
      id TEXT PRIMARY KEY,
      store_name TEXT NOT NULL,
      tagline TEXT,
      address TEXT,
      phone TEXT,
      receipt_footer TEXT,
      tax_rate_percent REAL NOT NULL DEFAULT 10,
      active_cashier_name TEXT,
      currency_prefix TEXT DEFAULT 'Rp',
      enable_sound_effects INTEGER DEFAULT 1
    );
  `);

  console.log('[Turso] Tables verified/created successfully.');

  // 2. Check and Seed Users if empty
  const userCount = await turso.execute('SELECT COUNT(*) as count FROM users');
  const countU = Number(userCount.rows[0].count || 0);
  if (countU === 0) {
    console.log('[Turso] Seeding initial users...');
    for (const u of INITIAL_USERS) {
      await turso.execute({
        sql: `INSERT OR IGNORE INTO users (id, username, password_hash, full_name, email, role, role_label, branch_name, avatar_initials, created_at, last_login)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          u.id,
          u.username,
          u.passwordHash,
          u.fullName,
          u.email,
          u.role,
          u.roleLabel,
          u.branchName || 'Store Senayan Utama',
          u.avatarInitials,
          u.createdAt,
          u.lastLogin || new Date().toISOString(),
        ],
      });
    }
  }

  // 3. Check and Seed Categories if empty
  const catCount = await turso.execute('SELECT COUNT(*) as count FROM categories');
  const countC = Number(catCount.rows[0].count || 0);
  if (countC === 0) {
    console.log('[Turso] Seeding initial categories...');
    for (const c of INITIAL_CATEGORIES) {
      await turso.execute({
        sql: `INSERT OR IGNORE INTO categories (id, name, slug, color, icon_name) VALUES (?, ?, ?, ?, ?)`,
        args: [c.id, c.name, c.slug, c.color || '', c.iconName || ''],
      });
    }
  }

  // 4. Check and Seed Products if empty
  const prodCount = await turso.execute('SELECT COUNT(*) as count FROM products');
  const countP = Number(prodCount.rows[0].count || 0);
  if (countP === 0) {
    console.log('[Turso] Seeding initial products...');
    for (const p of INITIAL_PRODUCTS) {
      await turso.execute({
        sql: `INSERT OR IGNORE INTO products (id, name, sku, category, price, stock, min_stock_alert, image, description, unit)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          p.id,
          p.name,
          p.sku,
          p.category,
          p.price,
          p.stock,
          p.minStockAlert,
          p.image,
          p.description || '',
          p.unit || 'Pcs',
        ],
      });
    }
  }

  // 5. Check and Seed Settings if empty
  const settingCount = await turso.execute('SELECT COUNT(*) as count FROM store_settings');
  const countS = Number(settingCount.rows[0].count || 0);
  if (countS === 0) {
    console.log('[Turso] Seeding initial store settings...');
    await turso.execute({
      sql: `INSERT OR IGNORE INTO store_settings (id, store_name, tagline, address, phone, receipt_footer, tax_rate_percent, active_cashier_name, currency_prefix, enable_sound_effects)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'default',
        INITIAL_SETTINGS.storeName,
        INITIAL_SETTINGS.tagline,
        INITIAL_SETTINGS.address,
        INITIAL_SETTINGS.phone,
        INITIAL_SETTINGS.receiptFooter,
        INITIAL_SETTINGS.taxRatePercent,
        INITIAL_SETTINGS.activeCashierName,
        INITIAL_SETTINGS.currencyPrefix,
        INITIAL_SETTINGS.enableSoundEffects ? 1 : 0,
      ],
    });
  }

  // 6. Check and Seed Transactions if empty
  const txCount = await turso.execute('SELECT COUNT(*) as count FROM transactions');
  const countT = Number(txCount.rows[0].count || 0);
  if (countT === 0) {
    console.log('[Turso] Seeding initial transactions...');
    for (const tx of INITIAL_TRANSACTIONS) {
      await turso.execute({
        sql: `INSERT OR IGNORE INTO transactions (id, date, cashier, customer_name, subtotal, tax, discount, total, payment_method, payment_amount, change_amount, status, notes, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          tx.id,
          tx.date,
          tx.cashier,
          tx.customerName || 'Pelanggan Umum',
          tx.subtotal,
          tx.tax,
          tx.discount,
          tx.total,
          tx.paymentMethod,
          tx.paymentAmount,
          tx.change,
          tx.status,
          tx.notes || '',
          tx.date,
        ],
      });

      for (const it of tx.items) {
        await turso.execute({
          sql: `INSERT OR IGNORE INTO transaction_items (id, transaction_id, product_id, name, sku, price, quantity, total, image)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            `${tx.id}-${it.productId}`,
            tx.id,
            it.productId,
            it.name,
            it.sku,
            it.price,
            it.quantity,
            it.total,
            it.image || '',
          ],
        });
      }
    }
  }

  console.log('[Turso] Database ready and verified.');
}
