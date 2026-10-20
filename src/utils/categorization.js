/**
 * Smart Local Rule-Based Categorization Engine
 * Deterministic keyword matching on normalized text.
 * No external APIs or generative models.
 */

const EXPENSE_RULES = [
  {
    category: 'Food & Dining',
    keywords: [
      'swiggy', 'zomato', 'restaurant', 'cafe', 'coffee', 'starbucks', 'mcdonald',
      'burger', 'pizza', 'domino', 'kfc', 'subway', 'biryani', 'dinner', 'lunch',
      'breakfast', 'snack', 'bakery', 'tea', 'chai', 'food court', 'bar', 'pub',
      'eatclub', 'dhabba'
    ],
    priority: 10,
  },
  {
    category: 'Groceries',
    keywords: [
      'blinkit', 'zepto', 'instamart', 'bigbasket', 'supermarket', 'groceries',
      'grocery', 'vegetables', 'veggies', 'fruits', 'milk', 'bread', 'eggs',
      'ration', 'dmart', 'nature basket', 'reliance fresh', 'kirana', 'meat',
      'fish', 'spices', 'provisions'
    ],
    priority: 10,
  },
  {
    category: 'Transportation',
    keywords: [
      'uber', 'ola', 'rapido', 'metro', 'petrol', 'diesel', 'fuel', 'auto',
      'cab', 'taxi', 'parking', 'toll', 'fastag', 'bus', 'train fare', 'bike service',
      'car wash', 'gas station', 'scooter'
    ],
    priority: 10,
  },
  {
    category: 'Bills & Utilities',
    keywords: [
      'electricity', 'bescom', 'power bill', 'water bill', 'internet', 'wifi',
      'broadband', 'airtel', 'jio', 'vi', 'cylinder', 'indane', 'hp gas',
      'lpg', 'pipe gas', 'dth', 'tata play', 'utility bill', 'mobile recharge'
    ],
    priority: 10,
  },
  {
    category: 'Housing & Rent',
    keywords: [
      'rent', 'landlord', 'house rent', 'flat rent', 'maintenance fee',
      'society maintenance', 'property tax', 'mortgage', 'home loan emi',
      'security deposit', 'brokerage'
    ],
    priority: 12,
  },
  {
    category: 'Healthcare',
    keywords: [
      'hospital', 'doctor', 'clinic', 'dentist', 'dental', 'pharmacy',
      'chemist', 'apollo', '1mg', 'pharmeasy', 'medPlus', 'medicine',
      'diagnostic', 'blood test', 'health checkup', 'physio', 'consultation'
    ],
    priority: 10,
  },
  {
    category: 'Subscriptions',
    keywords: [
      'netflix', 'spotify', 'hotstar', 'prime video', 'amazon prime',
      'youtube premium', 'chatgpt', 'openai', 'icloud', 'google one',
      'subscription', 'gym membership', 'cult fit', 'audible', 'software license'
    ],
    priority: 12,
  },
  {
    category: 'Entertainment',
    keywords: [
      'movie', 'cinema', 'pvr', 'inox', 'bookmyshow', 'concert', 'gaming',
      'playstation', 'steam', 'bowling', 'arcade', 'amusement', 'party', 'club'
    ],
    priority: 9,
  },
  {
    category: 'Shopping',
    keywords: [
      'amazon', 'flipkart', 'myntra', 'ajio', 'zara', 'h&m', 'clothes',
      'shoes', 'electronics', 'gadget', 'headphones', 'watch', 'shopping',
      'mall', 't-shirt', 'jeans', 'apparel'
    ],
    priority: 8,
  },
  {
    category: 'Education',
    keywords: [
      'course', 'udemy', 'coursera', 'tuition', 'school fee', 'college fee',
      'exam fee', 'books', 'textbook', 'stationary', 'training', 'masterclass',
      'certification'
    ],
    priority: 10,
  },
  {
    category: 'Travel',
    keywords: [
      'flight', 'irctc', 'train ticket', 'hotel', 'makemytrip', 'goibibo',
      'airbnb', 'booking.com', 'resort', 'vacation', 'trip', 'boarding pass',
      'visa', 'luggage'
    ],
    priority: 10,
  },
  {
    category: 'Personal Care',
    keywords: [
      'salon', 'haircut', 'spa', 'massage', 'cosmetics', 'nykaa',
      'skincare', 'shampoo', 'sunscreen', 'grooming', 'parlour'
    ],
    priority: 9,
  },
  {
    category: 'Investments',
    keywords: [
      'sip', 'mutual fund', 'zerodha', 'groww', 'stocks', 'equity',
      'gold', 'silver', 'fixed deposit', 'fd', 'ppf', 'nps', 'crypto',
      'bitcoin', 'etf'
    ],
    priority: 10,
  },
];

