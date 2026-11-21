import { useState } from 'react';
import { Check, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { StoreItem } from '../data/alHilalData';
import { HilalCrest } from './HilalCrest';

export interface CartEntry {
  key: string;
  item: StoreItem;
  size: string;
  qty: number;
}

interface AuthModalProps {
  open: boolean;
  memberName: string | null;
  onClose: () => void;
  onSignIn: (name: string) => void;
  onSignOut: () => void;
}

export function AuthModal({
  open,
  memberName,
  onClose,
  onSignIn,
  onSignOut,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const display = nameInput.trim() || emailInput.split('@')[0]?.trim() || 'مشجع هلالي';
    onSignIn(display);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="بوابة أعضاء الهلال"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050A2B]/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#101D66] border border-white/12 p-6 sm:p-7 text-white shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <HilalCrest className="w-10 h-12 text-white mb-3" />
              <h2 className="font-display font-black text-2xl">
                {memberName ? `أهلاً بك، ${memberName}` : 'بوابة القوة الزرقاء'}
              </h2>
              <p className="text-xs text-white/65 mt-1">
                {memberName
                  ? 'عضويتك في نادي الهلال السعودي نشطة'
                  : 'سجّل دخولك للوصول إلى التذاكر وعروض المتجر الحصرية'}
              </p>
            </div>

            {memberName ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-4 text-center">
                  <div className="text-xs text-blue-200">رقم العضوية</div>
                  <div className="font-display font-black text-xl tabular-nums mt-1">
                    HILAL-2026-8841
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="min-h-[44px] w-full rounded-full bg-white/12 hover:bg-white/20 text-white font-bold text-sm transition-colors cursor-pointer"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-white/[0.07] mb-5">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className={`min-h-[38px] rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      mode === 'login' ? 'bg-white text-[#0E1A5C]' : 'text-white/75'
                    }`}
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className={`min-h-[38px] rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      mode === 'signup' ? 'bg-white text-[#0E1A5C]' : 'text-white/75'
                    }`}
                  >
                    عضوية جديدة
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">
                        الاسم الكامل
                      </label>
                      <input
                        type="text"
                        required
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="مثال: فهد العتيبي"
                        className="w-full h-11 px-4 rounded-xl bg-white/[0.08] border border-white/12 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A6BFF]"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="name@example.com"
                      dir="ltr"
                      className="w-full h-11 px-4 rounded-xl bg-white/[0.08] border border-white/12 text-sm text-white placeholder:text-white/40 text-right focus:outline-none focus:border-[#3A6BFF]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="min-h-[46px] w-full rounded-full bg-white text-[#0E1A5C] font-bold text-sm hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    {mode === 'login' ? 'دخول' : 'إنشاء العضوية'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface CartModalProps {
  open: boolean;
  items: CartEntry[];
  onClose: () => void;
  onRemove: (key: string) => void;
  onClear: () => void;
}

export function CartModal({ open, items, onClose, onRemove, onClear }: CartModalProps) {
  const [checkedOut, setCheckedOut] = useState(false);

  const total = items.reduce((sum, entry) => sum + entry.item.price * entry.qty, 0);

  const handleCheckout = () => {
    setCheckedOut(true);
    window.setTimeout(() => {
      onClear();
      setCheckedOut(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="سلة المشتريات"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050A2B]/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full sm:max-w-md max-h-[82svh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-[#101D66] border border-white/12 p-6 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-black text-xl">سلة المشتريات</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <p className="py-10 text-center text-sm text-white/65">
                السلة فارغة حالياً
              </p>
            ) : (
              <>
                <div className="space-y-3 overflow-y-auto flex-1 pr-0.5">
                  {items.map((entry) => (
                    <div
                      key={entry.key}
                      className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-3.5 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="font-display font-bold text-sm truncate">
                          {entry.item.name}
                        </div>
                        <div className="text-xs text-white/65 mt-0.5 tabular-nums">
                          المقاس: {entry.size} · الكمية: {entry.qty} ·{' '}
                          {entry.item.price * entry.qty} ر.س
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(entry.key)}
                        aria-label="حذف المنتج"
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-rose-500/30 flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/75">الإجمالي</span>
                    <span className="font-display font-black text-2xl tabular-nums">
                      {total} ر.س
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className={`min-h-[46px] w-full rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      checkedOut
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white text-[#0E1A5C] hover:bg-blue-50'
                    }`}
                  >
                    {checkedOut ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تم استلام طلبك بنجاح</span>
                      </>
                    ) : (
                      <span>إتمام الطلب</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
