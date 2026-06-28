import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, Shield, Ban, Globe, Zap } from 'lucide-react';
import { api } from '../lib/api';
import TourCard from '../components/TourCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const categories = ['Все', 'Пляжный', 'Экскурсионный', 'Горный', 'Городской', 'Приключения'];
const countries = ['Все', 'Индонезия', 'Франция', 'Япония', 'ОАЭ', 'Мальдивы', 'США', 'Греция', 'Швейцария'];
const durations = ['Все', 'до 5 дней', '5-7 дней', '7-10 дней', '10+ дней'];
const difficulties = ['Все', 'Легкий', 'Средний', 'Сложный'];
const seasons = ['Все', 'Круглый год', 'Весна', 'Лето', 'Осень', 'Зима'];
const sortOptions = [
  { label: 'По популярности', value: 'popular' },
  { label: 'Цена: по возрастанию', value: 'price_asc' },
  { label: 'Цена: по убыванию', value: 'price_desc' },
  { label: 'Рейтинг', value: 'rating' },
];

export default function Tours() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'Все',
    country: searchParams.get('country') || 'Все',
    duration: 'Все',
    difficulty: 'Все',
    season: 'Все',
    priceMin: '',
    priceMax: '',
    visaRequired: false,
    insuranceIncluded: false,
    freeCancellation: false,
    instantConfirmation: false,
    sort: 'popular',
  });

  const { ref, isVisible } = useScrollAnimation(0.1);

  useEffect(() => {
    async function fetchTours() {
      try {
        const data = await api.getTours();
        const tourList = Array.isArray(data) ? data : data.results || [];
        setTours(tourList);
      } catch (err) {
        console.error('[v0] Failed to fetch tours:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  const filteredTours = useMemo(() => {
    let result = [...tours];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.highlights?.some((h) => h.toLowerCase().includes(q)) ||
          t.amenities?.some((a) => a.toLowerCase().includes(q))
      );
    }

    if (filters.category !== 'Все') {
      result = result.filter((t) => t.category === filters.category);
    }
    if (filters.country !== 'Все') {
      result = result.filter((t) => t.country === filters.country);
    }
    if (filters.duration !== 'Все') {
      if (filters.duration === 'до 5 дней') result = result.filter((t) => t.duration <= 5);
      else if (filters.duration === '5-7 дней') result = result.filter((t) => t.duration >= 5 && t.duration <= 7);
      else if (filters.duration === '7-10 дней') result = result.filter((t) => t.duration >= 7 && t.duration <= 10);
      else if (filters.duration === '10+ дней') result = result.filter((t) => t.duration > 10);
    }
    if (filters.difficulty !== 'Все') {
      result = result.filter((t) => t.difficulty === filters.difficulty);
    }
    if (filters.season !== 'Все') {
      result = result.filter((t) => t.bestSeason?.toLowerCase().includes(filters.season.toLowerCase()));
    }
    if (filters.priceMin) {
      result = result.filter((t) => t.price >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter((t) => t.price <= Number(filters.priceMax));
    }
    if (filters.visaRequired) {
      result = result.filter((t) => t.visaRequired);
    }
    if (filters.insuranceIncluded) {
      result = result.filter((t) => t.insuranceIncluded);
    }
    if (filters.freeCancellation) {
      result = result.filter((t) => t.freeCancellation);
    }
    if (filters.instantConfirmation) {
      result = result.filter((t) => t.instantConfirmation);
    }

    switch (filters.sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [tours, searchQuery, filters]);

  const activeFilterCount = [
    filters.category !== 'Все',
    filters.country !== 'Все',
    filters.duration !== 'Все',
    filters.difficulty !== 'Все',
    filters.season !== 'Все',
    filters.priceMin !== '',
    filters.priceMax !== '',
    filters.visaRequired,
    filters.insuranceIncluded,
    filters.freeCancellation,
    filters.instantConfirmation,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setFilters({
      category: 'Все',
      country: 'Все',
      duration: 'Все',
      difficulty: 'Все',
      season: 'Все',
      priceMin: '',
      priceMax: '',
      visaRequired: false,
      insuranceIncluded: false,
      freeCancellation: false,
      instantConfirmation: false,
      sort: 'popular',
    });
    setSearchParams({});
  };

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <section className="py-12 lg:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Все туры</h1>
          <p className="text-muted-foreground max-w-xl">
            Выберите идеальное путешествие из нашей коллекции лучших туров по всему миру
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section ref={ref} className="py-6 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию, стране, достопримечательностям..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm">Фильтры</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                className="appearance-none w-full lg:w-52 pl-4 pr-10 py-2.5 rounded-xl bg-card border border-border focus:border-emerald-500 outline-none text-sm cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 p-4 rounded-xl bg-card border border-border space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Категория</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilters((f) => ({ ...f, category: cat }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          filters.category === cat
                            ? 'bg-emerald-600 text-white'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Страна</label>
                  <select
                    value={filters.country}
                    onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm outline-none"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Длительность</label>
                  <select
                    value={filters.duration}
                    onChange={(e) => setFilters((f) => ({ ...f, duration: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm outline-none"
                  >
                    {durations.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Сложность</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm outline-none"
                  >
                    {difficulties.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Season */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Сезон</label>
                  <select
                    value={filters.season}
                    onChange={(e) => setFilters((f) => ({ ...f, season: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm outline-none"
                  >
                    {seasons.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Цена ($)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={filters.priceMin}
                      onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value }))}
                      placeholder="от"
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm outline-none"
                    />
                    <span className="text-muted-foreground">—</span>
                    <input
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value }))}
                      placeholder="до"
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Feature toggles */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
                {[
                  { key: 'visaRequired' as const, label: 'Нужна виза', icon: Globe },
                  { key: 'insuranceIncluded' as const, label: 'Страховка', icon: Shield },
                  { key: 'freeCancellation' as const, label: 'Бесплатная отмена', icon: Ban },
                  { key: 'instantConfirmation' as const, label: 'Мгновенное подтверждение', icon: Zap },
                ].map((feat) => (
                  <button
                    key={feat.key}
                    onClick={() => setFilters((f) => ({ ...f, [feat.key]: !f[feat.key] }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      filters[feat.key]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <feat.icon className="w-3.5 h-3.5" />
                    {feat.label}
                  </button>
                ))}
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Сбросить все фильтры
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Найдено: <span className="text-foreground font-medium">{filteredTours.length}</span> туров
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-xl h-[400px] animate-pulse" />
              ))}
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Туры не найдены</h3>
              <p className="text-muted-foreground text-sm">
                Попробуйте изменить параметры поиска или фильтры
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTours.map((tour, i) => (
                <TourCard key={tour.id} tour={tour} index={i} isVisible={isVisible} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
