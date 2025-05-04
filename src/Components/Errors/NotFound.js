import React from 'react';
import Lottie from 'lottie-react';
import notFoundAnimation from '../../assets/animations/404_notfound.json'; // Replace with the path to your Lottie JSON file
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="w-1/2 sm:w-1/3 md:w-1/4 rounded-xl">
        <Lottie animationData={notFoundAnimation} loop={true} />
      </div>
     
      <p className="text-gray-500 mt-2">Sorry, the page you’re looking for doesn’t exist.</p>
      <Link to={"/"} className="mt-6 inline-block text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md transition-colors duration-300">
        Go to Homepage
      </Link>
    </div>
  );
}

export default NotFound;
