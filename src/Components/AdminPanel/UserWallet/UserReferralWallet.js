import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import baseurl from "../../CrudOperations/customURl";

const ITEMS_PER_PAGE = 5;

const UserReferralWallet = () => {
  const [wallets, setWallets] = useState([]);
  const [filteredWallets, setFilteredWallets] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchReferralWallets = async () => {
    const token = localStorage.getItem("Merchanttoken");
    if (!token) {
      toast.error("Token missing. Please login.");
      return;
    }

    try {
      const res = await axios.get(`${baseurl}/api/admin/getAllReferralWalletsAndTransactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status) {
        setWallets(res.data.data);
        setFilteredWallets(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to load wallet data.");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(err?.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralWallets();
  }, []);

  useEffect(() => {
    const filtered = wallets.filter((wallet) =>
      wallet.user_id.toString().includes(searchTerm.trim())
    );
    setFilteredWallets(filtered);
    setCurrentPage(1); // reset to first page when searching
  }, [searchTerm, wallets]);

  const toggleExpand = (userId) => {
    setExpanded((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentWallets = filteredWallets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredWallets.length / ITEMS_PER_PAGE);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Referral Wallets</h2>

      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search by User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute top-2.5 left-3 text-gray-500 w-5 h-5" />
        </div>
      </div>

      {currentWallets.length === 0 ? (
        <div className="text-center text-gray-600">No wallet data found.</div>
      ) : (
        <div className="space-y-4">
          {currentWallets.map((wallet) => (
            <div key={wallet.user_id} className="border rounded-lg shadow p-4 bg-white">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(wallet.user_id)}
              >
                <div>
                  <p><strong>User ID:</strong> {wallet.user_id}</p>
                  <p><strong>Wallet Balance:</strong> ₹{wallet.wallet_balance}</p>
                  <p><strong>Last Transaction:</strong> {wallet.last_transaction_date}</p>
                </div>
                <div>{expanded[wallet.user_id] ? <ChevronUp /> : <ChevronDown />}</div>
              </div>

              {expanded[wallet.user_id] && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Transactions</h3>
                  {wallet.transactions.length === 0 ? (
                    <p className="text-sm text-gray-500">No transactions found.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm text-left border rounded-md overflow-hidden">
                        <thead className="bg-gray-100 text-xs uppercase">
                          <tr>
                            <th className="p-2 border">Txn ID</th>
                            <th className="p-2 border">Type</th>
                            <th className="p-2 border">Amount</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Date</th>
                            <th className="p-2 border">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wallet.transactions.map((txn) => (
                            <tr key={txn.id} className="border-b hover:bg-gray-50">
                              <td className="p-2 border">{txn.id}</td>
                              <td className="p-2 border capitalize">{txn.transaction_type}</td>
                              <td className="p-2 border">₹{txn.amount}</td>
                              <td className="p-2 border">{txn.status}</td>
                              <td className="p-2 border">{txn.transaction_date}</td>
                              <td className="p-2 border">{txn.remarks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserReferralWallet;
