import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  cycleDays: number;
  totalReturn: number;
  dailyReturn: number;
  image: string;
}

export interface Investment {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  dailyReturn: number;
  totalReturn: number;
  startDate: string;
  endDate: string;
  lastClaimDate: string;
  status: 'active' | 'completed';
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  method: 'mpesa' | 'emola';
  status: 'pending' | 'approved' | 'rejected';
  proofImage?: string;
  date: string;
}

export interface User {
  id: string;
  phone: string;
  password: string; // 6 digits
  balance: number;
  role: 'user' | 'admin';
  lastCheckIn?: string;
}

export interface PlatformSettings {
  adminPin: string;
  whatsappNumber: string;
}

interface AppState {
  users: User[];
  currentUser: User | null;
  investments: Investment[];
  transactions: Transaction[];
  settings: PlatformSettings;
  products: Product[];

  // Auth actions
  login: (phone: string, password: string) => boolean;
  register: (phone: string, password: string) => boolean;
  logout: () => void;
  updateUserBalance: (userId: string, amount: number) => void;

  // Investment actions
  buyInvestment: (productId: string) => string | null;
  claimDailyEarnings: () => void;
  checkIn: () => boolean;

  // Transaction actions
  createDeposit: (amount: number, method: 'mpesa' | 'emola', proofImage: string) => void;
  createWithdrawal: (amount: number, method: 'mpesa' | 'emola') => string | null;

