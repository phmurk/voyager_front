import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, Send, User } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import "./ForumTopic.css";

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
        flexShrink: 0,
      }}
    >
      {safeName.charAt(0).toUpperCase()}
    </div>
  );
};

// const formatForumDate = (createdAt: string) => {
//   if (!createdAt) return "";
//   const date = new Date(createdAt);
//   const now = new Date();
//   if (date.toDateString() === now.toDateString()) {
//     return date.toLocaleTimeString("ru-RU", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   }
//   return date.toLocaleDateString("ru-RU", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });
// };

export default function ForumTopicPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const [topic, setTopic] = useState<any | null>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const topicData = await api.getForumTopic(id);
        setTopic(topicData);
        if (topicData.replies) setReplies(topicData.replies);
      } catch (err) {
        console.error("Failed to fetch forum topic:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !id || !user || !token) return;

    setIsSubmitting(true);
    try {
      const newReply = await api.addForumReply(
        id,
        {
          content: replyText.trim(),
          author: user.name,
          author_avatar: `https://ui-avatars.com/api/?name=${user.name}`,
        },
        token,
      );

      if (newReply) {
        setReplies((prev) => [...prev, newReply]);
        setReplyText("");
      }
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="forum-page">
        <div className="container py-5">
          <div className="forum-container">
            <div
              className="skeleton-forum-line mb-3"
              style={{ height: "30px", width: "60%" }}
            />
            <div
              className="skeleton-forum-line mb-4"
              style={{ height: "120px" }}
            />
            <div className="skeleton-forum-line" style={{ height: "80px" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="forum-page d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="fw-bold mb-3">Тема не найдена</h2>
          <Link
            to="/blog?tab=forum"
            className="text-primary text-decoration-none"
            style={{ color: "hsl(var(--primary))" }}
          >
            Вернуться к обсуждениям
          </Link>
        </div>
      </div>
    );
  }

  const formatForumDate = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };

  return (
    <div className="forum-page">
      <div className="container py-4">
        <div className="forum-container">
          {/* Back link */}
          <Link
            to="/blog?tab=forum"
            className="d-inline-flex align-items-center gap-2 small text-muted text-decoration-none mb-4 hover-primary"
            style={{ transition: "color 0.2s" }}
          >
            <ArrowLeft size={16} />
            Назад к обсуждениям
          </Link>

          {/* Main Topic Header */}
          <div className="forum-card">
            <div className="d-flex align-items-center gap-3 mb-3">
              <UserAvatar name={topic.author} size="md" />
              <div style={{ minWidth: 0 }}>
                <div className="fw-bold">
                  {" "}
                  {typeof topic.author === "object"
                    ? topic.author.name
                    : topic.author}
                </div>
                <div
                  className="x-small text-muted"
                  style={{ fontSize: "0.75rem" }}
                >
                  {formatForumDate(topic.created_at)}
                </div>
              </div>
            </div>
            <h1 className="h3 fw-bold mb-3">{topic.title}</h1>
            <div className="forum-meta">
              <span className="forum-category-tag">{topic.category}</span>
              <div className="d-flex align-items-center gap-1">
                <MessageSquare size={16} />
                <span>{replies.length} ответов</span>
              </div>
            </div>
          </div>

          {/* Replies List */}
          <div className="mb-5">
            {replies.map((reply) => (
              <div key={reply.id} className="reply-item">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <UserAvatar name={reply.author} size="sm" />
                  <div style={{ minWidth: 0 }}>
                    <div className="small fw-bold text-truncate">
                      {typeof reply.author === "object"
                        ? reply.author.name
                        : reply.author}
                    </div>
                    <div
                      className="x-small text-muted"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {formatForumDate(reply.created_at)}
                    </div>
                  </div>
                </div>
                <p
                  className="small text-muted mb-3"
                  style={{ lineHeight: "1.6" }}
                >
                  {reply.content}
                </p>
              </div>
            ))}
          </div>

          {/* Reply Form Section */}
          <div className="reply-form-container">
            {user ? (
              <form onSubmit={handleSubmitReply} className="forum-card">
                <h3 className="h6 fw-bold mb-4">Ответить</h3>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Напишите ваш ответ..."
                  rows={4}
                  required
                  className="reply-textarea mb-4"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !replyText.trim()}
                  className="btn-forum-send"
                >
                  <Send size={16} />
                  <span>{isSubmitting ? "Отправка..." : "Отправить"}</span>
                </button>
              </form>
            ) : (
              <div className="forum-card text-center">
                <User size={32} className="text-muted mb-3 mx-auto" />
                <p className="small text-muted mb-3">
                  Войдите, чтобы оставить ответ
                </p>
                <Link
                  to="/auth"
                  className="btn-forum-send text-decoration-none"
                >
                  Войти
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
