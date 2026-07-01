import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { api } from "../lib/api";
import "./BlogPost.css"; // Импорт стилей

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
  size?: "sm" | "md" | "lg";
}) => {
  const safeName = name || "U";
  const backgroundColor = getUserColor(safeName);
  return (
    <div
      className={`user-avatar-circle size-${size}`}
      style={{ backgroundColor }}
    >
      {safeName.charAt(0).toUpperCase()}
    </div>
  );
};

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  // const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const data = await api.getBlogPost(id);
        setPost(data);
      } catch (err) {
        console.error("[v0] Failed to fetch blog post:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="blog-post-page">
        <div className="container py-5">
          <div className="blog-post-container">
            <div className="skeleton-blog-hero mb-4" />
            <div
              className="skeleton mb-3"
              style={{
                height: "30px",
                width: "70%",
                backgroundColor: "hsl(var(--muted))",
              }}
            />
            <div
              className="skeleton"
              style={{ height: "100px", backgroundColor: "hsl(var(--muted))" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-post-page d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="fw-bold mb-3">Статья не найдена</h2>
          <Link
            to="/blog"
            className="text-primary text-decoration-none"
            style={{ color: "hsl(var(--primary))" }}
          >
            Вернуться в блог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      <div className="container py-4">
        <div className="blog-post-container">
          <Link
            to="/blog"
            className="d-inline-flex align-items-center gap-2 small text-muted text-decoration-none mb-4 hover-primary"
            style={{ transition: "color 0.2s" }}
          >
            <ArrowLeft size={16} />
            Назад в блог
          </Link>

          {/* Hero Image */}
          <div className="blog-hero-image-wrapper">
            <img
              src={post.image}
              alt={post.title}
              className="blog-hero-image"
            />
          </div>

          {/* Meta */}
          <div className="d-flex flex-wrap align-items-center gap-4 mb-4">
            <span className="category-badge">{post.category}</span>
            <div className="d-flex align-items-center gap-1 small text-muted">
              <Clock size={16} />
              {post.read_time} мин чтения
            </div>
            <span className="small text-muted">{post.date}</span>
          </div>

          {/* Author */}
          <div className="author-section">
            {/* ЗАМЕНЕНО: вместо img используем UserAvatar */}
            <UserAvatar name={post.author} size="md" />
            <div>
              <div className="fw-bold">{post.author}</div>
              <div className="small text-muted">Автор статьи</div>
            </div>
          </div>

          {/* Title */}
          <h1 className="display-5 fw-bold mb-4">{post.title}</h1>

          {/* Content */}
          <div className="blog-main-content">
            <p className="blog-excerpt">{post.excerpt}</p>
            <div className="content-body">
              {/* Исправлено: добавлены типы paragraph: string и i: number */}
              {post.content.split("\n").map((paragraph: string, i: number) => (
                <p key={i} className="blog-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex align-items-center gap-3 pt-5 mt-4 border-top border-secondary">
            <p className="small text-muted italic">
              Спасибо за прочтение нашей статьи!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
