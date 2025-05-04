import React from "react";
import Sidebar from "../Header&SideBar/Sidebar";
const SavedCards = () => {
  return (
    <div className="flex gap-4 mt-14 xl:mt-0 justify-center">
      <Sidebar />

      <div className="bg-white flex flex-col gap-4 border p-4 w-[1100px]">
        <h1 className="font-bold text-2xl font-roboto">Manage Saved Cards</h1>

        <div className="flex flex-col gap-4 border p-2">
          <h2 className="font-bold text-lg">HDFC Bank Credit Card</h2>
          <p>**** **** **** 1234</p>
        </div>

        <div className="mt-4 flex flex-col gap-5">
          <h2 className="font-bold text-lg">FAQs</h2>
          <ul className="list-disc list-inside flex flex-col gap-10">
            <li className="hover:text-blue-500">Why should I save my card details on Flipkart?</li>
            <p>
              Saving your card details on Flipkart makes it quicker to complete your purchases. You don't have to enter your card details every time you shop, and it also provides a smoother and faster checkout experience.
            </p>
            <li className="hover:text-blue-500">Is it safe to save my card details on Flipkart?</li>
            <p>
              Yes, it is completely safe. Flipkart ensures the highest standards of security for your card details. We use secure encryption and do not store your CVV number.
            </p>
            <li className="hover:text-blue-500">What card details does Flipkart store?</li>
            <p>
              Flipkart stores your card number, cardholder name, and card expiry date. The CVV number is not stored and needs to be entered every time for security reasons.
            </p>
            <li className="hover:text-blue-500">Can I delete my saved card details?</li>
            <p>
              Yes, you can delete your saved card details anytime from your account settings.
            </p>
          </ul>
          <a href="#" className="hover:text-blue-500">View all FAQs</a>
        </div>
      </div>
    </div>
  );
};

export default SavedCards;
