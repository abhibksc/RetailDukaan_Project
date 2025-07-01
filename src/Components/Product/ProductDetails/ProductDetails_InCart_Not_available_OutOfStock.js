import { useSelector } from "react-redux";
import useCartActions from "../useCartActions";

const ProductDetails_InCart_Not_available_OutOfStock = ({ bestVariant }) => {
  const { addItemToCart, increaseQuantity, decreaseQuantity } = useCartActions();
  const cartItems = useSelector((state) => state.cartReducer.cartItems);

  const isInCart = (itemId) => {
    return cartItems?.data?.some((item) => item.variant_sku_id === itemId);
  };

  const getQuantityByVariantId = (variantId) => {
    const item = cartItems?.data?.find((item) => item.variant_sku_id === variantId);
    return item?.quantity || 0;
  };

  return (
    <>
      {bestVariant?.is_deliveryable && bestVariant?.is_Stock_Available ? (
        isInCart(bestVariant?.sku_id) ? (
          <div className="flex items-center justify-between w-full max-w-full p-2 bg-gray-50 border rounded-lg shadow-sm overflow-hidden">
            <button
              className="w-10  py-1 bg-gray-200 hover:bg-gray-300 text-sm font-bold transition"
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
            <span className="px-4 text-sm font-medium text-gray-700">
              {getQuantityByVariantId(bestVariant?.sku_id)}
            </span>
            <button
              className="w-10 py-1 bg-gray-200 hover:bg-gray-300 text-sm font-bold transition"
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
            className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
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
      ) : !bestVariant?.is_deliveryable ? (
        <button className="w-full py-2 bg-yellow-500 text-white text-sm font-semibold rounded-lg cursor-not-allowed transition">
          Not Deliverable
        </button>
      ) : (
        !bestVariant?.is_Stock_Available && (
          <button className="w-full py-2 bg-red-600 text-white text-sm font-semibold rounded-lg cursor-not-allowed transition">
            Out of Stock
          </button>
        )
      )}
    </>
  );
};

export default ProductDetails_InCart_Not_available_OutOfStock;
