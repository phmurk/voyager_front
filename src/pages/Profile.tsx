import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquarePlus } from "lucide-react";
import {
  User as Mail,
  Calendar,
  MapPin,
  Package,
  LogOut,
  Edit2,
  Check,
  Star,
  X,
  ShoppingBag,
  Heart,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "./Profile.css";
import { api } from "../lib/api";

const getUserColor = (name: string = "User") => {
  const colors = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#f97316",
    "#14b8a6",
    "#6366f1",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash % colors.length);
  return colors[index];
};

const UserAvatar = ({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "?";
  const backgroundColor = getUserColor(name || "User");

  return (
    <div
      className={`user-avatar-circle size-${size}`}
      style={{ backgroundColor }}
    >
      {firstLetter}
    </div>
  );
};

// const API_URL = import.meta.env.axios.create || "http://localhost:8000/api";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface Tour {
  id: string;
  title: string;
  price: number;
  discount: number;
  image: string;
  location: string;
}
interface Favorite {
  id: string;
  tour: Tour;
  created_at: string;
}
interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: Array<{
    id: string;
    quantity: number;
    travel_date: string | null;
    people_count: number;
    unit_price: number;
    tour: Tour;
  }>;
}
interface Activity {
  id: string;
  activity_type: string;
  created_at: string;
  topic: { id: string; title: string } | null;
  reply: { id: string; content: string } | null;
  content_preview: string | null;
}

type TabType = "orders" | "favorites" | "activity";

const statusLabels: Record<string, { label: string; class: string }> = {
  pending: { label: "В обработке", class: "badge-pending" },
  paid: { label: "Оплачен", class: "badge-paid" },
  completed: { label: "Завершён", class: "badge-completed" },
  cancelled: { label: "Отменён", class: "badge-cancelled" },
};

