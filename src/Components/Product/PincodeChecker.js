import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import usePincodeEffect from "../UseFullHooks/usePincodeEffect";
import { toast } from "react-toastify";
import LoadingModal from "../LoadingModal";

const PincodeChecker = ({ productDetails, area_pin, onPincodeChange }) => {
  const [pin, setPin] = useState(area_pin);
  const location = useLocation();
  const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
  

    const { triggerPincodeEffect } = usePincodeEffect();

  const handleCheck = async () => {

    setLoading(true);


    if (pin.length === 6) {


         const result = await triggerPincodeEffect(pin);
        
                  if (result.status !== "success") {
                    // toast.error(result.message);
                    // toast.error("invalid pincode");

                     setLoading(false);

                    return
                  }



      // Split current path
      const pathParts = location.pathname.split("/");

      // Replace last segment with new pin
      pathParts[pathParts.length - 1] = pin;

      // Join back the updated URL
      const newPath = pathParts.join("/");

      // Navigate to updated URL (force reload)
      navigate(newPath, { replace: true });
    //   window.location.reload(); // Reload the page
                     setLoading(false);

    } 
    
    else {
    setLoading(false);
          toast.error("Please enter a valid 6-digit pincode.");
    }
  };



    if (loading)
      return (
        <div className="min-h-screen">
          <LoadingModal />
        </div>
      );

  return (
    <div className="mt-4 space-y-2">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 
          ${
            productDetails.is_Deliverable
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
      >
        <span>
          {productDetails.is_Deliverable
            ? "✅ Available"
            : "❌ Not Available"}
        </span>
        <span className="font-semibold">at {area_pin}</span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter new pincode"
        />
        <button
          onClick={handleCheck}
          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition"
        >
          Check
        </button>
      </div>
    </div>
  );
};
export default PincodeChecker