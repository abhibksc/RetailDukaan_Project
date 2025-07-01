import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import useCartActions from "./useCartActions";
import { useDispatch, useSelector } from "react-redux";
import { GetVariantDetails } from "../CrudOperations/GetOperation";
import { activePages } from "../ReduxStore/Slices/auth";
import baseurl from "../CrudOperations/customURl";
import usePincodeEffect from "../UseFullHooks/usePincodeEffect";
import { toast } from "react-toastify";
import LoadingModal from "../LoadingModal";
import PincodeChecker from "./PincodeChecker";

const Container = styled.div`
  min-height: 100vh;
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
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const Single_Product_page = () => {
  const [loading, setLoading] = useState(false);

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

  const navigate = useNavigate();

  const { addItemToCart, increaseQuantity, decreaseQuantity } =
    useCartActions();

  const { triggerPincodeEffect } = usePincodeEffect();

  const {
    item_id,
    VariantId,
    Varient_type,
    purchase_item_id,
    stock_id,
    area_pin,
  } = useParams();

  useEffect(() => {
    setLoading(true);
    const fetchVariantDetails = async () => {
      console.log(VariantId);

      if (VariantId) {
        if (area_pin) {
          const result = await triggerPincodeEffect(area_pin);

          if (result.status !== "success") {
            toast.error(result.message);
            toast.error("Not Deliverable Area");
          }
        } else {
          toast.error("please Enter Pincode");
        }

        try {
          const response = await GetVariantDetails(
            VariantId,
            Varient_type,
            purchase_item_id,
            stock_id,
            area_pin
          );

          if (response && response.data?.Images) {
            setProductDetails(response.data);
            setImages({
              Images: response.data.Images,
              type: response.data.varient_type,
            });

            // const baseurl = "https://yourdomain.com"; // replace with actual base URL

            const ImageData =
              response.data.varient_type === "loose"
                ? `${baseurl}/images/${response.data.Images[0]?.image_path}`
                : `${baseurl}/${response.data.Images[0]?.image_path}`;

            setSelectedImage(ImageData);
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || error?.response?.data?.error )
        } finally {
          setLoading(false);
        }
      }
    };

    fetchVariantDetails();

    // setLoading(false)
  }, [VariantId, Varient_type, purchase_item_id, stock_id, area_pin]);


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

  if (loading)
    return (
      <div className="min-h-screen">
        <LoadingModal />
      </div>
    );

  return (
    <Container>
      <ImageThings>
        {/* Left side thumbnail list */}
        <ThumbnailList>
          {images.Images.map((img, index) => {
            const imagePath =
              images.type === "loose"
                ? `${baseurl}/images/${img.image_path}`
                : `${baseurl}/${img.image_path}`;
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

            {(productDetails.is_Deliverable && productDetails.is_available_in_stock) ? (
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
            ) :

            (!productDetails.is_Deliverable) ?


               <div className="flex w-full  items-center gap-4">
                <div className="w-full">
                  <Button onClick={() => navigate("/viewCart")}>go to cart</Button>
                </div>
              </div>


              :

               (!productDetails.is_available_in_stock) ?

                 <div className="flex w-full  items-center gap-4">
                <div className="w-full">
                  <Button >Out Of Stock</Button>
                </div>
              </div>

               :

               <div className="flex w-full  items-center gap-4">
                <div className="w-full">
                  <Button >Checking..</Button>
                </div>
              </div>

            }
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

              <PincodeChecker
                productDetails={productDetails}
                area_pin={area_pin}
                onPincodeChange={(newPin) => {
                  // You can re-run your pincode checking hook/API here
                  console.log("New pin to check:", newPin);
                  // For example: usePincodeEffect(newPin);
                }}
              />
            </div>
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

export default Single_Product_page;
