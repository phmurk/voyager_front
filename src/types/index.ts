export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  location: string;
  country: string;
  category: string;
  tags: string[];
  hotel?: string;
  hotelStars?: number;
  included: string[];
  notIncluded: string[];
  itinerary: ItineraryDay[];
  isHot?: boolean;
  discount: number;
  maxPeople?: number;
  // Rich details
  meals?: string;
  transport?: string;
  guideLanguage?: string;
  groupSize?: string;
  difficulty?: string;
  bestSeason?: string;
  visaRequired?: boolean;
  insuranceIncluded?: boolean;
  freeCancellation?: boolean;
  instantConfirmation?: boolean;
  amenities?: string[];
  highlights?: string[];
  faqs?: { q: string; a: string }[];
  gallery?: string[];
  departureCities?: string[];
  arrivalInfo?: string;
  importantNotes?: string;
  suitableFor?: string[];
  languages?: string[];
}

export interface ItineraryDay {
  id: string;
  day: number;
  dayNumber: number;
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
  readTime: number;
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
  tourCount: number;
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