const INCOME_RULES = [
  {
    category: 'Salary',
    keywords: [
      'salary', 'payroll', 'monthly salary', 'stipend', 'wages', 'compensation',
      'employer', 'infosys', 'tcs', 'wipro', 'google', 'microsoft', 'payscale'
    ],
    priority: 10,
  },
  {
    category: 'Freelance',
    keywords: [
      'freelance', 'client payment', 'upwork', 'fiverr', 'consulting',
      'contract work', 'milestone', 'gig', 'project fee', 'retainer'
    ],
    priority: 10,
  },
  {
    category: 'Business',
    keywords: [
      'business', 'sales', 'revenue', 'invoice', 'client settlement',
      'vendor payment', 'customer order', 'merchant payout', 'razorpay'
    ],
    priority: 10,
  },
  {
    category: 'Investments',
    keywords: [
      'dividend', 'interest credited', 'stock profit', 'capital gain',
      'maturity', 'fd interest', 'crypto gain', 'yield'
    ],
    priority: 10,
  },
  {
    category: 'Gifts',
    keywords: [
      'gift', 'birthday', 'diwali', 'anniversary', 'wedding gift',
      'reward', 'voucher bonus', 'rakhi'
    ],
    priority: 10,
  },
  {
    category: 'Refunds',
    keywords: [
      'refund', 'cashback', 'reimbursement', 'reimbursed', 'return credit',
      'claim settled', 'cred cashback'
    ],
    priority: 11,
  },
];

/**
 * Clean & normalize a note string
 */
const normalizeText = (text) => {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Suggests the best matching category for a transaction note
 * @param {string} note - User-entered note or description
 * @param {'expense'|'income'} type - Transaction type
 * @returns {{ category: string, confidence: number, keyword: string } | null}
 */
export const suggestCategory = (note, type = 'expense') => {
  const cleanNote = normalizeText(note);
  if (!cleanNote || cleanNote.length < 2) return null;

  const rules = type === 'income' ? INCOME_RULES : EXPENSE_RULES;
  let bestMatch = null;
  let highestScore = 0;

  for (const rule of rules) {
    for (const kw of rule.keywords) {
      const cleanKw = kw.toLowerCase();
      // Exact word match or substring match
      const regex = new RegExp(`\\b${cleanKw}\\b`, 'i');
      const isWordMatch = regex.test(cleanNote);
      const isSubMatch = cleanNote.includes(cleanKw);

      if (isWordMatch || isSubMatch) {
        // Score based on word match vs substring match + priority
        const score = (isWordMatch ? 20 : 10) + rule.priority + (cleanKw.length * 0.5);
        if (score > highestScore) {
          highestScore = score;
          bestMatch = {
            category: rule.category,
            confidence: Math.min(100, Math.round(score * 3)),
            keyword: kw,
          };
        }
      }
    }
  }

  // Only suggest if sufficiently confident (confidence >= 30)
  return bestMatch && bestMatch.confidence >= 30 ? bestMatch : null;
};
