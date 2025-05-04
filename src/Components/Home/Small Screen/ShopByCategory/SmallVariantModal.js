import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { CancelItemConfirmation } from "../../../AdminPanel/Orders/Manage Cancel Order/CancelModal";
import { getUserOrders } from "../../../CrudOperations/GetOperation";
import useCartActions from "../../../Product/useCartActions";
import { useDispatch, useSelector } from "react-redux";
import { activeMobileLoginPages } from "../../../ReduxStore/Slices/auth";

const SmallVariantModal = ({ Variants, onclose }) => {
  const { orderId } = useParams();
  const [cancelItemModal, setCancelItemModal] = useState(false);
  const [ItemData, setItemData] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);

  const { addItemToCart, increaseQuantity, decreaseQuantity } =
  useCartActions();

  const dispatch = useDispatch();


  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCancelItemClick = (item) => {
    setItemData(item);
    setCancelItemModal(!cancelItemModal);
  };
  const truncateText = (text, maxWords) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
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

  return (
    <div className="fixed z-50 inset-0 flex items-end justify-center bg-black bg-opacity-50">
      <div
        className="w-full  text-white max-w-2xl max-h-[80vh]  bg-white  rounded-t-lg shadow-lg relative overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className={`text-xl font-semibold text-gray-900
                ${
                    windowWidth < 200
                      ? "text-[6px]"
                      : windowWidth < 300
                      ? "text-[11px]"
                      : windowWidth < 400
                      ? "text-[12px]"
                      : windowWidth < 500
                      ? "text-[13px]"
                      : windowWidth < 600
                      ? "text-[14px]"
                      : " "
                  }
                
                `}>{truncateText(Variants[0].ItemName,3)}</h2>
            <button
              className="text-gray-600 hover:text-gray-900 text-lg"
              onClick={onclose}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 mt-2">
            {Variants.length > 0 &&
              Variants.map(
                (item, index) =>
                  (
                    <div
                      key={index}
                      className="border  rounded-md flex  justify-between px-2 items-"
                    >
                      {/* Left: Item Image & Details */}
                      <div className="flex gap-4 p-1 items-center">

                        <img
                          src={item.images[0]}
                          alt={item.variantName}
                          className={`  ${
                            windowWidth < 200
                              ? "w-10 h-10 "
                              : windowWidth < 300
                              ? "w-8 h-8"
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
                        <div>
                          <p
                            className={`${
                              windowWidth < 200
                                ? "text-[6px]"
                                : windowWidth < 300
                                ? "text-[11px]"
                                : windowWidth < 400
                                ? "text-[12px]"
                                : windowWidth < 500
                                ? "text-[13px]"
                                : windowWidth < 600
                                ? "text-[14px]"
                                : " "
                            }    font-semibold text-gray-700`}
                          >
                            {truncateText(item.variantName, 2)}
                          </p>
                          <p
                            className={`${
                              windowWidth < 200
                                ? "text-[5px]"
                                : windowWidth < 300
                                ? "text-[9px]"
                                : windowWidth < 400
                                ? "text-[10px]"
                                : windowWidth < 500
                                ? "text-[11px]"
                                : windowWidth < 600
                                ? "text-[12px]"
                                : " "
                            }    font-semibold text-gray-700`}
                          >
                            Approved {item['quantity/pct']} Quantity
                          </p>
                          <p
                            className={`${
                              windowWidth < 200
                                ? "text-[4px]"
                                : windowWidth < 300
                                ? "text-[8px]"
                                : windowWidth < 400
                                ? "text-[9px]"
                                : windowWidth < 500
                                ? "text-[10px]"
                                : windowWidth < 600
                                ? "text-[11px]"
                                : " "
                            }      font-semibold text-gray-700`}
                          >
                            {/* {item.Status} */}
                          </p>

                          <p
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
                            }     font-semibold text-green-500`}
                          >
                            ₹{item.sellingPrice - item.sellingPrice*item.discount_percentage_in_mrp/100}
                          </p>
                        </div>


                      </div>

                      {/* Right: Cancel Button */}
                      <button
                        className={` 
                          
                          ${
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
                          }
                          
                          
                          flex items-center p-2 text-blue-500 font-bold hover:underline `}






                      >
<div>
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
                                className="text-xs  text-[16px] rounded-r"
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
                            onClick={() =>
                              localStorage.getItem("token")
                                ? addItemToCart(
                                    item.sku_id,
                                    item.purchase_item_id,
                                    item.Varient_type,
                                    item.stock_type,
                                    item.stock_id,
                                    filteredProducts
                                  )
                                : 
                                dispatch(activeMobileLoginPages({ login: true }))
                            }
                            className="absolute text-[13px] bottom-0 right-0 bg-blue-600 text-white rounded-sm px-2 shadow-md transform translate-x-1/2 translate-y-1/2 hover:bg-blue-700"
                          >
                            +
                          </button>
                        )}
</div>
                      
                      </button>
                    </div>
                  )
              )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SmallVariantModal;
