import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { turso, initTursoDatabase } from './server/db';

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json());

// Initialize Turso DB on server startup
initTursoDatabase().catch((err) => {
  console.error('[Turso] Error initializing database:', err);
});

// ==========================================
// TURSO DATABASE & SYSTEM HEALTH APIS
// ==========================================

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/turso/status', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    const testRes = await turso.execute('SELECT 1 as test');
    const latencyMs = Date.now() - startTime;

    const prodCountRes = await turso.execute('SELECT COUNT(*) as count FROM products');
    const catCountRes = await turso.execute('SELECT COUNT(*) as count FROM categories');
    const trxCountRes = await turso.execute('SELECT COUNT(*) as count FROM transactions');
    const userCountRes = await turso.execute('SELECT COUNT(*) as count FROM users');

    const dbUrl = process.env.TURSO_DATABASE_URL || 'libsql://mykasirdb-naurahdigiss-droid.aws-ap-northeast-1.turso.io';

    res.json({
      connected: true,
      url: dbUrl,
      provider: 'Turso (libSQL)',
      region: 'AWS Tokyo (ap-northeast-1)',
      latencyMs,
      counts: {
        products: Number(prodCountRes.rows[0]?.count || 0),
        categories: Number(catCountRes.rows[0]?.count || 0),
        transactions: Number(trxCountRes.rows[0]?.count || 0),
        users: Number(userCountRes.rows[0]?.count || 0),
      },
    });
  } catch (err: any) {
    res.status(500).json({
      connected: false,
      error: err?.message || 'Gagal tersambung ke Turso Database',
    });
  }
});

