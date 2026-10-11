import api from "./api";

export const favoriteService = {
  getFavorites: () => api.get("/favorites"),
  addFavorite: (productId) => api.post("/favorites", { product_id: productId }),
  removeFavorite: (productId) => api.delete(`/favorites/${productId}`)
};