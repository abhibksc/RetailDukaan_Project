import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BackButton from "../../../../BackButton";
import PaginationExample from "../../../../PaginationExample";
import LoadingModal from "../../../../LoadingModal";
import useMilestoneRequest from "../../../../Utility/useMilestoneRequest";

import successTone from ".././../../../../assets/tones/successtone.mp3";

const SingupRequestBasePage = () => {
  const { sinupOfferReward_Requests, singupOfferReward_claim } =
    useMilestoneRequest(); // array of pending rewards
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;
  const [loading, setIsLoad] = useState(false);

  const pageCount =
    Math.ceil(sinupOfferReward_Requests.length / itemsPerPage) || 1;
  const validCurrentPage = Math.max(0, Math.min(currentPage, pageCount - 1));

  const displayedRequests = sinupOfferReward_Requests.slice(
    validCurrentPage * itemsPerPage,
    (validCurrentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return dateString
      ? new Date(dateString).toLocaleDateString(undefined, options)
      : "N/A";
  };

  const playSuccessTone = () => {
    const audio = new Audio(successTone);
    audio.play();
  };

  const handleRewardAction = async (id) => {
    try {
      setIsLoad(true);
      // Example API call or action logic
      // await performAcceptOrderAction(id);

      toast.success("Reward marked successfully!");
      playSuccessTone();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoad(false);
    }
  };

  return loading ? (
    <LoadingModal />
  ) : (
    <div className="p-6 bg-white rounded-md shadow-lg shadow-gray-500">
      <div className="flex flex-row justify-between w-full mb-7">
        {loading && <LoadingModal />}
        <div className="flex gap-3">
          <BackButton />
          <h1 className="text-[16px] mt-2 font-bold text-gray-800">
            User's SignUp Offer Reward Requests
          </h1>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Referrer</th>
              <th className="py-2 px-4 text-left">Referred</th>
              <th className="py-2 px-4 text-left">Offer</th>
              <th className="py-2 px-4 text-left">Total Reward</th>
              <th className="py-2 px-4 text-left">Claimed At</th>
              <th className="py-2 px-4 text-left">Availed At</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedRequests.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5 text-gray-500">
                  No pending reward requests.
                </td>
              </tr>
            ) : (
              displayedRequests.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">
                    <div>
                      <div className="font-semibold">
                        {item.referrer?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.referrer?.email || "N/A"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.referrer?.unique_user_id || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div>
                      <div className="font-semibold">
                        {item.referred?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.referred?.email || "N/A"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.referred?.unique_user_id || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div>
                      <div className="font-semibold">
                        {item.signup_offer?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.signup_offer?.description || ""}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4 font-semibold text-green-600">
                    ₹{item.total_reward}
                  </td>
                  <td className="py-2 px-4">
                    {formatDate(item.offer_claimed_at)}
                  </td>
                  <td className="py-2 px-4">
                    {formatDate(item.is_offer_availed)}
                  </td>
                  <td className="py-2 px-4">
                    {item.is_offer_availed && item.is_offer_claimed ? (
                      <button
                        disabled
                        className="px-4 py-1 text-sm rounded bg-green-500 text-white cursor-not-allowed"
                      >
                        Rewarded
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          singupOfferReward_claim(
                            item.referrer_SignUp_Offers_id,
                            playSuccessTone
                          )
                        }
                        className="px-4 py-1 text-sm rounded bg-orange-500 text-white hover:bg-orange-600"
                      >
                        Mark as Rewarded
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationExample
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SingupRequestBasePage;
