import React from 'react';
import { Link } from 'react-router-dom';

import paytm from '../../assets/footer/paytm.png';
import phonepay from '../../assets/footer/phonepay.png';
import rupay from '../../assets/footer/rupay.png';
import bhim from '../../assets/footer/bhim.png';
import mastercard from '../../assets/footer/mastercard.png';
import gpay from '../../assets/footer/gpay.png';
import visa from '../../assets/footer/visa.png';

const Footer = () => {
  const sections = [
    {
      title: 'About Us',
      links: ['Contact Us', 'About Us'],
    },
    {
      title: 'Useful Links',
      links: ['Terms of Service', 'Privacy Policy', 'Returns and Refund'],
    },
    {
      title: 'Consumer Policy',
      links: ['Exchange', 'Shipping Policy', 'Disclaimer Policy', 'Cancellation'],
    },
  ];

  return (
    <footer className="bg-blue-950 text-white py-5 px-7 mt-auto">
      <div className="container mx-auto px-10">
        {/* Footer Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-lg font-bold mb-4">{section.title}</h2>
              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={`/page/${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm hover:underline hover:text-gray-300"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Mail Us Section */}
          <div className="lg:border-l lg:border-gray-700 pl-8">
            <h2 className="text-md font-bold mb-4">Registered Office Address:</h2>
            <p className="text-sm">
            Gupta Trading Company,<br />
              Kedar Das Nagar Near Kedia Petrol Pump Gurudwara Road
              Chas BOKARO,<br />
              Jharkhand,827013,<br />
              India
            </p>
          </div>

          {/* Contact Us Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">Mail Us:</h2>
            <p className="text-sm">
              <span className="font-bold">Email:</span> info@retaildukaan.com <br />
              <span className="font-bold">Phone:</span> +91 9942324747
            </p>
          </div>
        </div>

        {/* Payment Methods Images */}
        {/* <div className="flex gap-4 justify-center mt-6">
          <img src={paytm} alt="paytm" className="w-20 h-10" />
          <img src={phonepay} alt="phonepay" className="w-20 h-10" />
          <img src={rupay} alt="rupay" className="w-20 h-10" />
          <img src={bhim} alt="bhim" className="w-20 h-10" />
          <img src={mastercard} alt="mastercard" className="w-20 h-10" />
          <img src={gpay} alt="gpay" className="w-20 h-10" />
          <img src={visa} alt="visa" className="w-20 h-10" />
        </div> */}

        {/* Divider */}
        <div className="my-8 border-t border-gray-700" />

        {/* Copyright Section */}
        <div className="text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Grocery App. Designed & Developed by wipenex IT Pvt. Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
