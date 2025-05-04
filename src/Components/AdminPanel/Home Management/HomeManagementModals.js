import React, { useState } from "react";




export const ViewFeaturedImages = ({ closeModal, modalImage }) => {
  const [hoveredImage, setHoveredImage] = useState(null);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg  relative">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Featured Images
        </h2>
        <div className="overflow-auto max-h-96">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Preview
                </th>
              </tr>
            </thead>
            <tbody>
              {modalImage.map((ele, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition-colors"
                >
                  {/* Image preview */}
                  <td className="border border-gray-300 px-4 py-2 relative">
                    <img
                      src={ele.ImageUrl}
                      alt="Featured"
                      className="w-16 h-16 object-cover rounded cursor-pointer"
                      onClick={() => window.open(ele.ImageUrl, "_blank")}
                    />
                    {/* Hovered image preview */}
                    {hoveredImage === ele.ImageUrl && (
                      <div className="absolute top-0 left-20 w-64 h-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        <img
                          src={ele.ImageUrl}
                          alt="Hovered Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={closeModal}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};






export const ViewFeaturedOffers = ({ closeModal, modaloffers }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-6xl w-full relative shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Featured Offers
        </h2>
        <div className="overflow-auto max-h-96">
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Offer Title</th>
                <th className="border border-gray-300 px-4 py-2">% Price</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {modaloffers.map((offer, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition-colors text-gray-800"
                >
                    <td className="border border-gray-300 px-4 py-2">
                    {offer.uniqueOfferId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {offer.offerName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    %{offer.OfferPercentValue}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {offer.Status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={closeModal}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};


