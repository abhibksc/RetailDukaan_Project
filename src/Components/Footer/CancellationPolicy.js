import React from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CancellationPolicy = () => {
    const navigate = useNavigate();
  return (
    <div className=" px-5">
      <div className="max-w-6xl mx-auto bg-white p-8 ">
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">
          Cancellation Policy
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Our commitment is to provide a seamless shopping experience while offering flexibility when plans change. Please review our policy details below.
        </p>

        {/* Order Cancellation Section */}
        <section className="mb-8">
          <div className="flex items-start mb-4">
            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">
              Order Cancellation
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Customers can cancel orders before the cut-off time of their selected delivery slot. Refunds will be processed for prepaid orders. The platform reserves the right to cancel orders suspected of fraudulent activity or non-compliance with these terms.
          </p>
        </section>

        {/* Refunds Section */}
        <section className="mb-8">
          <div className="flex items-start mb-4">
            <Info className="w-6 h-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Refunds</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Refunds for cancellations will be initiated within 2-3 business days. The amount will be credited back to the original payment method within 7 working days, depending on your bank’s policies.
          </p>
        </section>

        {/* Platform Rights Section */}
        <section>
          <div className="flex items-start mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">
              Platform Rights
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
          Gupta Trading Company(<Link to={"/"} className="text-blue-500 cursor-pointer" >www.retaildukaan.com</Link>) reserves the right to cancel orders under circumstances such as inventory issues, pricing errors, or suspected fraudulent activities. Customers will be notified promptly in such cases, and refunds (if applicable) will be processed.
          </p>
        </section>

        {/* Contact Section */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">
            If you have any questions about our cancellation policy, feel free to contact our customer support team.
          </p>
          <button className="py-2 px-6 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition cursor-pointer" onClick={() => navigate('/page/contact-us')}>  
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
