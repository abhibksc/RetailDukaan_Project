import React, { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 text-left text-lg font-semibold text-gray-700 focus:outline-none"
      >
        {title}
        <span className={`transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
          ▼
        </span>
      </button>
      {isOpen && <div className="pb-4 text-gray-600">{children}</div>}
    </div>
  );
};

const ReturnsRefundPolicy = () => {
  return (
    <div className=" px-5">
      <div className="max-w-6xl mx-auto bg-white p-8 ">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Returns, Refund, and Exchange Policy
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            At <span className="font-semibold">Gupta Trading Company(<Link to={"/"} className="text-blue-500 cursor-pointer" >www.retaildukaan.com</Link>)</span>, your
            satisfaction is our top priority. If you’re not in love with your
            purchase, don’t worry—we’ve got you covered with our hassle-free
            policy.
          </p>

          <div className="space-y-4">
            {/* Accordion Items */}
            <AccordionItem title="What is Gupta Trading Company Return and Refund Policy?">
              <p className="mb-4">
                You can return or exchange eligible items within{" "}
                <span className="font-semibold">3 days</span> of delivery.
                Ensure the item is in its{" "}
                <span className="font-semibold">original condition</span> with
                tags and packaging intact.
              </p>
              <ul className="list-disc pl-5">
                <li>Pick-up Service: Available in most locations.</li>
                <li>
                  Self-Ship: Reimbursements available as Gupta Trading Company credits
                  upon successful quality checks.
                </li>
              </ul>
            </AccordionItem>

            <AccordionItem title="How to Return a Product?">
              <ol className="list-decimal pl-5">
                <li>
                  Create a return request in the{" "}
                  <span className="font-semibold">"My Orders"</span> section of
                  the app/website.
                </li>
                <li>
                  Pack the product securely with all tags intact.
                  <ul className="list-disc pl-6">
                    <li>For pick-up: Keep it ready for inspection.</li>
                    <li>
                      For self-ship: Ship it to the nearest Returns Desk.
                    </li>
                  </ul>
                </li>
                <li>
                  Receive a confirmation email once the product passes the
                  quality check.
                </li>
              </ol>
            </AccordionItem>

            <AccordionItem title="Refund Policy">
              <ul className="list-disc pl-5">
                <li>
                  Refunds for cancellations or failed payments are credited to
                  the original payment method.
                </li>
                <li>
                  For COD orders, refunds are processed to your bank account or
                  UPI ID.
                </li>
                <li>
                  Refunds take <span className="font-semibold">5-7 working days</span>{" "}
                  after quality checks.
                </li>
              </ul>
            </AccordionItem>

            <AccordionItem title="Need Assistance?">
              <div>
                <p>
                  Our Customer Support is here to help! Feel free to reach out
                  to us:
                </p>
                <ul className="list-none mt-2 space-y-2">
                  <li className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-gray-700" />
                    <span>Phone: +91 9942324747 (9 AM - 6 PM, Mon-Sat)</span>
                  </li>
                  <li className="flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-gray-700" />
                    <span>Email: info@retaildukaan.com</span>
                  </li>
                </ul>
              </div>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsRefundPolicy;
