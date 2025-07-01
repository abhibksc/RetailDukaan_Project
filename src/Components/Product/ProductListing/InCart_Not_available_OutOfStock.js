import { useSelector } from "react-redux";
import useCartActions from "../useCartActions";

const InCart_Not_available_OutOfStock = ({ bestVariant }) => {
  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);

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

   (bestVariant);

  return (
    <>
      {bestVariant.is_deliveryable && bestVariant.is_Stock_Available ? (
        isInCart(bestVariant?.sku_id) ? (
          <div className="flex items-center bg-gray-50 border rounded-lg overflow-hidden shadow-sm">
            <button
              className="px-3 py-1 text-sm font-semibold bg-gray-200 hover:bg-gray-300"
              onClick={() =>
                decreaseQuantity(
                  bestVariant?.sku_id,
                  bestVariant?.purchase_item_id,
                  bestVariant?.variant_type
                )
              }
            >
              -
            </button>
            <span className="px-4 text-sm font-medium text-gray-800">
              {getQuantityByVariantId(bestVariant?.sku_id)}
            </span>
            <button
              className="px-3 py-1 text-sm font-semibold bg-gray-200 hover:bg-gray-300"
              onClick={() =>
                increaseQuantity(
                  bestVariant?.sku_id,
                  bestVariant?.purchase_item_id,
                  bestVariant?.variant_type
                )
              }
            >
              +
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-600 w-full text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() =>
              addItemToCart(
                bestVariant?.sku_id,
                bestVariant?.purchase_item_id,
                bestVariant?.variant_type,
                bestVariant?.stock_type,
                bestVariant?.stock_id
              )
            }
          >
            Add to Cart
          </button>
        )
      ) : !bestVariant.is_deliveryable ? (
        <button className="bg-yellow-600 w-full text-white text-sm font-semibold py-2 rounded-lg hover:bg-yellow-700 cursor-not-allowed transition">
          Not Available
        </button>
      ) : (
        !bestVariant.is_Stock_Available && (
          <button className="bg-red-600 w-full text-white text-sm font-semibold py-2 rounded-lg hover:bg-red-700  cursor-not-allowed transition">
            Out Of Stock
          </button>
        )
      )}
    </>
  );
};

export default InCart_Not_available_OutOfStock;
