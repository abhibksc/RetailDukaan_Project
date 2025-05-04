import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { getDesktopHomeManagementCategoryInCustomerUI } from "../../CrudOperations/GetOperation";
import { useDispatch, useSelector } from "react-redux";
import useCartActions from "../../Product/useCartActions";
import { Link } from "react-router-dom";
import LoadingModal from "../../LoadingModal";
import { activeMobileLoginPages } from "../../ReduxStore/Slices/auth";

const HomeManagementMobileCategory = () => {
  const [categories, setCategories] = useState([]);
  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);
  const dispatch = useDispatch();

  const { addItemToCart, increaseQuantity, decreaseQuantity } =
    useCartActions();
  useEffect(() => {
    const fetchHomeManagementCategory = async () => {
      try {
        const response = await getDesktopHomeManagementCategoryInCustomerUI();
        if (
          response?.data?.message ===
          "Desktop Home Management Categories retrieved successfully."
        ) {
          setCategories(response.data.Home_Management || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchHomeManagementCategory();
  }, []);

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true, // Enable automatic sliding
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 7, slidesToScroll: 1 } },
      { breakpoint: 771, settings: { slidesToShow: 6, slidesToScroll: 1 } },
      { breakpoint: 641, settings: { slidesToShow: 5, slidesToScroll: 1 } },
      { breakpoint: 613, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 509, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 397, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 261, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 139, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const isInCart = (itemId) => {
    if (reduxcartItems && reduxcartItems.data.length > 0) {
      console.log(
        reduxcartItems.data.some((ele) => ele.variant_sku_id === itemId)
      );

      return reduxcartItems.data.some((ele) => ele.variant_sku_id == itemId);
    }
  };

  const getQuantityByVariantId = (variantId) => {
    const item = reduxcartItems.data.find(
      (item) => item.variant_sku_id == variantId
    );

    return item ? item.quantity : 0; // Return quantity or default to 0
  };

  const truncateText = (text, maxWords) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  const itemTemplate = (item, categoryItem) => (
    <div className="p-2 ">
      <div className="rounded-xl  flex flex-col items-center relative">
        <div className="border">
          <div className="relative">
            <Link
              to={`/grocery/${item.category.categoryName}/${item.category.subCategoryName}/${item.category.subSubCategoryName}/${item.Modal_Item_id}/${item.variant_id}`}
              state={{
                Variantid: item.variant_id,
                Varient_type: item.Varient_type || item.varient_type,
                purchase_item_id: item.purchase_item_id,
                stock_id: item.stock_id,
              }}
            >
              <img
                src={item.images?.[0]}
                alt={item.variantName}
                className="h-20 object-contain rounded-md"
              />
            </Link>

            {/* Place the + button at the lower-right corner of the image */}
            {isInCart(item.sku_id) ? (
              <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-sm px-2 shadow-md transform  translate-y-1 hover:bg-blue-700">
                <div className="flex gap-2">
                  <button
                    className=" text-xs  text-[16px] rounded-l"
                    onClick={() =>
                      decreaseQuantity(
                        item.sku_id,
                        item.purchase_item_id,
                        item.Varient_type
                      )
                    }
                  >
                    -
                  </button>
                  <span className="px-1 text-[13px]">
                    {getQuantityByVariantId(item.sku_id)}
                  </span>
                  <button
                    className="text-xs text-[16px] rounded-r"
                    onClick={() =>
                      increaseQuantity(
                        item.sku_id,
                        item.purchase_item_id,
                        item.Varient_type
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  localStorage.getItem("token")
                    ? addItemToCart(
                        item.sku_id,
                        item.purchase_item_id,
                        item.Varient_type,
                        item.stock_type,
                        item.stock_id,
                        categoryItem
                      )
                    : dispatch(activeMobileLoginPages({ login: true }));
                }}
                className="absolute text-[13px] bottom-0 right-0 bg-blue-600 text-white rounded-sm px-2 shadow-md transform translate-x-1/2 translate-y-1/2 hover:bg-blue-700"
              >
                +
              </button>
            )}
          </div>
        </div>

        <Link
          to={`/grocery/${item.category.categoryName}/${item.category.subCategoryName}/${item.category.subSubCategoryName}/${item.Modal_Item_id}/${item.variant_id}`}
          state={{
            Variantid: item.variant_id,
            Varient_type: item.Varient_type || item.varient_type,
            purchase_item_id: item.purchase_item_id,
            stock_id: item.stock_id,
          }}
        >
          <div className="absolute top-0  left-0 bg-green-600 text-white text-[11px]  px-1   ">
            {item.discount_percentage_in_mrp
              ? item.discount_percentage_in_mrp + "%" + "OFF"
              : " "}
          </div>

          <h4 className="font-inter line-clamp-2 text-[10px] sm:text-[13px] md:text-[14px] text-gray-700 text-center mt-4 sm:mt-3">
            {truncateText(item.variantName, 4)}
          </h4>
          <p className="font-inter line-clamp-2 text-[8px] sm:text-[11px] md:text-[12px] text-gray-500 text-center mb-2">
            {item.brand}
          </p>

          <p className="font-inter line-clamp-2 font-semibold  text-[10px] sm:text-[13px] md:text-[15px] text-gray-800  mb-2">
            {truncateText(item["quantity/pct"], 3)}
          </p>

          {item.discount_percentage_in_mrp > 0 ? (
            <div className="flex justify-around border w-full px-2 gap-3">
              <p className="font-semibold text-green-600 text-[12px] sm:text-[15px] md:text-[16px]">
                ₹
                {Math.round(
                  item.sellingPrice -
                    (item.sellingPrice * item.discount_percentage_in_mrp) / 100
                )}
              </p>

              <p className="mt-1 line-through text-gray-600 text-[9px] sm:text-[12px] md:text-[13px]">
                ₹{item.sellingPrice}
              </p>
            </div>
          ) : (
            <div className="border w-full text-center">
              <p className="font-semibold text-green-600 text-[12px] sm:text-[15px] md:text-[16px]">
                ₹{item.sellingPrice}
              </p>
            </div>
          )}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="bg-white py-4 px-3 ">
      {categories.length > 0 ? (
        categories.map((category, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {category.CategoryTitle}
            </h2>
            <Slider {...settings}>
              {category.Items.map((item, itemIndex) => (
                <div key={itemIndex}>{itemTemplate(item, category.Items)}</div>
              ))}
            </Slider>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-600 py-4">
        <LoadingModal />
      </div>
      )}
    </div>
  );
};

export default HomeManagementMobileCategory;
