import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Headphones, Award } from "lucide-react";
import DestinationSlider from "../components/DestinationSlider";
import TourCard from "../components/TourCard";
import Newsletter from "../components/Newsletter";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

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
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80"
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
          <div
            ref={heroRef.ref}
            className={`max-w-2xl transition-all duration-1000 ${heroRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              Лучшее туристическое агентство 2026
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Откройте мир
              <br />
              <span className="text-emerald-400">приключений</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Более 500 уникальных туров по всему миру. Индивидуальные маршруты,
              лучшие отели и незабываемые впечатления ждут вас.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
              >
                Выбрать тур
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-muted transition-colors"
              >
                Узнать больше
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-12">
              <div>
                <div className="text-2xl font-bold text-emerald-400">500+</div>
                <div className="text-sm text-muted-foreground">Туров</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <div className="text-2xl font-bold text-emerald-400">50K+</div>
                <div className="text-sm text-muted-foreground">Клиентов</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <div className="text-2xl font-bold text-emerald-400">4.9</div>
                <div className="text-sm text-muted-foreground">Рейтинг</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Slider */}
      <DestinationSlider />

      {/* Hot Tours */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm font-medium mb-3">
                <Star className="w-3.5 h-3.5 fill-red-400" />
                Горячие предложения
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold">Горячие туры</h2>
            </div>
            <Link
              to="/tours"
              className="hidden md:flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Все туры
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl h-[420px] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotTours.map((tour, i) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  index={i}
                  isVisible={true}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Tours */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                Популярные туры
              </h2>
              <p className="text-muted-foreground">
                Туры с высшим рейтингом от наших клиентов
              </p>
            </div>
            <Link
              to="/tours"
              className="hidden md:flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Все туры
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl h-[400px] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularTours.map((tour, i) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  index={i}
                  isVisible={true}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={whyRef.ref} className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div
            className={`text-center mb-12 transition-all duration-700 ${whyRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">
              Почему выбирают VOYAGER
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Мы делаем всё, чтобы ваше путешествие было идеальным
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Надежность",
                desc: "Работаем только с проверенными партнерами. Ваши деньги в безопасности.",
              },
              {
                icon: Headphones,
                title: "Поддержка 24/7",
                desc: "Наша команда всегда на связи, где бы вы ни находились.",
              },
              {
                icon: Award,
                title: "Лучшие цены",
                desc: "Гарантируем лучшие цены или вернем разницу.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`text-center p-8 rounded-2xl bg-card border border-border hover:border-emerald-500/20 transition-all duration-700 ${whyRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 mb-5">
                  <item.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section ref={blogRef.ref} className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div
            className={`flex items-end justify-between mb-10 transition-all duration-700 ${blogRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                Блог путешественников
              </h2>
              <p className="text-muted-foreground">
                Истории, советы и вдохновение от экспертов
              </p>
            </div>
            <Link
              to="/blog"
              className="hidden md:flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Все статьи
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl h-[350px] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post, i) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className={`group block bg-card rounded-xl overflow-hidden border border-border hover:border-emerald-500/20 transition-all duration-700 ${blogRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                      <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                        {post.category}
                      </span>
                      <span>{post.read_time} мин чтения</span>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author_avatar || ""}
                        alt={post.author}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-muted-foreground">
                        {post.author}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section ref={reviewsRef.ref} className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div
            className={`text-center mb-12 transition-all duration-700 ${reviewsRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">
              Отзывы наших клиентов
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Узнайте, что говорят о нас путешественники
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl h-[200px] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((review, i) => (
                <div
                  key={review.id}
                  className={`bg-card rounded-xl p-6 border border-border transition-all duration-700 ${reviewsRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${j < review.rating ? "text-amber-400 fill-amber-400" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        review.avatar || "https://i.pravatar.cc/150?img=" + i
                      }
                      alt={review.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium">{review.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {review.tour?.title || "Тур"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
