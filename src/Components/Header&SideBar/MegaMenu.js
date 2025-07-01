import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { IoIosArrowForward } from "react-icons/io";
import {
  Show_Users_MainCategory,
  Show_Users_Sub_SubCategory,
  Show_users_SubCategory,
} from "../CrudOperations/GetOperation";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const MegaMenu = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [subDropdownOpen, setSubDropdownOpen] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subsubCategories, setSubsubCategories] = useState([]);
  const [selectedSubMenu, setSelectedSubMenu] = useState([]);
  const [selectedSubSubMenu, setSelectedSubSubMenu] = useState([]);
    const AreaPin = useSelector((state) => state.auth.AreaPin);

  // Fetch categories, subcategories, and sub-subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [mainCategories, subCategories, subSubCategories] =
          await Promise.all([
            Show_Users_MainCategory(),
            Show_users_SubCategory(),
            Show_Users_Sub_SubCategory(),
          ]);

        console.log(mainCategories);
        console.log(subCategories);
        console.log(subSubCategories);

        if(mainCategories?.message === "All category retrieved successfully!"){


        console.log(mainCategories);

        if (mainCategories?.data) {
          const sortedData = [...mainCategories.data].sort((a, b) => a.sort_order - b.sort_order);
          console.log(sortedData);
          setCategories(sortedData);
        }

        }
        else{
          toast.error(mainCategories?.data?.message || "Error fetching data in Main Category.");
        }
        if(subCategories?.message === "All subcategories retrieved successfully!"){
          setSubCategories(subCategories.data);
        }
        else{
          toast.error(subCategories?.data?.message || "Error fetching data in Sub Category.");
        }
        if(subSubCategories?.data.length > 0){
          setSubsubCategories(subSubCategories.data);
        }
        else{
          toast.error(subSubCategories?.data?.message || "Error fetching data in SubSub Category.");
        }

      } catch (error) {
        toast.error(error?.response?.data.message || "Error fetching data.");
      }
    };
    fetchCategories();
  }, []);

  // Track window resizing
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle the main dropdown for categories
  const toggleDropdown = (categoryId) => {
    setDropdownOpen(dropdownOpen === categoryId ? null : categoryId);
    const filteredSubCategories = subCategories.filter(
      (sub) => sub.category_id === categoryId
    );
    setSelectedSubMenu(filteredSubCategories);
    setSubDropdownOpen(null); // Reset sub-submenu when switching category
  };

  // Toggle the sub-submenu for subcategories
  const toggleSubmenu = (subCategoryId) => {
    setSubDropdownOpen(
      subDropdownOpen === subCategoryId ? null : subCategoryId
    );
    const filteredSubSubCategories = subsubCategories.filter(
      (sub) => sub.sub_category_id === subCategoryId
    );
    setSelectedSubSubMenu(filteredSubSubCategories);
  };

  const renderMenuItems = () => {
    return categories.map((category) => (
      <li
        key={category.id}
        className="   z-10 group py-2"
        onMouseEnter={() => toggleDropdown(category.id)}
        onMouseLeave={() => toggleDropdown(null)} // Close sub-submenu on mouse leave
      >
        <Link
          className="lg:inline-block text-white hover:text-gray-300 flex items-center"
          to={"#"}
        >
          <div className="text-center">
            <img
              className="w-16 h-16 mx-auto hidden md:block"
              src={category.image_url}
              alt={category.name}
            />
            <span className="flex flex-row gap-2 text-black hover:text-blue-600">
              <span className="font-inter">{category.name}</span>
              <FontAwesomeIcon
                icon={
                  dropdownOpen === category.id ? faChevronUp : faChevronDown
                }
                className="ml-1 text-black w-2 mt-1"
              />
            </span>
          </div>
        </Link>

        {/* Submenu */}
        {dropdownOpen === category.id && selectedSubMenu.length > 0 && (
          <ul className="absolute text-[12px] text-gray-700 pt-2 bg-white lg:w-52 w-[25rem]">
            {selectedSubMenu.map((sub) => (
              <li
                key={sub.id}
                className="relative px-3 bg-gray-100 shadow-lg w-56 py-1 "
                onMouseEnter={() => toggleSubmenu(sub.id)}
                onMouseLeave={() => setSubDropdownOpen(null)} // Close sub-submenu on mouse leave
              >
                <Link
                  className="text-gray-900 hover:text-blue-500 py-2 px-4 flex"
                  to={`/grocery/${category.name}/${sub.name}/${AreaPin}`}
                  state={{
                    // Category_id: category.id,
                    // Category_name: category.name,

                    id: sub.id,
                    type: "SubCategory",
                  }}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-inter">{sub.name}</span>
                    <IoIosArrowForward />
                  </div>
                </Link>

                {/* Sub-Submenu */}
                {subDropdownOpen === sub.id &&
                  selectedSubSubMenu.length > 0 && (
                    <ul className="absolute lg:left-full lg:top-0 lg:w-64 bg-gray-100 shadow-lg">
                      <li className="px-3 py-2">
                        <Link
                          className="text-gray-900 hover:text-blue-500 flex justify-between"
                          to={`/grocery/${category.name}/${sub.name}/${AreaPin}`}
                          state={
                            {
                              // Category_id: category.id,
                              // Category_name: category.name,
                              // id: sub.id,
                              // type: sub.name,
                            }
                          }
                        >
                   
                        </Link>
                        <Link
                            className="block text-gray-900 hover:text-blue-500"
                            to={`/grocery/${category.name}/${sub.name}/${AreaPin}`}
                            state={{
                              id: sub.id,
                              type: "SubCategory",
                            }}
                          >
                            All
       
                          </Link>
                      </li>

                      {/* selectedSubSubMenu */}

                      {selectedSubSubMenu.map((subSub) => (
                        <li key={subSub.id} className="px-3 py-2">
                          <Link
                            className="text-gray-900 hover:text-blue-500 flex justify-between"
                            to={`/grocery/${category.name}/${sub.name}/${subSub.name}/${AreaPin}`}
                            state={{
                              // Category_id: category.id,
                              // Category_name: category.name,

                              // SubCategory_id: sub.id,
                              // SubCategory_name: sub.name,

                              id: subSub.id,
                              type: "SubSubCategory",
                            }}
                          >
                            <span className="font-inter">{subSub.name}</span>
                            <IoIosArrowForward />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div className="bg-white pt-16  shadow-md flex-grow w-full  ">
      <ul className="lg:flex  justify-around mx-20">{renderMenuItems()}</ul>
    </div>
  );
};

export default MegaMenu;
