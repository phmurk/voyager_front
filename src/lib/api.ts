const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = {
  getTours: (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value);
      });
    }
    return fetch(`${API_URL}/tours/?${query}`).then((r) => r.json());
  },

  getTourDetail: (id: string) =>
    fetch(`${API_URL}/tours/${id}/`).then((r) => r.json()),

  getHotTours: () => fetch(`${API_URL}/tours/hot/`).then((r) => r.json()),

  searchTours: (q: string) =>
    fetch(`${API_URL}/tours/search/?q=${encodeURIComponent(q)}`).then((r) =>
      r.json(),
    ),

  filterTours: (filters: Record<string, any>) => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });
    return fetch(`${API_URL}/tours/filter/?${query}`).then((r) => r.json());
  },

  getDestinations: () =>
    fetch(`${API_URL}/destinations/`).then((r) => r.json()),

  getBlog: (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value);
      });
    }
    return fetch(`${API_URL}/blog/?${query}`).then((r) => r.json());
  },

  getBlogPost: (id: string) =>
    fetch(`${API_URL}/blog/${id}/`).then((r) => r.json()),

  getForumTopics: (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value);
      });
    }
    return fetch(`${API_URL}/forum-topics/?${query}`).then((r) => r.json());
  },

  getForumTopic: (id: string) =>
    fetch(`${API_URL}/forum-topics/${id}/`).then((r) => r.json()),

  addForumReply: (topicId: string, reply: any, token?: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Token ${token}`;
    return fetch(`${API_URL}/forum-topics/${topicId}/add_reply/`, {
      method: "POST",
      headers,
      body: JSON.stringify(reply),
    }).then((r) => r.json());
  },

  subscribeNewsletter: (email: string) =>
    fetch(`${API_URL}/newsletter/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then((r) => r.json()),

  getProfile: (token: string) =>
    fetch(`${API_URL}/profile/`, {
      headers: { Authorization: `Token ${token}` },
    }).then((r) => r.json()),

  updateProfile: (data: any, token: string) =>
    fetch(`${API_URL}/profile/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  getFavorites: (token: string) =>
    fetch(`${API_URL}/favorites/`, {
      headers: { Authorization: `Token ${token}` },
    }).then((r) => r.json()),

  addFavorite: (tourId: string, token: string) =>
    fetch(`${API_URL}/favorites/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ tour_id: tourId }),
    }).then((r) => r.json()),

  getForumActivity: (token: string) =>
    fetch(`${API_URL}/forum-activity/`, {
      headers: { Authorization: `Token ${token}` },
    }).then((r) => r.json()),

  createOrder: (orderData: any, token: string) =>
    fetch(`${API_URL}/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(orderData),
    }).then((r) => {
      if (!r.ok) throw new Error("Ошибка при создании заказа");
      return r.json();
    }),

  // addReview: (
  //   reviewData: {
  //     tour: string;
  //     rating: number;
  //     text: string;
  //     name: string;
  //     avatar?: string;
  //     date: string;
  //   },
  //   token: string,
  // ) =>
  //   fetch(`${API_URL}/reviews/`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Token ${token}`,
  //     },
  //     body: JSON.stringify(reviewData),
  //   }).then((r) => r.json()),

  addReview: (reviewData: any, token: string) =>
    fetch(`${API_URL}/reviews/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(reviewData),
    }).then(async (r) => {
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw err;
      }
      return r.json();
    }),
};
