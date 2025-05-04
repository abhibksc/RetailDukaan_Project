import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5"; // Import close icon from React Icons
import { verifyMailOtp, verifyNumberOtp } from "../CrudOperations/Update&Edit";
import { useDispatch, useSelector } from "react-redux";
import { updateEmail, updateNumber } from "../ReduxStore/Slices/auth";

const Mail_Varification_Modal = ({ close, mail, editMail }) => {
  console.log("running...");

  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const registered = useSelector((state) => state.auth.registered);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  const handleOTP = () => {
    if (otp) {
      const fun = async () => {

        console.log(registered);
        console.log(mail);

        

        const response = await verifyMailOtp({
          email: mail,
          emailOtp: otp,
          registered,
          token,
          id: userId,
        });

        if (response) {
          console.log(response);
          dispatch(updateEmail(response.data.email));
          alert("Successfully verified");
          editMail();
          close();
        }
      };

      fun();
    }
  };

  return (
    <div className="fixed z-20 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="relative">
        <div className="absolute top-0 right-0 mt-2 mr-1">
          <button
            className="text-gray-700 hover:text-gray-900"
            onClick={() => close()}
          >
            <IoCloseOutline className="text-2xl" /> {/* Close icon */}
          </button>
        </div>
        <div className="bg-white-500 p-6 rounded-lg max-w-lg w-full">
          <input
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
            className="border mx-auto w-full p-2 rounded-md"
            type="text"
          />
          <button
            onClick={handleOTP}
            className="mx-auto w-full  p-2 hover:text-blue-400"
          >
            verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mail_Varification_Modal;
