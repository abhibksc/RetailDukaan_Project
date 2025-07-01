import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import baseurl from "../../CrudOperations/customURl";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import PincodeChecker from "../PincodeChecker";
import InCart_Not_available_OutOfStock from "../ProductListing/InCart_Not_available_OutOfStock";
import ProductDetails_InCart_Not_available_OutOfStock from "./ProductDetails_InCart_Not_available_OutOfStock";

const ProductDetails = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const {
    groupName,
    group_id,
    categoryName,
    category_id,
    subCategoryName,
    subCategory_id,
    subSubCategoryName,
    subSubCategory_id,
    item_id,
    sku_id,
    Varient_type,
    purchase_item_id,
    stock_id,
    area_pin,
  } = useParams();

  const [data, setData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {

    console.log(sku_id);
    console.log(area_pin);
    
    try {
      setLoading(true);
      const res = await fetch(
        `${baseurl}/api/getProductDetails/${sku_id}/${area_pin}`
      );
      console.log(res);
      
      const result = await res.json();
      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
        setSelectedImage(result?.images?.[0]);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [sku_id, area_pin]);

  const handleVariantClick = (v) => {
    if (parseInt(v?.stock_quantity) > 0) {
      const path = `/product/${groupName}/${group_id}/${categoryName}/${category_id}/${subCategoryName}/${subCategory_id}/${subSubCategoryName}/${subSubCategory_id}/${item_id}/${v.sku_id}/${v.variant_type}/${v.purchase_item_id}/${v.stock_id}/${area_pin}`;
      navigate(path);
    }
  };

  if (error)
    return (
      <div className="p-6 min-h-screen text-center text-red-600 font-semibold">{error}</div>
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  const discountedPrice = (data.mrp - (data.mrp * data.discount) / 100).toFixed(
    2
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Left: Image Section */}
        <div>
          <div className="w-full h-[400px] bg-white border rounded-xl overflow-hidden shadow-sm p-2 flex items-center justify-center">
            <InnerImageZoom
              src={selectedImage}
              zoomSrc={selectedImage}
              zoomType="hover"
              zoomScale={1}
              alt="Zoomable"
              className="w-full object-contain max-h-[380px]"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {data?.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 object-contain rounded-lg border-2 cursor-pointer transition ${
                  selectedImage === img
                    ? "border-blue-500 shadow"
                    : "border-gray-300"
                }`}
                alt="Thumbnail"
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="bg-white p-6 rounded-xl shadow space-y-5">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              {data.item_name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {data.description || "No description available"}
            </p>
          </div>

          {/* Pricing */}
        { data.purchase_item_id && <div className="flex items-center gap-2">
            <span className="line-through text-gray-400">₹{data.mrp}</span>
            <span className="text-2xl font-bold text-green-600">
              ₹{discountedPrice}
            </span>
            {data.discount > 0 && (
              <span className="text-sm text-green-700 font-medium">
                ({data.discount}% OFF)
              </span>
            )}
          </div>
}
          <div className="text-sm text-gray-600">
            Delivery: {data.delivery_time}
          </div>

          {console.log(data)
          }

          {/* <PincodeChecker /> */}

          {/* Add to Cart Button */}
          {/* {data.is_deliveryable && data.is_Stock_Available ? (
            <button 
            
            onClick={()=>{}}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
              Add to Cart
            </button>
          ) : !data.is_deliveryable ? (
            <button className="w-full py-3 bg-yellow-500 text-white font-medium rounded-lg cursor-not-allowed">
              Coming Soon
            </button>
          ) : (
            <button className="w-full py-3 bg-red-500 text-white font-medium rounded-lg cursor-not-allowed">
              Out of Stock
            </button>
          )} */}

          <ProductDetails_InCart_Not_available_OutOfStock 
  bestVariant={{
    stock_type: data.stock_type,
    stock_id: data.stock_id,
    sku_id: data.sku_id,
    purchase_item_id: data.purchase_item_id,
    variant_type: data.variant_type,
    is_deliveryable: data.is_deliveryable,
    is_Stock_Available: data.is_Stock_Available,
  }}
/>


          {/* Variants Section */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Available Variants</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.variants.map((v, idx) => {
                const disabled = !v.stock_id || parseInt(v.stock_quantity) <= 0;
                return (
                  <div
                    key={idx}
                    onClick={() => !disabled && handleVariantClick(v)}
                    className={`border rounded-lg p-4 bg-gray-50 cursor-pointer hover:shadow transition ${
                      disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={v.image_url}
                        alt="Variant"
                        className="w-16 h-16 object-contain rounded border"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{v.variantName}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {v.quantity} | Unit: {v.unit_id}
                        </p>
                        <div className="text-xs text-gray-500 mt-1">
                          Brand: {v.brand_name}
                        </div>
                        <div className="text-xs text-blue-600 font-semibold mt-1">
                          {v.variant_type}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specs Section */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Specifications</h3>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              {data.specifications.map((spec, idx) => (
                <li key={idx} className="text-base text-gray-700">
                  <span className="font-medium inline-block w-56">
                    {spec.key}:
                  </span>
                  <span className="inline-block">{spec.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
