import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import {
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";

const NavMore = () => {

  return (
    <li className="relative  group hidden xl:block mt-1 cursor-pointer py-4  hover:text-blue-700">
               <div className="flex gap-1 hover:text-blue-700 cursor-pointer py-1">
                 <h1>More</h1>
                 <MdOutlineKeyboardArrowDown className="mt-1" />
               </div>
   
               <div className="absolute px-3 left-0  hidden self-center  bg-gray-100  shadow-lg  mt-4 w-56 py-4 group-hover:block z-10">
                 <ul className="text-black flex flex-col  gap-4 cursor-pointer p-2 ">
                   <li className="group hover:text-blue-500 border-b-2 py-2">
                     <div className="flex gap-2">
                       <FaRegUserCircle className="mt-1" />
                       <span className="font-extralight ">Download App</span>
                     </div>
                   </li>
                 </ul>
               </div>
             </li>
  );
};

export default NavMore;
