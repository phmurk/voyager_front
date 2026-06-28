import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MessageSquare, ThumbsUp, Clock } from 'lucide-react';
import { api } from '../lib/api';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const categories = ['Все', 'Советы', 'Направления', 'Бюджет', 'Еда', 'Маршруты', 'Приключения', 'Отели', 'Семья', 'Документы'];

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: 'articles' | 'forum' = searchParams.get('tab') === 'forum' ? 'forum' : 'articles';
  const setActiveTab = (tab: 'articles' | 'forum') => {
    setSearchParams(tab === 'forum' ? { tab: 'forum' } : {}, { replace: true });
  };
  const { ref, isVisible } = useScrollAnimation(0.1);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsData, topicsData] = await Promise.all([
          api.getBlog(),
          api.getForumTopics(),
        ]);
        const postsList = Array.isArray(postsData) ? postsData : postsData.results || [];
        const topicsList = Array.isArray(topicsData) ? topicsData : topicsData.results || [];
        setPosts(postsList);
        setTopics(topicsList);
      } catch (err) {
        console.error('[v0] Failed to fetch blog data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTopics = topics.filter((topic) => {
    return !searchQuery ||
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.author.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <section className="py-12 lg:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Блог и обсуждения</h1>
          <p className="text-muted-foreground max-w-xl">
            Статьи от экспертов, советы путешественников и живое сообщество
          </p>
        </div>
      </section>

      {/* Tabs & Search */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('articles')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'articles'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-card border border-border hover:bg-muted'
                }`}
              >
                Статьи
              </button>
              <button
                onClick={() => setActiveTab('forum')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'forum'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-card border border-border hover:bg-muted'
                }`}
              >
                Обсуждения
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'articles' ? 'Поиск по статьям...' : 'Поиск по темам...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Category filters for articles */}
          {activeTab === 'articles' && (
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section ref={ref} className="py-8 lg:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl h-[350px] animate-pulse" />
              ))}
            </div>
          ) : activeTab === 'articles' ? (
            <>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-20">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Статьи не найдены</h3>
                  <p className="text-muted-foreground text-sm">Попробуйте изменить параметры поиска</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post, i) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className={`group block bg-card rounded-xl overflow-hidden border border-border hover:border-emerald-500/20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                      style={{ transitionDelay: `${i * 80}ms` }}
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
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime} мин
                          </span>
                        </div>
                        <h3 className="font-semibold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={post.authorAvatar || ''}
                              alt={post.author}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-xs text-muted-foreground">{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ThumbsUp className="w-3 h-3" />
                            {post.likes}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {filteredTopics.length === 0 ? (
                <div className="text-center py-20">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Темы не найдены</h3>
                  <p className="text-muted-foreground text-sm">Попробуйте изменить параметры поиска</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTopics.map((topic) => (
                    <Link
                      key={topic.id}
                      to={`/forum/${topic.id}`}
                      className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-emerald-500/20 transition-all group"
                    >
                      <div className="shrink-0">
                        <img
                          src={topic.authorAvatar || ''}
                          alt={topic.author}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div className="flex-1 min-w-1">
                        <div className="flex items-center gap-2 mb-1">
                          {topic.isPinned && (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">
                              Закреплено
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-muted text-xs rounded-full text-muted-foreground">
                            {topic.category}
                          </span>
                        </div>
                        <h3 className="font-medium group-hover:text-emerald-400 transition-colors truncate">
                          {topic.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{topic.author}</span>
                          <span>{topic.date}</span>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground shrink-0">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4" />
                          <span>{topic.replies}</span>
                        </div>
                        <div className="text-xs">
                          <div className="text-muted-foreground">Последний ответ</div>
                          <div>{topic.lastReply}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
