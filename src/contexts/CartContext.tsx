import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface CartItem {
  id: string;
  tourId: string;
  title: string;
  price: number;
  discount: number;
  image: string;
  people: number;
  travelDate: string;
}

interface Tour {
  id: string;
  title: string;
  price: number;
  discount: number;
  image: string;
  location: string;
  country: string;
  duration: number;
  rating: number;
  reviews_count: number;
  is_hot: boolean;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  tours: Tour[];
  addItem: (item: CartItem) => void;
  removeItem: (tourId: string) => void;
  updateItem: (tourId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  checkout: (token: string, email: string, name: string) => Promise<{ id: string }>;
  isCheckingOut: boolean;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('voyager_cart');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
          ...item,
          price: Number(item.price) || 0,
          discount: Number(item.discount) || 0,
          people: Number(item.people) || 1,
        }));
      } catch (e) {
        console.error('Failed to parse cart:', e);
        return [];
      }
    }
    return [];
  });
  
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Загрузка туров
  useEffect(() => {
    async function loadTours() {
      try {
        const response = await fetch(`${API_URL}/tours/`);
        if (response.ok) {
          const data = await response.json();
          setTours(data.results || data || []);
        } else {
          setTours([]);
        }
      } catch (error) {
        console.error('Error loading tours:', error);
        setTours([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadTours();
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem('voyager_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    const normalizedItem = {
      ...item,
      price: Number(item.price) || 0,
      discount: Number(item.discount) || 0,
      people: Number(item.people) || 1,
    };

    setItems((prev) => {
      const existing = prev.find((i) => i.tourId === item.tourId);
      if (existing) {
        return prev.map((i) =>
          i.tourId === item.tourId
            ? { ...i, ...normalizedItem, people: Number(normalizedItem.people) }
            : i
        );
      }
      return [...prev, normalizedItem];
    });
  };

  const removeItem = (tourId: string) => {
    setItems((prev) => prev.filter((i) => i.tourId !== tourId));
  };

  const updateItem = (tourId: string, updates: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.tourId === tourId) {
          const updated = { ...i, ...updates };
          return {
            ...updated,
            price: Number(updated.price) || 0,
            discount: Number(updated.discount) || 0,
            people: Number(updated.people) || 1,
          };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('voyager_cart');
  };

  const getDiscountedPrice = (price: number, discount: number) => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;
    return d > 0 ? Math.round(p * (1 - d / 100)) : p;
  };

  // ✅ Вычисляем total из items, а не из tours
  const total = items.reduce((sum, item) => {
    const discountedPrice = getDiscountedPrice(item.price, item.discount);
    const people = Number(item.people) || 1;
    return sum + discountedPrice * people;
  }, 0);

  const itemCount = items.length;

  const checkout = async (token: string, email: string, name: string) => {
    setIsCheckingOut(true);
    try {
      const orderData = {
        email,
        name,
        total_amount: total,
      };

      const response = await fetch(`${API_URL}/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при создании заказа');
      }

      const data = await response.json();

      for (const item of items) {
        await fetch(`${API_URL}/orders/${data.id}/items/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          body: JSON.stringify({
            tour: item.tourId,
            quantity: 1,
            travel_date: item.travelDate,
            people_count: Number(item.people) || 1,
            unit_price: getDiscountedPrice(item.price, item.discount),
          }),
        });
      }

      clearCart();
      return { id: data.id };
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        tours,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        total,
        itemCount,
        checkout,
        isCheckingOut,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}