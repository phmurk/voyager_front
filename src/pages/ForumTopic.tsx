import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, ThumbsUp, Send, User } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function ForumTopicPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const [topic, setTopic] = useState<any | null>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const topicData = await api.getForumTopic(id);
        setTopic(topicData);
        if (topicData.replies) setReplies(topicData.replies);
      } catch (err) {
        console.error('[v0] Failed to fetch forum topic:', err);
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
      const newReply = await api.addForumReply(id, {
        content: replyText.trim(),
      }, token);

      if (newReply) {
        setReplies((prev) => [...prev, newReply]);
        setReplyText('');
      }
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="h-8 w-2/3 bg-card rounded animate-pulse mb-4" />
            <div className="h-32 bg-card rounded-xl animate-pulse mb-6" />
            <div className="h-20 bg-card rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Тема не найдена</h2>
          <Link to="/blog?tab=forum" className="text-emerald-400 hover:text-emerald-300">
            Вернуться к обсуждениям
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
            to="/blog?tab=forum"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к обсуждениям
          </Link>

          {/* Topic */}
          <div className="p-6 rounded-xl bg-card border border-border mb-6">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={topic.authorAvatar || ''}
                alt={topic.author}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-medium">{topic.author}</div>
                <div className="text-xs text-muted-foreground">{topic.date}</div>
              </div>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold mb-3">{topic.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="px-2 py-0.5 bg-muted rounded-full text-xs">{topic.category}</span>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {topic.replies} ответов
              </div>
              <span>{topic.views} просмотров</span>
            </div>
          </div>

          {/* Replies */}
          <div className="space-y-4 mb-8">
            {replies.map((reply) => (
              <div key={reply.id} className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={reply.authorAvatar || ''}
                    alt={reply.author}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium">{reply.author}</div>
                    <div className="text-xs text-muted-foreground">{reply.date}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{reply.content}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                  <ThumbsUp className="w-3 h-3" />
                  {reply.likes}
                </div>
              </div>
            ))}
          </div>

          {/* Reply Form */}
          {user ? (
            <form onSubmit={handleSubmitReply} className="p-5 rounded-xl bg-card border border-border">
              <h3 className="font-medium mb-4">Ответить</h3>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Напишите ваш ответ..."
                rows={4}
                required
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm outline-none resize-none mb-4"
              />
              <button
                type="submit"
                disabled={isSubmitting || !replyText.trim()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium transition-colors text-sm"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Отправка...' : 'Отправить'}
              </button>
            </form>
          ) : (
            <div className="p-5 rounded-xl bg-card border border-border text-center">
              <User className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Войдите, чтобы оставить ответ
              </p>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
              >
                Войти
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
