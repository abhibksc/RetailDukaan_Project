import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Carousel } from "primereact/carousel";
import {
  Show_Users_MainCategory,
  Show_Users_Sub_SubCategory,
  Show_users_SubCategory,
} from "../../../CrudOperations/GetOperation";
import BackButton from "../../../BackButton";
import { width } from "@mui/system";
import useWindowSize from "../../../useWindowSize";

const Sub_SubCategory_Carousel = ({ locationStateData }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subsubCategories, setSubsubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { width } = useWindowSize(); // Get the screen width

  // Fetch data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [mainRes, subRes, subSubRes] = await Promise.all([
          Show_Users_MainCategory(),
          Show_users_SubCategory(),
          Show_Users_Sub_SubCategory(),
        ]);

        console.log(locationStateData);

        setCategories(mainRes.data || []);
        setSubCategories(subRes.data || []);

        console.log(subSubRes);

        const filteredData = subSubRes.data.filter(
          (ele) => ele.sub_category_id === locationStateData.id
        );

        console.log(filteredData);

        setSubsubCategories(filteredData || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        toast.error(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Carousel Item Template
  const itemTemplate = (Scategory) => (
    <div key={Scategory.id} className="text-center ">

    
      <Link
        to={`/grocery/${Scategory.name}`}
        state={{
          // Category_id: category.id,
          // Category_name: category.name,

          id: Scategory.id,
          type: "SubSubCategory",
          name: Scategory.name,
        }}
        className="flex flex-col items-center"
      >
 
        <img
          className={`  ${
            windowWidth < 200
              ? "w-9 h-9 "
              : windowWidth < 300
              ? "w-7 h-7"
              : windowWidth < 400
              ? "w-9 h-9"
              : windowWidth < 500
              ? "w-10 h-10"
              : windowWidth < 600
              ? "w-12 h-12"
              : " "
          }  rounded-full `}
          src={Scategory.image_url || "https://via.placeholder.com/150"}
          alt={Scategory.name}
        />
        <span
          className={`${
            windowWidth < 200
              ? "text-[6px]"
              : windowWidth < 300
              ? "text-[10px]"
              : windowWidth < 400
              ? "text-[12px]"
              : windowWidth < 500
              ? "text-[13px]"
              : windowWidth < 600
              ? "text-[14px]"
              : " "
          }                           font-semibold text-gray-700`}
        >
          {Scategory.name}
        </span>
      </Link>
    </div>
  );

  // const updatedCategories = [...subsubCategories];

  // // Ensure the last item is filled with the first item if empty
  // if (
  //   updatedCategories.length > 0 &&
  //   !updatedCategories[updatedCategories.length - 1]
  // ) {
  //   updatedCategories[updatedCategories.length - 1] = updatedCategories[0];
  // }

  return (
    <div className=" shadow-md w-full pb-2 bg-white">
      <header className="shadow-sm shadow-gray-700 mb-3 bg-gradient-to-b from-green-400 to-white">
        <div className="flex mx-3">
          <BackButton className="" />
          <h1   className={`${
                      windowWidth < 200
                        ? "text-[8px] mt-3 ml-4"
                        : windowWidth < 300
                        ? "text-[10px] mt-3 ml-4"
                        : windowWidth < 400
                        ? "text-[12px] mt-3 ml-4"
                        : windowWidth < 500
                        ? "text-[13px] mt-5 ml-4"
                        : windowWidth < 600
                        ? "text-[15px] mt-4 ml-4"
                        : windowWidth < 700
                        ? "text-[16px] mt-4 ml-4"
                         : windowWidth < 800
                        ? "text-[17px] mt-4 ml-4"
                         : windowWidth < 1100
                        ? "text-[18px] mt-4 ml-4"
                        : ""
                    }                                font-semibold text-gray-900`} >
            {locationStateData.name}
          </h1>
        </div>
      </header>

      <div className="w-full ">
        <Carousel
          showNavigators={false}
          value={subsubCategories}
          itemTemplate={itemTemplate}
          numVisible={
            windowWidth < 200
              ? 1
              : windowWidth < 350
              ? 3
              : windowWidth < 450
              ? 4
              : windowWidth < 600
              ? 5
              : windowWidth < 700
              ? 5
              : windowWidth < 800
              ? 5
              : ""
          }
          numScroll={1}
          circular
          autoplayInterval={6000}
        />

        
      </div>
    </div>
  );
};

export default Sub_SubCategory_Carousel;
