import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { sendDeactivationOtp, verifyDeactivationOtp } from "../CrudOperations/Update&Edit";
import { toast } from "react-toastify";

const DeactiveModal = ({ isOpen, onClose }) => {
  const [otp, setOtp] = useState("");
  const emails = useSelector((state) => state.auth.email);
  const phones = useSelector((state) => state.auth.phone);

//   useEffect(() => {
//     document.body.classList.add("modal-open");
//     return () => {
//       document.body.classList.remove("modal-open");
//     };
//   }, []);



  useEffect(() => {
const fun = async()=>{

    const response = await sendDeactivationOtp();
    console.log(response);
    

}
fun();
  }, []);





  const handleAccountDeactivation = async ()=>{
    console.log("Chlafsd");
    
if(otp && phones){

    const response = await verifyDeactivationOtp({

        otp : otp , type : "phone_otp"



    });
    console.log(response);
}
else if(otp && emails){

    const response = await verifyDeactivationOtp({

        otp : otp , type : "mail_otp"



    });
    console.log(response);
}
else{
    toast.warn("Please enter the otp!!")
}

  }













  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-6xl p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-red-600 text-center">
              Deactivate Your Account
            </h2>


        <div className="flex gap-3">
          <div>
       
            <p className="text-gray-700 text-sm mt-2">
              When you deactivate your account:
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm mt-2 space-y-2">
              <li>You are logged out of your RetailDukaan account.</li>
              <li>Your public profile is no longer visible.</li>
              <li>
                Your reviews/ratings remain visible, but your profile is shown
                as "unavailable."
              </li>
              <li>Your wishlist items become inaccessible.</li>
              <li>You will be unsubscribed from promotional emails.</li>
              <li>Your account data is retained for reactivation.</li>
            </ul>

            <h3 className="text-md font-semibold mt-4">How to Reactivate?</h3>
            <p className="text-gray-700 text-sm">
              Simply log in with your registered email or phone number and
              password. RetailDukaan retains your account data so you can continue
              from where you left off.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              <strong>Note:</strong> Reactivation can only be done on the
              Desktop version.
            </p>
          </div>

          <div>
            <div className="mt-4">
              <p className="text-sm font-semibold">Registered Email:</p>
              <p className="text-gray-700 text-sm">{emails}</p>

              {phones && (
                <div>
                  <p className="text-sm font-semibold mt-2">
                    Registered Mobile:
                  </p>
                  <p className="text-gray-700 text-sm">{phones}</p>
                </div>
              )}

              <p className="text-sm font-semibold mt-3">Enter OTP:</p>
              <input
                type="text"
                className="w-full border p-2 rounded-md mt-1"
                placeholder="Enter received OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="mt-4 flex-col  justify-between">
              <button
                className="bg-red-600 text-white px-4 py-2 mb-3 rounded-md text-sm hover:bg-red-700"
                onClick={handleAccountDeactivation}
              >
                CONFIRM DEACTIVATION
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400"
                onClick={onClose}
              >
                NO, LET ME STAY!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeactiveModal;
