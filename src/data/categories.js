export const EXPENSE_CATEGORIES = [
  { id: 'Food & Dining', name: 'Food & Dining', icon: 'Utensils', color: 'orange', hex: '#f97316' },
  { id: 'Groceries', name: 'Groceries', icon: 'ShoppingCart', color: 'emerald', hex: '#10b981' },
  { id: 'Transportation', name: 'Transportation', icon: 'Car', color: 'blue', hex: '#3b82f6' },
  { id: 'Shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'pink', hex: '#ec4899' },
  { id: 'Bills & Utilities', name: 'Bills & Utilities', icon: 'Zap', color: 'amber', hex: '#f59e0b' },
  { id: 'Housing & Rent', name: 'Housing & Rent', icon: 'Home', color: 'indigo', hex: '#6366f1' },
  { id: 'Healthcare', name: 'Healthcare', icon: 'HeartPulse', color: 'rose', hex: '#f43f5e' },
  { id: 'Entertainment', name: 'Entertainment', icon: 'Film', color: 'purple', hex: '#a855f7' },
  { id: 'Education', name: 'Education', icon: 'GraduationCap', color: 'cyan', hex: '#06b6d4' },
  { id: 'Travel', name: 'Travel', icon: 'Plane', color: 'sky', hex: '#0ea5e9' },
  { id: 'Personal Care', name: 'Personal Care', icon: 'Sparkles', color: 'fuchsia', hex: '#d946ef' },
  { id: 'Subscriptions', name: 'Subscriptions', icon: 'CreditCard', color: 'violet', hex: '#8b5cf6' },
  { id: 'Investments', name: 'Investments', icon: 'TrendingUp', color: 'teal', hex: '#14b8a6' },
  { id: 'Other', name: 'Other', icon: 'MoreHorizontal', color: 'gray', hex: '#6b7280' },
];

export const INCOME_CATEGORIES = [
  { id: 'Salary', name: 'Salary', icon: 'Briefcase', color: 'emerald', hex: '#10b981' },
  { id: 'Freelance', name: 'Freelance', icon: 'Laptop', color: 'blue', hex: '#3b82f6' },
  { id: 'Business', name: 'Business', icon: 'Building2', color: 'indigo', hex: '#6366f1' },
  { id: 'Investments', name: 'Investments', icon: 'TrendingUp', color: 'teal', hex: '#14b8a6' },
  { id: 'Gifts', name: 'Gifts', icon: 'Gift', color: 'pink', hex: '#ec4899' },
  { id: 'Refunds', name: 'Refunds', icon: 'RotateCcw', color: 'cyan', hex: '#06b6d4' },
  { id: 'Other Income', name: 'Other Income', icon: 'Wallet', color: 'amber', hex: '#f59e0b' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const getCategoryMeta = (name, type = 'expense') => {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const found = list.find(c => c.name.toLowerCase() === (name || '').toLowerCase()) ||
                ALL_CATEGORIES.find(c => c.name.toLowerCase() === (name || '').toLowerCase());
  return found || {
    id: name || 'Other',
    name: name || 'Other',
    icon: 'Tag',
    color: 'gray',
    hex: '#64748b'
  };
};
