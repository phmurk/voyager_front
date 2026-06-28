import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingCart, CreditCard, Calendar, Users, ArrowRight, MapPin, Clock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const { items, tours, removeItem, updateItem, clearCart, total, itemCount, isLoading } = useCart();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Защита от undefined tours
  const getTour = (tourId: string) => {
    if (!tours || !Array.isArray(tours)) return null;
    return tours.find((t) => t.id === tourId);
  };

  // ✅ Вычисляем цену из item (не из tours)
  const getItemPrice = (item: any) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    return discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setOrderSuccess(true);
    clearCart();
  };

  if (orderSuccess) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Оплата прошла успешно!</h2>
          <p className="text-muted-foreground mb-8">
            Ваш заказ подтвержден. Вся информация отправлена на ваш email.
          </p>
          <button
            onClick={() => navigate('/tours')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
          >
            Продолжить покупки
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Корзина пуста</h2>
          <p className="text-muted-foreground mb-8">
            Добавьте туры в корзину, чтобы оформить заказ
          </p>
          <button
            onClick={() => navigate('/tours')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
          >
            Выбрать тур
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-8">Корзина</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 bg-card rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              items.map((item) => {
                const tour = getTour(item.tourId);
                
                // ✅ Вычисляем цену из item
                const discountedPrice = getItemPrice(item);
                const itemTotal = discountedPrice * (Number(item.people) || 1);

                return (
                  <div
                    key={item.tourId}
                    className="flex gap-4 p-4 rounded-xl bg-card border border-border"
                  >
                    <img
                      src={item.image || tour?.image || 'https://via.placeholder.com/112x112'}
                      alt={item.title || tour?.title || 'Тур'}
                      className="w-28 h-28 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 truncate">
                        {item.title || tour?.title || 'Тур не найден'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {tour?.location || '—'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {tour?.duration || '—'} дн.
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.travelDate || 'Дата не выбрана'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {item.people || 1} чел.
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateItem(item.tourId, { people: Math.max(1, (item.people || 1) - 1) })}
                            className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.people || 1}</span>
                          <button
                            onClick={() => updateItem(item.tourId, { people: (item.people || 1) + 1 })}
                            className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-emerald-400">
                            ${itemTotal.toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.tourId)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <button
              onClick={clearCart}
              className="text-sm text-muted-foreground hover:text-red-400 transition-colors"
            >
              Очистить корзину
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold mb-4">Итого</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Товаров</span>
                    <span>{itemCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Количество человек</span>
                    <span>{items.reduce((s, i) => s + (Number(i.people) || 1), 0)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-medium">Сумма</span>
                    <span className="text-2xl font-bold text-emerald-400">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {!showPayment ? (
                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    Оформить заказ
                  </button>
                ) : (
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Номер карты</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        placeholder="0000 0000 0000 0000"
                        maxLength={16}
                        required
                        className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Срок</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                          className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="123"
                          maxLength={3}
                          required
                          className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Имя на карте</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="IVAN IVANOV"
                        required
                        className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm outline-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowPayment(false)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-sm"
                      >
                        Назад
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium transition-colors text-sm"
                      >
                        {isProcessing ? 'Обработка...' : `Оплатить $${total.toFixed(2)}`}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}