import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { favoriteService } from "../../services/favoriteService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    favoriteService.getFavorites()
      .then((response) => setFavorites(response.data.favorites))
      .catch(() => setError("Unable to load favorites."))
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(productId) {
    setError("");

    try {
      await favoriteService.removeFavorite(productId);
      setFavorites((current) => current.filter((item) => item.id !== productId));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to remove favorite.");
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <h1 className="section-title">Favorites</h1>
      <AlertMessage type="danger" message={error} />
      {favorites.length === 0 ? (
        <div className="action-panel">
          <p className="text-muted mb-0">No favorites saved yet. Open a product detail page and save products you want to revisit.</p>
        </div>
      ) : (
        <div className="row g-3">
          {favorites.map((item) => (
            <div className="col-lg-6" key={item.id}>
              <div className="action-panel h-100">
                <div className="d-flex justify-content-between">
                  <h2 className="h5"><Link to={`/products/${item.id}`}>{item.product_name}</Link></h2>
                  <span className="badge bg-secondary align-self-start">{item.availability_status}</span>
                </div>
                <p className="mb-1">{formatCurrency(item.price_per_unit)} / {item.unit}</p>
                <p className="small text-muted">{item.farmer_name} · {item.district} · saved {formatDate(item.saved_at)}</p>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Favorites;