app.post('/api/turso/init', async (req: Request, res: Response) => {
  try {
    await initTursoDatabase();
    res.json({ success: true, message: 'Database Turso berhasil diinisialisasi' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// ==========================================
// CATEGORIES APIS
// ==========================================

app.get('/api/categories', async (req: Request, res: Response) => {
  try {
    const result = await turso.execute('SELECT id, name, slug, color, icon_name as iconName FROM categories ORDER BY name ASC');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', async (req: Request, res: Response) => {
  try {
    const { name, slug, color, iconName } = req.body;
    const id = `cat-${Date.now()}`;
    await turso.execute({
      sql: 'INSERT INTO categories (id, name, slug, color, icon_name) VALUES (?, ?, ?, ?, ?)',
      args: [id, name, slug || name.toLowerCase().replace(/\s+/g, '-'), color || 'bg-blue-100 text-blue-800', iconName || 'Folder'],
    });
    res.json({ id, name, slug, color, iconName });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, color, iconName } = req.body;
    await turso.execute({
      sql: 'UPDATE categories SET name = ?, slug = ?, color = ?, icon_name = ? WHERE id = ?',
      args: [name, slug, color, iconName, id],
    });
    res.json({ success: true, id, name, slug, color, iconName });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await turso.execute({
      sql: 'DELETE FROM categories WHERE id = ?',
      args: [id],
    });
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// PRODUCTS APIS
// ==========================================

app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const result = await turso.execute(`
      SELECT 
        id, 
        name, 
        sku, 
        category, 
        price, 
        stock, 
        min_stock_alert as minStockAlert, 
        image, 
        description, 
        unit 
      FROM products 
      ORDER BY name ASC
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const { name, sku, category, price, stock, minStockAlert, image, description, unit } = req.body;
    const id = `prod-${Date.now()}`;
    await turso.execute({
      sql: `INSERT INTO products (id, name, sku, category, price, stock, min_stock_alert, image, description, unit)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        name,
        sku || `SKU-${Date.now()}`,
        category || 'Umum',
        Number(price) || 0,
        Number(stock) || 0,
        Number(minStockAlert) || 10,
        image || '',
        description || '',
        unit || 'Pcs',
      ],
    });
    res.json({ id, name, sku, category, price, stock, minStockAlert, image, description, unit });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, sku, category, price, stock, minStockAlert, image, description, unit } = req.body;
    await turso.execute({
      sql: `UPDATE products 
            SET name = ?, sku = ?, category = ?, price = ?, stock = ?, min_stock_alert = ?, image = ?, description = ?, unit = ?
            WHERE id = ?`,
      args: [
        name,
        sku,
        category,
        Number(price),
        Number(stock),
        Number(minStockAlert),
        image,
        description,
        unit,
        id,
      ],
    });
    res.json({ success: true, id, name, sku, category, price, stock, minStockAlert, image, description, unit });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/products/:id/stock', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { change, newStock } = req.body;
    if (newStock !== undefined) {
      await turso.execute({
        sql: 'UPDATE products SET stock = ? WHERE id = ?',
        args: [Number(newStock), id],
      });
    } else if (change !== undefined) {
      await turso.execute({
        sql: 'UPDATE products SET stock = stock + ? WHERE id = ?',
        args: [Number(change), id],
      });
    }
    const updated = await turso.execute({
      sql: 'SELECT id, stock FROM products WHERE id = ?',
      args: [id],
    });
    res.json(updated.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await turso.execute({
      sql: 'DELETE FROM products WHERE id = ?',
      args: [id],
    });
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// TRANSACTIONS APIS (ATOMIC TRANSACTION & STOCK DECREMENT)
// ==========================================

app.get('/api/transactions', async (req: Request, res: Response) => {
  try {
    const trxRes = await turso.execute(`
      SELECT 
        id, 
        date, 
        cashier, 
        customer_name as customerName, 
        subtotal, 
        tax, 
        discount, 
        total, 
        payment_method as paymentMethod, 
        payment_amount as paymentAmount, 
        change_amount as change, 
        status, 
        notes 
      FROM transactions 
      ORDER BY date DESC
    `);

    const itemsRes = await turso.execute(`
      SELECT 
        transaction_id, 
        product_id as productId, 
        name, 
        sku, 
        price, 
        quantity, 
        total, 
        image 
      FROM transaction_items
    `);

    // Group items by transaction_id
    const itemsByTrx = new Map<string, any[]>();
    for (const item of itemsRes.rows) {
      const tid = String(item.transaction_id);
      if (!itemsByTrx.has(tid)) {
        itemsByTrx.set(tid, []);
      }
      itemsByTrx.get(tid)!.push({
        productId: item.productId,
        name: item.name,
        sku: item.sku,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
        image: item.image,
      });
    }

    const transactions = trxRes.rows.map((t: any) => ({
      ...t,
      items: itemsByTrx.get(String(t.id)) || [],
    }));

    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions', async (req: Request, res: Response) => {
  try {
    const {
      id,
      date,
      cashier,
      customerName,
      items,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      paymentAmount,
      change,
      status,
      notes,
    } = req.body;

    const trxId = id || `TRX-${Date.now()}`;
    const trxDate = date || new Date().toISOString();

    // Insert Transaction
    await turso.execute({
      sql: `INSERT INTO transactions 
            (id, date, cashier, customer_name, subtotal, tax, discount, total, payment_method, payment_amount, change_amount, status, notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        trxId,
        trxDate,
        cashier || 'Kasir',
        customerName || 'Pelanggan Umum',
        Number(subtotal) || 0,
        Number(tax) || 0,
        Number(discount) || 0,
        Number(total) || 0,
        paymentMethod || 'cash',
        Number(paymentAmount) || 0,
        Number(change) || 0,
        status || 'Sukses',
        notes || '',
        trxDate,
      ],
    });

    // Insert Transaction Items & Atomically Reduce Product Stock
    if (Array.isArray(items)) {
      for (const item of items) {
        const itemId = `${trxId}-${item.productId}-${Date.now()}`;
        await turso.execute({
          sql: `INSERT INTO transaction_items (id, transaction_id, product_id, name, sku, price, quantity, total, image)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            itemId,
            trxId,
            item.productId,
            item.name,
            item.sku || '',
            Number(item.price) || 0,
            Number(item.quantity) || 1,
            Number(item.total) || 0,
            item.image || '',
          ],
        });

        // Decrement stock in Turso
        await turso.execute({
          sql: `UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?`,
          args: [Number(item.quantity) || 1, item.productId],
        });
      }
    }

    res.json({
      id: trxId,
      date: trxDate,
      cashier,
      customerName,
      items,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      paymentAmount,
      change,
      status,
      notes,
    });
  } catch (err: any) {
    console.error('[Turso] Transaction creation failed:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// STORE SETTINGS APIS
// ==========================================

app.get('/api/settings', async (req: Request, res: Response) => {
  try {
    const result = await turso.execute(`
      SELECT 
        store_name as storeName, 
        tagline, 
        address, 
        phone, 
        receipt_footer as receiptFooter, 
        tax_rate_percent as taxRatePercent, 
        active_cashier_name as activeCashierName, 
        currency_prefix as currencyPrefix, 
        enable_sound_effects as enableSoundEffects 
      FROM store_settings 
      WHERE id = 'default'
    `);
    if (result.rows.length > 0) {
      const row = result.rows[0];
      res.json({
        ...row,
        enableSoundEffects: Boolean(row.enableSoundEffects),
      });
    } else {
      res.json(null);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', async (req: Request, res: Response) => {
  try {
    const {
      storeName,
      tagline,
      address,
      phone,
      receiptFooter,
      taxRatePercent,
      activeCashierName,
      currencyPrefix,
      enableSoundEffects,
    } = req.body;

    await turso.execute({
      sql: `UPDATE store_settings 
            SET store_name = ?, tagline = ?, address = ?, phone = ?, receipt_footer = ?, tax_rate_percent = ?, active_cashier_name = ?, currency_prefix = ?, enable_sound_effects = ?
            WHERE id = 'default'`,
      args: [
        storeName,
        tagline,
        address,
        phone,
        receiptFooter,
        Number(taxRatePercent),
        activeCashierName,
        currencyPrefix,
        enableSoundEffects ? 1 : 0,
      ],
    });

    res.json({ success: true, ...req.body });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// AUTHENTICATION & USERS APIS
// ==========================================

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const result = await turso.execute(`
      SELECT 
        id, 
        username, 
        full_name as fullName, 
        email, 
        role, 
        role_label as roleLabel, 
        branch_name as branchName, 
        avatar_initials as avatarInitials, 
        created_at as createdAt, 
        last_login as lastLogin
      FROM users 
      ORDER BY created_at ASC
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await turso.execute({
      sql: `SELECT * FROM users WHERE LOWER(username) = LOWER(?)`,
      args: [username.trim()],
    });

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'ID Kasir atau username tidak terdaftar di database Turso.' });
    }

    const userRow = result.rows[0];
    if (userRow.password_hash !== password) {
      return res.status(401).json({ success: false, message: 'Kata sandi tidak sesuai. Silakan periksa kembali.' });
    }

    // Update last_login
    const now = new Date().toISOString();
    await turso.execute({
      sql: 'UPDATE users SET last_login = ? WHERE id = ?',
      args: [now, userRow.id],
    });

    const authUser = {
      id: userRow.id,
      username: userRow.username,
      fullName: userRow.full_name,
      email: userRow.email,
      role: userRow.role,
      roleLabel: userRow.role_label,
      branchName: userRow.branch_name,
      avatarInitials: userRow.avatar_initials,
      createdAt: userRow.created_at,
      lastLogin: now,
    };

    res.json({ success: true, user: authUser });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { username, password, fullName, email, role, branchName } = req.body;

    const check = await turso.execute({
      sql: 'SELECT id FROM users WHERE LOWER(username) = LOWER(?)',
      args: [username.trim()],
    });

    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan di database. Harap pilih username lain.' });
    }

    const initials = fullName
      .split(' ')
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'OP';

    const roleMap: Record<string, string> = {
      super_admin: 'Super Administrator',
      admin: 'Administrator Toko',
      kasir: 'Kasir Front-Office',
      manajer: 'Manajer Operasional',
    };

    const newId = `usr-${Date.now()}`;
    const now = new Date().toISOString();

    await turso.execute({
      sql: `INSERT INTO users (id, username, password_hash, full_name, email, role, role_label, branch_name, avatar_initials, created_at, last_login)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newId,
        username.trim(),
        password,
        fullName.trim(),
        email.trim(),
        role || 'kasir',
        roleMap[role] || 'Operator',
        branchName || 'Cabang Senayan Utama',
        initials,
        now,
        now,
      ],
    });

    const authUser = {
      id: newId,
      username: username.trim(),
      fullName: fullName.trim(),
      email: email.trim(),
      role: role || 'kasir',
      roleLabel: roleMap[role] || 'Operator',
      branchName: branchName || 'Cabang Senayan Utama',
      avatarInitials: initials,
      createdAt: now,
      lastLogin: now,
    };

    res.json({ success: true, user: authUser });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/users/:id/password', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Kata sandi baru minimal 6 karakter.' });
    }

    await turso.execute({
      sql: 'UPDATE users SET password_hash = ? WHERE id = ?',
      args: [newPassword, id],
    });

    res.json({ success: true, message: 'Kata sandi berhasil diperbarui di database Turso.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, email, role, branchName } = req.body;

    const roleMap: Record<string, string> = {
      super_admin: 'Super Administrator',
      admin: 'Administrator Toko',
      kasir: 'Kasir Front-Office',
      manajer: 'Manajer Operasional',
    };

    await turso.execute({
      sql: `UPDATE users 
            SET full_name = ?, email = ?, role = ?, role_label = ?, branch_name = ?
            WHERE id = ?`,
      args: [
        fullName,
        email,
        role,
        roleMap[role] || 'Operator',
        branchName || 'Cabang Senayan Utama',
        id,
      ],
    });

    res.json({ success: true, message: 'Data akses pengguna berhasil diperbarui.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userCheck = await turso.execute({
      sql: 'SELECT username, role FROM users WHERE id = ?',
      args: [id],
    });

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    const targetUser = userCheck.rows[0];
    if (targetUser.username === 'naurahdigiss01' || targetUser.role === 'super_admin') {
      return res.status(403).json({ success: false, message: 'Akun Super Administrator utama tidak dapat dihapus.' });
    }

    await turso.execute({
      sql: 'DELETE FROM users WHERE id = ?',
      args: [id],
    });

    res.json({ success: true, message: 'Akses pengguna berhasil dihapus dari Turso.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// VITE MIDDLEWARE & STATIC ASSET SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] KASIRKU Enterprise server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
