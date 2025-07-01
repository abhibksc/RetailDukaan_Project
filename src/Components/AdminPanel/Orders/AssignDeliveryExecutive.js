import React, { useEffect, useState } from "react";
import { getAllNotAssignedOrder } from "../../CrudOperations/GetOperation";
import { useNavigate } from "react-router-dom";
import AssignModal from "./AssignModal";
import { toast } from "react-toastify";
import BackButton from "../../BackButton";
import { MakeDeliveryBoyFreeModal } from "./OrderModals";

const AssignDeliveryExecutive = () => {
  const navigate = useNavigate();
  const [NotAssignedOrder, setNotAssignedOrder] = useState([]);
  const [FilterNotAssignedOrder, setFilterNotAssignedOrder] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]); // Track selected orders
  const [isMakeDelvieryBoyFreeModalOpen, setIsMakeDeliveryBoyFreeModalOpen] =
    useState(false);
  const [makeDeliveryBoyData, setmakeDeliveryBoyData] = useState("");

  const [isModalOpen, setIsOpenModal] = useState(false); // Track selected orders

  useEffect(() => {
    const fetchPincodes = async () => {
      const response = await getAllNotAssignedOrder();

      if (
        response.data.message === "All NotAssignedOrder Retrive Successfully!!"
      ) {
        setNotAssignedOrder(response.data.data);
        setFilterNotAssignedOrder(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    };
    fetchPincodes();
  }, []);

  const handleCheckboxChange = (orderId) => {
    setSelectedOrderIds(
      (prevSelected) =>
        prevSelected.includes(orderId)
          ? prevSelected.filter((id) => id !== orderId) // Remove if already selected
          : [...prevSelected, orderId] // Add if not selected
    );
  };

  const handleAssignClick = () => {
    setIsOpenModal(!isModalOpen);
    console.log("Selected Order IDs:", selectedOrderIds);
  };

  // handleOnDelivery

  const handleOnDelivery = () => {
    navigate(
      `/admin/${localStorage.getItem("Merchanttoken")}/order/ondelivery`
    );
  };

  const handleOnAssigningTheExecutive = async () => {
    const response = await getAllNotAssignedOrder();
    console.log(response);

    if (
      response.data.messsage === "All NotAssignedOrder Retrive Successfully!!"
    ) {
      console.log(response.data.data);
      setNotAssignedOrder(response.data.data);
      setFilterNotAssignedOrder(response.data.data);
    }

    setIsOpenModal(!isModalOpen);

    console.log("Assigning the executive");
  };

  const handlemakeDeliveryBoyFreee = () => {
    setIsMakeDeliveryBoyFreeModalOpen(!isMakeDelvieryBoyFreeModalOpen);
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-lg shadow-gray-500">
      <div className="flex flex-row justify-between w-full mb-7">
        <div className="flex gap-5">
          <BackButton className="" />
          <h1 className="text-lg font-bold border-b-2 text-gray-800">
            Delivery : Assign Delivery Executive
          </h1>
        </div>

        <div className="flex justify-center gap-3">
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
            onClick={handlemakeDeliveryBoyFreee}
          >
            Make Available
          </button>

          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
            onClick={handleOnDelivery}
          >
            On the way
          </button>

          <button
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
            onClick={handleAssignClick}
          >
            Assign Selected Orders
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                Select
              </th>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                Order ID
              </th>
              <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                Pincode
              </th>
            </tr>
          </thead>
          <tbody>
  {NotAssignedOrder.length > 0 ? (
    NotAssignedOrder.map((item) => (
      <tr key={item.id}>
        <td className="py-3 px-5 border-b border-gray-200">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            onChange={() => handleCheckboxChange(item.un_Order_id)}
          />
        </td>
        <td className="py-3 px-5 border-b border-gray-200">
          {item.un_Order_id}
        </td>
        <td className="py-3 px-5 border-b border-gray-200">
          {item.pin_code}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" className="py-3 px-5 text-center text-gray-500">
        NO any pending order exists
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      {isModalOpen && (
        <AssignModal
          oncloseModal={handleAssignClick}
          onSubmit={handleOnAssigningTheExecutive}
          selectedOrderIds={selectedOrderIds}
        />
      )}

      {isMakeDelvieryBoyFreeModalOpen && (
        <MakeDeliveryBoyFreeModal
          close={handlemakeDeliveryBoyFreee}
          makeDeliveryBoyData={makeDeliveryBoyData}
        />
      )}
    </div>
  );
};

export default AssignDeliveryExecutive;
