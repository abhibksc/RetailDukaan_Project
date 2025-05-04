import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className=" px-5">
      <div className="max-w-6xl mx-auto bg-white p-8 ">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-indigo-600 mb-4 text-center">
            About Us
          </h1>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            Welcome to <span className="font-semibold">Gupta Trading Company(<Link to={"/"} className="text-blue-500 cursor-pointer" >www.retaildukaan.com</Link>)</span>, your
            trusted destination for quality grocery items at reasonable prices.
            We take pride in catering to the needs of our local community by
            offering a wide range of products, including both loose and packaged
            items.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            At <span className="font-semibold">Gupta Trading Company</span>, we believe
            in making grocery shopping a seamless, affordable, and enjoyable
            experience for everyone. Whether you're looking for fresh staples or
            convenient packaged goods, we ensure every product meets high
            standards of quality and affordability, making it the best choice
            for our valued customers.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            We are deeply rooted in serving the local community and are
            committed to understanding and fulfilling their unique needs. Our
            mission is not just about selling groceries—it’s about building
            lasting relationships with our customers and supporting the local
            economy.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            Choose <span className="font-semibold">Gupta Trading Company(<Link to={"/"} className="text-blue-500 cursor-pointer" >www.retaildukaan.com</Link>)</span> for your
            daily essentials, and experience the difference of shopping local,
            with care and convenience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
