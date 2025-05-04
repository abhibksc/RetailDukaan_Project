import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import useCartActions from "./useCartActions";
import { useDispatch, useSelector } from "react-redux";
import { GetVariantDetails } from "../CrudOperations/GetOperation";
import { activePages } from "../ReduxStore/Slices/auth";

const Container = styled.div`
  display: flex;
  justify-content: flex-start; /* Adjust alignment */
  gap: 10px;
  align-items: flex-start;
  position: relative;
  max-width: 1200px; /* Adjust width */
  margin: 0 auto; /* Equivalent to mx-auto */
`;

const ImageThings = styled.div`
  display: flex;
  gap: px;
`;

const ThumbnailList = styled.div`
  display: flex;
  flex-direction: column;

  gap: 10px;
  width: 80px;
`;

const Thumbnail = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 2px solid #ddd;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: #00adb7;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  overflow: hidden;
  border: 1px solid #ddd;
  cursor: crosshair;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MagnifiedContainer = styled.div`
  width: 400px;
  height: 400px;
  overflow: hidden;
  display: ${({ show }) => (show ? "block" : "none")};
  position: absolute;
  top: 0;
  right: 300px; /* Keeps it outside the main layout */
  background: white;
`;

const MagnifiedImage = styled.img`
  width: 600px;
  z-index: 2;
  height: 600px;
  position: absolute;
  left: ${({ x }) => `calc(-${x}% + 200px)`};
  top: ${({ y }) => `calc(-${y}% + 200px)`};
`;

const ItemDetails = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 100%; /* Corrected */
`;

const PriceTag = styled.h1`
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
`;

const Discount = styled.h2`
  color: #28a745;
  font-size: 1rem;
  font-weight: 600;
`;

const Button = styled.button`
  color: white;
  background: #007bff;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  width: 100%;
  &:hover {
    background: #0056b3;
  }

  &:active {
    background: #004494;
  }
`;

const AddButton = styled.div`
background: white;
  border : 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;

