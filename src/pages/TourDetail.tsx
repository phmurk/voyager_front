import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  Users,
  Check,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Gauge,
  MessageSquare,
  Sun,
  Languages,
} from "lucide-react";
import { api } from "../lib/api";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import "./TourDetail.css";

const formatReviewDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

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
  return colors[Math.abs(hash % colors.length)];
};

const UserAvatar = ({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md";
}) => {
  const safeName = name || "G";
  return (
    <div
      className={`user-avatar-circle size-${size}`}
      style={{
        backgroundColor: getUserColor(safeName),
        width: size === "md" ? "40px" : "32px",
        height: size === "md" ? "40px" : "32px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: size === "md" ? "1rem" : "0.8rem",
      }}
    >
      {safeName.charAt(0).toUpperCase()}
    </div>
  );
};

export default function TourDetail() {
  const { user, token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [tour, setTour] = useState<any | null>(null);
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [peopleCount, setPeopleCount] = useState(2);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "overview" | "itinerary" | "reviews" | "gallery"
  >("overview");

  useEffect(() => {
    async function fetchTour() {
      if (!id) return;
      try {
        const tourData = await api.getTourDetail(id);
        setTour(tourData);
        if (tourData.itinerary_days) setItinerary(tourData.itinerary_days);
      } catch (err) {
        console.error("Failed to fetch tour:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTour();
  }, [id]);

  useEffect(() => {
    if (user && tour && token) {
      api.getFavorites(token).then((favs) => {
        const isFav = favs.some((f: any) => f.tour.id === tour.id);
        setIsFavorite(isFav);
      });
    }
  }, [tour, user, token]);

  const handleToggleFavorite = async () => {
    if (!token) {
      alert("Войдите, чтобы добавлять в избранное");
      navigate("/auth");
      return;
    }
    try {
      const response = await api.addFavorite(tour.id, token);
      if (response.status === "removed") {
        setIsFavorite(false);
      } else {
        setIsFavorite(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = () => {
    if (!tour || !selectedDate) return;
    const price = Number(tour.price) || 0;
    const discount = Number(tour.discount) || 0;

    addItem({
      id: crypto.randomUUID(),
      tourId: tour.id,
      title: tour.title,
      price: price,
      discount: discount,
      image: tour.image,
      people: Number(peopleCount),
      travelDate: selectedDate,
    });
    setShowBookingModal(false);
    navigate("/cart");
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const discountedPrice = tour
    ? tour.discount > 0
      ? Math.round(tour.price * (1 - tour.discount / 100))
      : tour.price
    : 0;

  const totalPrice = discountedPrice * peopleCount;
  const allImages = tour
    ? [tour.image, ...(Array.isArray(tour.gallery) ? tour.gallery : [])].filter(
        Boolean,
      )
    : [];

  if (loading) {
    return (
      <div className="tour-detail-page">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8">
              <div
                className="skeleton mb-4"
                style={{ height: "400px", borderRadius: "1rem" }}
              />
              <div
                className="skeleton mb-2"
                style={{ height: "40px", width: "60%" }}
              />
              <div className="skeleton" style={{ height: "100px" }} />
            </div>
            <div className="col-lg-4">
              <div
                className="skeleton"
                style={{ height: "300px", borderRadius: "1rem" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) return <div className="text-center py-5">Тур не найден</div>;

  return (
    <div className="tour-detail-page">
      <div className="container py-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/tours")}
          className="btn btn-link text-muted p-0 mb-4 text-decoration-none d-flex align-items-center gap-2"
        >
          <ArrowLeft size={16} /> Назад к турам
        </button>

        {/* Hero Gallery */}
        <section className="tour-hero-gallery">
          <img
            src={allImages[currentImage] || tour.image}
            alt={tour.title}
            className="hero-main-img"
          />
          <div className="hero-overlay">
            <div className="d-flex gap-2 mb-3">
              {tour.isHot && (
                <span className="badge bg-danger">Горячий тур</span>
              )}
              {tour.discount > 0 && (
                <span className="badge bg-success mt-3">-{tour.discount}%</span>
              )}
            </div>
            <h1 className="text-white fw-bold mb-2">{tour.title}</h1>
            <div className="d-flex flex-wrap gap-4 text-white-50 small">
              <span className="d-flex align-items-center gap-1">
                <MapPin size={14} /> {tour.location}
              </span>
              <span className="d-flex align-items-center gap-1">
                <Clock size={14} /> {tour.duration} дней
              </span>
              <span className="d-flex align-items-center gap-1">
                <Star size={14} className="text-warning fill-warning" />{" "}
                {tour.rating}
              </span>
            </div>
          </div>

          {allImages.length > 1 && (
            <>
              <button
                className="gallery-nav-btn prev"
                onClick={() =>
                  setCurrentImage((p) => (p > 0 ? p - 1 : allImages.length - 1))
                }
              >
                <ChevronLeft />
              </button>
              <button
                className="gallery-nav-btn next"
                onClick={() =>
                  setCurrentImage((p) => (p < allImages.length - 1 ? p + 1 : 0))
                }
              >
                <ChevronRight />
              </button>
              <div className="thumbnail-strip d-none d-md-flex">
                {allImages.slice(0, 5).map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`thumb-btn ${i === currentImage ? "active" : ""}`}
                  >
                    <img
                      src={img}
                      className="w-100 h-100 object-fit-cover"
                      alt="preview"
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        <div className="row g-5">
          {/* Main Content */}
          <div className="col-lg-8">
            <div className="row g-3 mb-5">
              {[
                {
                  icon: Users,
                  label: "Группа",
                  value: tour.group_size || `до ${tour.max_people} чел.`,
                },
                {
                  icon: Gauge,
                  label: "Сложность",
                  value: tour.difficulty || "Легкий",
                },
                {
                  icon: Sun,
                  label: "Сезон",
                  value: tour.best_season || "Круглый год",
                },
                {
                  icon: Languages,
                  label: "Язык",
                  value: tour.guide_language || "Русский",
                },
              ].map((item) => (
                <div key={item.label} className="col-6 col-md-3">
                  <div className="info-box">
                    <item.icon size={20} className="text-primary mb-2" />
                    <div className="x-small text-muted mb-1">{item.label}</div>
                    <div className="small fw-bold">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <nav className="detail-tabs">
              {[
                { key: "overview", label: "Обзор" },
                { key: "itinerary", label: "Программа" },
                { key: "reviews", label: "Отзывы" },
                { key: "gallery", label: "Галерея" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`tab-trigger ${activeTab === tab.key ? "active" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="tab-content">
              {activeTab === "overview" && (
                <div className="animate-fadeIn">
                  <h2 className="h4 fw-bold mb-3">О туре</h2>
                  <p className="text-muted mb-5">{tour.description}</p>

                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="info-box text-start h-100">
                        <h3 className="h6 fw-bold mb-3 d-flex align-items-center gap-2">
                          <Check className="text-success" /> Включено
                        </h3>
                        <ul className="list-unstyled small text-muted mb-0">
                          {tour.included?.map((item: string) => (
                            <li key={item} className="mb-2">
                              ✓ {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="info-box text-start h-100">
                        <h3 className="h6 fw-bold mb-3 d-flex align-items-center gap-2">
                          <X className="text-danger" /> Не включено
                        </h3>
                        <ul className="list-unstyled small text-muted mb-0">
                          {tour.not_included?.map((item: string) => (
                            <li key={item} className="mb-2">
                              ✕ {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "itinerary" && (
                <div className="animate-fadeIn">
                  {itinerary.length > 0 ? (
                    itinerary.map((day: any) => (
                      <div key={day.id} className="itinerary-day">
                        <div className="day-number">{day.day_number}</div>
                        <div>
                          <h3 className="h6 fw-bold mb-1">{day.title}</h3>
                          <p className="small text-muted mb-0">
                            {day.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">
                      Программа тура скоро будет добавлена.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="animate-fadeIn">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h2 className="h4 fw-bold mb-0">Отзывы путешественников</h2>
                    <span
                      className="badge bg-emerald-soft text-primary px-3 py-2"
                      style={{
                        backgroundColor: "hsla(var(--primary) / 0.1)",
                        color: "hsl(var(--primary))",
                        borderRadius: "10px",
                      }}
                    >
                      Всего: {tour.reviews?.length || 0}
                    </span>
                  </div>

                  {tour.reviews && tour.reviews.length > 0 ? (
                    <div className="row g-4">
                      {/* Сортируем отзывы: самые новые (по ID или дате) в начало */}
                      {[...tour.reviews].reverse().map((review: any) => (
                        <div key={review.id} className="col-12">
                          <div
                            className="info-box text-start p-4"
                            style={{
                              backgroundColor: "hsla(var(--foreground) / 0.02)",
                              borderRadius: "20px",
                              border: "1px solid hsla(var(--border) / 0.5)",
                            }}
                          >
                            <div className="d-flex align-items-start gap-3 mb-3">
                              {/* Наш компонент аватарок */}
                              <UserAvatar name={review.name} size="md" />

                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="fw-bold text-white">
                                    {review.name}
                                  </div>
                                  <div className="x-small text-muted">
                                    {/* Используем умную дату по полю created_at или date */}
                                    {formatReviewDate(
                                      review.created_at || review.date,
                                    )}
                                  </div>
                                </div>

                                <div className="d-flex gap-1 text-warning mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      fill={
                                        i < review.rating
                                          ? "currentColor"
                                          : "none"
                                      }
                                      className={
                                        i < review.rating ? "" : "opacity-25"
                                      }
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            <p
                              className="small text-muted mb-0"
                              style={{ lineHeight: "1.6", fontStyle: "italic" }}
                            >
                              "{review.text}"
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="text-center py-5 info-box"
                      style={{ borderRadius: "20px" }}
                    >
                      <MessageSquare
                        size={40}
                        className="text-muted mb-3 opacity-20"
                      />
                      <p className="text-muted mb-0">
                        Отзывов для этого тура пока нет.
                      </p>
                      <p className="small text-muted">
                        Вы можете оставить первый отзыв после поездки в своем
                        профиле.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "gallery" && (
                <div className="row g-3 animate-fadeIn">
                  {allImages.length > 0 ? (
                    allImages.map((img: string, i: number) => (
                      <div key={i} className="col-6 col-md-4">
                        <div className="rounded-3 overflow-hidden aspect-square border border-secondary shadow-sm">
                          <img
                            src={img}
                            className="w-100 h-100 object-fit-cover"
                            alt={`Gallery view ${i}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setCurrentImage(i);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">
                      Фотографии для этого тура появятся позже.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <aside className="booking-card">
              <div className="mb-4">
                {tour.discount > 0 && (
                  <div className="text-muted text-decoration-line-through small">
                    ${tour.price}
                  </div>
                )}
                <div className="d-flex align-items-baseline gap-2">
                  <span className="price-display">${discountedPrice}</span>
                  <span className="text-muted small">/чел.</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-4">
                  <label className="x-small fw-bold text-muted mb-2 d-block">
                    ДАТА ПОЕЗДКИ
                  </label>
                  <div className="position-relative">
                    <Calendar
                      size={16}
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-primary"
                      style={{ zIndex: 1 }}
                    />
                    <input
                      type="date"
                      value={selectedDate}
                      min={getMinDate()} // ОГРАНИЧЕНИЕ: только со следующего дня
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="x-small fw-bold text-muted mb-2 d-block">
                  КОЛИЧЕСТВО ЧЕЛОВЕК
                </label>
                <div className="d-flex align-items-center gap-3">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setPeopleCount((p) => Math.max(1, p - 1))}
                  >
                    -
                  </button>
                  <span className="fw-bold">{peopleCount}</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      setPeopleCount((p) =>
                        Math.min(tour.max_people || 10, p + 1),
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-3 border-top mb-4">
                <span className="fw-bold">Итого:</span>
                <span className="h4 fw-bold text-primary mb-0">
                  ${totalPrice}
                </span>
              </div>

              <button
                className="btn btn-primary w-100 py-3 rounded-3 fw-bold mb-3"
                onClick={() => setShowBookingModal(true)}
                disabled={!selectedDate}
              >
                Забронировать
              </button>

              <div className="d-flex gap-2">
                <button
                  className={`btn flex-grow-1 ${isFavorite ? "btn-danger" : "btn-outline-secondary"}`}
                  onClick={handleToggleFavorite}
                >
                  <Heart
                    size={16}
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                </button>
                {/* <button className="btn btn-outline-secondary flex-grow-1">
                  <Share2 size={16} />
                </button> */}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay">
          <div
            className="booking-card"
            style={{ maxWidth: "400px", width: "100%" }}
          >
            <h3 className="h5 fw-bold mb-4">Подтверждение</h3>
            <div className="small text-muted mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span>Тур:</span>{" "}
                <span className="text-white">{tour.title}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Дата:</span>{" "}
                <span className="text-white">{selectedDate}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Людей:</span>{" "}
                <span className="text-white">{peopleCount}</span>
              </div>
            </div>
            <div className="d-flex gap-3">
              <button
                className="btn btn-outline-secondary flex-grow-1"
                onClick={() => setShowBookingModal(false)}
              >
                Отмена
              </button>
              <button
                className="btn btn-primary flex-grow-1"
                onClick={handleAddToCart}
              >
                В корзину
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