  // Admin actions
  approveTransaction: (transactionId: string) => void;
  rejectTransaction: (transactionId: string) => void;
  updateSettings: (settings: Partial<PlatformSettings>) => void;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Solar Básico',
    price: 500,
    cycleDays: 30,
    totalReturn: 1600,
    dailyReturn: 1600 / 30,
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ef1adfe3-ca3e-4f6f-a45e-9c722a390466/solar-investment-c5e10ec8-1782930183083.webp'
  },
  {
    id: '2',
    name: 'Eólico Padrão',
    price: 1500,
    cycleDays: 30,
    totalReturn: 3600,
    dailyReturn: 3600 / 30,
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ef1adfe3-ca3e-4f6f-a45e-9c722a390466/wind-energy-60ab5d9a-1782930181209.webp'
  },
  {
    id: '3',
    name: 'Hidro Pro',
    price: 2000,
    cycleDays: 20,
    totalReturn: 6000,
    dailyReturn: 6000 / 20,
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ef1adfe3-ca3e-4f6f-a45e-9c722a390466/hydro-power-4fc2bc1c-1782930179939.webp'
  },
  {
    id: '4',
    name: 'Rede Premium',
    price: 3500,
    cycleDays: 20,
    totalReturn: 8600,
    dailyReturn: 8600 / 20,
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ef1adfe3-ca3e-4f6f-a45e-9c722a390466/power-grid-a10457fb-1782930180294.webp'
  },
  {
    id: '5',
    name: 'Smart Grid Elite',
    price: 5000,
    cycleDays: 15,
    totalReturn: 15000,
    dailyReturn: 15000 / 15,
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ef1adfe3-ca3e-4f6f-a45e-9c722a390466/smart-grid-50e07050-1782930181042.webp'
  },
  {
    id: '6',
    name: 'Industrial Ultra',
    price: 10000,
    cycleDays: 10,
    totalReturn: 30000,
    dailyReturn: 30000 / 10,
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ef1adfe3-ca3e-4f6f-a45e-9c722a390466/industrial-solar-4a0163c0-1782930180874.webp'
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      investments: [],
      transactions: [],
      settings: {
        adminPin: '120000',
        whatsappNumber: '840000000'
      },
      products: PRODUCTS,

      login: (phone, password) => {
        const user = get().users.find(u => u.phone === phone && u.password === password);
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      register: (phone, password) => {
        if (get().users.find(u => u.phone === phone)) return false;
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          phone,
          password,
          balance: 0,
          role: 'user'
        };
        set(state => ({ users: [...state.users, newUser], currentUser: newUser }));
        return true;
      },

      logout: () => set({ currentUser: null }),

      updateUserBalance: (userId, amount) => {
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, balance: u.balance + amount } : u),
          currentUser: state.currentUser?.id === userId ? { ...state.currentUser, balance: state.currentUser.balance + amount } : state.currentUser
        }));
      },

      buyInvestment: (productId) => {
        const { currentUser, products } = get();
        if (!currentUser) return 'Faça login primeiro';
        const product = products.find(p => p.id === productId);
        if (!product) return 'Produto não encontrado';
        if (currentUser.balance < product.price) return 'Saldo insuficiente';

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + product.cycleDays);

        const newInvestment: Investment = {
          id: Math.random().toString(36).substr(2, 9),
          userId: currentUser.id,
          productId: product.id,
          amount: product.price,
          dailyReturn: product.dailyReturn,
          totalReturn: product.totalReturn,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          lastClaimDate: startDate.toISOString(),
          status: 'active'
        };

        set(state => ({
          investments: [...state.investments, newInvestment],
          users: state.users.map(u => u.id === currentUser.id ? { ...u, balance: u.balance - product.price } : u),
          currentUser: { ...currentUser, balance: currentUser.balance - product.price }
        }));

        return null;
      },

      claimDailyEarnings: () => {
        const { currentUser, investments } = get();
        if (!currentUser) return;

        const now = new Date();
        let totalEarnings = 0;
        const updatedInvestments = investments.map(inv => {
          if (inv.userId !== currentUser.id || inv.status !== 'active') return inv;

          const lastClaim = new Date(inv.lastClaimDate);
          const diffDays = Math.floor((now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays >= 1) {
            const earnings = inv.dailyReturn * diffDays;
            totalEarnings += earnings;
            
            const newLastClaimDate = new Date(lastClaim);
            newLastClaimDate.setDate(lastClaim.getDate() + diffDays);
            
            // Check if cycle is over
            const endDate = new Date(inv.endDate);
            if (newLastClaimDate >= endDate) {
              return { ...inv, lastClaimDate: endDate.toISOString(), status: 'completed' as const };
            }
            return { ...inv, lastClaimDate: newLastClaimDate.toISOString() };
          }
          return inv;
        });

        if (totalEarnings > 0) {
          set(state => ({
            investments: updatedInvestments,
            users: state.users.map(u => u.id === currentUser.id ? { ...u, balance: u.balance + totalEarnings } : u),
            currentUser: { ...currentUser, balance: currentUser.balance + totalEarnings }
          }));
        }
      },

      checkIn: () => {
        const { currentUser } = get();
        if (!currentUser) return false;

        const now = new Date().toDateString();
        const lastCheckIn = currentUser.lastCheckIn ? new Date(currentUser.lastCheckIn).toDateString() : null;

        if (lastCheckIn === now) return false;

        set(state => ({
          users: state.users.map(u => u.id === currentUser.id ? { ...u, balance: u.balance + 10, lastCheckIn: new Date().toISOString() } : u),
          currentUser: { ...currentUser, balance: currentUser.balance + 10, lastCheckIn: new Date().toISOString() }
        }));
        return true;
      },

      createDeposit: (amount, method, proofImage) => {
        const { currentUser } = get();
        if (!currentUser) return;

        const newTransaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          userId: currentUser.id,
          type: 'deposit',
          amount,
          method,
          status: 'pending',
          proofImage,
          date: new Date().toISOString()
        };

        set(state => ({ transactions: [...state.transactions, newTransaction] }));
      },

      createWithdrawal: (amount, method) => {
        const { currentUser } = get();
        if (!currentUser) return 'Faça login primeiro';
        if (currentUser.balance < amount) return 'Saldo insuficiente';

        const newTransaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          userId: currentUser.id,
          type: 'withdrawal',
          amount,
          method,
          status: 'pending',
          date: new Date().toISOString()
        };

        set(state => ({
          transactions: [...state.transactions, newTransaction],
          users: state.users.map(u => u.id === currentUser.id ? { ...u, balance: u.balance - amount } : u),
          currentUser: { ...currentUser, balance: currentUser.balance - amount }
        }));

        return null;
      },

      approveTransaction: (transactionId) => {
        const { transactions, users } = get();
        const transaction = transactions.find(t => t.id === transactionId);
        if (!transaction || transaction.status !== 'pending') return;

        let updatedUsers = [...users];
        if (transaction.type === 'deposit') {
          updatedUsers = users.map(u => u.id === transaction.userId ? { ...u, balance: u.balance + transaction.amount } : u);
        }

        set(state => ({
          transactions: state.transactions.map(t => t.id === transactionId ? { ...t, status: 'approved' } : t),
          users: updatedUsers,
          currentUser: state.currentUser?.id === transaction.userId && transaction.type === 'deposit' 
            ? { ...state.currentUser, balance: state.currentUser.balance + transaction.amount } 
            : state.currentUser
        }));
      },

      rejectTransaction: (transactionId) => {
        const { transactions, users } = get();
        const transaction = transactions.find(t => t.id === transactionId);
        if (!transaction || transaction.status !== 'pending') return;

        let updatedUsers = [...users];
        if (transaction.type === 'withdrawal') {
          updatedUsers = users.map(u => u.id === transaction.userId ? { ...u, balance: u.balance + transaction.amount } : u);
        }

        set(state => ({
          transactions: state.transactions.map(t => t.id === transactionId ? { ...t, status: 'rejected' } : t),
          users: updatedUsers,
          currentUser: state.currentUser?.id === transaction.userId && transaction.type === 'withdrawal' 
            ? { ...state.currentUser, balance: state.currentUser.balance + transaction.amount } 
            : state.currentUser
        }));
      },

      updateSettings: (newSettings) => {
        set(state => ({ settings: { ...state.settings, ...newSettings } }));
      }
    }),
    {
      name: 'moz-energy-storage'
    }
  )
);
