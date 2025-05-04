import React from 'react';


const Orders = () => {

  const steps = [
    { status: "Order Placed", date: "2024-07-20", isCompleted: true },
    { status: "Packed", date: "2024-07-21", isCompleted: true },
    { status: "Shipped", date: "2024-07-22", isCompleted: true },
    { status: "Out for Delivery", date: "2024-07-23", isCompleted: false },
    { status: "Delivered", date: "2024-07-23", isCompleted: false },
  ];

  
  return (
    <div className=" bg-gray-50">
      {/* Sidebar for filters */}
      
      {/* for laptop */}
      <aside className="hidden xl:block w-1/4 bg-blue-50 p-6 border-r border-gray-200">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Filters</h2>
        {/* Add your filter controls here */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Status</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg">
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Date Range</label>
          <input type="date" className="w-full p-3 border border-gray-300 rounded-lg" />
        </div>
        {/* Add more filters as needed */}
      </aside>


      {/* for mobile */}


      <aside className="mt-7 md:mt-14 xl:hidden  w-full flex gap-6  bg-blue-50  p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Filters</h2>
        {/* Add your filter controls here */}
        <div className="mb-6 flex gap-2 w ">
          {/* <label className="block text-black mb-2">Status</label> */}
          <select className="w-full  border border-gray-300 rounded-lg">
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div className="mb-6">
          {/* <label className="block text-gray-700 mb-2">Date Range</label> */}
          <input type="date" className="w-full p-3 border border-gray-300 rounded-lg" />
        </div>
        {/* Add more filters as needed */}
      </aside>

      {/* <main className=" p-8">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full p-4 border border-gray-300 rounded-lg"
          />
        </div>

        <ul className="space-y-6">
          <li className="p-6 border border-gray-300 rounded-lg bg-white">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Order #12345</h3>
            <p className="text-gray-600">Status: <span className="font-medium text-yellow-600">Pending</span></p>
            <p className="text-gray-600">Date: <span className="font-medium text-gray-800">2024-07-05</span></p>
          </li>
          <li className="p-6 border border-gray-300 rounded-lg bg-white">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Order #12346</h3>
            <p className="text-gray-600">Status: <span className="font-medium text-green-600">Completed</span></p>
            <p className="text-gray-600">Date: <span className="font-medium text-gray-800">2024-07-04</span></p>
          </li>
        </ul>
      </main> */}


<div className='p-8'>

  <div className="flex items-center space-x-4 overflow-auto">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          {/* Status Circle */}
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              step.isCompleted ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
            }`}
          >
            {index + 1}
          </div>

          {/* Connector */}
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-1 rounded-md ${
                steps[index + 1].isCompleted ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
          )}

          {/* Status Text */}
          <div className="text-sm mt-2 text-center">
            <div>{step.status}</div>
            <div className="text-xs text-gray-500">{step.date}</div>
          </div>
        </div>
      ))}
    </div>

</div>

    </div>
  );
};

export default Orders;
