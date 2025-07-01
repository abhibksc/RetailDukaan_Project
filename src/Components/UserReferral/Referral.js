import React, { useEffect, useState } from "react";
import {
  getReferralDetails,
  getReferralMilestones,
  getReferralTransactions,
  GetUser_RefferalWallet,
} from "../CrudOperations/GetOperation";
import { toast } from "react-toastify";
import { baseUIurl } from "../CrudOperations/customURl";
import { useSelector } from "react-redux";

const Referral = () => {
  const Refferal_code = useSelector((state) => state.auth.referral_code);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState([]);

  const [selectedReferralDetail, setSelectedReferralDetail] = useState(null);
  const [showReferralModal, setShowReferralModal] = useState(false);

  const [referrals, setReferrals] = useState([]);
  const [walletBalance, setWalletBalance] = useState({
    created_at: "",
    id: "",
    last_transaction_date: "",
    referral_balance: 0.0,
    updated_at: "",
    user_id: "",
  });
  const [milestones, setMilestones] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [upiId, setUpiId] = useState("");

  const handleShowOfferDetails = (offers) => {
    setSelectedOffer(offers);
    setShowModal(true);
  };

  const handleShowReferralDetails = (details) => {
    setSelectedReferralDetail(details);
    setShowReferralModal(true);
  };

  // Retrived user Refferal Wallet

  const Retrived_user_refferal_wallet = async () => {
    try {
      const response = await GetUser_RefferalWallet();
      console.log(response);

      if (
        response?.data?.message ===
        "All Refferal wallet retrieved successfully!"
      ) {
        setWalletBalance(response?.data?.data);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.messsage || error?.response?.data?.error
      );
    }
  };

  // Retrived user Refferal  Milestone

  const Retrived_user_refferal_milestone = async () => {
    try {
      const response = await getReferralMilestones();
      console.log(response);

      if (response?.data?.message === "Milestones retrieved successfully") {
        setMilestones(response?.data?.data);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.messsage || error?.response?.data?.error
      );
    }
  };

  // Retrived user Refferal  history

  const Retrived_user_refferal_history = async () => {
    try {
      const response = await getReferralDetails();
      console.log(response);

      if (response?.data?.message === "Referral details fetched successfully") {
        setReferrals(response?.data?.data);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.messsage || error?.response?.data?.error
      );
    }
  };


    const Retrived_user_refferal_txn = async () => {
    try {
      const response = await getReferralTransactions();
      console.log(response);

      if (response?.data?.message === "Referral transactions fetched successfully.") {
        setTransactions(response?.data?.transactions);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.messsage || error?.response?.data?.error
      );
    }
  };

  useEffect(() => {
    Retrived_user_refferal_wallet();
    Retrived_user_refferal_milestone();
    Retrived_user_refferal_history();
    Retrived_user_refferal_txn();

    // setTransactions([
    //   {
    //     id: 1,
    //     type: "credit",
    //     amount: 100,
    //     date: "2024-06-21",
    //     remarks: "Milestone 1 Completed",
    //   },
    //   {
    //     id: 2,
    //     type: "debit",
    //     amount: 50,
    //     date: "2024-06-22",
    //     remarks: "Withdrawn to Wallet",
    //   },
    // ]);
  }, []);

  const handleWithdraw = () => {
    if (!upiId.trim()) {
      alert("Please enter a valid UPI ID.");
      return;
    }

    if (walletBalance?.referral_balance < 100) {
      alert("You need at least ₹100 to withdraw.");
      return;
    }

    const amount = walletBalance?.referral_balance;

    // Simulate transaction
    setTransactions((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "debit",
        amount: amount,
        date: new Date().toISOString().slice(0, 10),
        remarks: `Withdrawn to ${upiId}`,
      },
    ]);

    setWalletBalance(0);
    setUpiId("");
    alert("Withdrawal request submitted!");
  };

  return (
    <div className="">
      {/* 🟢 Referral Promo Banner */}

      <div className="bg-gradient-to-r mb-4 from-purple-100 via-pink-100 to-yellow-100 border shadow rounded-lg p-6 max-w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">
            Refer & Earn ₹100!
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Share this link with friends. You both earn rewards when they sign
            up.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              readOnly
              value={`${baseUIurl}/referral?code=${Refferal_code}`}
              className="border rounded px-3 py-2 text-sm w-64 text-gray-700 bg-white"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${baseUIurl}/referral?code=${Refferal_code}`
                );
                alert("Referral link copied!");
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
            >
              Copy
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/?text=Join and earn ₹100: ${baseUIurl}/referral?code=${Refferal_code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm"
            >
              WhatsApp
            </a>
            <a
              href={`https://t.me/share/url?url=${baseUIurl}/referral?code=${Refferal_code}=Join now and earn rewards!`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>

      {/* 💰 Wallet Balance */}
      <div className="bg-white border shadow mb-4 rounded-lg p-4 max-w-full mx-auto">
        <h2 className="font-bold text-xl mb-2">Referral Wallet</h2>
        <p className="text-2xl font-semibold text-green-600">
          ₹{Number(walletBalance?.referral_balance || 0).toFixed(2)}
          {console.log(walletBalance?.referral_balance)}
        </p>

        {/* 🏧 Withdraw Section */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Withdraw Earnings</h3>
          {walletBalance?.referral_balance >= 100 ? (
            <div className="space-y-4">
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="Enter your UPI ID (e.g. name@upi)"
                className="border w-full px-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={handleWithdraw}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-sm"
              >
                Withdraw ₹
                {Number(walletBalance?.referral_balance || 0).toFixed(2)}
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Minimum ₹100 required to request withdrawal.
            </p>
          )}
        </div>
      </div>

      {/* 🏆 Milestone Timeline */}
      <div className="bg-white border shadow mb-4 rounded-lg p-4 max-w-full mx-auto">
        <h2 className="font-bold text-xl mb-4">Referral Milestones</h2>
        <div className="flex items-center justify-between relative">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center w-full z-10"
            >
              {index !== milestones.length - 1 && (
                <div
                  className={`absolute top-5 left-1/7 right-0 h-1 ${
                    milestones[index + 1].achieved
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                  style={{
                    width: "100%",
                    transform: "translateX(50%)",
                    zIndex: 0,
                  }}
                ></div>
              )}

              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center z-20 ${
                  milestone.achieved
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {milestone.achieved ? "✓" : index + 1}
              </div>

              <div className="mt-2 text-center text-sm w-28">
                <div className="font-semibold">Level {milestone.level}</div>
                <div className="text-gray-500">
                  {milestone.required} Referrals = ₹{milestone.reward}
                </div>
                <div
                  className={`text-xs ${
                    milestone.achieved ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {milestone.achieved ? "Achieved" : "Pending"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📋 Referral History */}
      <div className="bg-white border shadow mb-4 rounded-lg p-4 max-w-full mx-auto">
        <h2 className="font-bold text-xl mb-4">Referral History</h2>
        {referrals.length === 0 ? (
          <p className="text-gray-500">No referrals found.</p>
        ) : (
          <table className="min-w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b text-gray-600 bg-gray-50">
                <th className="py-2 px-4">UserId</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Created</th>
                <th className="py-2 px-4">Referral Info</th>

                <th className="py-2 px-4">Offer</th>
                          <th className="py-2 px-4">Total Reward</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((ref, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    {ref.referred_user_Unique_userId}
                  </td>
                  <td className="py-2 px-4">{ref.referred_user_name}</td>
                  <td className="py-2 px-4">
                    {ref.referred_user_email || "-"}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(ref.referral_created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() =>
                        handleShowReferralDetails(ref.refferal_Details)
                      }
                      className="text-purple-600 underline hover:text-purple-800 text-sm"
                    >
                      View
                    </button>
                  </td>

                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleShowOfferDetails(ref.selected_offer)}
                      className="text-blue-600 underline hover:text-blue-800 text-sm"
                    >
                      View
                    </button>
                  </td>

                     <td className="py-2 px-4">₹{ref.total_reward_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 💳 Wallet Transactions */}
      <div className="bg-white border shadow mb-4 rounded-lg p-4 max-w-full mx-auto">
        <h2 className="font-bold text-xl mb-4">Wallet Transactions</h2>
        {transactions?.length === 0 ? (
          <p className="text-gray-500">No transactions available.</p>
        ) : (
          <table className="min-w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2 px-4">Type</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Remarks</th>
                <th className="py-2 px-4">status</th>


              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 capitalize text-blue-600">
                    {txn.type}
                  </td>
                  <td className="py-2 px-4">₹{txn.transaction_type}</td>
                  <td className="py-2 px-4">{txn.amount}</td>
                  <td className="py-2 px-4">{txn.transaction_date}</td>
                  <td className="py-2 px-4">{txn.remarks}</td>
                  <td className="py-2 px-4">{txn.status}</td>


                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <h3 className="text-lg font-bold mb-4">Selected Offer Details</h3>
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-3">Offer</th>
                  <th className="py-2 px-3">Cashback</th>
                  <th className="py-2 px-3">Purchased</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedOffer.map((offer, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-3">{offer.offer1}</td>
                    <td className="py-2 px-3">₹{offer.offer_cashback}</td>
                    <td className="py-2 px-3">{offer.purchasedByRefree}</td>
                    <td className="py-2 px-3">
                      {offer.rewardStatus || "pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

{showReferralModal && (
 <div className="fixed inset-0 bg-black flex items-center justify-center  bg-opacity-30 z-50 top-0 ">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
      <h3 className="text-lg font-bold mb-4">Referral Details</h3>

      {selectedReferralDetail ? (
        <table className="min-w-full text-sm text-left border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 border font-semibold">Type</th>
              <th className="py-2 px-3 border font-semibold">Amount</th>
              <th className="py-2 px-3 border font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-3 border">Signup Bonus</td>
              <td className="py-2 px-3 border text-green-600 font-medium">
                ₹{selectedReferralDetail.signup_bonus || 0}
              </td>
              <td className="py-2 px-3 border">
                {selectedReferralDetail.signup_status === "achieved" ? (
                  <span className="text-green-700 font-semibold">Achieved</span>
                ) : (
                  <span className="text-gray-500">Pending</span>
                )}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 border">Purchased Bonus</td>
              <td className="py-2 px-3 border text-blue-600 font-medium">
                ₹{selectedReferralDetail.purchased_bonus || 0}
              </td>
              <td className="py-2 px-3 border">
                {selectedReferralDetail.purchased_status === "achieved" ? (
                  <span className="text-green-700 font-semibold">Achieved</span>
                ) : (
                  <span className="text-gray-500">Pending</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center">No referral data found.</p>
      )}

      <button
        onClick={() => setShowReferralModal(false)}
        className="absolute top-2 right-3 text-gray-600 hover:text-red-600"
      >
        ✕
      </button>
    </div>
  </div>
)}


    </div>
  );
};

export default Referral;
