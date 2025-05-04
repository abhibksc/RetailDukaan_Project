import React from "react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  console.log("Chalankya");
  
  return (
    <div className=" px-5">
      <div className="max-w-6xl mx-auto bg-white p-8 ">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Terms and Conditions</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Introduction</h2>

          
          <p className="text-gray-600 leading-relaxed">
           <Link to={"/"}>www.retaildukaan.com</Link>(Gupta Trading Company is a Proprietor Firm)  ("We," "Us," or "Our") is the owner and operator of this
            application and website (collectively, "The Platform"). By accessing or using
            the services provided through the Platform, you agree to the terms outlined
            in this document. Please read these terms carefully before proceeding.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h2>
          <p className="text-gray-600 leading-relaxed">
            During registration or use of the Platform, we may collect the following information:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-3">
            <li>Your name (first and last), email address, contact number, postal address, and demographic details (such as occupation).</li>
            <li>Information about your browsing activity, including the pages accessed, links clicked, and frequency of access.</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            We ensure that your information is used solely to enhance your experience and is protected as per applicable laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Eligibility</h2>
          <p className="text-gray-600 leading-relaxed">
            The services of this Platform are available to users in selected regions. You must be at least 18 years of age to transact independently.
            Persons who are "incompetent to contract" within the meaning of the Indian Contract Act, 1872, including minors, undischarged insolvent, etc.,
            are not eligible to use/access the Gupta Trading Company (<Link to={"/"} className="text-blue-500 cursor-pointer">www.retaildukaan.com</Link>). Minors under the age of 18 may use the Platform under the supervision of an adult
            parent or legal guardian competent to contract, but are prohibited from purchasing products for adult consumption or restricted items.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">License & Access</h2>
          <p className="text-gray-600 leading-relaxed">
            You are granted a limited license to access and use the Platform for personal purposes. Unauthorized reproduction, resale, or commercial
            exploitation of any part of the Platform is strictly prohibited.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Account & Registration Obligations</h2>
          <p className="text-gray-600 leading-relaxed">
            All users must register and maintain accurate details to place orders. By registering, you agree to receive communications such as promotional
            messages and order updates. You can opt out of promotional communications at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Pricing Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            Products will be sold at the listed prices unless otherwise specified. The prices displayed at the time of order placement will be charged
            at the time of delivery.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Order Cancellation</h2>
          <p className="text-gray-600 leading-relaxed">
            Customers can cancel orders before the cut-off time of their selected delivery slot. Refunds will be processed for prepaid orders. The Platform
            reserves the right to cancel orders suspected of fraudulent activity or non-compliance with these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Returns & Refunds</h2>
          <p className="text-gray-600 leading-relaxed">
            We have a "no questions asked return and refund policy" which entitles all our members to return the product at the time of delivery if they
            are not satisfied with the quality or freshness of the product. A credit note will be issued for the value of the returned products, which can
            be used for future shopping bills.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">User Obligations</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>Provide accurate and updated information during registration.</li>
            <li>Comply with all applicable laws while using the Platform.</li>
            <li>Use the Platform for lawful purposes only and refrain from transmitting any unlawful or harmful content.</li>
            <li>Avoid unauthorized access to other users' accounts or interfering with the Platform's operations.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Copyright & Intellectual Property</h2>
          <p className="text-gray-600 leading-relaxed">
            All content on the Platform, including text, images, and software, is protected under copyright and trademark laws. Unauthorized use,
            reproduction, or distribution of content is prohibited.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Modification of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to modify these terms at any time. Continued use of the Platform signifies your acceptance of any changes made.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Governing Law</h2>
          <p className="text-gray-600 leading-relaxed">
            These Terms of Service and any separate agreements shall be governed by and construed in accordance with the laws of the state of Jharkhand, India.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Feedback & Reviews</h2>
          <p className="text-gray-600 leading-relaxed">
            By submitting feedback or reviews, you grant Retail Dukaan the right to use this content for promotional or other purposes without compensation.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
