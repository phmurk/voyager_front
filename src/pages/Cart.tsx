import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  CreditCard,
  Calendar,
  Users,
  ArrowRight,
  MapPin,
  Clock,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import "./Cart.css"; // Импорт стилей

export default function Cart() {
  const { user, token } = useAuth();
  const {
    items,
    tours,
    removeItem,
    updateItem,
    clearCart,
    total,
    itemCount,
    isLoading,
  } = useCart();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const getTour = (tourId: string) => {
    if (!tours || !Array.isArray(tours)) return null;
    return tours.find((t) => t.id === tourId);
  };

  // Обработка срока действия (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Удаляем всё, кроме цифр

    if (value.length >= 2) {
      // Если введено 2 и более цифр, вставляем слэш
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }

    setCardExpiry(value);
  };

  // Обработка имени владельца
  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    // Разрешаем только латинские буквы и один пробел
    const regex = /^[A-Z]*\s?[A-Z]*$/;

    if (regex.test(value)) {
      setCardName(value);
    }
  };

  const getItemPrice = (item: any) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    return discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Пожалуйста, войдите в аккаунт для оформления заказа");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);
    try {
      // Отправляем данные в Django
      await api.createOrder(
        {
          email: user?.email,
          name: user?.name,
          phone: "+375 00 000 0000", // Тут можно добавить поле ввода телефона в форму
          total_amount: total,
          payment_method: "card",
          cart_items: items, // Это те самые данные, которые распарсит наш Serializer
        },
        token,
      );

      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      alert("Ошибка оплаты: " + err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="cart-page d-flex align-items-center justify-content-center">
        <div className="cart-empty-state px-4">
          <div className="icon-circle-large bg-emerald-soft">
            <CreditCard size={40} className="text-primary" />
          </div>
          <h2 className="fw-bold mb-3">Оплата прошла успешно!</h2>
          <p className="text-muted mb-4">
            Ваш заказ подтвержден. Вся информация отправлена на ваш email.
          </p>
          <div className="d-flex justify-content-center">
            <button
              onClick={() => navigate("/tours")}
              className="btn btn-emerald px-4 py-3 rounded-3"
            >
              Продолжить покупки <ArrowRight size={18} className="ms-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page d-flex align-items-center justify-content-center">
        <div className="cart-empty-state px-4">
          <div className="icon-circle-large bg-muted-soft">
            <ShoppingCart size={40} className="text-muted" />
          </div>
          <h2 className="fw-bold mb-3">Корзина пуста</h2>
          <p className="text-muted mb-4">
            Добавьте туры в корзину, чтобы оформить заказ
          </p>
          <div className="d-flex justify-content-center">
            <button
              onClick={() => navigate("/tours")}
              className="btn btn-emerald px-4 py-3 rounded-3"
            >
              Выбрать тур <ArrowRight size={18} className="ms-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container py-4">
        <h1 className="cart-title">Корзина</h1>

        <div className="row g-4">
          {/* Items List */}
          <div className="col-12 col-lg-8">
            <div className="d-flex flex-column gap-3">
              {isLoading
                ? [1, 2].map((i) => (
                    <div key={i} className="skeleton-cart-item" />
                  ))
                : items.map((item) => {
                    const tour = getTour(item.tourId);
                    const discountedPrice = getItemPrice(item);
                    const itemTotal =
                      discountedPrice * (Number(item.people) || 1);

                    return (
                      <div key={item.tourId} className="cart-item-card">
                        <img
                          src={
                            item.image ||
                            tour?.image ||
                            "https://via.placeholder.com/112"
                          }
                          alt="Tour"
                          className="cart-item-img"
                        />
                        <div className="flex-grow-1 min-w-0">
                          <h3 className="h6 fw-bold mb-1 text-truncate">
                            {item.title || tour?.title || "Тур"}
                          </h3>

                          <div className="d-flex flex-wrap gap-3 mb-2 small text-muted">
                            <span className="d-flex align-items-center gap-1">
                              <MapPin size={12} /> {tour?.location || "—"}
                            </span>
                            <span className="d-flex align-items-center gap-1">
                              <Clock size={12} /> {tour?.duration || "—"} дн.
                            </span>
                          </div>

                          <div className="d-flex flex-wrap gap-3 mb-3 small text-muted">
                            <span className="d-flex align-items-center gap-1">
                              <Calendar size={12} />{" "}
                              {item.travelDate || "Дата не выбрана"}
                            </span>
                            <span className="d-flex align-items-center gap-1">
                              <Users size={12} /> {item.people || 1} чел.
                            </span>
                          </div>

                          <div className="d-flex align-items-center justify-content-between">
                            <div className="quantity-controls">
                              <button
                                className="btn-qty"
                                onClick={() =>
                                  updateItem(item.tourId, {
                                    people: Math.max(1, (item.people || 1) - 1),
                                  })
                                }
                              >
                                <Minus size={12} />
                              </button>
                              <span
                                className="small fw-bold"
                                style={{ width: "20px", textAlign: "center" }}
                              >
                                {item.people || 1}
                              </span>
                              <button
                                className="btn-qty"
                                onClick={() =>
                                  updateItem(item.tourId, {
                                    people: (item.people || 1) + 1,
                                  })
                                }
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                              <span className="fw-bold text-primary">
                                ${itemTotal.toFixed(2)}
                              </span>
                              <button
                                onClick={() => removeItem(item.tourId)}
                                className="btn btn-link p-0 text-muted hover-danger"
                                title="Удалить"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>

            <button
              onClick={clearCart}
              className="btn btn-link btn-sm text-muted text-decoration-none mt-3 p-0"
            >
              Очистить корзину
            </button>
          </div>

          {/* Summary Sidebar */}
          <div className="col-12 col-lg-4">
            <aside className="cart-summary-card">
              <h3 className="h5 fw-bold mb-4">Итого</h3>

              <div className="summary-row">
                <span className="text-muted">Товаров</span>
                <span>{itemCount}</span>
              </div>
              <div className="summary-row">
                <span className="text-muted">Количество человек</span>
                <span>
                  {items.reduce((s, i) => s + (Number(i.people) || 1), 0)}
                </span>
              </div>

              <div className="summary-total mb-4">
                <span>Сумма</span>
                <span className="text-primary fs-4">${total.toFixed(2)}</span>
              </div>

              {!showPayment ? (
                <button
                  onClick={() => setShowPayment(true)}
                  className="btn btn-emerald w-100 py-3 rounded-3"
                >
                  <CreditCard size={18} className="me-2" /> Оформить заказ
                </button>
              ) : (
                <form onSubmit={handlePayment} className="animate-fadeIn">
                  <div className="mb-3">
                    <label className="payment-label">НОМЕР КАРТЫ</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(
                          e.target.value.replace(/\D/g, "").slice(0, 16),
                        )
                      }
                      placeholder="0000 0000 0000 0000"
                      className="payment-input"
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="payment-label">СРОК</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange} // ИСПОЛЬЗУЕМ НАШУ ФУНКЦИЮ
                        placeholder="MM/YY"
                        maxLength={5} // Ограничиваем длину (2 цифры + / + 2 цифры)
                        className="payment-input"
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="payment-label">CVC</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) =>
                          setCardCvc(
                            e.target.value.replace(/\D/g, "").slice(0, 3),
                          )
                        }
                        placeholder="***"
                        className="payment-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="payment-label">ИМЯ ВЛАДЕЛЬЦА</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={handleCardNameChange} // ИСПОЛЬЗУЕМ НАШУ ФУНКЦИЮ
                      placeholder="IVAN IVANOV"
                      className="payment-input"
                      required
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPayment(false)}
                      className="btn btn-outline-secondary flex-grow-1"
                    >
                      Назад
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="btn btn-emerald flex-grow-1"
                    >
                      {isProcessing ? "Ждите..." : "Оплатить"}
                    </button>
                  </div>
                </form>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
