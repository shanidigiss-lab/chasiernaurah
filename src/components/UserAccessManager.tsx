import React, { useState } from 'react';
import { 
  KeyRound, 
  User, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  Copy, 
  UserPlus, 
  Sparkles, 
  AlertCircle, 
  Building2,
  Trash2,
  LogIn,
  Store,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { DEMO_ACCOUNTS } from '../data/authData';
import { UserRole } from '../types';

export const UserAccessManager: React.FC = () => {
  const { 
    currentUser, 
    users, 
    updateUserPassword, 
    register, 
    deleteUser, 
    quickLoginAs, 
    setShowLandingPage, 
    addToast 
  } = usePOS();

  // State for changing current user's password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // State for targeting another user's password
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [targetNewPassword, setTargetNewPassword] = useState('');
  const [showTargetPassword, setShowTargetPassword] = useState(false);

  // State for adding new user
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('cashier');
  const [newBranch, setNewBranch] = useState('Store Senayan Utama');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Handle current user password change
  const handleUpdateCurrentPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError(null);

    const res = await updateUserPassword(currentUser.id, newPassword);
    setIsUpdatingPassword(false);

    if (res.success) {
      setNewPassword('');
      setConfirmPassword('');
      addToast('success', 'Kata Sandi Diperbarui', 'Kata sandi akun Anda berhasil diganti di database.');
    } else {
      setPasswordError(res.message || 'Gagal mengubah kata sandi.');
    }
  };

  // Handle updating another user's password
  const handleUpdateTargetUserPassword = async (userId: string) => {
    if (!targetNewPassword || targetNewPassword.length < 6) {
      addToast('error', 'Gagal', 'Kata sandi minimal 6 karakter.');
      return;
    }

    const res = await updateUserPassword(userId, targetNewPassword);
    if (res.success) {
      setEditingUserId(null);
      setTargetNewPassword('');
      addToast('success', 'Kata Sandi Diperbarui', 'Kata sandi pengguna berhasil disimpan ke database.');
    } else {
      addToast('error', 'Gagal', res.message || 'Gagal mengubah kata sandi pengguna.');
    }
  };

  // Handle adding new user
  const handleAddNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newUsername || !newEmail || !newUserPassword) {
      addToast('error', 'Data Belum Lengkap', 'Semua kolom wajib diisi.');
      return;
    }

    const res = await register({
      fullName: newFullName,
      username: newUsername.toLowerCase().trim(),
      email: newEmail.trim(),
      password: newUserPassword,
      role: newRole,
      branchName: newBranch
    });

    if (res.success) {
      setIsAddingUser(false);
      setNewFullName('');
      setNewUsername('');
      setNewEmail('');
      setNewUserPassword('');
      addToast('success', 'Operator Berhasil Ditambahkan', `Akun @${newUsername} siap digunakan.`);
    } else {
      addToast('error', 'Gagal Menambah Pengguna', res.message || 'Terjadi kesalahan.');
    }
  };

  const handleCopy = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('success', `${label} Disalin`, `"${text}" siap ditempel.`);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="bg-white rounded-xl border border-[#c1c7cd] p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#edeef0] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#cfe2f1] text-[#2f6481] flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[17px] font-bold text-[#191c1e]">
              Akses Pengguna, Username & Kata Sandi
            </h3>
            <p className="text-[13px] text-[#5e666d]">
              Kelola kredensial login kasir, supervisor, dan administrator toko.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLandingPage(true)}
            className="px-3.5 py-1.5 rounded-lg border border-[#c1c7cd] hover:bg-[#edeef0] text-[12px] font-bold text-[#2f6481] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Buka Landing Page"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddingUser(!isAddingUser)}
            className="px-3.5 py-1.5 rounded-lg bg-[#2f6481] hover:bg-[#25526b] text-white text-[12px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isAddingUser ? 'Batal Tambah' : 'Tambah Operator'}</span>
          </button>
        </div>
      </div>

      {/* Form: Add New User Expandable */}
      {isAddingUser && (
        <form onSubmit={handleAddNewUser} className="p-4 bg-[#f8f9fc] border border-[#cfe2f1] rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[14px] font-bold text-[#14374a] flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#2f6481]" />
              Pendaftaran Operator / Kasir Baru
            </h4>
            <span className="text-[11px] font-semibold text-[#5e666d]">Disimpan ke Turso DB</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
            <div>
              <label className="block font-semibold text-[#191c1e] mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="cth. Anita Kasir Pagi"
                className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3 py-2 text-[13px] focus:ring-2 focus:ring-[#2f6481]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#191c1e] mb-1">Username (ID Login) *</label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="cth. kasir_anita"
                className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3 py-2 text-[13px] font-mono focus:ring-2 focus:ring-[#2f6481]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#191c1e] mb-1">Email Toko / Pribadi *</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="anita@kasirku.id"
                className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3 py-2 text-[13px] focus:ring-2 focus:ring-[#2f6481]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#191c1e] mb-1">Peran (Hak Akses) *</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3 py-2 text-[13px] font-semibold focus:ring-2 focus:ring-[#2f6481]"
              >
                <option value="cashier">Kasir POS (Front Office)</option>
                <option value="supervisor">Supervisor Toko</option>
                <option value="manager">Manager Outlet</option>
                <option value="super_admin">Super Administrator</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#191c1e] mb-1">Penugasan Outlet / Cabang</label>
              <input
                type="text"
                value={newBranch}
                onChange={(e) => setNewBranch(e.target.value)}
                placeholder="Store Senayan Utama"
                className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3 py-2 text-[13px] focus:ring-2 focus:ring-[#2f6481]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#191c1e] mb-1">Kata Sandi Awal *</label>
              <input
                type="password"
                required
                minLength={6}
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3 py-2 text-[13px] font-mono focus:ring-2 focus:ring-[#2f6481]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingUser(false)}
              className="px-3.5 py-1.5 rounded-lg border border-[#c1c7cd] bg-white text-[#41484d] text-[13px] font-semibold hover:bg-[#edeef0] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#2f6481] text-white text-[13px] font-bold hover:bg-[#25526b] transition-colors cursor-pointer shadow-2xs"
            >
              Simpan Operator Baru
            </button>
          </div>
        </form>
      )}

      {/* Section 1: Ganti Kata Sandi Akun yang Sedang Aktif */}
      {currentUser && (
        <div className="p-4 bg-[#f8f9fc] rounded-xl border border-[#edeef0] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#2f6481]" />
              <h4 className="text-[14px] font-bold text-[#191c1e]">
                Ubah Kata Sandi Akun Anda (@{currentUser.username})
              </h4>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#cfe2f1] text-[#14374a]">
              {currentUser.roleLabel}
            </span>
          </div>

          {passwordError && (
            <div className="p-2.5 rounded-lg bg-[#ffdad6] border border-[#ffb4ab] text-[#ba1a1a] text-[12px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateCurrentPassword} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="block text-[12px] font-semibold text-[#41484d] mb-1">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3 py-2 text-[13px] font-mono focus:ring-2 focus:ring-[#2f6481] pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71787e] hover:text-[#191c1e] cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="sm:col-span-5">
              <label className="block text-[12px] font-semibold text-[#41484d] mb-1">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full bg-white border border-[#c1c7cd] rounded-lg px-3 py-2 text-[13px] font-mono focus:ring-2 focus:ring-[#2f6481]"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isUpdatingPassword || !newPassword}
                className="w-full py-2 px-3 rounded-lg bg-[#2f6481] hover:bg-[#25526b] disabled:opacity-50 text-white text-[13px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                {isUpdatingPassword ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Perbarui</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Section 2: Daftar Semua Pengguna & Kredensial Cepat */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[14px] font-bold text-[#191c1e] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2f6481]" />
            Daftar Operator Terdaftar ({users.length} Akun)
          </h4>
          <span className="text-[11px] text-[#5e666d]">
            Termasuk akun demo Super Admin, Supervisor, dan Kasir
          </span>
        </div>

        <div className="divide-y divide-[#edeef0] border border-[#c1c7cd] rounded-xl overflow-hidden">
          {users.map((u) => {
            const isSelf = currentUser?.id === u.id;
            const demoMatch = DEMO_ACCOUNTS.find((d) => d.username === u.username);
            const isEditingThisUser = editingUserId === u.id;

            return (
              <div key={u.id} className="p-4 bg-white hover:bg-[#fafafc] transition-colors space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2f6481] text-white flex items-center justify-center font-bold text-[14px] shrink-0">
                      {u.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] font-bold text-[#191c1e]">
                          {u.fullName}
                        </span>
                        {isSelf && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Sedang Digunakan
                          </span>
                        )}
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#cfe2f1] text-[#14374a]">
                          {u.roleLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[12px] text-[#71787e] mt-0.5 flex-wrap">
                        <span className="font-mono text-[#191c1e] font-semibold">
                          @{u.username}
                        </span>
                        <span>•</span>
                        <span>{u.email}</span>
                        <span>•</span>
                        <span>{u.branchName || 'Cabang Utama'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for this user */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Copy Username button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(u.username, 'Username', `${u.id}-u`)}
                      className="p-1.5 rounded-lg border border-[#c1c7cd] text-[#41484d] hover:bg-[#edeef0] text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      title="Salin Username"
                    >
                      {copiedKey === `${u.id}-u` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>User</span>
                    </button>

                    {/* Copy Password button if demo password is known */}
                    {demoMatch && (
                      <button
                        type="button"
                        onClick={() => handleCopy(demoMatch.password, 'Kata Sandi', `${u.id}-p`)}
                        className="p-1.5 rounded-lg border border-[#c1c7cd] text-[#41484d] hover:bg-[#edeef0] text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        title="Salin Kata Sandi Awal"
                      >
                        {copiedKey === `${u.id}-p` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <KeyRound className="w-3.5 h-3.5 text-[#2f6481]" />
                        )}
                        <span>Sandi Demo</span>
                      </button>
                    )}

                    {/* Change Password toggle button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isEditingThisUser) {
                          setEditingUserId(null);
                        } else {
                          setEditingUserId(u.id);
                          setTargetNewPassword('');
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-[#2f6481] text-[#2f6481] hover:bg-[#cfe2f1]/30 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      <span>{isEditingThisUser ? 'Tutup' : 'Ubah Sandi'}</span>
                    </button>

                    {/* Quick switch to this account if not self */}
                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => {
                          quickLoginAs(u.id);
                          addToast('info', 'Beralih Akun', `Sekarang masuk sebagai ${u.fullName}.`);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#f3f3f6] hover:bg-[#e7e8eb] text-[#191c1e] text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                        title="Beralih langsung ke akun ini"
                      >
                        <LogIn className="w-3 h-3 text-[#2f6481]" />
                        <span>Masuk Akun</span>
                      </button>
                    )}

                    {/* Delete button (protected for naurahdigiss01) */}
                    {u.username !== 'naurahdigiss01' && !isSelf && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Hapus operator @${u.username} (${u.fullName})?`)) {
                            deleteUser(u.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors cursor-pointer"
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Password Modifier for this user */}
                {isEditingThisUser && (
                  <div className="pt-2 mt-2 border-t border-[#edeef0] flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-[#41484d] shrink-0">
                      Sandi Baru @{u.username}:
                    </span>
                    <div className="relative flex-1 max-w-xs">
                      <input
                        type={showTargetPassword ? 'text' : 'password'}
                        value={targetNewPassword}
                        onChange={(e) => setTargetNewPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full bg-[#f8f9fc] border border-[#c1c7cd] rounded-lg px-2.5 py-1.5 text-[12px] font-mono focus:ring-2 focus:ring-[#2f6481] pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowTargetPassword(!showTargetPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#71787e] hover:text-[#191c1e] cursor-pointer"
                      >
                        {showTargetPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdateTargetUserPassword(u.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#2f6481] hover:bg-[#25526b] text-white text-[12px] font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      Simpan Sandi
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
