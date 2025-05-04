import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { AssignDelivery_Executive__ } from "../../../CrudOperations/PostOperation";
import { getAvailableDeliveryExecutives } from "../../../CrudOperations/GetOperation";


const ReturnAssignModal = ({ oncloseModal, onSubmit ,selectedOrderIds }) => {
  const [DeliveryExecutiveList, setDeliveryExecutiveList] = React.useState([]);

  const [selectedExecutive, setSelectedExecutive] = React.useState("");

  useEffect(()=>{

const fun = async () => {   

    if(selectedOrderIds.length == 0){

        alert("Please select at least one order to assign");
        oncloseModal();
    }


    const response = await getAvailableDeliveryExecutives();

    console.log(response);

    if(response && response.data.message == "All Available executive retrieved successfully!"){
      setDeliveryExecutiveList(response.data.data);




    }
    

}

fun();

  },[])

  const handleSubmit = async() => {
    if (selectedExecutive && selectedOrderIds.length > 0) {

        console.log(selectedExecutive);
        console.log(selectedOrderIds);

        

        const response = await AssignDelivery_Executive__(selectedExecutive, selectedOrderIds);

        console.log(response);

        if(response.data.message == "Delivery Executive assigned successfully!"){
            toast.success("Delivery Executive Assigned Successfully!!");
            onSubmit(); 
          
          }else{  
            toast.error("Delivery Executive Not Assigned !!");


          }
        


    //   onSubmit(selectedExecutive, selectedOrderIds);
    //   onSubmit();
    } else {
      alert("Please select a delivery executive and at least one order.");
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Assign Delivery Executive</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Delivery Executive (Order : {selectedOrderIds.length})</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={selectedExecutive}
            onChange={(e) => setSelectedExecutive(e.target.value)}
          >
            <option value="">-- Select Executive --</option>
            {DeliveryExecutiveList.length > 0 && DeliveryExecutiveList.map((exec) => (
              <option key={exec.id} value={exec.id}>
                {exec.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={oncloseModal}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleSubmit}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnAssignModal;
