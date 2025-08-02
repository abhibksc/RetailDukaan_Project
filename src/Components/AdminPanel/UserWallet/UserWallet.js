import React, { useEffect, useState } from "react";
import axios from "axios";
import baseurl from "../../CrudOperations/customURl";
import { toast } from "react-toastify";
import { Loader2, Search } from "lucide-react";

const UserWallet = () => {
  const [walletData, setWalletData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchWallets = async () => {
    try {
      const token = localStorage.getItem("Merchanttoken");
      if (!token) {
        toast.error("Token missing. Please login.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${baseurl}/api/admin/getAllUsersWalletsWithTransactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.data || [];
      setWalletData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      toast.error("Failed to fetch wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = walletData.filter((user) => {
      return (
        user.name?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
        <span className="ml-2 text-gray-500">Loading Wallet Data...</span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
        All Users' Wallets
      </h1>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name, phone or email"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-indigo-500"
        />
      </div>

      {/* Wallet Cards */}
      {paginatedData.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        paginatedData.map((user, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md border rounded-xl p-6 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-bold text-indigo-600">{user.name || "Unnamed User"}</h2>
                <p className="text-gray-700 text-sm">User ID: {user.user_id}</p>
                <p className="text-gray-700 text-sm">Unique ID: {user.unique_user_id}</p>
                <p className="text-gray-700 text-sm">Email: {user.email}</p>
                <p className="text-gray-700 text-sm">Phone: {user.phone}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">Wallet</h3>
                <p className="text-green-700 font-bold text-lg">₹{user.wallet?.balance || "0.00"}</p>
                <p className="text-gray-600 text-sm">
                  Last Updated: {user.wallet?.last_updated || "N/A"}
                </p>
                <p className="text-gray-600 text-sm">Notes: {user.wallet?.notes || "—"}</p>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-2 text-gray-800">Transactions</h4>
              {user.wallet?.transactions?.length > 0 ? (
                <div className="overflow-auto max-h-60 border rounded-md">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 sticky top-0">
                      <tr>
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Type</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Initiator</th>
                        <th className="px-4 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.wallet.transactions.map((tx, i) => (
                        <tr key={tx.transaction_id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">{i + 1}</td>
                          <td className="px-4 py-2 text-blue-600">₹{tx.amount}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-block px-2 py-1 rounded text-white text-xs ${
                                tx.type === "credit" ? "bg-green-600" : "bg-red-500"
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-4 py-2">{tx.description || "—"}</td>
                          <td className="px-4 py-2">
                            {tx.initiator_role} (ID: {tx.initiated_by_id})
                          </td>
                          <td className="px-4 py-2">{tx.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No transactions found.</p>
              )}
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserWallet;
