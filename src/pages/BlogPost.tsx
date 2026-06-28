import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, ThumbsUp, Share2 } from 'lucide-react';
import { api } from '../lib/api';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const data = await api.getBlogPost(id);
        setPost(data);
      } catch (err) {
        console.error('[v0] Failed to fetch blog post:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="h-[400px] bg-card rounded-xl animate-pulse mb-6" />
            <div className="h-8 w-2/3 bg-card rounded animate-pulse mb-4" />
            <div className="h-4 w-full bg-card rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Статья не найдена</h2>
          <Link to="/blog" className="text-emerald-400 hover:text-emerald-300">
            Вернуться в блог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад в блог
          </Link>

          {/* Hero Image */}
          <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
              {post.category}
            </span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} мин чтения
            </div>
            <span>{post.date}</span>
          </div>

          {/* Author */}
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
            <img
              src={post.authorAvatar || ''}
              alt={post.author}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-medium">{post.author}</div>
              <div className="text-sm text-muted-foreground">Автор статьи</div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl lg:text-4xl font-bold mb-8">{post.title}</h1>

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {post.excerpt}
            </p>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              {post.content.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-8 border-t border-border">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                liked
                  ? 'bg-emerald-600 text-white'
                  : 'bg-card border border-border hover:bg-muted'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">{post.likes + (liked ? 1 : 0)}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Поделиться</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
