import React from "react";
import { Link } from "react-router-dom";

const DisclaimerPolicy = () => {
  return (
    <div className=" px-5">
      <div className="max-w-6xl mx-auto bg-white p-8 ">
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-extrabold text-green-600 text-center">
            Disclaimer Policy
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            The information provided on the <span className="font-semibold">Gupta Trading Company(<Link to={"/"} className="text-blue-500 cursor-pointer" >www.retaildukaan.com</Link>)</span> (website, app, or any associated channels) is for general informational purposes only. While we strive to ensure that all information, including product descriptions, pricing, availability, and policies, is accurate and up to date, we make no guarantees regarding the completeness, reliability, or accuracy of this information.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-lg">
            <li>
              <span className="font-semibold">Product Information:</span> All product details and prices are subject to change without notice. Images are for illustrative purposes only, and actual products may vary slightly in appearance.
            </li>
            <li>
              <span className="font-semibold">Availability:</span> While we do our best to ensure the availability of all items, we cannot guarantee that a product listed on our platform will always be in stock.
            </li>
            <li>
              <span className="font-semibold">Local Regulations:</span> Products and services offered by Gupta Trading Company are subject to local laws and regulations. Customers are responsible for ensuring compliance with any applicable laws when purchasing products from us.
            </li>
            <li>
              <span className="font-semibold">Third-Party Links:</span> Gupta Trading Company(<Link to={"/"} className="text-blue-500 cursor-pointer" >www.retaildukaan.com</Link>) may provide links to third-party websites or resources for convenience and reference. We do not endorse or assume responsibility for the content, products, or services of any linked websites.
            </li>
          </ul>
          <p className="text-gray-700 text-lg">
            By using our platform, you agree that <span className="font-semibold">Gupta Trading Company(<Link to={"/"} className="text-blue-500 cursor-pointer" >www.retaildukaan.com</Link>)</span> is not liable for:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-lg">
            <li>
              Any direct, indirect, incidental, or consequential damages arising from the use of our platform or the inability to use it.
            </li>
            <li>
              Any inaccuracies, errors, or omissions in the information provided.
            </li>
            <li>
              Delays in delivery or interruptions in service due to circumstances beyond our control.
            </li>
          </ol>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Gupta Trading Company(using the Platform <Link to={"/"} className="text-blue-500 cursor-pointer" >www.retaildukaan.com</Link>)</span> reserves the right to modify this Disclaimer at any time without prior notice.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              For further questions or concerns, please contact our customer support team:
            </h2>
            <ul className="space-y-1 text-gray-700 text-lg">
              <li>
                <span className="font-semibold">Phone:</span> +91 9942324747 (Operational 6 days, 9 AM to 6 PM)
              </li>
              <li>
                <span className="font-semibold">Email:</span> info@retaildukaan.com
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPolicy;
