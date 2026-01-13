import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SpiceLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const TOPPINGS_PRICE: Record<string, number> = {
  'Scrambled Egg': 4000,
  'Boiled Egg': 3000,
  'Sawi Hijau': 2000,
  'Kubis': 2000,
  'Jamur Kuping': 2000,
  'Kerupuk Orange': 3000,
  'Makaroni': 3000,
  'Batagor': 3000,
  'Siomay': 3000,
  'Ceker': 4000,
  'Tulang': 5000,
  'Bakso': 4000,
  'Sosis': 4000,
  // Add defaults from form if needed, price is estimation based on standard
};

export const DRINKS_PRICE: Record<string, number> = {
  'Es Teh Manis': 5000,
  'Jeruk Hangat': 7000,
  'Air Mineral': 4000,
};

export interface SeblakItem {
  id: string;
  levelPedas: string;
  kuah: string;
  rasa: string;
  telur: string;
  sayur: string;
  toppings: string[];
  price: number;
}

export interface DrinkItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderState {
  customerName: string;
  diningOption: 'Dine-in' | 'Takeaway';
  paymentMethod: 'Cash' | 'Transfer';
  bowls: SeblakItem[];
  drinks: DrinkItem[];
  specialRequest: string;
  orderHistory: Array<{
      id: string;
      date: string;
      total: number;
      itemsCount: number;
      queueNumber: string;
  }>;
  
  setCustomerName: (name: string) => void;
  setDiningOption: (option: 'Dine-in' | 'Takeaway') => void;
  setPaymentMethod: (method: 'Cash' | 'Transfer') => void;
  addToHistory: (order: { id: string; date: string; total: number; itemsCount: number; queueNumber: string }) => void;
  addBowl: (bowl: Omit<SeblakItem, 'id'>) => void;
  removeBowl: (id: string) => void;
  updateDrink: (name: string, price: number, delta: number) => void;
  setSpecialRequest: (req: string) => void;
  clearOrder: () => void;
  
  getTotalPrice: () => number;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      customerName: '',
      diningOption: 'Dine-in',
      paymentMethod: 'Cash',
      bowls: [],
      drinks: [],
      specialRequest: '',
      orderHistory: [],

      setCustomerName: (name) => set({ customerName: name }),
      setDiningOption: (option) => set({ diningOption: option }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      addToHistory: (order) => set((state) => ({ orderHistory: [order, ...state.orderHistory] })),
      
      addBowl: (bowl) => set((state) => ({
        bowls: [...state.bowls, { ...bowl, id: Math.random().toString(36).substring(7) }],
         // If dining option or name wasn't set globally, we keep it as is.
         // In new flow, we might update global settings from the order form too, but let's handle that in the component.
      })),
      
      removeBowl: (id) => set((state) => ({
        bowls: state.bowls.filter((b) => b.id !== id)
      })),

      updateDrink: (name, price, delta) => set((state) => {
        const existing = state.drinks.find(d => d.name === name);
        if (existing) {
            const newQty = existing.quantity + delta;
            if (newQty <= 0) {
                return { drinks: state.drinks.filter(d => d.name !== name) };
            }
            return { drinks: state.drinks.map(d => d.name === name ? { ...d, quantity: newQty } : d) };
        } else {
            if (delta > 0) {
                return { drinks: [...state.drinks, { name, price, quantity: delta }] };
            }
            return state;
        }
      }),

      setSpecialRequest: (req) => set({ specialRequest: req }),
      
      clearOrder: () => set({ 
          customerName: '', 
          diningOption: 'Dine-in', 
          paymentMethod: 'Cash',
          bowls: [], 
          drinks: [], 
          specialRequest: '' 
      }),
      
      getTotalPrice: () => {
          const state = get();
          const bowlsPrice = state.bowls.reduce((acc, b) => acc + b.price, 0);
          const drinksPrice = state.drinks.reduce((acc, d) => acc + (d.price * d.quantity), 0);
          return bowlsPrice + drinksPrice;
      }
    }),
    {
      name: 'seblak-cart-storage',
    }
  )
);
