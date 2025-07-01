import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Admin_getReferralMilestones, getReferralDetails, getReferralMilestones, getReferralTransactions, GetUser_RefferalWallet } from "../../CrudOperations/GetOperation";
import { baseUIurl } from "../../CrudOperations/customURl";





const VisualMilstone = ({isModalOpen}) => {
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



  // Retrived user Refferal  Milestone

  const Retrived_user_refferal_milestone = async () => {
    try {
      const response = await Admin_getReferralMilestones();
      console.log(response);

      if (response?.data?.message === "All configured referral milestones fetched successfully.") {
        setMilestones(response?.data?.data);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.messsage || error?.response?.data?.error
      );
    }
  };


  useEffect(() => {
    Retrived_user_refferal_milestone();

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
  }, [isModalOpen]);

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
    <div className="mt-20">
      {/* 🟢 Referral Promo Banner */}


      {/* 🏆 Milestone Timeline */}
      <div className="bg-white border shadow mb-4 rounded-lg p-4 max-w-full mx-auto">
        <h2 className="font-bold text-xl mb-4">Customer Visualization</h2>
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





    </div>
  );
};

export default VisualMilstone;
