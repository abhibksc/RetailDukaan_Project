import React, { useEffect, useState } from "react";
import useCartActions from "../../../Product/useCartActions";
import { useSelector } from "react-redux";
import { FaIndianRupeeSign } from "react-icons/fa6";
import useTruncateSentance from "../../../UseFullHooks/useTruncateSentance";

function ShowVariantModal({ variants, onclose }) {
  console.log(variants);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const {truncateText} = useTruncateSentance()

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);

  const { addItemToCart, increaseQuantity, decreaseQuantity } =
    useCartActions();

  const getQuantityByVariantId = (variantId) => {
    const item = reduxcartItems.data.find(
      (item) => item.variant_sku_id == variantId
    );

    return item ? item.quantity : 0; // Return quantity or default to 0
  };

  const isInCart = (itemId) => {
    if (reduxcartItems && reduxcartItems.data.length > 0) {
      console.log(
        reduxcartItems.data.some((ele) => ele.variant_sku_id === itemId)
      );

      return reduxcartItems.data.some((ele) => ele.variant_sku_id == itemId);
    }
  };

  return (
    <div className="fixed z-50 inset-0 flex items-end justify-center bg-black bg-opacity-50">
      <div className="w-full bg-white text-white  rounded-t-lg shadow-lg relative">
    <div className="flex justify-between w-full m-3 p-2">

    <h3 className="text-black font-bold text-[15px]  w-full ">{        truncateText(variants[0].ItemName , 3)}</h3>

    <button
          className="  mr-5  text-gray-700   hover:bg-gray-400 transition duration-200"
          onClick={onclose}
        >
          x
        </button>
      

    </div>

        <div>
          {/* <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {variants.ItemName && variants.ItemName}
          </h2> */}
        

          {variants.length > 0 &&
            variants.map((ele, index) => (
              <div
                key={index}
                className=" p-4 mb-2 border gap-3 border-gray-200 rounded-lg flex flex-row items-center bg-gray-50 hover:shadow-md transition-shadow duration-200"
              >








                {/* Image */}
                <img
                  src={ele.images[0]}
                  alt={ele.ItemName || "No title"}
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
                      : windowWidth < 700
                      ? "w-12 h-12"
                      : windowWidth < 800
                      ? "w-14 h-14"
                      : windowWidth < 900
                      ? "w-15 h-15"
                      : windowWidth < 1000
                      ? "w-16 h-16"
                      : ""
                  }  rounded-sm `}
                />

                <div className=" flex-1">
                  {/* Item name */}
                  <h3
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
                    {`${truncateText(ele["variantName"] , 2)}`}
                  </h3>

                  {/* Quantity */}
                  {/* <p className="text-sm text-gray-600 mt-1">
                      {`${ele["quantity/pct"]}`}
                      </p> */}

                  {/* Final price and MRP */}
                  <div
                    //    className="flex items-center space-x-4 mt-2"

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
                    }               flex items-center space-x-4 mt-2            font-semibold text-gray-700`}
                  >
                    {/* Selling price */}
                    <div
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
                      }               flex items-center              font-semibold text-gray-700`}

                      // className="flex items-center text-lg font-semibold text-gray-700"
                    >
                      <FaIndianRupeeSign className="mr-1 text-gray-700" />
                      <span>
                        {ele.sellingPrice -
                          ele.discount_percentage_in_mrp / 100 || "N/A"}
                      </span>
                    </div>

                    {/* MRP (Cutted price) */}
                    {ele.mrp ? (
                      <div className="flex items-center text-sm text-gray-500">
                        <FaIndianRupeeSign className="mr-1 text-gray-500" />
                        <span className="line-through">
                          {ele.sellingPrice || "N/A"}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Price per unit */}
                  {/* <p className="text-sm text-gray-500 mt-1">
                        @
                        {ele.unit
                          ? `${ele.packet_varient_price_per_unit} / ${ele.packet_varient_sell_unit}`
                          : ele.loose_price_per_unit && ele.loose_product_unit
                          ? `${ele.loose_price_per_unit} / ${ele.loose_product_unit}`
                          : "N/A"}
                      </p> */}
                </div>

                {/* Add to Cart / Quantity control */}
                <div
                  // className="mt-4 md:mt-0 md:ml-6 flex flex-col items-center justify-center"

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
                  }               flex items-center  mt-2     justify-center       `}
                >
                  {isInCart(ele.sku_id) ? (
                    <div className="flex items-center">
                      <button
                        className="bg-gray-200 px-3 py-1 rounded-l-md hover:bg-gray-300 transition-colors duration-200"
                        onClick={() =>
                          decreaseQuantity(
                            ele.sku_id,
                            ele.purchase_item_id,
                            ele.Varient_type
                          )
                        }
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-gray-700">
                        {getQuantityByVariantId(ele.sku_id)}
                        {console.log(ele)
                        }
                      </span>
                      <button
                        className="bg-gray-200 px-3 py-1 rounded-r-md hover:bg-gray-300 transition-colors duration-200"
                        onClick={() =>
                          increaseQuantity(
                            ele.sku_id,
                            ele.purchase_item_id,
                            ele.Varient_type
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className="py-2 px-4 bg-blue-600 text-white rounded-md  font-medium hover:bg-blue-700 transition-colors duration-200"
                      onClick={() =>
                        addItemToCart(
                          ele.sku_id,
                          ele.purchase_item_id,
                          ele.Varient_type,
                          ele.stock_type,
                          ele.stock_id,
                          variants
                        )
                      }
                    >
                      Add to Cart
                    </button>
                  )}
                </div>






              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ShowVariantModal;
