import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ItemsPopUp = ({ updateClose }) => {
  const [ItemList, setItemList] = useState(null);
  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);

    useEffect(() => {
      document.body.classList.add("modal-open");
      return () => {
        document.body.classList.remove("modal-open");
      };
    }, []);




    

  return (



    <div className="fixed inset-0 z-20 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white border p-5 w-full max-w-2xl flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Grocery Basket
        </h2>

        <ul className="space-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {reduxcartItems && reduxcartItems.data.length > 0 ? (
            reduxcartItems.data.map((itemji, index) => (
              <li
                key={index}
                className="p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Image container */}
                <div className="relative">
                  <img
                    src={itemji.image_url}
                    alt={itemji.variant_Name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover"
                  />
                  <span className="absolute bottom-0 left-0 bg-white text-gray-500 font-bold shadow-md text-xs px-2 py-1 rounded-t-md">
                    {itemji.quantity}
                  </span>
                </div>

                {/* Item Details */}
                <div className="flex flex-col gap-2 flex-grow">
                  <h1 className="text-sm font-medium text-gray-800">
                    {itemji.variant_Name}
                  </h1>
                  <h2 className="text-xs text-gray-500">
                    {itemji.quantity_perPacket}
                  </h2>

                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="text-lg font-bold text-green-600">
                      ₹
                      {(
                        itemji.mrp -
                        (itemji.mrp * itemji.discount_percentage_in_mrp) / 100
                      ).toFixed(2)}
                    </span>
                    <span className="text-gray-500 line-through text-sm">
                      ₹{itemji.mrp}
                    </span>
                    <span className="text-sm text-blue-600 font-semibold">
                      {itemji.discount_percentage_in_mrp}%
                    </span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          )}
        </ul>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-600 border rounded-md hover:bg-gray-100"
            onClick={() => updateClose()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemsPopUp;
