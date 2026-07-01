import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { api } from "../lib/api";
import TourCard from "../components/TourCard";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import type { Tour } from "../types";
import "./Tours.css";

const categories = ["Все", "Пляжный", "Экскурсионный", "Горный"];
const countries = [
  "Все",
  "Индонезия",
  "Франция",
  "Япония",
  "ОАЭ",
  "Мальдивы",
  "США",
  "Греция",
  "Швейцария",
];
// const difficulties = ["Все", "Легкий", "Средний", "Сложный"];
const sortOptions = [
  { label: "По популярности", value: "popular" },
  { label: "Цена: по возрастанию", value: "price_asc" },
  { label: "Цена: по убыванию", value: "price_desc" },
  { label: "Высокий рейтинг", value: "rating" },
];

export default function Tours() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Инициализация фильтров
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "Все",
    country: searchParams.get("country") || "Все",
    difficulty: "Все",
    priceMin: "",
    priceMax: "",
    visaRequired: false,
    insuranceIncluded: false,
    freeCancellation: false,
    instantConfirmation: false,
    sort: "popular",
  });

  const { ref, isVisible } = useScrollAnimation(0.1);

  useEffect(() => {
    async function fetchTours() {
      try {
        const data = await api.getTours();
        const tourList = Array.isArray(data) ? data : data.results || [];
        setTours(tourList);
      } catch (err) {
        console.error("Failed to fetch tours:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  // ОСНОВНАЯ ЛОГИКА ФИЛЬТРАЦИИ И ПОИСКА
  const filteredTours = useMemo(() => {
    let result = [...tours];

    // 1. Умный поиск (название, страна, город, отель)
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)),
      );
    }

    // 2. Фильтр по категории
    if (filters.category !== "Все") {
      result = result.filter((t) => t.category === filters.category);
    }

    // 3. Фильтр по стране
    if (filters.country !== "Все") {
      result = result.filter((t) => t.country === filters.country);
    }

    // 4. Фильтр по сложности
    if (filters.difficulty !== "Все") {
      result = result.filter((t) => t.difficulty === filters.difficulty);
    }

    // 5. Фильтр по цене
    if (filters.priceMin) {
      result = result.filter((t) => t.price >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter((t) => t.price <= Number(filters.priceMax));
    }

    // 6. Дополнительные опции
    if (filters.visaRequired) result = result.filter((t) => t.visa_required);
    if (filters.insuranceIncluded)
      result = result.filter((t) => t.insurance_included);
    if (filters.freeCancellation)
      result = result.filter((t) => t.free_cancellation);
    if (filters.instantConfirmation)
      result = result.filter((t) => t.instant_confirmation);

    // 7. Сортировка
    switch (filters.sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0));
    }

    return result;
  }, [tours, searchQuery, filters]);

  const activeFilterCount = [
    filters.category !== "Все",
    filters.country !== "Все",
    filters.difficulty !== "Все",
    filters.priceMin !== "",
    filters.priceMax !== "",
    filters.visaRequired,
    filters.insuranceIncluded,
    filters.freeCancellation,
    filters.instantConfirmation,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setFilters({
      category: "Все",
      country: "Все",
      difficulty: "Все",
      priceMin: "",
      priceMax: "",
      visaRequired: false,
      insuranceIncluded: false,
      freeCancellation: false,
      instantConfirmation: false,
      sort: "popular",
    });
    setSearchQuery("");
    setSearchParams({});
  };

  return (
    <div className="tours-page">
      {/* Hero Header */}
      <section className="tours-hero">
        <div className="container">
          <div className="scroll-reveal visible">
            <span className="tours-subtitle">Ваше следующее приключение</span>
            <h1 className="fw-bold mb-3 fs-1">КАТАЛОГ ТУРОВ</h1>
            <div className="title-separator ms-0"></div>
          </div>
        </div>
      </section>

      {/* Control Bar (Search + Main Filters) */}
      <section ref={ref} className="tours-filter-section">
        <div className="container">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-lg-5">
              <div className="search-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Страна, город или название тура..."
                  className="search-input-premium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="search-clear-btn"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="col-6 col-lg-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`filter-toggle-btn-premium w-100 ${showFilters ? "active" : ""}`}
              >
                <SlidersHorizontal size={18} />
                <span>Параметры фильтрации</span>
                {activeFilterCount > 0 && (
                  <span className="filter-badge-premium">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Sort Select */}
            <div className="col-6 col-lg-3">
              <div className="sort-select-wrapper">
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, sort: e.target.value }))
                  }
                  className="sort-select-premium"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="sort-chevron" size={16} />
              </div>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="filters-expanded-panel-premium animate-fadeIn">
              <div className="row g-4">
                <div className="col-12">
                  <label className="filter-label-premium">Тип отдыха</label>
                  <div className="category-tags-row">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          setFilters((f) => ({ ...f, category: cat }))
                        }
                        className={`category-tag-premium ${filters.category === cat ? "active" : ""}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <label className="filter-label-premium">Направление</label>
                  <select
                    value={filters.country}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, country: e.target.value }))
                    }
                    className="filter-select-premium"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* <div className="col-12 col-md-4">
                  <label className="filter-label-premium">Сложность</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, difficulty: e.target.value }))
                    }
                    className="filter-select-premium"
                  >
                    {difficulties.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div> */}

                <div className="col-12 col-md-4">
                  <label className="filter-label-premium">Бюджет ($)</label>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      placeholder="От"
                      value={filters.priceMin}
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, priceMin: e.target.value }))
                      }
                      className="filter-input-premium"
                    />
                    <input
                      type="number"
                      placeholder="До"
                      value={filters.priceMax}
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, priceMax: e.target.value }))
                      }
                      className="filter-input-premium"
                    />
                  </div>
                </div>
              </div>

              {/* Feature Chips */}
              <div className="features-row-premium">
                {/* {[
                  { key: "visaRequired", label: "Виза не нужна", icon: Globe },
                  {
                    key: "insuranceIncluded",
                    label: "Страховка",
                    icon: Shield,
                  },
                  { key: "freeCancellation", label: "Отмена", icon: Ban },
                  { key: "instantConfirmation", label: "Мгновенно", icon: Zap },
                ].map((feat) => (
                  <button
                    key={feat.key}
                    onClick={() =>
                      setFilters((f: any) => ({
                        ...f,
                        [feat.key]: !f[feat.key],
                      }))
                    }
                    className={`feature-chip-premium ${filters[feat.key as keyof typeof filters] ? "active" : ""}`}
                  >
                    <feat.icon size={14} />
                    {feat.label}
                  </button>
                ))} */}

                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="reset-filters-btn">
                    Сбросить всё
                  </button>
                )}
              </div>
              {/* <button
                onClick={() => setShowFilters(false)}
                className="btn btn-emerald w-100 mt-4 d-lg-none py-3"
                style={{ borderRadius: "12px" }}
              >
                Показать туры
              </button> */}
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="py-5">
        <div className="container">
          <div className="results-info mb-4">
            Найдено туров:{" "}
            <span className="highlight">{filteredTours.length}</span>
          </div>

          <div className="row g-4">
            {loading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="col-12 col-md-6 col-lg-3">
                  <div className="skeleton-card" />
                </div>
              ))
            ) : filteredTours.length === 0 ? (
              <div className="text-center py-5 col-12">
                <Search size={48} className="text-muted mb-3" />
                <h3 className="fw-bold h4">Ничего не найдено</h3>
                <p className="text-muted">
                  Попробуйте изменить параметры поиска или сбросить фильтры
                </p>
                <button onClick={resetFilters} className="btn btn-emerald mt-3">
                  Сбросить поиск
                </button>
              </div>
            ) : (
              filteredTours.map((tour, i) => (
                <div key={tour.id} className="col-12 col-md-6 col-lg-3">
                  <TourCard tour={tour} index={i} isVisible={isVisible} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
