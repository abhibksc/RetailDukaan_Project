import React, { useState } from "react";
import useCartActions from "../useCartActions";
import { useSelector } from "react-redux";
import useTruncateSentance from "../../UseFullHooks/useTruncateSentance";
import { Link } from "react-router-dom";
import InCart_Not_available_OutOfStock from "./InCart_Not_available_OutOfStock";

const VegIcon = () => (
  <span className="absolute top-2 right-2 z-10 w-5 h-5">
    <svg viewBox="0 0 100 100" width="15" height="15">
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        fill="none"
        stroke="green"
        strokeWidth="10"
        rx="10"
      />
      <circle cx="50" cy="50" r="20" fill="green" />
    </svg>
  </span>
);

const NonVegIcon = () => (
  <span className="absolute top-2 right-2 z-10 w-5 h-5">
    <svg viewBox="0 0 100 100" width="15" height="15">
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        fill="none"
        stroke="red"
        strokeWidth="10"
        rx="10"
      />
      <circle cx="50" cy="50" r="20" fill="red" />
    </svg>
  </span>
);

const ProductCard = ({ item, variant, showAllVariants }) => {
  const AreaPin = useSelector((state) => state.auth.AreaPin);
  const [showModal, setShowModal] = useState(false);

  const bestVariant = variant || item.variants[0]; // fallback
  const discountedPrice = (
    bestVariant.mrp -
    (bestVariant.mrp * bestVariant.discount) / 100
  ).toFixed(2);

  console.log(bestVariant);
  console.log(bestVariant);
  console.log(bestVariant);

  

  return (
    <div>
      {bestVariant.is_deliveryable && (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-4 flex flex-col gap-3 relative border border-gray-200">
          {bestVariant.isVeg ? <VegIcon /> : <NonVegIcon />}
          <Link
            to={`/product/${bestVariant?.groupName}/${bestVariant?.GroupId}/${bestVariant?.categoryName}/${bestVariant?.categoryId}/${bestVariant?.subCategoryName}/${bestVariant?.subCategoryId}/${bestVariant?.subSubCategoryName}/${bestVariant?.subSubCategoryId}/${bestVariant?.item_id}/${bestVariant?.sku_id}/${bestVariant?.variant_type}/${bestVariant?.purchase_item_id}/${bestVariant?.stock_id}/${AreaPin}`}
            className="block"
          >
            <img
              src={bestVariant.image_url}
              alt={item.ItemName}
              className="w-full h-44 object-contain rounded-xl"
            />
            <h3 className="text-md font-medium mt-2">
              {item.ItemName} {bestVariant.variantName}{" "}
            
            </h3>
            <h4 className="text-sm font-medium text-gray-500 mt-2">
              {bestVariant.variant_type}
            </h4>
          </Link>

          {!bestVariant.mrp ? (
            <div className="flex items-center space-x-2 text-red-500">
              out of stock
            </div>
          ) : !bestVariant.is_Stock_Available ? (
            <div>
              <span className="line-through text-sm text-gray-400">
                ₹{bestVariant.mrp}
              </span>
              <span className="text-lg font-bold text-green-600">
                ₹{discountedPrice}
              </span>
              {bestVariant.discount && (
                <span className="text-sm text-green-700">
                  ({bestVariant.discount}% OFF)
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="line-through text-sm text-gray-400">
                ₹{bestVariant.mrp}
              </span>
              <span className="text-lg font-bold text-green-600">
                ₹{discountedPrice}
              </span>
              {bestVariant.discount && (
                <span className="text-sm text-green-700">
                  ({bestVariant.discount}% OFF)
                </span>
              )}
            </div>
          )}

          <div className="mt-auto flex flex-row justify-between w-full gap-1">
            <button
              onClick={() => setShowModal(true)}
              className={`

              ${
                !bestVariant.mrp && !bestVariant.is_Stock_Available
                  ? "  border w-full text-gray-900 bg-gray-300 text-sm font-medium py-1.5 px-4 rounded-lg cursor-not-allowed transition"
                  : "border w-full text-gray-900 text-sm font-medium py-1.5 px-4 rounded-lg hover:bg-gray-100 transition"
              }
                
                

              `}
            >
              {bestVariant.variantName}
            </button>
            <div className="flex items-center justify-center w-full">
              <InCart_Not_available_OutOfStock bestVariant={bestVariant} />
            </div>
          </div>
        </div>
      )}

      {/* Optional Modal showing all variants only for main card */}
      {!showAllVariants && showModal && item.variants && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-4 rounded-xl w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-2">
              {item.ItemName} - Variants
            </h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {item.variants.map((v, idx) => {
                const hasMRP = !!v.mrp;
                const inStock = v.stock > 0;
                const dis = (v.mrp - (v.mrp * v.discount) / 100).toFixed(2);

                return (
                  <div
                    key={idx}
                    className="relative border p-2 rounded-lg flex flex-col gap-1 bg-gray-50"
                  >
                    <Link
                      to={`/product/${v?.groupName}/${v?.GroupId}/${v?.categoryName}/${v?.categoryId}/${v?.subCategoryName}/${v?.subCategoryId}/${v?.subSubCategoryName}/${v?.subSubCategoryId}/${v?.item_id}/${v?.sku_id}/${v?.variant_type}/${v?.purchase_item_id}/${v?.stock_id}/${AreaPin}`}
                      className="block"
                    >
                      {v.isVeg === 1 ? <VegIcon /> : <NonVegIcon />}
                      <img
                        src={v.image_url}
                        alt={v.variantName}
                        className="h-24 object-contain rounded mb-4 mx-auto"
                      />
                      {!hasMRP || !inStock ? (
                        <div className="flex items-center space-x-2 text-red-500">
                          out of stock
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="line-through text-sm text-gray-400">
                            ₹{v.mrp}
                          </span>
                          <span className="text-md font-bold text-green-600">
                            ₹{dis}
                          </span>
                          {v.discount && (
                            <span className="text-sm text-green-700">
                              ({v.discount}% OFF)
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-auto flex flex-row justify-between w-full gap-1">
                        <button
                          onClick={() => setShowModal(true)}
                          className="border w-full text-gray-900 text-sm font-medium py-1.5 px-4 rounded-lg hover:bg-gray-100 transition"
                        >
                          {v.variantName}
                        </button>

                        <div className="flex items-center justify-center w-full">
                          <InCart_Not_available_OutOfStock bestVariant={v} />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
