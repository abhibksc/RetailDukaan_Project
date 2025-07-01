import Lottie from "react-lottie";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useSelector } from "react-redux";
import useTruncateSentance from "../../UseFullHooks/useTruncateSentance";
import useCartActions from "../../Product/useCartActions";

import animationDataa from "../../../assets/animations/Emptylist.json";
import { Link } from "react-router-dom";

const Cart_Item_Section = () => {
  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: animationDataa,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const AreaPin = useSelector((state) => state.auth.AreaPin);

  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);
  const { truncateText } = useTruncateSentance();

  const { addItemToCart, increaseQuantity, decreaseQuantity } =
    useCartActions();

  const isInCart = (itemId) => {
    if (reduxcartItems && reduxcartItems.data.length > 0) {
      const answer = reduxcartItems.data.find(
        (ele) => ele.variant_sku_id == itemId
      );

      return answer ? true : false;
    }
  };

  const getQuantityByVariantId = (variantId) => {
    const item = reduxcartItems.data.find(
      (item) => item.variant_sku_id == variantId
    );

    return item ? item.quantity : 0; // Return quantity or default to 0
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-6">
        Your Items
      </h1>

      <ul className="space-y-4">
        {reduxcartItems.data && reduxcartItems.data.length > 0 ? (
          reduxcartItems.data.map((item , index) => {
            const discountedPrice = (
              item.mrp -
              (item.mrp * item.discount_percentage_in_mrp) / 100
            ).toFixed(2);

            return (
              <li key={index} className="p-4 border flex flex-col xl:flex-row justify-between items-center bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 transition">
                <Link
                  key={item.grocery_cart_Item_id}
                  to={`/product/${item.GroupName}/${item.GroupId}/${item.CategoryName}/${item.CategoryId}/${item.SubCategoryName}/${item.SubCategoryId}/${item.Sub_SubCateogry_Name}/${item.Sub_SubCategoryId}/${item.item_id}/${item.variant_sku_id}/${item.Varient_type}/${item.purchase_item_id}/${item.stockId}/${AreaPin}`}
                  className="block"
                >
                  {" "}
                  <div className="flex gap-4 items-start w-full xl:w-auto">
                    <img
                      src={item.image_url}
                      alt={item.variant_Name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex flex-col gap-1">
                      <div className="font-semibold text-gray-800">
                        {truncateText(item.ItemName, 4)}{" "}
                        {truncateText(item.variant_Name, 4)}
                      </div>
                      <h2 className="text-sm text-gray-600 line-clamp-2">
                        {item.brand} {item.variantName}
                      </h2>
                      <div className="flex items-center text-sm mt-1">
                        <div className="text-gray-800 font-semibold flex items-center">
                          <FaIndianRupeeSign className="mr-1" />
                          {discountedPrice}
                        </div>
                        {item.discount_percentage_in_mrp > 0 && (
                          <>
                            <div className="line-through text-gray-500 ml-2">
                              ₹{item.mrp}
                            </div>
                            <div className="text-green-600 ml-2">
                              {Math.round(item.discount_percentage_in_mrp)}% Off
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="mt-4 xl:mt-0">
                  {item.is_available_for_pincode && !item.is_outOfStock ? (
                    isInCart(item.variant_sku_id) ? (
                      <div className="flex items-center border border-gray-300 bg-white shadow rounded-md px-3 py-1">
                        <button
                          className="px-3 py-1 text-sm font-semibold text-gray-600 bg-gray-100 rounded-l hover:bg-gray-200"
                          onClick={() =>
                            decreaseQuantity(
                              item.variant_sku_id,
                              item.purchase_item_id,
                              item.Varient_type
                            )
                          }
                        >
                          -
                        </button>
                        <span className="px-4 text-base font-medium text-gray-800">
                          {getQuantityByVariantId(item.variant_sku_id)}
                        </span>
                        <button
                          className="px-3 py-1 text-sm font-semibold text-gray-600 bg-gray-100 rounded-r hover:bg-gray-200"
                          onClick={() =>
                            increaseQuantity(
                              item.variant_sku_id,
                              item.purchase_item_id,
                              item.Varient_type
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="bg-blue-500 text-white text-sm rounded px-6 py-2 hover:bg-blue-600 transition"
                        onClick={() => addItemToCart(item.variant_sku_id)}
                      >
                        Add to Cart
                      </button>
                    )
                  ) : (
                    <div className="flex items-center border border-red-300 bg-red-50 text-red-700 rounded-md px-4 py-2">
                      Out of Stock
                      <button
                        className="ml-4 px-3 py-1 text-sm font-semibold text-red-600 bg-red-100 rounded hover:bg-red-200"
                        onClick={() =>
                          decreaseQuantity(
                            item.variant_sku_id,
                            item.purchase_item_id,
                            item.Varient_type
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })
        ) : (
          <div className="p-6 bg-white rounded-md shadow-md flex flex-col items-center justify-center">
            <Lottie options={defaultOptions2} height={280} width={280} />
            <h1 className="font-semibold text-lg mt-4 text-gray-700">
              Your Basket Is Empty
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Enjoy up to 50% savings on groceries. Shop now!
            </p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded text-sm transition">
              Shop Now
            </button>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Cart_Item_Section;