export default function Profile() {
  const { user, isLoading, logout, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [reviewingTour, setReviewingTour] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const handleSendReview = async () => {
    if (!reviewingTour || !token || !user?.name) return;

    const reviewData = {
      tour: reviewingTour.id, // Убедитесь, что здесь UUID
      name: user.name,
      rating: reviewRating,
      text: reviewText,
      date: new Date().toLocaleDateString("ru-RU"),
    };

    try {
      const response = await api.addReview(reviewData, token);

      if (response.id) {
        setReviewingTour(null);
        setReviewText("");
        setReviewRating(5);
        fetchProfileData();
        // alert("Отзыв успешно опубликован!");
      }
    } catch (err: any) {
      // ТЕПЕРЬ МЫ УВИДИМ ОШИБКУ, ЕСЛИ БЭКЕНД ЕЁ ПРИШЛЕТ
      console.error("Детальная ошибка бэкенда:", err);

      // Если err — это объект ошибки от Django (например {tour: ["..."]})
      const msg = err.tour
        ? `Ошибка тура: ${err.tour}`
        : "Ошибка при сохранении. Проверь поля формы.";
      alert(msg);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) navigate("/auth");
  }, [isLoading, user, navigate]);

  useEffect(() => {
    // Исправление ошибки: используем пустую строку если user.name undefined
    if (user) setNameDraft(user.name || "");
  }, [user]);

  useEffect(() => {
    if (!user || !token) return;
    fetchProfileData();
  }, [user, token]);

  // const fetchProfileData = async () => {
  //   setDataLoading(true);
  //   try {
  //     const response = await fetch(`${API_URL}/profile/`, {
  //       headers: { Authorization: `Token ${token}` },
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setOrders(data.orders || []);
  //       setFavorites(data.favorites || []);
  //       setActivities(data.activities || []);
  //     }
  //   } catch (err) {
  //     console.error("Failed to fetch profile data:", err);
  //   } finally {
  //     setDataLoading(false);
  //   }
  // };

  const fetchProfileData = async () => {
    setDataLoading(true);
    try {
      const response = await api.getProfile(token!);
      setOrders(response.orders || []);
      setFavorites(response.favorites || []);
      setActivities(response.activities || []);
    } catch (err) {
      console.error("Failed to fetch profile data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSaveName = async () => {
    // Исправление ошибки: проверка на token и nameDraft
    if (!nameDraft.trim() || !token) return;
    setIsSaving(true);
    try {
      await fetch(`${API_URL}/profile/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ first_name: nameDraft.trim() }),
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    if (!token) return;
    try {
      await fetch(`${API_URL}/favorites/${favoriteId}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });
      setFavorites(favorites.filter((f) => f.id !== favoriteId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="profile-page">
        <div className="container py-5">
          <div className="mx-auto" style={{ maxWidth: "800px" }}>
            <div className="skeleton mb-4" style={{ height: "160px" }} />
            <div className="skeleton" style={{ height: "300px" }} />
          </div>
        </div>
      </div>
    );
  }

  const totalSpent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <div className="profile-page">
      <div className="container py-5">
        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          {/* Header */}
          <section className="profile-header-card">
            <div className="profile-cover" />
            <div className="profile-info-section">
              <div className="d-flex flex-column flex-sm-row align-items-sm-end gap-3">
                <UserAvatar name={user?.name || "Гость"} size="lg" />
                <div className="flex-grow-1 min-w-0">
                  {isEditing ? (
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <input
                        type="text"
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        className="form-control form-control-sm fw-bold fs-5"
                        style={{ maxWidth: "200px" }}
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={isSaving}
                        className="btn btn-success btn-sm p-1"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="btn btn-outline-secondary btn-sm p-1"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h1 className="h4 fw-bold mb-0 text-truncate">
                        {user.name}
                      </h1>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-link btn-sm p-0 text-muted"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                  <div className="small text-muted d-flex align-items-center gap-1">
                    <Mail size={14} /> {user.email}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
                >
                  <LogOut size={16} /> Выйти
                </button>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-4">
              <div className="stat-box">
                <div className="stat-label">
                  <Package size={16} className="text-primary" /> Заказов
                </div>
                <div className="stat-value">{orders.length}</div>
              </div>
            </div>
            <div className="col-6 col-md-4">
              <div className="stat-box">
                <div className="stat-label">
                  <ShoppingBag size={16} className="text-primary" /> Потрачено
                </div>
                <div className="stat-value text-primary">${totalSpent}</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="stat-box">
                <div className="stat-label">
                  <Heart size={16} className="text-primary" /> Избранное
                </div>
                <div className="stat-value">{favorites.length}</div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <section className="profile-tabs-card">
            <div className="tabs-nav">
              {(["orders", "favorites", "activity"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                >
                  {tab === "orders"
                    ? "Заказы"
                    : tab === "favorites"
                      ? "Избранное"
                      : "Активность"}
                </button>
              ))}
            </div>

            <div className="p-4">
              {activeTab === "orders" && (
                <div className="orders-list">
                  {dataLoading ? (
                    <div className="skeleton" style={{ height: "100px" }} />
                  ) : orders.length === 0 ? (
                    <div className="text-center py-5">
                      <Package size={48} className="text-muted mb-2" />
                      <p className="text-muted">Заказов пока нет</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <span className="small text-muted">
                            <Calendar size={14} />{" "}
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                          <div className="d-flex align-items-center gap-3">
                            <span
                              className={`badge-status ${statusLabels[order.status]?.class || "badge-pending"}`}
                            >
                              {statusLabels[order.status]?.label ||
                                "В обработке"}
                            </span>
                            <span className="fw-bold text-primary">
                              ${order.total_amount}
                            </span>
                          </div>
                        </div>
                        {/* Внутри activeTab === "orders" -> order.items.map */}
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="order-item p-3 d-flex flex-wrap align-items-center gap-3"
                          >
                            {/* Картинка тура */}
                            <img
                              src={item.tour.image || ""}
                              alt="Tour"
                              className="order-item-img"
                            />

                            {/* Информация о туре */}
                            <div className="flex-grow-1 min-w-0">
                              <div className="small fw-bold text-truncate">
                                {item.tour.title}
                              </div>
                              <div className="x-small text-muted d-flex gap-2">
                                <span>
                                  <MapPin size={12} /> {item.tour.location}
                                </span>
                                <span>{item.people_count} чел.</span>
                              </div>
                            </div>

                            {/* Цена и Кнопка */}
                            <div className="order-item-actions">
                              <span className="price-tag mb-1">
                                ${item.unit_price}
                              </span>
                              <button
                                onClick={() =>
                                  setReviewingTour({
                                    id: item.tour.id,
                                    title: item.tour.title,
                                  })
                                }
                                className="btn-review-responsive"
                              >
                                <MessageSquarePlus size={14} className="me-1" />{" "}
                                Оставить отзыв
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "favorites" && (
                <div className="row g-3">
                  {favorites.length === 0 ? (
                    <div className="text-center py-5 w-100">
                      <Heart size={48} className="text-muted mb-2" />
                      <p className="text-muted">Список пуст</p>
                    </div>
                  ) : (
                    favorites.map((fav) => (
                      <div key={fav.id} className="col-12 col-md-6">
                        <div className="favorite-card">
                          <div className="position-relative">
                            <img
                              src={fav.tour.image}
                              className="w-100"
                              style={{ height: "120px", objectFit: "cover" }}
                              alt=""
                            />
                            <button
                              onClick={() => handleRemoveFavorite(fav.id)}
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="p-3">
                            <div className="fw-bold text-truncate">
                              {fav.tour.title}
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <span className="small text-muted">
                                {fav.tour.location}
                              </span>
                              <span className="fw-bold text-primary">
                                ${fav.tour.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "activity" && (
                <div className="d-flex flex-column gap-2">
                  {activities.length === 0 ? (
                    <div className="text-center py-5">
                      <MessageSquare size={48} className="text-muted mb-2" />
                      <p className="text-muted">Активности нет</p>
                    </div>
                  ) : (
                    activities.map((act) => (
                      <div key={act.id} className="activity-item">
                        <div className="small fw-bold text-primary">
                          {act.activity_type}
                        </div>
                        <div className="small">{act.topic?.title}</div>
                        <div className="x-small text-muted text-end">
                          {new Date(act.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      {/* Modal для отзыва */}
      {reviewingTour && (
        <div className="modal-overlay">
          <div className="review-modal-card">
            <h3 className="h5 fw-bold mb-1">Ваш отзыв</h3>
            <p className="small text-muted mb-4">
              О туре: {reviewingTour.title}
            </p>

            <div className="mb-4 text-center">
              <div className="small text-muted mb-2">Оценка</div>
              <div className="d-flex justify-content-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    onClick={() => setReviewRating(star)}
                    className={
                      star <= reviewRating
                        ? "text-warning fill-warning"
                        : "text-muted opacity-25"
                    }
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="topic-label">Текст отзыва</label>
              <textarea
                className="topic-textarea"
                rows={4}
                placeholder="Расскажите о ваших впечатлениях..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={() => setReviewingTour(null)}
                className="btn btn-outline-secondary flex-grow-1"
              >
                Отмена
              </button>
              <button
                onClick={handleSendReview}
                disabled={!reviewText.trim()}
                className="btn btn-emerald-publish flex-grow-1"
              >
                Опубликовать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
