import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { savePageState } from "../../../ReduxStore/Slices/pageStateSlice";
import { getDesktopHomeManagementCategoryListingsInCustomerUI } from "../../../CrudOperations/GetOperation";
import useTruncateSentance from "../../../UseFullHooks/useTruncateSentance";
import LoadingModal from "../../../LoadingModal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-toastify";

const CategoryListings = () => {

  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
    const AreaPin = useSelector((state) => state.auth.AreaPin);
  const [GroupId, setGroupID] = useState("");
  const [GroupName, setGroupName] = useState("");

  const { truncateText } = useTruncateSentance();
  const locationData = useLocation();
  const savedState = useSelector((state) => state.pageStateSlice[locationData.pathname]) || null;

  useEffect(() => {
    if (savedState?.groupid && savedState?.groupname) {
      setGroupID(savedState.groupid);
      setGroupName(savedState.groupname);
    } else if (locationData.state) {
      const { groupid, groupname } = locationData.state;
      setGroupID(groupid);
      setGroupName(groupname);
      dispatch(
        savePageState({
          path: locationData.pathname,
          componentState: { groupid, groupname },
        })
      );
    }
  }, [locationData, savedState, dispatch]);

  useEffect(() => {
    const fetchHomeManagementCategory = async () => {
      setLoading(true);
      try {

        
        const response = await getDesktopHomeManagementCategoryListingsInCustomerUI(GroupId);
           console.log(response);
        

        if (
          response?.data?.message === "Desktop Home Management Categories List retrieved successfully."
        ) {

          
          const fetched = response?.data?.data || [];
             (fetched);
          
          setCategories(fetched);
        }



      } catch (error) {
        toast.error(
          error?.response?.data?.message || error?.response?.data?.error
        );
      } finally {
        setLoading(false);
      }





    };

    if (GroupId)  fetchHomeManagementCategory();
  }, [GroupId]);

  const settings = (itemsCount) => ({
    dots: true,
    infinite: itemsCount > 5,
    speed: 1000,
    autoplay: true,
    slidesToShow: Math.min(5, itemsCount),
    slidesToScroll: 1,
    swipeToSlide: true, // allow swipe to slide directly
    draggable: true, // enable drag with mouse
    touchThreshold: 10, // sensitivity of swipe
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(4, itemsCount), slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: Math.min(3, itemsCount), slidesToScroll: 1 },
      },
      {
        breakpoint: 560,
        settings: { slidesToShow: Math.min(2, itemsCount), slidesToScroll: 1 },
      },
    ],
  });

    const handleCat_product = (item, category) => {
         ("vd");
      
    navigate(
      `/product/${GroupName}/${GroupId}/${category.categoryName}/${category.categoryID}/${item.Subcat_name}/${item.Subcat_id}`,
      {
        state: {
          type: "SubCategory",
          title: item.Subcat_name,
          id: item.Subcat_id,
        },
      }
    );
  };


  const itemTemplate = (item,category) => (
    <div className="p-2">
 
      <div className="rounded-xl shadow-lg p-3 border bg-white flex flex-col items-center">
     <Link
  to={`/product/${GroupName}/${GroupId}/${category.categoryName}/${category.categoryID}/${item.Subcat_name}/${item.Subcat_id}/${AreaPin}`}
  state={{
    type: "SubCategory",
    title: item.Subcat_name,
    id: item.Subcat_id,
  }}
>

          <img
            src={item.Subcat_image}
            alt={item.Subcat_name}
            className="w-32 h-32 object-contain mb-3"
          />
          <h4 className="font-medium text-sm text-center">
            {truncateText(item.Subcat_name, 2)}
          </h4>
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-h-screen">
        <LoadingModal />
      </div>
    );
  }

  return (
    <div className="p-5 bg-gray-100">
      {categories?.length > 0 ? (
        categories?.map((category, index) => (
          <div key={index} className="mb-8 p-3">
            <h2 className="text-xl font-bold mb-4">{category?.categoryName}</h2>
            <Slider {...settings(category?.subcat?.length)}>
              {category?.subcat.map((item, itemIndex) => (
                <div key={itemIndex}>{itemTemplate(item ,category )}</div>
              ))}
            </Slider>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No categories found.</p>
      )}
    </div>
  );
};

export default CategoryListings;
