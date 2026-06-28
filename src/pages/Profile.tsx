import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Calendar,
  MapPin,
  Package,
  LogOut,
  Edit2,
  Check,
  X,
  ShoppingBag,
  Compass,
  Clock,
  Heart,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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

type TabType = 'orders' | 'favorites' | 'activity';

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: 'В обработке', className: 'bg-amber-500/10 text-amber-400' },
  paid: { label: 'Оплачен', className: 'bg-emerald-500/10 text-emerald-400' },
  completed: { label: 'Завершён', className: 'bg-emerald-500/10 text-emerald-400' },
  cancelled: { label: 'Отменён', className: 'bg-red-500/10 text-red-400' },
};

const activityTypeLabels: Record<string, string> = {
  reply: 'Ответ в обсуждении',
  like: 'Лайк',
  mention: 'Упоминание',
};

export default function Profile() {
  const { user, isLoading, logout, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    if (user) setNameDraft(user.name);
  }, [user]);

  useEffect(() => {
    if (!user || !token) return;
    fetchProfileData();
  }, [user, token]);

  const fetchProfileData = async () => {
    setDataLoading(true);
    try {
      const response = await fetch(`${API_URL}/profile/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setFavorites(data.favorites);
        setActivities(data.activities);
      }
    } catch (err) {
      console.error('[v0] Failed to fetch profile data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (!nameDraft.trim() || !token) return;
    setIsSaving(true);
    try {
      await fetch(`${API_URL}/profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
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
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` },
      });
      setFavorites(favorites.filter(f => f.id !== favoriteId));
    } catch (err) {
      console.error('[v0] Failed to remove favorite:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading || !user) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-40 bg-card rounded-2xl animate-pulse mb-6" />
            <div className="h-64 bg-card rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=047857&color=fff&size=200`;

  const totalSpent = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile header */}
          <section className="relative overflow-hidden rounded-2xl bg-card border border-border mb-6">
            <div className="h-28 bg-secondary/40 border-b border-border" />
            <div className="px-6 pb-6 -mt-12">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <img
                  src={avatarUrl}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl border-4 border-card object-cover bg-muted"
                />
                <div className="flex-1 min-w-0 sm:pb-2">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-muted border border-border outline-none focus:border-emerald-500 text-lg font-bold"
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={isSaving}
                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50"
                        aria-label="Сохранить"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setNameDraft(user.name);
                        }}
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                        aria-label="Отмена"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl lg:text-2xl font-bold truncate">{user.name}</h1>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-emerald-400 transition-colors"
                        aria-label="Редактировать имя"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted hover:text-red-400 transition-colors text-sm font-medium sm:mb-2"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                <Package className="w-4 h-4 text-emerald-400" />
                Заказов
              </div>
              <div className="text-2xl font-bold">{orders.length}</div>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                Потрачено
              </div>
              <div className="text-2xl font-bold text-emerald-400">${totalSpent}</div>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                <Heart className="w-4 h-4 text-emerald-400" />
                Избранные
              </div>
              <div className="text-2xl font-bold">{favorites.length}</div>
            </div>
          </section>

          {/* Tabs */}
          <section className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="flex border-b border-border">
              {(['orders', 'favorites', 'activity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-emerald-400 text-emerald-400 bg-secondary/30'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'orders' && 'Заказы'}
                  {tab === 'favorites' && 'Избранное'}
                  {tab === 'activity' && 'Активность'}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  {dataLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">Заказов пока нет</h3>
                      <p className="text-sm text-muted-foreground">
                        Выберите тур мечты и отправляйтесь в путешествие
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const status = statusLabels[order.status] || statusLabels.pending;
                        return (
                          <div key={order.id} className="rounded-xl border border-border overflow-hidden">
                            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-secondary/30 border-b border-border">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(order.created_at).toLocaleDateString('ru-RU', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                                  {status.label}
                                </span>
                                <span className="font-bold text-emerald-400">${order.total_amount}</span>
                              </div>
                            </div>
                            <div className="divide-y divide-border">
                              {order.items?.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-4">
                                  <img
                                    src={item.tour?.image || ''}
                                    alt={item.tour?.title || 'Тур'}
                                    className="w-14 h-14 rounded-lg object-cover shrink-0 bg-muted"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{item.tour?.title || 'Тур'}</div>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                                      {item.tour?.location && (
                                        <span className="flex items-center gap-1">
                                          <MapPin className="w-3 h-3" />
                                          {item.tour.location}
                                        </span>
                                      )}
                                      {item.travel_date && (
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {item.travel_date}
                                        </span>
                                      )}
                                      <span>{item.people_count} чел.</span>
                                    </div>
                                  </div>
                                  <span className="text-sm font-medium shrink-0">${item.unit_price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div>
                  {dataLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">Избранные туры пока не добавлены</h3>
                      <p className="text-sm text-muted-foreground">
                        Добавьте туры в избранное, чтобы сохранить их для дальнейшего просмотра
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites.map((fav) => (
                        <div key={fav.id} className="rounded-xl border border-border overflow-hidden hover:border-emerald-400/50 transition-colors">
                          <div className="relative">
                            <img
                              src={fav.tour?.image || ''}
                              alt={fav.tour?.title || 'Тур'}
                              className="w-full h-32 object-cover"
                            />
                            <button
                              onClick={() => handleRemoveFavorite(fav.id)}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
                              aria-label="Удалить из избранного"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold truncate mb-2">{fav.tour?.title || 'Тур'}</h3>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">{fav.tour?.location}</span>
                              <span className="font-bold text-emerald-400">
                                ${fav.tour?.discount ? Math.round(fav.tour.price * (1 - fav.tour.discount / 100)) : fav.tour?.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div>
                  {dataLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : activities.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">Активность пока не зафиксирована</h3>
                      <p className="text-sm text-muted-foreground">
                        Участвуйте в обсуждениях, чтобы ваша активность появилась здесь
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activities.map((activity) => (
                        <div key={activity.id} className="p-4 rounded-lg border border-border bg-secondary/20">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-emerald-400">
                                {activityTypeLabels[activity.activity_type] || activity.activity_type}
                              </p>
                              {activity.topic && (
                                <p className="text-sm font-semibold text-foreground mt-1">{activity.topic.title}</p>
                              )}
                              {activity.content_preview && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{activity.content_preview}</p>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {new Date(activity.created_at).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
