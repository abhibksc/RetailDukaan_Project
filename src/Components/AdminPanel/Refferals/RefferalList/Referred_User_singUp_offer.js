const ReferredUserSignupOffer = ({ closeReferred_User_singUp_offer, referred_User_singUp_offer }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white to-blue-50 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          🎁 Referred User Signup Offers
        </h2>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="px-4 py-3">Offer</th>
                <th className="px-4 py-3">Cashback</th>
                <th className="px-4 py-3">Purchase Status</th>
                <th className="px-4 py-3">Reward Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {referred_User_singUp_offer?.map((offer, index) => (
                <tr key={index} className="hover:bg-blue-50 transition-all">
                  <td className="px-4 py-2 font-medium">{offer.offer1}</td>
                  <td className="px-4 py-2">₹{offer.offer_cashback}</td>
                  <td className="px-4 py-2 capitalize">{offer.purchasedByRefree}</td>
                  <td className="px-4 py-2 capitalize">{offer.reward_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={closeReferred_User_singUp_offer}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferredUserSignupOffer;
