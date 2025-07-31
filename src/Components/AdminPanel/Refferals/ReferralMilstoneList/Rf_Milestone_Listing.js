import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { FaListAlt } from "react-icons/fa";
import ReferredUserSignupOffer from "../RefferalList/Referred_User_singUp_offer";
import Referred_user_Modal from "../RefferalList/Referred_user_Modal";
import BackButton from "../../../BackButton";
import PaginationExample from "../../../PaginationExample";
import {
  Admin_all_referrals,
  Admin_ReferrerMilestoneSummary,
} from "../../../CrudOperations/GetOperation";
import LoadingModal from "../../../LoadingModal";
import { useNavigate } from "react-router-dom";

const Rf_Milestone_Listing = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9; // Number of items per page

  const [Referrals, setReferrals] = useState([]);

  const [loading, setIsLoad] = useState(false);
  const [referred_user, setReferred_user] = useState(null);
  const [referred_User_singUp_offer, setReferred_User_singUp_offer] =
    useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, new, old

  useEffect(() => {
    setIsLoad(true);
    const fun = async () => {
      try {
        const response = await Admin_ReferrerMilestoneSummary();
        console.log(response);

        if (
          response?.data?.message ===
"Referrer milestone reward summary fetched successfully."
        ) {
          console.log(response);

          setReferrals(response?.data?.data);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Error"
        );
      } finally {
        setIsLoad(false);
      }
    };

    fun();
  }, []);

  // Filter and search logic
  let filteredOrders = Referrals.filter((reff) => {
    const hasPending = reff?.selected_offer?.some(
      (ele) => ele.purchasedByRefree === "pending"
    );

    if (filter === "all") return true;
    if (filter === "pending" && hasPending) return true;

    return false;
  }).reverse();

  const pageCount = Math.ceil(filteredOrders.length / itemsPerPage) || 1;

  const validCurrentPage = Math.max(0, Math.min(currentPage, pageCount - 1));

  // Determine items for the current page
  const displayedOrders = filteredOrders.slice(
    validCurrentPage * itemsPerPage,
    (validCurrentPage + 1) * itemsPerPage
  );

  // Handle page changekrchuke
  const handlePageChange = ({ selected }) => {
    selected;

    setCurrentPage(selected);
  };


  const handleMileStone = (referrer_id)=>{


const token = localStorage.getItem('Merchanttoken');
const url = `/admin/${token}/ManageRefferals/all-refferals-milestone/milstone/${referrer_id}`;

window.open(url, '_blank');



  }

  return loading ? (
    <LoadingModal />
  ) : (
    <div className="min-h-screen p-6 bg-white rounded-md shadow-lg shadow-gray-500">
      <div className="flex flex-row  justify-between  w-full ">
        {loading && <LoadingModal />}
        <div className="flex flex-row  justify-between  w-full mb-7">
          <div className="flex gap-3">
            <BackButton />
            <h1 className="text-2xl font-bold text-gray-800 mt-2">
              Manage Referral MileStone
            </h1>
          </div>

          <div className="flex justify-center gap-4"></div>
        </div>
      </div>

      {referred_user && (
        <Referred_user_Modal
          closeReferredUserModal={() => setReferred_user(null)}
          referred_user={referred_user}
        />
      )}

      {referred_User_singUp_offer && (
        <ReferredUserSignupOffer
          closeReferred_User_singUp_offer={() =>
            setReferred_User_singUp_offer(null)
          }
          referred_User_singUp_offer={referred_User_singUp_offer}
        />
      )}

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Referral"
          className="border px-4 py-2 rounded-md w-full sm:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filter Dropdown */}
        <select
          className="border px-4 py-2 rounded-md w-full sm:w-1/4"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">pending</option>
        </select>
      </div>

      {console.log(Referrals)
      }

      {!displayedOrders.length > 0 ? (
        <div className="mt-10 ">
          <div className="text-red-500">NO Any Refferal!!</div>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr>
                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    S. no
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Customer Id
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Name
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Email
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Number
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    MileStone
                  </th>



                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Total Reward
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchQuery
                  ? Referrals.filter(
                      (ele) =>
                        ele?.referrer?.unique_id?.toLowerCase() ===
                        searchQuery.toLowerCase()
                    ).map((item, index) => (
                      <tr key={index}>
                        <td className="py-3 px-5 border-b border-gray-200">
                          {index + 1}
                        </td>

                        <td className="py-3 px-5 border-b border-gray-200">
                          {item?.referrer?.unique_id}
                        </td>

                        <td className="py-3 px-5 border-b border-gray-200">
                          {item?.referrer?.name}
                        </td>

                        <td className="py-3 px-5 border-b border-gray-200">
                          {item?.referrer?.email}
                        </td>

                        <td className="py-3 px-5 border-b border-gray-200">
                          {item?.referrer?.phone}
                        </td>

                        <td
                          className="py-3 px-5 border-b cursor-pointer border-gray-200"
                          onClick={() => setReferred_user(item?.referred_user)}
                        >
                          <FaListAlt size={20} />
                        </td>

                        <td
                          className="py-3 px-5 border-b cursor-pointer border-gray-200"
                          onClick={() =>
                            setReferred_User_singUp_offer(item?.selected_offer)
                          }
                        >
                          <FaListAlt size={20} />
                        </td>

                        <td className="py-3 px-5 border-b border-gray-200">
                          {" "}
                          {dayjs(item?.referrer?.referral_created_at).format(
                            "DD/MM/YYYY"
                          )}{" "}
                        </td>

                        <td className="py-3 px-5 border-b border-gray-200">
                          {item?.referral_reward_from_this_user}
                        </td>
                      </tr>
                    ))
                  : displayedOrders.map((item, index) => (
                      <tr key={index}>
                        <td className="py-3 px-5 border-b border-gray-200">
                          {index + 1}
                        </td>

                        <td className="py-3 px-5 border-b border-gray-200">
                          {item?.referrer_id}
                        </td>

                        <td className="py-3 px-5 border-b border-gray-200">
                          {item?.name}
                        </td>

                        <td className="py-3 px-5 border-b border-gray-200">
                          {item?.email}
                        </td>

                                <td className="py-3 px-5 border-b border-gray-200">
                          {item?.phone}
                        </td>


                        <td
                          className="py-3 px-5 border-b cursor-pointer border-gray-200"
                          onClick={() => handleMileStone(item?.referrer_database_id)}
                        >
                          <FaListAlt size={20} />
                        </td>

          
                      

                        <td className="py-3 px-5 border-b border-gray-200">
                          {item?.total_reward_earned_by_milestone}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          <PaginationExample
            pageCount={pageCount}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Rf_Milestone_Listing;
