import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MessageSquare, Clock, Plus } from "lucide-react";
import { api } from "../lib/api";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useAuth } from "../contexts/AuthContext";
import "./Blog.css"; // Импорт стилей

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
  const safeName = name || "U";
  const sizePx = size === "sm" ? "24px" : "40px";
  const fontSize = size === "sm" ? "0.75rem" : "1.1rem";

  return (
    <div
      className="user-avatar-circle"
      style={{
        backgroundColor: getUserColor(safeName),
        width: sizePx,
        height: sizePx,
        fontSize: fontSize,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {safeName.charAt(0).toUpperCase()}
    </div>
  );
};
const categories = [
  "Все",
  "Советы",
  "Направления",
  "Бюджет",
  "Еда",
  "Маршруты",
  "Приключения",
  "Документы",
];

const formatForumDate = (createdAt: string) => {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    });
  }
};

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: "articles" | "forum" =
    searchParams.get("tab") === "forum" ? "forum" : "articles";

  const setActiveTab = (tab: "articles" | "forum") => {
    setSearchParams(tab === "forum" ? { tab: "forum" } : {}, { replace: true });
  };

  const { ref, isVisible } = useScrollAnimation(0.1);

  const { user, token } = useAuth(); // Получаем данные пользователя
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [newTopicData, setNewTopicData] = useState({
    title: "",
    category: "Советы",
    content: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.name || !token) {
      alert("Ошибка авторизации");
      return;
    }

    // const topicData = {
    //   title: newTopicData.title,
    //   category: newTopicData.category,
    //   author: user.name, // Здесь TS уже не будет ругаться, т.к. мы проверили выше
    //   author_avatar: user.avatar || "", // Используем пустую строку, если аватара нет
    //   date: new Date().toISOString(),
    // };

    try {
      const response = await fetch(`${API_URL}/forum-topics/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          title: newTopicData.title,
          category: newTopicData.category,
          // content: newTopicData.content, // Убираем, если в модели ForumTopic нет такого поля
          author: user.name,
          author_avatar: `https://ui-avatars.com/api/?name=${user.name}&background=047857&color=fff`,
          date: new Date().toLocaleDateString("ru-RU"), // Текст для поля date
        }),
      });

      if (response.ok) {
        setIsCreatingTopic(false);
        setNewTopicData({ title: "", category: "Советы", content: "" });
        window.location.reload();
      } else {
        // Проверяем, пришел ли JSON, прежде чем его парсить
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          alert("Ошибка сервера: " + JSON.stringify(errorData));
        } else {
          const errorText = await response.text();
          console.error("Сервер вернул не JSON:", errorText);
          alert(
            `Ошибка ${response.status}: Сервер прислал пустой ответ или ошибку в формате HTML.`,
          );
        }
      }
    } catch (err) {
      console.error("Ошибка сети или выполнения:", err);
      alert("Не удалось отправить запрос. Проверьте соединение.");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsData, topicsData] = await Promise.all([
          api.getBlog(),
          api.getForumTopics(),
        ]);
        const postsList = Array.isArray(postsData)
          ? postsData
          : postsData.results || [];
        const topicsList = Array.isArray(topicsData)
          ? topicsData
          : topicsData.results || [];
        setPosts(postsList);
        setTopics(topicsList);
      } catch (err) {
        console.error("Failed to fetch blog data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Все" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTopics = topics.filter((topic) => {
    return (
      !searchQuery ||
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="blog-page">
      {/* Header */}
      <section className="blog-hero">
        <div className="container">
          <h1 className="fw-bold mb-3 fs-2 fs-lg-1">Блог и обсуждения</h1>
          <p className="text-muted mb-0" style={{ maxWidth: "600px" }}>
            Статьи от экспертов, советы путешественников и живое сообщество
          </p>
        </div>
      </section>

      {/* Tabs & Search */}
      <section className="blog-controls-section">
        <div className="container">
          <div className="row g-3 align-items-center">
            {/* Tabs */}
            <div className="col-12 col-lg-auto">
              <div className="blog-tabs">
                <button
                  onClick={() => setActiveTab("articles")}
                  className={`tab-btn ${activeTab === "articles" ? "active" : ""}`}
                >
                  Статьи
                </button>
                <button
                  onClick={() => setActiveTab("forum")}
                  className={`tab-btn ${activeTab === "forum" ? "active" : ""}`}
                >
                  Обсуждения
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="col-12 col-lg-6">
              <div className="blog-search-wrapper">
                <Search className="blog-search-icon" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === "articles"
                      ? "Поиск по статьям..."
                      : "Поиск по темам..."
                  }
                  className="blog-search-field"
                />
              </div>
            </div>
          </div>

          {/* Category filters */}
          {activeTab === "articles" && (
            <div className="category-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section ref={ref} className="py-5">
        <div className="container">
          {loading ? (
            <div className="row g-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="col-12 col-md-6 col-lg-4">
                  <div className="skeleton-blog" />
                </div>
              ))}
            </div>
          ) : activeTab === "articles" ? (
            <div className="row g-4">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-5 col-12">
                  <Search size={48} className="text-muted mb-3" />
                  <h3 className="h5 fw-bold">Статьи не найдены</h3>
                </div>
              ) : (
                filteredPosts.map((post, i) => (
                  <div key={post.id} className="col-12 col-md-6 col-lg-4">
                    <Link
                      to={`/blog/${post.id}`}
                      className={`blog-card scroll-reveal ${isVisible ? "visible" : ""}`}
                      style={{ transitionDelay: `${i * 80}ms` }}
                    >
                      <div className="blog-card-img-box">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="blog-card-img"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <div className="d-flex align-items-center gap-3 mb-3 small text-muted">
                          <span
                            className="badge bg-emerald-soft text-primary"
                            style={{
                              backgroundColor: "hsla(var(--primary) / 0.1)",
                              color: "hsl(var(--primary))",
                            }}
                          >
                            {post.category}
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <Clock size={14} /> {post.read_time} мин
                          </span>
                        </div>
                        <h3 className="h6 fw-bold mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="small text-muted line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="d-flex align-items-center justify-content-between mt-auto">
                          <div className="d-flex align-items-center gap-2">
                            <UserAvatar name={post.author} size="sm" />
                            <span className="small text-muted">
                              {post.author}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {user ? (
                <>
                  {!isCreatingTopic ? (
                    <button
                      onClick={() => setIsCreatingTopic(true)}
                      className="btn-create-topic"
                    >
                      <Plus size={20} /> Создать обсуждение
                    </button>
                  ) : (
                    <div className="create-topic-card animate-fadeIn">
                      <h3 className="h5 fw-bold mb-4">Новое обсуждение</h3>
                      <form onSubmit={handleCreateTopic}>
                        <div className="row">
                          <div className="col-md-8">
                            <label className="topic-label">
                              Заголовок темы
                            </label>
                            <input
                              required
                              className="topic-input"
                              placeholder="Например: Посоветуйте отель в Париже"
                              value={newTopicData.title}
                              onChange={(e) =>
                                setNewTopicData({
                                  ...newTopicData,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="topic-label">Категория</label>
                            <select
                              className="topic-select"
                              value={newTopicData.category}
                              onChange={(e) =>
                                setNewTopicData({
                                  ...newTopicData,
                                  category: e.target.value,
                                })
                              }
                            >
                              {categories
                                .filter((c) => c !== "Все")
                                .map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                        <div className="d-flex gap-3 mt-2">
                          <button type="submit" className="tab-btn active px-4">
                            Опубликовать
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsCreatingTopic(false)}
                            className="tab-btn"
                          >
                            Отмена
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              ) : (
                <div className="forum-topic-item justify-content-center text-center p-4">
                  <div>
                    <p className="mb-2">
                      Войдите, чтобы создавать новые обсуждения
                    </p>
                    <Link
                      to="/auth"
                      className="text-primary fw-bold text-decoration-none"
                    >
                      Войти в аккаунт
                    </Link>
                  </div>
                </div>
              )}

              {filteredTopics.length === 0 ? (
                <div className="text-center py-5">
                  <MessageSquare size={48} className="text-muted mb-3" />
                  <h3 className="h5 fw-bold">Темы не найдены</h3>
                </div>
              ) : (
                filteredTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    to={`/forum/${topic.id}`}
                    className="forum-topic-item"
                  >
                    <div className="shrink-0">
                      <UserAvatar name={topic.author} size="md" />
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        {topic.isPinned && (
                          <span
                            className="badge bg-emerald-soft text-primary"
                            style={{ fontSize: "0.65rem" }}
                          >
                            Закреплено
                          </span>
                        )}
                        <span
                          className="badge bg-muted text-muted"
                          style={{
                            fontSize: "0.65rem",
                            color: "hsl(var(--muted-foreground))",
                          }}
                        >
                          {topic.category}
                        </span>
                      </div>
                      <h3 className="topic-title h6 mb-1">{topic.title}</h3>
                      <div className="small text-muted d-flex gap-3">
                        <span>{topic.author}</span>
                        <span>{formatForumDate(topic.created_at)}</span>
                      </div>
                    </div>
                    <div className="d-none d-md-flex align-items-center gap-4 text-muted small">
                      <div className="d-flex align-items-center gap-1">
                        <MessageSquare size={16} /> <span>{topic.replies}</span>
                      </div>
                      <div className="text-end" style={{ minWidth: "100px" }}>
                        <div className="x-small text-muted">
                          Последний ответ
                        </div>
                        <div className="fw-bold" style={{ fontSize: "0.7rem" }}>
                          {topic.lastReply}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
