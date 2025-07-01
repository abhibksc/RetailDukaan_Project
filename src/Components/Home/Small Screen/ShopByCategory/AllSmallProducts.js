import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getAllItem,
  getMainBannerUptoOfferItems,
} from "../../../CrudOperations/GetOperation";
import useTruncateSentance from "../../../UseFullHooks/useTruncateSentance";
import Sub_SubCategory_Carousel from "./Sub_SubCategory_Carausal";
import useCartActions from "../../../Product/useCartActions";
import BackButton from "../../../BackButton";
import { activeMobileLoginPages } from "../../../ReduxStore/Slices/auth";
import { ChevronDownIcon } from "lucide-react";
import SmallVariantModal from "./SmallVariantModal";

const items = [
  { id: 1, image: "url1", name: "Item 1", price: "$10" },
  { id: 2, image: "url2", name: "Item 2", price: "$20" },
  // More items...
];

const breakpointColumnsObj = {
  default: 9,

  768: 7,
  480: 6,
  414: 5,
  375: 4,
  320: 3,
};

const AllSmallProducts = () => {
  const { truncateText } = useTruncateSentance();
  const { subcategoryTitle } = useParams();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);
  const Customer_userId = useSelector((state) => state.auth.Customer_userId);
     (Customer_userId);

  // setIsOpenVariant

  const [isOpenVariant, setIsOpenVariant] = useState(false);
  const [ExistVariants, setexistVariants] = useState(null);

     (reduxcartItems);

  const dispatch = useDispatch();

  const { addItemToCart, increaseQuantity, decreaseQuantity } =
    useCartActions();

  const [searchTerm, setSearchTerm] = useState("");
  const [emptyItem, setEmptyItem] = useState(false);
  const [cart, setCart] = useState({}); // Ensure cart is defined here

  const [selectedBrand, setSelectedBrand] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [quantity, setquantity] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [items, setItems] = useState([]);
  const [variants, setVariants] = useState([]);
  const [title, setTitle] = useState("");
  const [sortOption, setSortOption] = useState("Popularity");
  const [loading, setLoading] = useState(false);
  const [hunt, setHunt] = useState("");
  const [locationState, setLocationState] = useState("");

  // setHunt

  const [filteredItems, setFilteredItem] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {

  //   document.body.classList.add("modal-open");
  //   return () => {
  //     document.body.classList.remove("modal-open");
  //   };

  // }, []);

  useEffect(() => {
    const fetchItems = async () => {
      // setLoading(true);

         ("fdsdsfds");

      setCategoryName("");
      setFilteredProducts([]);
      // setLoading(true);

      if (location.state) {
        const { id, type, bannerId, ImageId } = location.state || {};

           (location);

        if (id && type) {
          setLocationState(location.state);

          const response = await getAllItem({ id, type });

             (response);

          if (response && response.Items.length > 0) {
            setCategoryName(response.Category.name);
            setFilteredProducts(response.Items);
            setLoading(false);
          } else {
            // toast.error(response.data.message);
            setCategoryName("No Item Found");
            setLoading(false);
          }
        } else if (bannerId) {
          const response = await getMainBannerUptoOfferItems(bannerId);
             (response);

          if (response && response.data.MainBanner.Items.length > 0) {
               (response.data.MainBanner);

            // alert("Main Banner");
            // setCategoryName(response.Category.name);
            setFilteredProducts(response.data.MainBanner.Items);
            setLoading(false);
          } else {
            setCategoryName("No Item Found");
            setLoading(false);
          }
        } else if (ImageId) {
          const response = await getFeaturedBannerUptoOfferItems(ImageId);
             (response);

          if (response && response.data.FeaturedBanner.Items.length > 0) {
               (response.data.FeaturedBanner);

            // alert("Main Banner");
            // setCategoryName(response.Category.name);
            setFilteredProducts(response.data.FeaturedBanner.Items);
            setLoading(false);
          } else {
            setCategoryName("No Item Found");
            setLoading(false);
          }
        }
      }
    };

    fetchItems();
  }, [location.pathname, location.state]);

  const isInCart = (itemId) => {
    if (reduxcartItems && reduxcartItems.data.length > 0) {
         (
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
      <div className="max-h-screen">
        <LoadingModal />
      </div>
    );

  return (
    <div className="h-[calc(100vh-66px)] overflow-y-auto bg-white ">
      {locationState ? (
        <div className="">
          <Sub_SubCategory_Carousel locationStateData={locationState} />
        </div>
      ) : (
        <header className="shadow-md shadow-gray-700 mb-3 bg-gradient-to-b from-green-400 to-white">
          <div className="flex mx-3">
            <BackButton className="" />
            <h1 className="mt-2 ml-4 font-semibold text-gray-700">Product</h1>
          </div>
        </header>
      )}

      <div
        className={`grid      ${
          windowWidth < 300
            ? "grid-cols-2 "
            : windowWidth < 400
            ? "grid-cols-3 "
            : windowWidth < 500
            ? "grid-cols-4 "
            : windowWidth < 600
            ? "grid-cols-5 "
            : windowWidth < 700
            ? "grid-cols-6 "
            : windowWidth < 800
            ? "grid-cols-7 "
            : ""
        }    gap-4`}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div className="p-2 mt-5 ">
              <div className="rounded-xl  flex flex-col items-center relative">
                <div className="border">
                  <div className="relative">
                    <Link
                      to={`/grocery/${item.category.categoryName}/${item.category.subCategoryName}/${item.category.subSubCategoryName}/${item.Modal_Item_id}/${item.variant_id}`}
                      state={{
                        Variantid: item.variant_id,
                        Varient_type: item.Varient_type || item.varient_type,
                        purchase_item_id: item.purchase_item_id,
                        stock_id: item.stock_id,
                      }}
                    >
                      <img
                        src={item.images[0] || "placeholder-image-url"}
                        alt={item.name}
                        className="w-full h-auto rounded-sm"
                      />
                    </Link>

                    {/* Place the + button at the lower-right corner of the image */}
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
                            : dispatch(activeMobileLoginPages({ login: true }))
                        }
                        className="absolute text-[13px] bottom-0 right-0 bg-blue-600 text-white rounded-sm px-2 shadow-md transform translate-x-1/2 translate-y-1/2 hover:bg-blue-700"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>

                <Link
                  to={`/grocery/${item.category.categoryName}/${item.category.subCategoryName}/${item.category.subSubCategoryName}/${item.Modal_Item_id}/${item.variant_id}`}
                  state={{
                    Variantid: item.variant_id,
                    Varient_type: item.Varient_type || item.varient_type,
                    purchase_item_id: item.purchase_item_id,
                    stock_id: item.stock_id,
                  }}
                >
                  <div className="absolute top-0  left-0 bg-green-600 text-white text-[11px]  px-1   ">
                    {item.discount_percentage_in_mrp
                      ? item.discount_percentage_in_mrp + "%" + "OFF"
                      : " "}
                  </div>

                  <h4 className="font-inter line-clamp-2 text-[10px] sm:text-[13px] md:text-[14px] text-gray-700 text-center mt-4 sm:mt-3">
                    {truncateText(item.variantName, 4)}
                  </h4>

                  <p className="font-inter line-clamp-2 text-[8px] sm:text-[11px] md:text-[12px] text-gray-500 text-center mb-2">
                    {item.brand}
                  </p>
                </Link>

                <div>
                  {/* <p className="font-inter line-clamp-2 font-semibold text-[10px] sm:text-[13px] md:text-[15px] text-gray-800 text-center mb-2">
    {truncateText(item["quantity/pct"], 3)}
  </p> */}

                  <div
                    onClick={() => {
                      setIsOpenVariant(true);

                      setexistVariants(item.Variants);
                    }}
                    className="flex justify-center items-center  cursor-pointer font-inter line-clamp-2 font-semibold text-[7px] sm:text-[5px] md:text-[8px] text-gray-800 text-center mb-2"
                  >
                    <span className="text-gray-700 text-sm mr-1">
                      {" "}
                      {truncateText(item["quantity/pct"], 3)}
                    </span>
                    <ChevronDownIcon className="w-5 h-5 text-gray-700" />
                  </div>
                </div>

                {item.discount_percentage_in_mrp > 0 ? (
                  <div className="flex justify-around border w-full px-2 gap-3">
                    <p className="font-semibold text-green-600 text-[12px] sm:text-[15px] md:text-[16px]">
                      ₹
                      {Math.round(
                        item.sellingPrice -
                          (item.sellingPrice *
                            item.discount_percentage_in_mrp) /
                            100
                      )}
                    </p>

                    <p className="mt-1 line-through text-gray-600 text-[9px] sm:text-[12px] md:text-[13px]">
                      ₹{item.sellingPrice}
                    </p>
                  </div>
                ) : (
                  <div className="border w-full text-center">
                    <p className="font-semibold text-green-600 text-[12px] sm:text-[15px] md:text-[16px]">
                      ₹{item.sellingPrice}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 w-full items-center ">
            Showing 0 products
          </div>
        )}
      </div>

      {isOpenVariant && (
        <SmallVariantModal
          Variants={ExistVariants}
          onclose={() => setIsOpenVariant(false)}
        />
      )}
    </div>
  );
};

export default AllSmallProducts;
