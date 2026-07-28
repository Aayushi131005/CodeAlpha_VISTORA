import { useEffect, useState } from "react";
import {
  getReviews,
  addReview,
} from "../api/reviewApi";

const ReviewSection = ({ productId }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const data = await getReviews(productId);
      setReviews(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      await addReview({
        productId,
        userId: user._id,
        name: user.name,
        rating,
        comment,
      });

      setRating(5);
      setComment("");

      loadReviews();

      window.location.reload();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to add review");
    }
  };

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold mb-8">
        Customer Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">
          No reviews yet.
        </p>
      ) : (
        <div className="space-y-6 mb-12">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border rounded-xl p-5"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold">
                  {review.name}
                </h3>

                <span className="text-yellow-500">
                  {"⭐".repeat(review.rating)}
                </span>
              </div>

              <p className="text-gray-600 mt-2">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {user && (
        <form
          onSubmit={handleSubmit}
          className="border rounded-xl p-6 space-y-4"
        >
          <h3 className="text-2xl font-bold">
            Write a Review
          </h3>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded-lg p-3 w-full"
          >
            <option value={5}>★★★★★ (5)</option>
            <option value={4}>★★★★☆ (4)</option>
            <option value={3}>★★★☆☆ (3)</option>
            <option value={2}>★★☆☆☆ (2)</option>
            <option value={1}>★☆☆☆☆ (1)</option>
          </select>

          <textarea
            rows="4"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border rounded-lg p-3 w-full"
            required
          />

          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewSection;