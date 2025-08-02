import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import "animate.css";
import { GetNewCustomer_graph, getNewOrders, getTotalSales, MerchantDetails } from "../../CrudOperations/GetOperation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: (ctx) => ctx.chart.canvas.id,
    },
  },
};

const Dashboard = () => {
  const navigate = useNavigate();

  const Merchanttoken = localStorage.getItem('Merchanttoken');

const [totalSales, setTotalSales] = React.useState(0);  
const [newOrder, setNewOrder] = React.useState(0);  
const [customers, setCustomer] = React.useState(0);  
const [pendingOrder, setPendingOrder] = React.useState(0);  

const [salesData, setSalesData] = React.useState({
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Sales",
      data: [2000, 48, 77, 9, 100, 27, 40],
      fill: false,
      backgroundColor: "rgba(255,206,86,0.4)",
      borderColor: "rgba(255,206,86,1)",
    },
  ],
});

const [ordersData, setOrdersData] = React.useState({
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Sales",
      data: [2000, 48, 77, 9, 100, 27, 40],
      fill: false,
      backgroundColor: "rgba(255,206,86,0.4)",
      borderColor: "rgba(255,206,86,1)",
    },
  ],
});


const [customersData, setCustomersData] = React.useState({
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Customers",
      data: [18, 48, 77, 9, 100, 27, 40],
      fill: false,
      backgroundColor: "rgba(255,206,86,0.4)",
      borderColor: "rgba(255,206,86,1)",
    },
  ],
});






  useEffect(() => {

    const fun = async () => {
        const response = await MerchantDetails();
          (response);

        
        
        if (response && response?.message === "Total sales retrieved successfully") {

          setTotalSales(response?.total_sales);

          setNewOrder(response?.new_orders);

          setCustomer(response?.total_users);

          setPendingOrder(response?.pendigOrder);


          
              ('User Details:', response.id);
        } else {
              ('No response or error occurred.');
        }




        const GetTotalSales = await getTotalSales();
          (GetTotalSales);


        setSalesData({
          labels: GetTotalSales?.labels || [],
          datasets: [

            {

              label: "Sales",
              data: GetTotalSales?.datasets[0]?.data || [],
              fill: false,
              backgroundColor: "rgba(255,206,86,0.4)",
              borderColor: "rgba(255,206,86,1)",
              
            }


          ],
        });



        const GetnewOrderResponse = await GetNewCustomer_graph();
          (GetnewOrderResponse);


        setCustomersData({
          labels: GetnewOrderResponse?.labels || [],
          datasets: [

            {

              label: GetnewOrderResponse?.datasets[0]?.label || [],
              data: GetnewOrderResponse?.datasets[0]?.data || [],
              fill: false,
              backgroundColor: "rgba(255,206,86,0.4)",
              borderColor: "rgba(255,206,86,1)",
            }


          ],
        });


        










    };

    fun();



}, []);

  
  return (
    <div className="p-6 bg-gray-100 min-h-screen animate__animated animate__fadeIn">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div
        //  onClick={()=>navigate(`/admin/${Merchanttoken}/orders`)} 
         className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-lg shadow transition-transform transform hover:scale-105 hover:shadow-lg text-white">
          <h2 className="text-xl font-bold mb-2">Total Sales</h2>
          <p className="text-2xl">₹{totalSales}</p>
        </div>
        <div onClick={()=>navigate(`/admin/${Merchanttoken}/orders`)} className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-lg shadow transition-transform transform hover:scale-105 hover:shadow-lg text-white">
          <h2 className="text-xl font-bold mb-2">New Orders</h2>
          <p className="text-2xl">{newOrder}</p>
        </div>
        <div onClick={()=>navigate(`/admin/${Merchanttoken}/manage-customer`)}  
        className="bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded-lg shadow transition-transform transform hover:scale-105 hover:shadow-lg text-white">
          <h2 className="text-xl font-bold mb-2">Customers</h2>
          <p className="text-2xl">{customers}</p>
        </div>


                <div onClick={()=>navigate(`/admin/${Merchanttoken}/ManageRefferals/all-refferals-singUp-offers`)} className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-lg shadow transition-transform transform hover:scale-105 hover:shadow-lg text-white">
          <h2 className="text-xl font-bold mb-2">All Referrals</h2>
          <p className="text-2xl">{3}</p>
        </div>

        
        {/* <div onClick={()=>navigate(`/admin/${Merchanttoken}/orders`)} className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-lg shadow transition-transform transform hover:scale-105 hover:shadow-lg text-white">
          <h2 className="text-xl font-bold mb-2">Pending Orders</h2>
          <p className="text-2xl">{pendingOrder}</p>
        </div> */}
        {/* <div
          className="bg-gradient-to-r from-indigo-500 to-blue-500 p-4 rounded-lg shadow transition-transform transform hover:scale-105 hover:shadow-lg text-white cursor-pointer"
          onClick={() => navigate("/admin/customermail")}
        >
          <h2 className="text-xl font-bold mb-2">Customers Mail</h2>
          <p className="text-2xl">75</p>
        </div> */}
        {/* <div
          className="bg-gradient-to-r from-indigo-500 to-blue-500 p-4 rounded-lg shadow transition-transform transform hover:scale-105 hover:shadow-lg text-white cursor-pointer"
          onClick={() => navigate("/admin/customermail")}
        >
          <h2 className="text-xl font-bold mb-2">Refund Report</h2>
          <p className="text-[14px]">Overview of refund transactions.</p>
        </div> */}

        {/* <div
          className="bg-gradient-to-r from-indigo-500 to-blue-500 p-4 rounded-lg shadow transition-transform transform hover:scale-105 hover:shadow-lg text-white cursor-pointer"
          onClick={() => navigate("/admin/customermail")}
        >
          <h2 className="text-xl font-bold mb-2">Stock Report</h2>
          <p className="text-[14px]">reports on current stock levels, out-of-stock products, and low stock items.</p>
        </div> */}
      </div>

      <div className="flex flex-col gap-3 mb-5"> 
        {/* <div
          className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100 transition-colors border-l-4 border-blue-500"
          onClick={() => navigate("/admin/deliveryreport")}
        >
          <h2 className="text-xl font-bold mb-2">Delivery Report</h2>
          <p className="text-[14px]">
            Reports on the deliveries made, including daily, date-wise, monthly,
            quarterly, and yearly summaries.
          </p>
        </div> */}

        <div
          className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition-colors cursor-pointer border-l-4 border-red-500"
          onClick={() => navigate(`/admin/${localStorage.getItem('Merchanttoken')}/cancelRequests`)}
        >
          <h2 className="text-xl font-bold mb-2">Cancel Report</h2>
          <p className="text-[14px]">
            Reports on the cancellations, including daily, date-wise, monthly,
            quarterly, and yearly summaries.
          </p>
        </div>

      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-600">Monthly Data Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="animate__animated animate__fadeIn animate__delay-1s">
            <Line id="Monthly Sales" data={salesData} options={options} />
          </div>
          <div className="animate__animated animate__fadeIn animate__delay-2s">
            <Line id="New Orders" data={ordersData} options={options} />
          </div>
          <div className="animate__animated animate__fadeIn animate__delay-3s">
            <Line id="Customers" data={customersData} options={options} />
          </div>
        </div>
      </div>


      
    </div>
  );
};

export default Dashboard;