`;

const ImageGallery = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(location.state?.product || null);
  const [images, setImages] = useState({
    Images: [],
    type: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState({ x: 50, y: 50, show: false });
  const previewRef = useRef(null);

  const [productDetails, setProductDetails] = useState({
    variantName: "",
    brand_name: "",
    PurchaseItemDetails: {
      MRP: "",
    },
    Specification: [],
  });
  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);
  const Customer_userId = useSelector((state) => state.auth.Customer_userId);
  const area_pin = useSelector((state) => state.auth.AreaPin);


  const navigate = useNavigate();

  const { addItemToCart, increaseQuantity, decreaseQuantity } =
    useCartActions();

  useEffect(() => {
    const fetchVariantDetails = async () => {
      if (location.state?.Variantid) {
        try {
          const response = await GetVariantDetails(
            location.state.Variantid,
            location.state.Varient_type,
            location.state.purchase_item_id,
            location.state.stock_id,
            area_pin
          );

          console.log(response);

          if (response && response.data?.Images) {
            console.log(response);

            setProductDetails(response.data);
            setImages({
              Images: response.data.Images,
              type: response.data.varient_type,
            });
            const ImageData =
              response.data.varient_type === "loose"
                ? `https://retaildukan.wipenex.com/public/images/${response.data.Images[0]?.image_path}`
                : `https://retaildukan.wipenex.com/public/${response.data.Images[0]?.image_path}`;

            setSelectedImage(ImageData);
          }
        } catch (error) {
          console.error("Error fetching variant details:", error);
        }
      }
    };
    fetchVariantDetails();
  }, [location]);

  useEffect(() => {
    if (product?.images?.length) {
      setImages(product.images);
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  const handleHover = (imagePath) => {
    setSelectedImage(imagePath);
  };

  const handleMouseMove = (e) => {
    const rect = previewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoom({ x, y, show: true });
  };

  const handleMouseLeave = () => {
    setZoom({ x: 50, y: 50, show: false });
  };

  const isInCart = (itemId) => {
    console.log(reduxcartItems);
    console.log(itemId);

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
    <Container>
      <ImageThings>
        {/* Left side thumbnail list */}
        <ThumbnailList>
          {images.Images.map((img, index) => {
            const imagePath =
              images.type === "loose"
                ? `https://retaildukan.wipenex.com/public/images/${img.image_path}`
                : `https://retaildukan.wipenex.com/public/${img.image_path}`;
            return (
              <Thumbnail
                key={index}
                src={imagePath}
                onMouseEnter={() => handleHover(imagePath)}
              />
            );
          })}
        </ThumbnailList>

        {/* Main Image & Magnified Image */}
        <ImageWrapper>
          <div className="flex flex-col gap-2">
            <PreviewContainer
              ref={previewRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {selectedImage && <PreviewImage src={selectedImage} />}
            </PreviewContainer>

            <div className="flex w-full  items-center gap-4">
              <div className="w-full">
                {isInCart(productDetails.sku_id) ? (
                  <Button onClick={() => navigate("/viewCart")}>
                    Go To Cart
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      localStorage.getItem("token")
                        ? addItemToCart(
                            productDetails.sku_id,
                            productDetails.PurchaseItemDetails.id,
                            productDetails.varient_type,
                            productDetails.stock_Details.stock_type,
                            productDetails.stock_Details.id
                          )
                        : dispatch(activePages({ login: true }));
                    }}
                  >
                    Add 
                  </Button>
                )}
              </div>

              <div className="w-full">
                {isInCart(productDetails.sku_id) ? (
                  <AddButton className="flex flex-1 items-center justify-between ">
                    <button
                      className="p-3 text-white text-[12px] bg-gray-500   "
                      onClick={() =>
                        decreaseQuantity(
                          productDetails.sku_id,
                          productDetails.PurchaseItemDetails.id,
                          productDetails.varient_type ||
                            productDetails.Varient_type
                        )
                      }
                    >
                      -
                    </button>
                    <span className="px-4  bg-white text-black">
                      {getQuantityByVariantId(productDetails.sku_id)} Item
                    </span>

                    {console.log(productDetails)}
                    <button
                      className="p-3 text-white text-[12px] bg-gray-500   "
                      onClick={() =>
                        increaseQuantity(
                          productDetails.sku_id,
                          productDetails.PurchaseItemDetails.id,
                          productDetails.varient_type ||
                            productDetails.Varient_type
                        )
                      }
                    >
                      +
                    </button>
                  </AddButton>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {/* Magnified Image (appears on the right, tracks cursor) */}
          <MagnifiedContainer show={zoom.show ? "true" : undefined}>
            {selectedImage && (
              <MagnifiedImage src={selectedImage} x={zoom.x} y={zoom.y} />
            )}
          </MagnifiedContainer>
        </ImageWrapper>
      </ImageThings>

      {/* Item details section */}
      <ItemDetails className="w-full ">
        <div className="flex flex-col gap-4">
          {/* Product Info */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-gray-500 text-sm border-b-2 w-28">
                {productDetails.brand_name}
              </h3>
              <h1 className="text-lg text-gray-600">
                {productDetails.variantName}
              </h1>
              <h2 className="text-yellow-500 text-lg">⭐⭐⭐⭐☆</h2>{" "}
              {/* Placeholder for ratings */}
            </div>

            {/* Pricing */}
            <div className="flex flex-col gap-1">
              <h3 className="text-gray-500 w-28">
                MRP:{" "}
                <s className="text-red-500">
                  ₹{productDetails.PurchaseItemDetails.mrp}
                </s>
              </h3>
              <PriceTag>
                {console.log(productDetails)}
                Price: ₹
                {Math.round(
                  productDetails.PurchaseItemDetails.mrp -
                    (productDetails.PurchaseItemDetails.mrp *
                      productDetails.PurchaseItemDetails
                        .discount_percentage_in_mrp) /
                      100
                )}
              </PriceTag>
              <Discount>
                You Save: ₹
                {Math.round(
                  productDetails.PurchaseItemDetails.mrp -
                    (productDetails.PurchaseItemDetails.mrp -
                      (productDetails.PurchaseItemDetails.mrp *
                        productDetails.PurchaseItemDetails
                          .discount_percentage_in_mrp) /
                        100)
                )}
              </Discount>
              <h2 className="text-gray-500">(inclusive of all taxes)</h2>
            </div>
          </div>

          {/* Delivery & Quantity */}
          <div className="flex flex-col gap-4">
            {/* Delivery */}
            {/* <div className="flex flex-row justify-between items-center">
              <div className="text-sm font-semibold text-gray-500">
                Delivery
              </div>
              <div className="flex flex-col gap-1">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Enter Pincode"
                    className="border px-2 py-1 text-sm pr-14" // Add padding to avoid text overlap
                  />
                  <div className="absolute right-2  p-1 rounded">
                    <button className="text-blue-500 text-sm">Change</button>
                  </div>
                </div>

                <p className="text-[12px] text-gray-500">
                  Delivery by Tomorrow, Saturday
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Schedule delivery at your convenience
              </p>
            </div> */}

            {/* Quantity */}

            {/* <div className="flex flex-row items-center gap-5">
              <h3 className="text-sm font-semibold text-gray-500">Quantity</h3>
              <div className="flex flex-row gap-3">
                <span className="border px-3 py-1 rounded cursor-pointer">
                  500g
                </span>
                <span className="border px-3 py-1 rounded cursor-pointer">
                  1kg
                </span>
                <span className="border px-3 py-1 rounded cursor-pointer">
                  2kg
                </span>
              </div>
            </div> */}

            {/* Seller */}
            {/* <div className="flex flex-row justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-500">Seller</h3>
              <p className="text-sm">Sell Name</p>
            </div> */}
          </div>

          {/* Specifications */}
          <div className="mt-4 pe-3 border  ">
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
      </ItemDetails>
    </Container>
  );
};

export default ImageGallery;
