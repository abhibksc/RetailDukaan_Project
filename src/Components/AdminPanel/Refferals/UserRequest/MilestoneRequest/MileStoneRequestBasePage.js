import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BackButton from "../../../../BackButton";
import PaginationExample from "../../../../PaginationExample";
import LoadingModal from "../../../../LoadingModal";
import { performAcceptOrderAction } from "../../../../CrudOperations/Update&Edit";
import useMilestoneRequest from "../../../../Utility/useMilestoneRequest";
import successTone from ".././../../../../assets/tones/successtone.mp3";

const MileStoneRequestBasePage = () => {
  const { MilestoneRequests , Accept_Users_Milestone_Request  } = useMilestoneRequest();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;
  const [loading, setIsLoad] = useState(false);

  const pageCount = Math.ceil(MilestoneRequests.length / itemsPerPage) || 1;
  const validCurrentPage = Math.max(0, Math.min(currentPage, pageCount - 1));

  const displayedMilestoneRequest = MilestoneRequests.slice(
    validCurrentPage * itemsPerPage,
    (validCurrentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };


  const playSuccessTone = () => {
    const audio = new Audio(successTone);
    audio.play();
  };

    const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
            User's MileStone Request
          </h1>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">S.No</th>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">Referrer Id</th>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">Name</th>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">Email</th>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">Phone</th>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">Date</th>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">Request Type</th>
                 <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">Achieved</th>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">Status</th>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedMilestoneRequest.map((item, index) => (
              <tr key={item.request_id} className="bg-white hover:bg-gray-50">
                <td className="py-3 px-5 border-b border-gray-200">{index + 1}</td>
                <td className="py-3 px-5 border-b border-gray-200">{item.Unique_userId}</td>
                <td className="py-3 px-5 border-b border-gray-200">{item.user_name || "N/A"}</td>
                <td className="py-3 px-5 border-b border-gray-200">{item.email || "N/A"}</td>
                <td className="py-3 px-5 border-b border-gray-200">{item.phone || "N/A"}</td>
                 <td className="py-3 px-5 border-b border-gray-200">{formatDate(item.created_at)}</td>
                <td className="py-3 px-5 border-b border-gray-200">Milestone Achieve</td>
                             <td className="py-3 px-5 border-b border-gray-200">{item.MileStoneName} ({item.referrals_required})</td>
                <td className="py-3 px-5 border-b border-gray-200">{item.status}</td>
                <td className="border-b border-gray-200">
                  {item.status !== "claimed" ? (
                    <button
                      className="p-2 w-full  shadow-lg rounded-sm text-green-500 border hover:text-green-700 hover:shadow-md hover:rounded-md"
                      onClick={() => Accept_Users_Milestone_Request(item.request_id,"Accept","claimed" , playSuccessTone)}
                    >
                      Accept
                    </button>
                  ) : (
                    <div className="p-1 text-center rounded-md shadow text-white bg-green-400">
                      Accepted
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationExample pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  );
};

export default MileStoneRequestBasePage;
