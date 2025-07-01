import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import {
  Show_Users_MainCategory,
  Show_Users_Sub_SubCategory,
  Show_users_SubCategory,
} from "../../../CrudOperations/GetOperation";
import { savePageState } from "../../../ReduxStore/Slices/pageStateSlice";

const CategoryMegaMenu = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [subDropdownOpen, setSubDropdownOpen] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subsubCategories, setSubsubCategories] = useState([]);
  const [selectedSubMenu, setSelectedSubMenu] = useState([]);
  const [selectedSubSubMenu, setSelectedSubSubMenu] = useState([]);
  const [GroupId, setGroupID] = useState("");
  const [GroupName, setGroupName] = useState("");

  const locationData = useLocation();
  const { id, pincode } = useParams();
  const AreaPin = useSelector((state) => state.auth.AreaPin);
  const savedState = useSelector((state) => state.pageStateSlice[locationData.pathname]) || null;
  const dispatch = useDispatch();

  useEffect(() => {
    if (savedState?.groupid && savedState.groupid !== GroupId) {
      setGroupID(savedState.groupid);
      setGroupName(savedState.groupname);
    } else if (locationData.state?.groupid && locationData.state.groupid !== GroupId) {
      setGroupID(locationData.state.groupid);
      setGroupName(locationData.state.groupname);
      dispatch(
        savePageState({
          path: locationData.pathname,
          componentState: {
            groupid: locationData.state.groupid,
            groupname: locationData.state.groupname,
          },
        })
      );
    }
  }, [locationData.pathname, locationData.state, savedState, dispatch, GroupId]);

  useEffect(() => {
    if (!GroupId) return;

    const fetchCategories = async () => {
      try {
        const [main, sub, subsub] = await Promise.all([
          Show_Users_MainCategory({ id, pincode }),
          Show_users_SubCategory({ id, pincode }),
          Show_Users_Sub_SubCategory({ id, pincode }),
        ]);

        if (main?.data?.message === "Categories fetched successfully!") {
          const filtered = main.data.data.filter((cat) => cat.GroupId === GroupId);
          setCategories(filtered.sort((a, b) => a.sort_order - b.sort_order));
        } else {
          toast.error(main?.data?.message || "Error fetching main categories.");
        }

        if (sub?.message === "All subcategories retrieved successfully!") {
          setSubCategories(sub.data);
        } else {
          toast.error("Error fetching subcategories.");
        }

        if (subsub?.data?.length > 0) {
          setSubsubCategories(subsub.data);
        } else {
          toast.error("No SubSub Category found.");
        }
      } catch (err) {
        toast.error(err?.response?.data.message || "Fetch error.");
      }
    };

    fetchCategories();
  }, [GroupId]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let dropdownTimeout;
  const toggleDropdown = (categoryId) => {
    clearTimeout(dropdownTimeout);
    if (dropdownOpen !== categoryId) {
      const filteredSub = subCategories.filter((sub) => sub.category_id === categoryId);
      setSelectedSubMenu(filteredSub);
      setDropdownOpen(categoryId);
    } else {
      dropdownTimeout = setTimeout(() => setDropdownOpen(null), 300);
    }
  };

  const toggleSubmenu = (subCategoryId) => {
    if (subDropdownOpen !== subCategoryId) {
      const filteredSubSub = subsubCategories.filter((sub) => sub.sub_category_id === subCategoryId);
      setSelectedSubSubMenu(filteredSubSub);
      setSubDropdownOpen(subCategoryId);
    } else {
      setSubDropdownOpen(null);
    }
  };

  const renderMenuItems = useMemo(() => {
    if (!categories.length) return <div className="p-3">No Categories Created</div>;

    return categories.map((category) => (
      <li
        key={category.id}
        className="z-10 group py-2"
        onMouseEnter={() => toggleDropdown(category.id)}
        onMouseLeave={() => setDropdownOpen(null)}
      >
        <Link className="text-black hover:text-blue-600 flex items-center" to="#">
          <div className="text-center">
            <img className="w-16 h-16 mx-auto hidden md:block" src={category.image_url} alt={category.name} />
            <span className="flex gap-2 font-inter">
              {category.name}
              <FontAwesomeIcon
                icon={dropdownOpen === category.id ? faChevronUp : faChevronDown}
                className="ml-1 w-2 mt-1"
              />
            </span>
          </div>
        </Link>

        {dropdownOpen === category.id && selectedSubMenu.length > 0 && (
          <ul className="absolute text-sm text-gray-700 pt-2 bg-white lg:w-52 w-[25rem] z-20">
            {selectedSubMenu.map((sub) => (
              <li
                key={sub.id}
                className="relative px-3 bg-gray-100 shadow-lg w-56 py-1"
                onMouseEnter={() => toggleSubmenu(sub.id)}
                onMouseLeave={() => setSubDropdownOpen(null)}
              >
                <Link
                  to={`/product/${GroupName}/${GroupId}/${category.name}/${category.id}/${sub.name}/${sub.id}/${AreaPin}`}
                  state={{ id: sub.id, type: "SubCategory" }}
                  className="text-gray-900 hover:text-blue-500 py-2 px-4 flex justify-between"
                >
                  <span className="font-inter">{sub.name}</span>
                  <IoIosArrowForward />
                </Link>

                {subDropdownOpen === sub.id && selectedSubSubMenu.length > 0 && (
                  <ul className="absolute lg:left-full lg:top-0 lg:w-64 bg-gray-100 shadow-lg">
                    <li className="px-3 py-2">
                      <Link
                        className="block text-gray-900 hover:text-blue-500"
                        to={`/product/${GroupName}/${GroupId}/${sub.name}/${sub.id}/${AreaPin}`}
                        state={{ id: sub.id, type: "SubCategory" }}
                      >
                        All
                      </Link>
                    </li>

                    {selectedSubSubMenu.map((subSub) => (
                      <li key={subSub.id} className="px-3 py-2">
                        <Link
                          to={`/product/${GroupName}/${GroupId}/${category.name}/${category.id}/${sub.name}/${sub.id}/${subSub.name}/${subSub.id}/${AreaPin}`}
                          state={{ id: subSub.id, type: "SubSubCategory" }}
                          className="text-gray-900 hover:text-blue-500 flex justify-between"
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
  }, [categories, dropdownOpen, subDropdownOpen, selectedSubMenu, selectedSubSubMenu]);

  return (
    <div className="bg-white pt-16 shadow-md w-full">
      <ul className="lg:flex justify-around mx-20">{renderMenuItems}</ul>
    </div>
  );
};

export default CategoryMegaMenu;
