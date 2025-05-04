import React, { useState } from 'react';

const Coupon = () => {
  const [coupons, setCoupons] = useState([
    {
      code: 'SUMMER21',
      discount: '15',
      startDate: '2024-07-01',
      endDate: '2024-08-01',
      minPurchaseAmount: '50',
      maxDiscountAmount: '20',
      usageLimitPerUser: '1',
      totalUsageLimit: '100',
      applicableCategories: 'Electronics, Clothing',
      description: '15% off on Electronics and Clothing',
    },
    {
      code: 'WINTER21',
      discount: '10',
      startDate: '2024-12-01',
      endDate: '2025-01-31',
      minPurchaseAmount: '30',
      maxDiscountAmount: '15',
      usageLimitPerUser: '2',
      totalUsageLimit: '200',
      applicableCategories: 'Home, Kitchen',
      description: '10% off on Home and Kitchen items',
    },
  ]);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    startDate: '',
    endDate: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    usageLimitPerUser: '',
    totalUsageLimit: '',
    applicableCategories: '',
    description: '',
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState(coupons[0]?.code || '');

  const handleAddCoupon = (e) => {
    e.preventDefault();
    setCoupons([...coupons, newCoupon]);
    setNewCoupon({
      code: '',
      discount: '',
      startDate: '',
      endDate: '',
      minPurchaseAmount: '',
      maxDiscountAmount: '',
      usageLimitPerUser: '',
      totalUsageLimit: '',
      applicableCategories: '',
      description: '',
    });
    setIsAddModalOpen(false);
  };

  const handleSendCoupon = (e) => {
    e.preventDefault();
    // Simulate sending coupon via email
    alert(`Coupon ${selectedCoupon} sent to ${email}`);
    setEmail('');
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const getStatus = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (currentDate >= start && currentDate <= end) {
      return 'Active';
    }
    return 'Expired';
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={openAddModal}
        >
          Add Coupon
        </button>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">S.No</th>
              <th className="px-4 py-2 border-b text-left">Coupon Code</th>
              <th className="px-4 py-2 border-b text-left">Discount Amount</th>
              <th className="px-4 py-2 border-b text-left">Start Date</th>
              <th className="px-4 py-2 border-b text-left">End Date</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b text-center">{index + 1}</td>
                <td className="px-4 py-2 border-b">{coupon.code}</td>
                <td className="px-4 py-2 border-b">{coupon.discount}%</td>
                <td className="px-4 py-2 border-b">{coupon.startDate}</td>
                <td className="px-4 py-2 border-b">{coupon.endDate}</td>
                <td className="px-4 py-2 border-b">{getStatus(coupon.startDate, coupon.endDate)}</td>
                <td className="px-4 py-2 border-b">
                  <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Send Coupon</h2>
        <form onSubmit={handleSendCoupon}>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <select
              value={selectedCoupon}
              onChange={(e) => setSelectedCoupon(e.target.value)}
              className="border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
              required
            >
              {coupons.map((coupon, index) => (
                <option key={index} value={coupon.code}>
                  {coupon.code} - {coupon.description}
                </option>
              ))}
            </select>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="User Email"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send Coupon
          </button>
        </form>
      </div>

      {isAddModalOpen && (
 <div className="fixed inset-0 flex items-center justify-center z-50">
 <div
   className="fixed inset-0 bg-gray-600 bg-opacity-50"
   onClick={closeAddModal}
 ></div>
 <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md mx-4 z-10 overflow-hidden">
   <div className="max-h-[80vh] overflow-auto scrollbar-hidden">
     <h2 className="text-xl font-bold text-gray-800 mb-3">Add New Coupon</h2>
     <form onSubmit={handleAddCoupon}>
  <div className="grid grid-cols-1 gap-3 mb-4">
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">Coupon Code</label>
      <input
        type="text"
        value={newCoupon.code}
        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
        className="border border-gray-300 rounded-lg w-full py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        required
      />
    </div>
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
      <textarea
        value={newCoupon.description}
        onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
        className="border border-gray-300 rounded-lg w-full py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">Discount Type</label>
      <select
        value={newCoupon.discount_type}
        onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
        className="border border-gray-300 rounded-lg w-full py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        required
      >
        <option value="percentage">Percentage</option>
        <option value="fixed">Fixed</option>
        <option value="free_shipping">Free Shipping</option>
      </select>
    </div>
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">Discount Value</label>
      <input
        type="number"
        step="0.01"
        value={newCoupon.discount_value}
        onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: e.target.value })}
        className="border border-gray-300 rounded-lg w-full py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        required
      />
    </div>
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">Minimum Purchase</label>
      <input
        type="number"
        step="0.01"
        value={newCoupon.min_purchase}
        onChange={(e) => setNewCoupon({ ...newCoupon, min_purchase: e.target.value })}
        className="border border-gray-300 rounded-lg w-full py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">Maximum Discount</label>
      <input
        type="number"
        step="0.01"
        value={newCoupon.max_discount}
        onChange={(e) => setNewCoupon({ ...newCoupon, max_discount: e.target.value })}
        className="border border-gray-300 rounded-lg w-full py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">Valid From</label>
      <input
        type="date"
        value={newCoupon.valid_from}
        onChange={(e) => setNewCoupon({ ...newCoupon, valid_from: e.target.value })}
        className="border border-gray-300 rounded-lg w-full py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        required
      />
    </div>
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">Valid To</label>
      <input
        type="date"
        value={newCoupon.valid_to}
        onChange={(e) => setNewCoupon({ ...newCoupon, valid_to: e.target.value })}
        className="border border-gray-300 rounded-lg w-full py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        required
      />
    </div>
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">Usage Limit</label>
      <input
        type="number"
        value={newCoupon.usage_limit}
        onChange={(e) => setNewCoupon({ ...newCoupon, usage_limit: e.target.value })}
        className="border border-gray-300 rounded-lg w-full py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">User Limit</label>
      <input
        type="number"
        value={newCoupon.user_limit}
        onChange={(e) => setNewCoupon({ ...newCoupon, user_limit: e.target.value })}
        className="border border-gray-300 rounded-lg w-full py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
    {/* Customer-specific Dropdown */}
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">Customer-Specific</label>
      <select
        value={newCoupon.is_customer_specific ? 'yes' : 'no'}
        onChange={(e) => setNewCoupon({ ...newCoupon, is_customer_specific: e.target.value === 'yes' })}
        className="border border-gray-300 rounded-lg w-full py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
    {/* Product-specific Dropdown */}
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">Product-Specific</label>
      <select
        value={newCoupon.is_product_specific ? 'yes' : 'no'}
        onChange={(e) => setNewCoupon({ ...newCoupon, is_product_specific: e.target.value === 'yes' })}
        className="border border-gray-300 rounded-lg w-full py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
    {/* General Coupon Dropdown */}
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">General Coupon</label>
      <select
        value={newCoupon.is_general_coupon ? 'yes' : 'no'}
        onChange={(e) => setNewCoupon({ ...newCoupon, is_general_coupon: e.target.value === 'yes' })}
        className="border border-gray-300 rounded-lg w-full py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">Is Active?</label>
      <input
        type="checkbox"
        checked={newCoupon.is_active}
        onChange={(e) => setNewCoupon({ ...newCoupon, is_active: e.target.checked })}
        className="border border-gray-300 rounded-lg py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  </div>
  <div className="flex justify-end gap-2 mt-4">
    <button
      type="button"
      className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition-colors duration-150"
      onClick={closeAddModal}
    >
      Cancel
    </button>
    <button
      type="submit"
      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors duration-150"
    >
      Add Coupon
    </button>
  </div>
</form>


   </div>
 </div>
</div>

 
    
      
      )}
    </div>
  );
};

export default Coupon;
