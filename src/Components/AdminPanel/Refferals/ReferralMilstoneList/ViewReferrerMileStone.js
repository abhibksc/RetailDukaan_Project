import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Admin_ReferrerMilestoneTracking } from "../../../CrudOperations/GetOperation";

const ViewReferrerMileStone = () => {
  const { referrer_id } = useParams();
  const [milestoneData, setMilestoneData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await Admin_ReferrerMilestoneTracking(referrer_id);
        setMilestoneData(response?.data?.achievements || []);
      } catch (error) {
        console.error("Error fetching milestone data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, [referrer_id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        🎯 Referrer Milestone Timeline
      </h2>

      {milestoneData.length === 0 ? (
        <p className="text-center text-gray-500">No milestones achieved yet.</p>
      ) : (
        <div className="relative border-l border-blue-400 pl-6 space-y-10">
          {milestoneData.map((milestone, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-3 top-1.5 w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg z-10" />
              <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-blue-700">
                  Milestone #{milestone.milestone_id}
                </h3>
                <p className="text-sm text-gray-600">
                  🔢 Referrals Required: <strong>{milestone.referrals_required}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  💰 Reward: ₹{milestone.reward_amount}
                </p>
                <p className="text-xs text-gray-500">
                  🗓️ Achieved: {new Date(milestone.achieved_on).toLocaleString()}
                </p>

                {milestone.transactions?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2 text-gray-700">
                      Transactions:
                    </h4>
                    <div className="space-y-2">
                      {milestone.transactions.map((txn, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center text-sm border-b pb-1 text-gray-700"
                        >
                          <span className="font-medium text-green-700">
                            ₹{txn.amount}
                          </span>
                          <span className="text-gray-500 truncate w-1/2">{txn.remarks}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(txn.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewReferrerMileStone;
