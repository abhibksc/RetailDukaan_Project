import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getFeaturedBannerUptoOfferItems,
  getMainBannerUptoOfferItems,
  GetVariantDetails,
} from "../../CrudOperations/GetOperation";
import useCartActions from "../../Product/useCartActions";
import { Carousel } from "primereact/carousel";
import BackButton from "../../BackButton";
import useTruncateSentance from "../../UseFullHooks/useTruncateSentance";
import LoadingModal from "../../LoadingModal";
import { activeMobileLoginPages } from "../../ReduxStore/Slices/auth";

const SingleSmallProduct = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { addItemToCart, increaseQuantity, decreaseQuantity } =
    useCartActions();
  const cartItems = useSelector((state) => state.cartReducer.cartItems);

  const { truncateText} = useTruncateSentance();

  const [productDetails, setProductDetails] = useState({
    variantName: "",
    brand_name: "",
    PurchaseItemDetails: { MRP: "" },
    Specification: [],
  });

  const [images, setImages] = useState({ Images: [], type: "" });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setLoading(true)
    const fetchVariantDetails = async () => {
      const {
        Variantid,
        Varient_type,
        purchase_item_id,
        stock_id,
        bannerId,
        ImageId,
      } = location.state || {};

      try {
        if (Variantid) {
          const response = await GetVariantDetails(
            Variantid,
            Varient_type,
            purchase_item_id,
            stock_id
          );

          if (response?.data?.Images) {
            setProductDetails(response.data);
            setImages({
              Images: response.data.Images,
              type: response.data.varient_type,
            });
          }
        } else if (bannerId) {
          const response = await getMainBannerUptoOfferItems(bannerId);
          if (response?.data?.MainBanner?.Items?.length > 0) {
            setProductDetails(response.data.MainBanner.Items);
          }
        } else if (ImageId) {
          const response = await getFeaturedBannerUptoOfferItems(ImageId);
          if (response?.data?.FeaturedBanner?.Items?.length > 0) {
            setProductDetails(response.data.FeaturedBanner.Items);
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }

    setLoading(false)

    };

    fetchVariantDetails();
  }, [location.state]);

  const isInCart = (itemId) => {
    return cartItems?.data?.some((item) => item.variant_sku_id === itemId);
  };

  const getQuantityByVariantId = (variantId) => {
    return (
      cartItems?.data?.find((item) => item.variant_sku_id === variantId)
        ?.quantity || 0
    );
  };

  if(loading) return <div className="text-center w-screen h-screen text-gray-600">

    <LoadingModal/>  


  </div>

  return (
    <div className="w-full  mx-auto bg-white shadow-lg rounded-lg overflow-hidden h-[calc(100vh-66px)] overflow-y-auto mb-2">
      <style>{`.p-carousel-prev, .p-carousel-next { display: none; }`}</style>

      {/* Header with Back Button */}
      <header className="bg-gradient-to-b from-green-500 to-white shadow-md py-3 px-4 flex items-center">
        <BackButton />
        <h1 className="ml-4 font-semibold text-gray-800">
          {truncateText(productDetails.variantName, 2)}
        </h1>
      </header>

      {/* Image Carousel */}
      {images.Images.length > 0 && (
        <div className="relative">
          <Carousel
            value={images.Images}
            numVisible={1}
            numScroll={1}
            circular
            autoplayInterval={3000}
            onPageChange={(e) => setActiveIndex(e.page)}
            itemTemplate={(img) => (
              <div className="flex justify-center items-center p-2">
                <img
                  src={
                    images.type === "loose"
                      ? `https://retaildukan.wipenex.com/public/images/${img.image_path}`
                      : `https://retaildukan.wipenex.com/public/${img.image_path}`
                  }
                  alt="Product"
                  className="w-full h-56 object-contain rounded-lg shadow-md"
                />
              </div>
            )}
          />
          {/* Custom Dots */}
          <div className="flex justify-center mt-2">
            {images.Images.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 mx-1 rounded-full transition-all ${
                  index === activeIndex ? "bg-blue-500 w-4" : "bg-gray-400"
                }`}
              ></span>
            ))}
          </div>
        </div>
      )}

      {/* Product Info */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800">
          {productDetails.variantName}
        </h2>
        <p className="text-sm text-gray-500">{productDetails.brand_name}</p>

        {/* Discount Info */}
        <p className="text-sm text-red-500">
          {productDetails.PurchaseItemDetails?.discount_percentage_in_mrp
            ? `Discount: ${productDetails.PurchaseItemDetails.discount_percentage_in_mrp}%`
            : "No Discount"}
        </p>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-2">
          <p className="text-xl font-semibold text-green-600">
            ₹
            {Math.round(
              productDetails.PurchaseItemDetails.sellingPrice -
                (productDetails.PurchaseItemDetails.sellingPrice *
                  productDetails.PurchaseItemDetails
                    .discount_percentage_in_mrp) /
                  100
            )}
          </p>
          <p className="text-gray-500 line-through">
            ₹{productDetails.PurchaseItemDetails?.sellingPrice}
          </p>
        </div>
      </div>

      {/* Cart Actions */}
      <div className="flex justify-around p-4 gap-4">
        {isInCart(productDetails.sku_id) ? (
          <button
            className="flex-1 rounded-md bg-blue-500 text-white text-sm p-2 hover:bg-blue-600"
            onClick={() => navigate("/viewCart")}
          >
            Go to Cart
          </button>
        ) : (
          <button
            className="flex-1 rounded-md bg-blue-500 text-white text-md p-2 hover:bg-blue-600"
            onClick={() => localStorage.getItem("token") ?  addItemToCart(
                productDetails.sku_id,
                productDetails.PurchaseItemDetails.id,
                productDetails.varient_type || productDetails.Varient_type,
                productDetails.stock_Details.stock_type,
                productDetails.stock_Details.id
              ) :    dispatch(activeMobileLoginPages({ login: true }))
            }
          >
            Add to Cart
          </button>
        )}

        {/* Quantity Selector */}
        {isInCart(productDetails.sku_id) && (
          <div className="flex items-center">
            <button
              className="p-3 text-white text-xs bg-gray-500 rounded-l-md"
              onClick={() =>
                decreaseQuantity(
                  productDetails.sku_id,
                  productDetails.PurchaseItemDetails.id,
                  productDetails.varient_type || productDetails.Varient_type
                )
              }
            >
              -
            </button>
            <span className="px-4 bg-white text-black">
              {getQuantityByVariantId(productDetails.sku_id)} Item(s)
            </span>
            <button
              className="p-3 text-white text-xs bg-gray-500 rounded-r-md"
              onClick={() =>
                increaseQuantity(
                  productDetails.sku_id,
                  productDetails.PurchaseItemDetails.id,
                  productDetails.varient_type || productDetails.Varient_type
                )
              }
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Ratings and Expiry */}
      {/* <div className="p-4 text-sm text-gray-600">
        <p className="flex items-center">
          <span className="text-yellow-500 mr-2">⭐⭐⭐⭐</span> 4.0 Ratings
        </p>
        <p>Expiry Date: {productDetails.expiry_date || "Not Available"}</p>
      </div> */}

{/* Specification */}
<div className="mt-4 pe-3 border mb-5 ">
            <h1 className="text-lg px-4 py-2 font-semibold border-b  mb-4">
              Specification
            </h1>
            {productDetails.Specification.length > 0 &&
              productDetails.Specification.map((spec) => {
                return (
                  <div
                    key={spec.id}
                    className="flex px-4 py-1 flex-row items-start justify-start gap-4"
                  >
                    <p className="text-sm text-gray-500 w-1/3">{spec.key}</p>
                    <p className="text-sm flex-1">{spec.value}</p>
                  </div>
                );
              })}
          </div>


    </div>
  );
};

export default SingleSmallProduct;
