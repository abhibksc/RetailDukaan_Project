import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import LoadingModal from '../../../LoadingModal';
import { VerifyOrderID } from '../../../CrudOperations/PostOperation';

const PaymentFailed = () => {
  // const { userId, orderId, reason } = useParams();
  const navigate = useNavigate();
  const { orderId_by_backend } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [loading, setLoading ] = useState(true);

  const [orderId, setOrderID] = useState(null);
  const [userId, setUserID] = useState(null);
  const [reason, setReason] = useState(null);

const match = location.pathname.match(/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)/);

const userID_by_frontend = match ? match[3] : null;
const orderId_by_frontend = match ? match[4] : null;
const errorMessage_by_frontend = match ? match[5] : null;


const errorMessage_by_backend = searchParams.get('reason');


  const handleRetry = () => navigate('/CheckOut');
  const handleHome = () => navigate('/');



  useEffect(() => {
    console.log(location.pathname);
    

        // Remove prefixes
        const cleanUserId = userID_by_frontend.replace("userId-", "");
        const cleanOrderId = orderId_by_frontend.replace("orderId=", "");
        const cleanReason = errorMessage_by_frontend || "Unknown";

        console.log(cleanUserId );
        console.log(cleanOrderId );
        console.log(cleanReason );
        console.log(errorMessage_by_frontend );



    


    // Final check for confirmation payment
  
    const fun = async () => {

      const str = cleanOrderId;
const result = str.split("-")[1];
console.log(result); 
  
      const OrderCheckResponse = await VerifyOrderID({orderId : result });
  
  
    
      const  errormsge = cleanReason || OrderCheckResponse.message;
      const orderID = orderId_by_backend || cleanOrderId;

      setOrderID(result);
      setReason(errormsge);
      setLoading(false);
     
  
  
  
  
  
     };
  
  
    fun();
  
    
  
  
  
    }, []);







  
    if(loading) return <LoadingModal />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
        <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
        {/* {orderId && <p className="text-gray-600 mb-2">Order ID: <span className="font-medium">{orderId}</span></p>} */}
        <p className="text-gray-600 mb-4" aria-live="polite">
          Reason: <span className="font-medium text-red-500">{decodeURIComponent(reason || 'Unknown Error')}</span>
        </p>
        <p className="text-gray-600 mb-6">
          Unfortunately, your payment could not be processed. Please try again or contact support.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRetry}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition active:scale-95"
          >
            Retry Payment
          </button>
          <button
            onClick={handleHome}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition active:scale-95"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
