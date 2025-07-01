import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setLat_Long_Location, updateAreaPin } from "../ReduxStore/Slices/auth";
import { fetchHomeData } from "../ReduxStore/Slices/homeSlice";

const usePincodeEffect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const triggerPincodeEffect = async (pincode) => {
    console.log(pincode);
    
    const apiEndpoint = `https://api.postalpincode.in/pincode/${pincode}`;

    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();

      if (data[0].Status === "Success") {

        return { status: "success", message: "Pincode Available" };
     
      } else {
        toast.warn("Wrong pincode");
        return { status: "error", message: "Wrong Pincode" };
      }
    } catch (error) {
      toast.warn("Error while getting pincode info");
      return { status: "error", message: "Network Error" };
    }
  };


  return { triggerPincodeEffect };
};

export default usePincodeEffect;
