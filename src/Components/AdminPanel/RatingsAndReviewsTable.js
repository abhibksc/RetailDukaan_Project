// src/components/RatingsAndReviewsTable.js
import React, { useState } from 'react';
import { AiOutlineEye } from 'react-icons/ai';

const reviewsData = [
  {
    id: 'A101',
    overallRating: 4.1,
    totalRatings: 6612,
    totalReviews: 62,
    reviews: [
      { user: 'Hari Haran', rating: 1, review: 'No cooling... very disappointed', date: '3 months ago' },
      { user: 'Patron Moyo', rating: 5, review: 'What a nice product you offer', date: 'a month ago' },
      { user: 'Aman Otaku', rating: 4, review: 'Good for this hot weather', date: 'a month ago' },
      { user: 'ARINDAM DAS, Kolkata', rating: 5, review: 'Good Product', date: '17 days ago' },
      { user: 'Shristi Kumari', rating: 1, review: "It's taste was not too good?", date: '3 months ago' },
    ],
  },
  // Add more items if needed...
];

const RatingsAndReviewsTable = () => {
  const [selectedReview, setSelectedReview] = useState(null);

  const openModal = (item) => {
    setSelectedReview(item);
  };

  const closeModal = () => {
    setSelectedReview(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Ratings and Reviews</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="w-full bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Item ID</th>
              <th className="py-2 px-4 border-b text-left">Rating & Review</th>
              <th className="py-2 px-4 border-b text-left">Stars</th>
            </tr>
          </thead>
          <tbody>
            {reviewsData.map((item) => (
              <tr key={item.id} className="w-full border-b">
                <td className="py-2 px-4">{item.id}</td>
                <td className="py-2 px-4  text-start">
                  <button onClick={() => openModal(item)} className="text-blue-500 hover:text-blue-700">
                    <AiOutlineEye size={20} />
                  </button>
                </td>
                <td className="py-2 px-4">
                  <span className="text-yellow-500 font-bold">{item.overallRating} ★</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Item {selectedReview.id} - {selectedReview.overallRating} ★</h3>
            <p className="mb-2"><strong>Total Ratings:</strong> {selectedReview.totalRatings}</p>
            <p className="mb-4"><strong>Total Reviews:</strong> {selectedReview.totalReviews}</p>
            <h4 className="text-lg font-semibold mb-2">User Reviews:</h4>
            <ul className="space-y-2">
              {selectedReview.reviews.map((review, index) => (
                <li key={index} className="border-t pt-2">
                  <p><strong>User:</strong> {review.user}</p>
                  <p><strong>Rating:</strong> {review.rating} ★</p>
                  <p><strong>Review:</strong> {review.review}</p>
                  <p className="text-gray-500 text-sm">{review.date}</p>
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingsAndReviewsTable;
