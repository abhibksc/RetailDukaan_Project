import { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import { CreateRefferalConfiguration, StoreRefferalConfiguration, StoreMainGroup } from "../../CrudOperations/PostOperation";
import { Update_Main_RefferalConfiguration, Update_Main_Group, UpdateRefferal_Configuraion } from "../../CrudOperations/Update&Edit";




const AddRefferal_Configuration = ({ RefferalConfiguration, onSubmit, modalType, onClose , selectedRefferalConfiguration }) => {
  const [errors, setErrors] = useState({ desktop_image: "", mobile_image: "" });
  const [loading, setLoading] = useState(false);
  const [desktopImage, setDesktopImage] = useState(selectedRefferalConfiguration ? selectedRefferalConfiguration.RefferalConfiguration_desktop_Image : null);
  const [mobileImage, setMobileImage] = useState(selectedRefferalConfiguration ? selectedRefferalConfiguration.RefferalConfiguration_mobile_Image_url : null);
  const [name, setName] = useState(selectedRefferalConfiguration ? selectedRefferalConfiguration.name : "");


  // new

  const [referrals_required , setreferrals_required] = useState(selectedRefferalConfiguration ? selectedRefferalConfiguration.referrals_required : "");
  const [reward_amount, setreward_amount] = useState(selectedRefferalConfiguration ? selectedRefferalConfiguration.reward_amount : "");
  const [status, setStatus] = useState(selectedRefferalConfiguration ? selectedRefferalConfiguration.status : "active");
  const [MileStoneName, setMileStoneName] = useState(selectedRefferalConfiguration ? selectedRefferalConfiguration.MileStoneName : "");



  

  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject("No file selected");

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        return reject("Only jpeg, png, jpg, gif, webp images are allowed");
      }

      if (file.size > 100 * 1024) {
        return reject("Image must be ≤ 100KB");
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        if (img.width === 128 && img.height === 128) {
          resolve();
        } else {
          reject("Image must be exactly 128x128 pixels");
        }
      };

      img.onerror = () => reject("Invalid image file");
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(modalType);
    
   

    try {


console.log(reward_amount);
console.log(referrals_required);
console.log(status);



      setLoading(true);







      if (modalType === "add") {
        const response = await CreateRefferalConfiguration(reward_amount, referrals_required, status , MileStoneName);
        console.log(response);
        




        if (response.data.message === "Refferal Configuration Offer saved successfully!") {
         console.log(response.data.message);
          
          onSubmit(response)
        }
       









      }
      else if (modalType === "edit") {
        const RefferalConfiguration_id = selectedRefferalConfiguration.id;

        

        const res = await UpdateRefferal_Configuraion(  RefferalConfiguration_id,reward_amount, referrals_required, status , MileStoneName);

console.log(res);


        if (res?.data?.message === "Refferal Configuration updated successfully!") {
           
           onSubmit(res)


           
         }
        
        



      }








    } catch (error) {
      setErrors((prev) => ({ ...prev, desktop_image: error}));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
        <div className="flex flex-col gap-4 p-6 bg-white rounded-md shadow-lg">
          <Atom color="#32cd32" size="medium" text="" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Refferal Configuration</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">


             <div>
            <label className="block text-sm font-medium text-gray-700">MileStone Name*</label>
            <input
              type="text"
              className="mt-1 border p-2 w-full rounded"
              value={MileStoneName}
              onChange={(e) => setMileStoneName(e.target.value)}
              required
            />
          </div>




               <div>
            <label className="block text-sm font-medium text-gray-700">Required Customer *</label>
            <input
              type="number"
              className="mt-1 border p-2 w-full rounded"
              value={referrals_required}
              onChange={(e) => setreferrals_required(e.target.value)}
              required
            />
          </div>
  

          <div>
            <label className="block text-sm font-medium text-gray-700">Reward Amount*</label>
            <input
              type="number"
              className="mt-1 border p-2 w-full rounded"
              value={reward_amount}
              onChange={(e) => setreward_amount(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status: *
            </label>
            <select
              className="mt-1 border p-2 w-full rounded"
              value={status || "active"}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value={"active"}>Active</option>
              <option value={"inactive"}>Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRefferal_Configuration;
