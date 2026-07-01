import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Users, Globe, Award } from "lucide-react";
import DestinationSlider from "../components/DestinationSlider";
import TourCard from "../components/TourCard";
import Newsletter from "../components/Newsletter";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import "./Home.css"; // Импорт стилей

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
  size = "sm",
}: {
  name: string;
  size?: "sm" | "md";
}) => {
  const safeName = name || "U";
  const sizePx = size === "sm" ? "24px" : "40px";
  const fontSize = size === "sm" ? "0.7rem" : "1rem";

  return (
    <div
      style={{
        backgroundColor: getUserColor(safeName),
        width: sizePx,
        height: sizePx,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: fontSize,
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {safeName.charAt(0).toUpperCase()}
    </div>
  );
};

export default function Home() {
  const [hotTours, setHotTours] = useState<any[]>([]);
  const [popularTours, setPopularTours] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useScrollAnimation(0.1);
  const whyRef = useScrollAnimation(0.1);
  const blogRef = useScrollAnimation(0.1);
  const reviewsRef = useScrollAnimation(0.1);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    async function fetchData() {
      try {
        const [hotRes, popularRes, blogRes, reviewsRes] = await Promise.all([
          fetch(`${API_URL}/tours/hot/`),
          fetch(`${API_URL}/tours/?ordering=-rating`),
          fetch(`${API_URL}/blog/?ordering=-created_at`),
          fetch(`${API_URL}/reviews/`),
        ]);

        if (hotRes.ok) {
          const data = await hotRes.json();
          setHotTours(Array.isArray(data) ? data : data.results || []);
        }

        if (popularRes.ok) {
          const data = await popularRes.json();
          setPopularTours(
            Array.isArray(data)
              ? data.slice(0, 4)
              : data.results?.slice(0, 4) || [],
          );
        }

        if (blogRes.ok) {
          const data = await blogRes.json();
          setBlogPosts(
            Array.isArray(data)
              ? data.slice(0, 3)
              : data.results?.slice(0, 3) || [],
          );
        }

        if (reviewsRes.ok) {
          const data = await reviewsRes.json();
          setReviews(
            Array.isArray(data)
              ? data.slice(0, 6)
              : data.results?.slice(0, 6) || [],
          );
        }
      } catch (err) {
        console.error("Failed to fetch home data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [API_URL]);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg-container">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80"
            alt="Travel"
            className="hero-img"
          />
          <div className="hero-gradient-overlay" />
          <div className="hero-bottom-fade" />
        </div>

        <div className="container relative z-1">
          <div
            ref={heroRef.ref}
            className={`scroll-reveal ${heroRef.isVisible ? "visible" : ""}`}
            style={{ transitionDuration: "1s" }}
          >
            <div className="hero-badge">
              <Award size={16} />
              Лучшее туристическое агентство 2024
            </div>

            <h1 className="hero-title">
              Откройте мир
              <br />
              <span
                className="text-emerald-400"
                style={{ color: "hsl(var(--primary))" }}
              >
                приключений
              </span>
            </h1>

            <p className="hero-description">
              Более 500 уникальных туров по всему миру. Индивидуальные маршруты,
              лучшие отели и незабываемые впечатления ждут вас.
            </p>

            <div className="d-flex flex-wrap gap-3">
              <Link to="/tours" className="btn btn-emerald px-4 py-3 rounded-3">
                Выбрать тур <ArrowRight size={16} className="ms-1" />
              </Link>
              <Link
                to="/about"
                className="btn btn-outline-secondary px-4 py-3 rounded-3 text-white border-secondary"
              >
                Узнать больше
              </Link>
            </div>

            <div className="stats-container">
              <div>
                <div className="stats-item-value">500+</div>
                <div className="small text-muted">Туров</div>
              </div>
              <div className="stats-divider" />
              <div>
                <div className="stats-item-value">50K+</div>
                <div className="small text-muted">Клиентов</div>
              </div>
              <div className="stats-divider" />
              <div>
                <div className="stats-item-value">4.9</div>
                <div className="small text-muted">Рейтинг</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DestinationSlider />

      {/* Hot Tours */}
      <section className="section-padding bg-secondary-soft">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between mb-5">
            <div>
              <div className="badge-hot-offers">
                <Star size={14} className="fill-current" />
                Горячие предложения
              </div>
              <h2 className="fw-bold fs-2">Горячие туры</h2>
            </div>
            <Link
              to="/tours"
              className="d-none d-md-flex align-items-center gap-2 text-decoration-none"
              style={{ color: "hsl(var(--primary))" }}
            >
              Все туры <ArrowRight size={16} />
            </Link>
          </div>

          <div className="row g-4">
            {loading
              ? [1, 2, 3].map((i) => (
                  <div key={i} className="col-12 col-md-6 col-lg-4">
                    <div className="skeleton-box" style={{ height: "420px" }} />
                  </div>
                ))
              : hotTours.map((tour, i) => (
                  <div key={tour.id} className="col-12 col-md-6 col-lg-4">
                    <TourCard tour={tour} index={i} isVisible={true} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Popular Tours */}
      <section className="section-padding">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between mb-5">
            <div>
              <h2 className="fw-bold fs-2 mb-2">Популярные туры</h2>
              <p className="text-muted mb-0">
                Туры с высшим рейтингом от наших клиентов
              </p>
            </div>
            <Link
              to="/tours"
              className="d-none d-md-flex align-items-center gap-2 text-decoration-none"
              style={{ color: "hsl(var(--primary))" }}
            >
              Все туры <ArrowRight size={16} />
            </Link>
          </div>

          <div className="row g-4">
            {loading
              ? [1, 2, 3, 4].map((i) => (
                  <div key={i} className="col-12 col-md-6 col-lg-3">
                    <div className="skeleton-box" style={{ height: "400px" }} />
                  </div>
                ))
              : popularTours.map((tour, i) => (
                  <div key={tour.id} className="col-12 col-md-6 col-lg-3">
                    <TourCard tour={tour} index={i} isVisible={true} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us (Premium Version) */}
      <section ref={whyRef.ref} className="why-choose-premium">
        <div className="why-choose-overlay"></div>

        <div className="container position-relative z-1">
          <div
            className={`why-choose-header text-center scroll-reveal ${whyRef.isVisible ? "visible" : ""}`}
          >
            <span className="why-choose-subtitle">
              Более 10 лет опыта в организации путешествий
            </span>
            <h2 className="why-choose-title">Почему выбирают VOYAGER?</h2>
            <div className="title-separator"></div>
          </div>

          <div className="row g-4 justify-content-center mt-2">
            {[
              {
                icon: Award,
                title: "Лучшие цены",
                text: "Мы предлагаем конкурентные цены без скрытых комиссий",
              },
              {
                icon: Globe,
                title: "100+ направлений",
                text: "Туры на все континенты и по любым бюджетам",
              },
              {
                icon: Users,
                title: "Опытные гиды",
                text: "Профессионалы, влюбленные в свою работу",
              },
            ].map((reason, index) => (
              <div
                className={`col-12 col-md-6 col-lg-4 scroll-reveal ${whyRef.isVisible ? "visible" : ""}`}
                key={index}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="why-choose-card">
                  <div className="why-card-icon-wrapper">
                    <reason.icon size={32} />
                  </div>
                  <h3 className="why-card-title">{reason.title}</h3>
                  <p className="why-card-text">{reason.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section ref={blogRef.ref} className="section-padding">
        <div className="container">
          <div
            className={`d-flex align-items-end justify-content-between mb-5 scroll-reveal ${blogRef.isVisible ? "visible" : ""}`}
          >
            <div>
              <h2 className="fw-bold fs-2 mb-2">Блог путешественников</h2>
              <p className="text-muted mb-0">
                Истории, советы и вдохновение от экспертов
              </p>
            </div>
            <Link
              to="/blog"
              className="d-none d-md-flex align-items-center gap-2 text-decoration-none"
              style={{ color: "hsl(var(--primary))" }}
            >
              Все статьи <ArrowRight size={16} />
            </Link>
          </div>

          <div className="row g-4">
            {loading
              ? [1, 2, 3].map((i) => (
                  <div key={i} className="col-12 col-md-4">
                    <div className="skeleton-box" style={{ height: "350px" }} />
                  </div>
                ))
              : blogPosts.map((post, i) => (
                  <div key={post.id} className="col-12 col-md-4">
                    <Link
                      to={`/blog/${post.id}`}
                      className={`blog-card scroll-reveal ${blogRef.isVisible ? "visible" : ""}`}
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <div className="blog-card-img-wrapper">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="blog-card-img"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <span
                            className="badge bg-emerald-soft text-emerald"
                            style={{
                              backgroundColor: "hsla(166, 72%, 40%, 0.1)",
                              color: "hsl(var(--primary))",
                            }}
                          >
                            {post.category}
                          </span>
                          <span className="small text-muted">
                            {post.read_time} мин чтения
                          </span>
                        </div>
                        <h3 className="h6 fw-bold mb-2 blog-title-hover">
                          {post.title}
                        </h3>
                        <p className="small text-muted mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="d-flex align-items-center gap-2">
                          <UserAvatar name={post.author} size="sm" />
                          <span className="small text-muted">
                            {post.author}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section
        ref={reviewsRef.ref}
        className="section-padding bg-secondary-soft"
      >
        <div className="container">
          <div
            className={`text-center mb-5 scroll-reveal ${reviewsRef.isVisible ? "visible" : ""}`}
          >
            <h2 className="fw-bold fs-2 mb-3 text-uppercase">
              Отзывы наших клиентов
            </h2>
            <div className="title-separator mb-3"></div>
            <p className="text-muted mx-auto" style={{ maxWidth: "450px" }}>
              Узнайте, что говорят о нас путешественники
            </p>
          </div>

          <div className="row g-4">
            {loading
              ? [1, 2, 3].map((i) => (
                  <div key={i} className="col-12 col-md-4">
                    <div
                      className="skeleton-box"
                      style={{ height: "200px", borderRadius: "20px" }}
                    />
                  </div>
                ))
              : // Берем последние 6 отзывов. Сортировка по дате уже должна быть на бэкенде.
                reviews.slice(0, 6).map((review, i) => (
                  <div
                    key={review.id || i}
                    className="col-12 col-md-6 col-lg-4"
                  >
                    <div
                      className={`review-card h-100 scroll-reveal ${reviewsRef.isVisible ? "visible" : ""}`}
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <div className="d-flex gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            size={16}
                            className={
                              j < review.rating
                                ? "text-warning fill-warning"
                                : "text-muted opacity-25"
                            }
                          />
                        ))}
                      </div>

                      <p
                        className="small text-muted mb-4 italic"
                        style={{ lineHeight: "1.6" }}
                      >
                        "{review.text}"
                      </p>

                      <div className="d-flex align-items-center gap-3 mt-auto">
                        {/* ЗАМЕНА: вместо <img> теперь наш UserAvatar */}
                        <UserAvatar name={review.name} />

                        <div>
                          <div className="small fw-bold text-white">
                            {review.name}
                          </div>
                          <div
                            className="x-small text-primary"
                            style={{
                              fontSize: "0.75rem",
                              color: "hsl(var(--primary))",
                            }}
                          >
                            {review.tour_title || "Интересное путешествие"}
                          </div>
                        </div>

                        <div
                          className="ms-auto x-small text-muted"
                          style={{ fontSize: "0.65rem" }}
                        >
                          {review.date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
