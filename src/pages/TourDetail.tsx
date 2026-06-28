import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, MapPin, Star, Users, Check, X, Calendar,
  ChevronLeft, ChevronRight, CreditCard, Heart, Share2,
  Utensils, Bus, Globe, Gauge, Sun, Shield, Ban,
  Zap, CheckCircle2, HelpCircle,
  Plane, Info, AlertTriangle, UserCheck, Languages,
} from 'lucide-react';
import { api } from '../lib/api';
import { useCart } from '../contexts/CartContext';

export default function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [tour, setTour] = useState<any | null>(null);
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [peopleCount, setPeopleCount] = useState(2);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'faq' | 'gallery'>('overview');

  useEffect(() => {
    async function fetchTour() {
      if (!id) return;
      try {
        const tourData = await api.getTourDetail(id);
        setTour(tourData);
        if (tourData.itinerary) setItinerary(tourData.itinerary);
      } catch (err) {
        console.error('[v0] Failed to fetch tour:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTour();
  }, [id]);

  const handleAddToCart = () => {
  if (!tour || !selectedDate) return;

  // ✅ Убеждаемся, что цена - число
  const price = Number(tour.price) || 0;
  const discount = Number(tour.discount) || 0;

  const item = {
    id: crypto.randomUUID(),
    tourId: tour.id,
    title: tour.title,
    price: price,
    discount: discount,
    image: tour.image,
    people: Number(peopleCount),
    travelDate: selectedDate,
  };

  console.log('Добавление в корзину:', item); // Отладка

  addItem(item);
  setShowBookingModal(false);
  navigate('/cart');
};

  const discountedPrice = tour
    ? (tour.discount > 0
      ? Math.round(tour.price * (1 - tour.discount / 100))
      : tour.price)
    : 0;

  const totalPrice = discountedPrice * peopleCount;

  const galleryImages = tour?.gallery && tour.gallery.length > 0
    ? tour.gallery
    : [tour?.image].filter(Boolean) as string[];

  const allImages = tour ? [tour.image, ...(tour.gallery || [])] : [];

  if (loading) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-[400px] bg-card rounded-xl animate-pulse" />
              <div className="h-8 w-2/3 bg-card rounded animate-pulse" />
              <div className="h-4 w-full bg-card rounded animate-pulse" />
            </div>
            <div className="h-[300px] bg-card rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Тур не найден</h2>
          <button
            onClick={() => navigate('/tours')}
            className="text-emerald-400 hover:text-emerald-300"
          >
            Вернуться к турам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Back */}
        <button
          onClick={() => navigate('/tours')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к турам
        </button>

        {/* Hero Gallery */}
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] mb-8">
          <img
            src={allImages[currentImage] || tour.image}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImage((p) => (p > 0 ? p - 1 : allImages.length - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentImage((p) => (p < allImages.length - 1 ? p + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3 mb-3">
              {tour.isHot && (
                <span className="px-3 py-1 bg-red-500/90 text-white text-xs font-medium rounded-full">
                  Горячий тур
                </span>
              )}
              {(tour.discount ?? 0) > 0 && (
                <span className="px-3 py-1 bg-emerald-500/90 text-white text-xs font-medium rounded-full">
                  -{tour.discount}%
                </span>
              )}
              {tour.freeCancellation && (
                <span className="px-3 py-1 bg-blue-500/90 text-white text-xs font-medium rounded-full">
                  Бесплатная отмена
                </span>
              )}
              {tour.instantConfirmation && (
                <span className="px-3 py-1 bg-amber-500/90 text-white text-xs font-medium rounded-full">
                  Мгновенное подтверждение
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">{tour.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {tour.location}, {tour.country}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {tour.duration} дней
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                {tour.rating} ({tour.reviews_count || 0} отзывов)
              </div>
            </div>
          </div>
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="absolute bottom-6 right-6 hidden md:flex gap-2">
              {allImages.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${i === currentImage ? 'border-emerald-400' : 'border-white/30'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Группа', value: tour.groupSize || `до ${tour.maxPeople} чел.` },
                { icon: Gauge, label: 'Сложность', value: tour.difficulty || 'Легкий' },
                { icon: Sun, label: 'Сезон', value: tour.bestSeason || 'Круглый год' },
                { icon: Languages, label: 'Язык', value: tour.guideLanguage || 'Русский' },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl bg-card border border-border text-center">
                  <item.icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                  <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                  <div className="text-sm font-medium">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex gap-6">
                {[
                  { key: 'overview', label: 'Обзор' },
                  { key: 'itinerary', label: 'Программа' },
                  { key: 'faq', label: 'Вопросы' },
                  { key: 'gallery', label: 'Галерея' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`pb-3 text-sm font-medium transition-colors relative ${
                      activeTab === tab.key
                        ? 'text-emerald-400'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Description */}
                <div>
                  <h2 className="text-xl font-bold mb-4">О туре</h2>
                  <p className="text-muted-foreground leading-relaxed">{tour.description}</p>
                </div>

                {/* Highlights */}
                {tour.highlights && tour.highlights.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Главные достопримечательности</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tour.highlights.map((h: string) => (
                        <div key={h} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <span className="text-sm">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* What's Included */}
                  <div className="p-6 rounded-xl bg-card border border-border">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Check className="w-5 h-5 text-emerald-400" />
                      Включено
                    </h3>
                    <ul className="space-y-2">
                      {tour.included?.map((item: string) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 rounded-xl bg-card border border-border">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <X className="w-5 h-5 text-red-400" />
                      Не включено
                    </h3>
                    <ul className="space-y-2">
                      {tour.not_included?.map((item: string) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Meals */}
                  {tour.meals && (
                    <div className="p-6 rounded-xl bg-card border border-border">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-emerald-400" />
                        Питание
                      </h3>
                      <p className="text-sm text-muted-foreground">{tour.meals}</p>
                    </div>
                  )}

                  {/* Transport */}
                  {tour.transport && (
                    <div className="p-6 rounded-xl bg-card border border-border">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Bus className="w-5 h-5 text-emerald-400" />
                        Транспорт
                      </h3>
                      <p className="text-sm text-muted-foreground">{tour.transport}</p>
                    </div>
                  )}

                  {/* Amenities */}
                  {tour.amenities && tour.amenities.length > 0 && (
                    <div className="p-6 rounded-xl bg-card border border-border md:col-span-2">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-emerald-400" />
                        Удобства
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {tour.amenities.map((a: string) => (
                          <span key={a} className="px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visa */}
                  <div className="p-6 rounded-xl bg-card border border-border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-emerald-400" />
                      Виза
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tour.visaRequired ? 'Требуется виза' : 'Виза не требуется'}
                    </p>
                  </div>

                  {/* Insurance */}
                  <div className="p-6 rounded-xl bg-card border border-border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      Страховка
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tour.insuranceIncluded ? 'Включена в стоимость' : 'Не включена'}
                    </p>
                  </div>

                  {/* Departure Cities */}
                  {tour.departure_cities && tour.departure_cities.length > 0 && (
                    <div className="p-6 rounded-xl bg-card border border-border md:col-span-2">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Plane className="w-5 h-5 text-emerald-400" />
                        Города вылета
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {tour.departure_cities.map((city: string) => (
                          <span key={city} className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Arrival Info */}
                  {tour.arrival_info && (
                    <div className="p-6 rounded-xl bg-card border border-border md:col-span-2">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5 text-emerald-400" />
                        Информация о прибытии
                      </h3>
                      <p className="text-sm text-muted-foreground">{tour.arrival_info}</p>
                    </div>
                  )}

                  {/* Important Notes */}
                  {tour.important_notes && (
                    <div className="p-6 rounded-xl bg-amber-500/5 border border-amber-500/20 md:col-span-2">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-400">
                        <AlertTriangle className="w-5 h-5" />
                        Важно знать
                      </h3>
                      <p className="text-sm text-muted-foreground">{tour.important_notes}</p>
                    </div>
                  )}

                  {/* Suitable For */}
                  {tour.suitable_for && tour.suitable_for.length > 0 && (
                    <div className="p-6 rounded-xl bg-card border border-border md:col-span-2">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-emerald-400" />
                        Для кого подходит
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {tour.suitable_for.map((s: string) => (
                          <span key={s} className="px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hotel */}
                {tour.hotel && (
                  <div className="p-6 rounded-xl bg-card border border-border">
                    <h3 className="font-semibold mb-4">Отель</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
                        <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                      </div>
                      <div>
                        <div className="font-medium text-lg">{tour.hotel}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: tour.hotel_stars || 0 }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {tour.reviews && tour.reviews.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Отзывы</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tour.reviews.map((review: any) => (
                        <div key={review.id} className="p-5 rounded-xl bg-card border border-border">
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={review.avatar || 'https://i.pravatar.cc/150'}
                              alt={review.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <div className="font-medium">{review.name}</div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-muted'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">"{review.text}"</p>
                          <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                {itinerary.length > 0 ? (
                  itinerary.map((day) => (
                    <div
                      key={day.id}
                      className="flex gap-4 p-5 rounded-xl bg-card border border-border"
                    >
                      <div className="shrink-0 w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-emerald-400">{day.day_number}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{day.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{day.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Программа тура пока не добавлена
                  </div>
                )}
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-4">
                {tour.faqs && tour.faqs.length > 0 ? (
                  tour.faqs.map((faq: any, i: number) => (
                    <div key={i} className="p-5 rounded-xl bg-card border border-border">
                      <div className="flex items-start gap-3 mb-3">
                        <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <h3 className="font-medium">{faq.q}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground pl-8">{faq.a}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Вопросов пока нет
                  </div>
                )}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden">
                    <img src={img} alt={`${tour.title} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="mb-4">
                  {(tour.discount ?? 0) > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg text-muted-foreground line-through">${tour.price}</span>
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded-full">
                        -{tour.discount}%
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-emerald-400">${discountedPrice}</span>
                    <span className="text-sm text-muted-foreground">/чел.</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tour.free_cancellation && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                      <Ban className="w-3 h-3" />
                      Отмена
                    </span>
                  )}
                  {tour.insurance_included && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">
                      <Shield className="w-3 h-3" />
                      Страховка
                    </span>
                  )}
                  {tour.visa_required && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-full">
                      <Globe className="w-3 h-3" />
                      Виза
                    </span>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Дата поездки</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Количество человек</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPeopleCount((p) => Math.max(1, p - 1))}
                        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{peopleCount}</span>
                      <button
                        onClick={() => setPeopleCount((p) => Math.min(tour.max_people || 30, p + 1))}
                        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-border mb-4">
                  <span className="text-sm">Итого:</span>
                  <span className="text-xl font-bold text-emerald-400">${totalPrice}</span>
                </div>

                <button
                  onClick={() => setShowBookingModal(true)}
                  disabled={!selectedDate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  Забронировать
                </button>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-colors ${
                      isFavorite
                        ? 'border-red-500/30 bg-red-500/10 text-red-400'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-400' : ''}`} />
                    <span className="text-sm">{isFavorite ? 'В избранном' : 'В избранное'}</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Поделиться</span>
                  </button>
                </div>
              </div>

              {/* Languages */}
              {tour.languages && tour.languages.length > 0 && (
                <div className="p-5 rounded-xl bg-card border border-border">
                  <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                    <Languages className="w-4 h-4 text-emerald-400" />
                    Языки
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tour.languages.map((lang: string) => (
                      <span key={lang} className="px-2.5 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tour.tags && tour.tags.length > 0 && (
                <div className="p-5 rounded-xl bg-card border border-border">
                  <h3 className="font-semibold mb-3 text-sm">Теги</h3>
                  <div className="flex flex-wrap gap-2">
                    {tour.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full border border-border">
            <h3 className="text-lg font-bold mb-4">Подтверждение бронирования</h3>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Тур</span>
                <span className="font-medium">{tour.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата</span>
                <span className="font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Количество</span>
                <span className="font-medium">{peopleCount} чел.</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-medium">Итого к оплате</span>
                <span className="text-xl font-bold text-emerald-400">${totalPrice}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-sm"
              >
                Отмена
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors text-sm"
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