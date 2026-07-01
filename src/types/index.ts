export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  rating: number;
  reviews_count: number;
  image: string;
  images: string[];
  location: string;
  country: string;
  category: string;
  tags: string[];
  hotel?: string;
  hotel_stars?: number;
  included: string[];
  not_included: string[];
  itinerary_days?: ItineraryDay[];
  is_hot?: boolean;
  discount: number;
  max_people: number;
  // Rich details
  meals?: string;
  transport?: string;
  guide_language?: string;
  group_size?: string;
  difficulty?: string;
  best_season?: string;
  visa_required?: boolean;
  insurance_included?: boolean;
  free_cancellation?: boolean;
  instant_confirmation?: boolean;
  amenities?: string[];
  highlights?: string[];
  faqs?: { q: string; a: string }[];
  gallery?: string[];
  departure_cities?: string[];
  arrival_info?: string;
  important_notes?: string;
  suitable_for?: string[];
  languages?: string[];
}

export interface ItineraryDay {
  id: string;
  day_number: number;
  title: string;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  author_avatar: string;
  date: string;
  image: string;
  category: string;
  // readTime: number;
  read_time: number;
  likes: number;
}

export interface ForumTopic {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  author_avatar: string;
  date: string;
  replies: number;
  replies_count: number;
  views: number;
  lastReply: string;
  last_reply: string;
  category: string;
  isPinned?: boolean;
  is_pinned: boolean;
}

export interface ForumReply {
  id: string;
  topicId: string;
  author: string;
  authorAvatar: string;
  author_avatar: string;
  content: string;
  date: string;
  likes: number;
}

export interface CartItem {
  tourId: string;
  quantity: number;
  date: string;
  people: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  tour_count: number;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  tourName: string;
}
