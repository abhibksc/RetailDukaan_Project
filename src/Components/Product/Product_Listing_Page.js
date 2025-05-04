import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  getAllCartItems,
  getAllItem,
  getFeaturedBannerUptoOfferItems,
  getMainBannerUptoOfferItems,
} from "../CrudOperations/GetOperation";
import LoadingModal from "../LoadingModal";
import ItemsSidebar from "./ItemsSidebar";
import EmptyState from "../Animation/Empty";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  DecreaseItemQuantityToCart,
  IncreaseItemQuantityToCart,
  StoreItemToCart,
} from "../CrudOperations/PostOperation";
import {
  addCart,
  cartReducer,
  decreaseCart,
  importCartItems,
  increaseCart,
} from "../ReduxStore/Slices/cartSlice";
import { activePages, logout } from "../ReduxStore/Slices/auth";

function ProductListingPage() {

  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);
  const Customer_userId = useSelector((state) => state.auth.Customer_userId);
  console.log(Customer_userId);

  console.log(reduxcartItems);

  const dispatch = useDispatch();

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

      console.log("fdsdsfds");

      setCategoryName("");
      setFilteredProducts([]);
      // setLoading(true);

      if (location.state) {
        const { id, type, bannerId, ImageId } = location.state || {};


        if (id && type) {

          const response = await getAllItem({ id, type });

          console.log(response);

          if (response && response.Items.length > 0) {
            setCategoryName(response.Category.name);
            setFilteredProducts(response.Items);
            setLoading(false);
          } else {
            // toast.error(response.data.message);
            setCategoryName("No Item Found");
            setLoading(false);
          }
        } 
        
        else if (bannerId) {
          const response = await getMainBannerUptoOfferItems(bannerId);
          console.log(response);

          if (response?.data?.message === "true" && response?.data?.MainBanner?.length > 0) {
            setFilteredProducts(response.data.MainBanner);
            setLoading(false);
          } else {
            setCategoryName("No Item Found");
            setLoading(false);
          }
        } 
        
        else if (ImageId) {
          const response = await getFeaturedBannerUptoOfferItems(ImageId);
          console.log(response);

          if (response && response.data.FeaturedBanner.Items.length > 0) {
            console.log(response.data.FeaturedBanner);

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

  const handleAddItemClick = (variants, title) => {
    if (variants.length === 1) {
      setVariants(variants);
      setTitle(title);
      setShowPopup(true);
    }
  };

  // handleVarientPopup

  const handleVarientPopup = (variants, title, itemId) => {
    setVariants({
      title: title,
      variants: variants,
      Item_Id: itemId,
    });

    setShowPopup(true);
  };

  const handleClosePopup = () => setShowPopup(false);

  const handleSortChange = (e) => {
    if (emptyItem) return;
    // setLoading(true);

    const sortBy = e.target.value;
    setSortOption(sortBy);
    

    let sortedProducts = [...filteredProducts];

    switch (sortBy) {
      case "PriceLowToHigh":
        sortedProducts.sort((a, b) => {
          const priceA = a.mrp - (a.mrp * a.discount_percentage_in_mrp) / 100;
          const priceB = b.mrp - (b.mrp * b.discount_percentage_in_mrp) / 100;
          return priceA - priceB;
        });
        break;
    
      case "PriceHighToLow":
        sortedProducts.sort((a, b) => {
          const priceA = a.mrp - (a.mrp * a.discount_percentage_in_mrp) / 100;
          const priceB = b.mrp - (b.mrp * b.discount_percentage_in_mrp) / 100;
          return priceB - priceA;
        });
        break;
    
      case "Discount":
        sortedProducts.sort((a, b) => b.discount_percentage_in_mrp - a.discount_percentage_in_mrp);
        break;
    
      case "Popularity":
      default:
        // No sorting needed — just keep the products as they are
        sortedProducts = [...filteredProducts];
        break;
    }
    
    
    setFilteredProducts(sortedProducts);
    
    setLoading(false);
  };

  const Breadcrumb = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const {
      Category_id,
      SubCategory_id,
      Sub_SubCategory_id,
      Category_name,
      SubCategory_name,
      Sub_SubCategory_name,
    } = location.state || {};

    return (
      <nav className="breadcrumb font-semibold text-gray-500 xl:text-[11px] ">
        <ul className="flex space-x-2">
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const state = {};
            if (index === 1) {
              state.Category_id = Category_id;
              state.Category_name = Category_name;
            } else if (index === 2) {
              state.Category_id = Category_id;
              state.Category_name = Category_name;
              state.SubCategory_id = SubCategory_id;
              state.SubCategory_name = SubCategory_name;
            } else if (index === 3) {
              state.Category_id = Category_id;
              state.Category_name = Category_name;
              state.SubCategory_id = SubCategory_id;
              state.SubCategory_name = SubCategory_name;
              state.Sub_SubCategory_id = Sub_SubCategory_id;
              state.Sub_SubCategory_name = Sub_SubCategory_name;
            }

            return (
              <li key={to}>
                <Link
                  to={to}
                  state={state}
                  className="text-gray-600 capitalize"
                >
                  {decodeURIComponent(value.replace("-", " "))}
                </Link>
                {index < pathnames.length - 1 && (
                  <span className="mx-2">some</span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand((prev) => {
      if (prev.includes(brand)) {
        // If brand is already selected, remove it
        return prev.filter((b) => b !== brand);
      } else {
        // Otherwise, add the brand
        return [...prev, brand];
      }
    });
  };

  // useEffect(() => {

  //   if (selectedBrand.length === 0) {
  //     setFilteredProducts(items); // Reset to all items if no brand is selected
  //   } else {
  //     const filteredItems = items.filter((item) =>
  //       selectedBrand.includes(item.brand)
  //     );
  //     setFilteredProducts(filteredItems);
  //   }
  // }, [selectedBrand]);

  const addItemToCart = async (
    variantId,
    purchase_item_id,
    Varient_type,
    stock_type,
    stock_id
  ) => {
    const login = localStorage.getItem("token");

    if (login) {
      console.log(filteredProducts);
      console.log(variantId);

      const filterItem = filteredProducts.find(
        (ele) => ele.sku_id == variantId
      );
      console.log(filterItem);
      

      if (filterItem) {
          console.log(Customer_userId);
          console.log(variantId);

          const response = await StoreItemToCart(
            Customer_userId,
            purchase_item_id,
            Varient_type,
            variantId,
            stock_type,
            stock_id
          );
          console.log(response);

          if (
            response &&
            response.data.message === "Item added to cart successfully."
          ) {
            dispatch(importCartItems(response.data.groceryItems));

            toast.success("Item added to cart successfully.");
          }
          else if (response && response.data.message == "address not found") {
            toast.warn("Please Set Address");
            console.log(response);

            navigate("/profile/addresses");
          }

         else if (response && response.data.message == "Out Of Stock") {
            toast.warn("Out Of Stock");
            console.log(response);
          }
          else{

            console.error(response.data.message || response.data.error);

            localStorage.removeItem("token");
            dispatch(logout());
            navigate("/");
          }
      }
    } else if (!login) {
      toast.warn("please login");
      console.log("not Login");
    }
  };

  const increaseQuantity = async (
    variantId,
    purchase_item_id,
    Varient_type,
    itemId
  ) => {
    // setLoading(true);
    const login = localStorage.getItem("token");

    if (!login) {
      toast.warn("Please Login!");
      return;
    }

    const filterItem = reduxcartItems.data.find(
      (ele) => ele.variant_sku_id == variantId
    );
    if (!filterItem) {
      console.log("Item not found");
      toast.warn("Item not found");
      return;
    }

    console.log(filterItem);

    console.log(reduxcartItems);

    dispatch(increaseCart({ variant_sku_id: filterItem.variant_sku_id }));

    const existingVariant = reduxcartItems.data.find(
      (ele) => ele.variant_sku_id == variantId
    );

    if (existingVariant) {
      try {
        const response = await IncreaseItemQuantityToCart({
          grocery_cart_Item_id: existingVariant.grocery_cart_Item_id,
          grocery_cart_id: existingVariant.grocery_cart_id,
          sku_id: variantId,
          purchase_item_id: purchase_item_id,
          Varient_type: Varient_type,
        });

        console.log(response);

        if (response) {
          if (
            response.data.message ==
            "Insufficient stock to increase item quantity"
          ) {
            dispatch(
              decreaseCart({ variant_sku_id: filterItem.variant_sku_id })
            );
            return toast.error(
              "Oops! Looks like we're fresher out of stock than a New Year's resolution!"
            );
          } else if (
            response.data.message == "Item quantity increased successfully"
          ) {
            dispatch(importCartItems(response.data.groceryItems));
            toast.success(response.data.message);
          } else if (
            response.data.error == "limit order is greater than newQuantity"
          ) {
            console.log("out OF LIMIT ...... ");
            console.log(response);
            setLoading(false);

            dispatch(
              decreaseCart({ variant_sku_id: filterItem.variant_sku_id })
            );
            return toast.error("Out Of Limit");
          } else {
            setLoading(false);
            dispatch(
              decreaseCart({ variant_sku_id: filterItem.variant_sku_id })
            );

            console.log("Y Chaala");
            

            

                     
             toast.error(response.data.message || response.data.error);

            //  localStorage.removeItem("token");
            //  dispatch(logout());
            //  navigate("/");
          }
        }
      } catch (error) {
        setLoading(false);
        dispatch(decreaseCart({ variant_sku_id: filterItem.variant_sku_id }));

        logger.error("Error increasing item quantity:", error);
        

        // localStorage.removeItem("token");
        // dispatch(logout());
        // navigate("/");
      }

      setLoading(false);
    } else {
      dispatch(decreaseCart({ variant_sku_id: filterItem.variant_sku_id }));
    }
  };

  const decreaseQuantity = async (
    variantId,
    purchase_item_id,
    Varient_type,
    itemId
  ) => {
    console.log(variantId);
    console.log(purchase_item_id);
    console.log(Varient_type);

    const login = localStorage.getItem("token");

    if (!login) {
      console.log("User not logged in");
      return;
    }

    const filterItem = reduxcartItems.data.find(
      (ele) => ele.variant_sku_id == variantId
    );
    if (!filterItem) {
      console.log("Item not found");
      return;
    }
    console.log(filterItem);

    dispatch(decreaseCart({ variant_sku_id: filterItem.variant_sku_id }));

    try {
      const response = await DecreaseItemQuantityToCart({
        grocery_cart_Item_id: filterItem.grocery_cart_Item_id,
        grocery_cart_id: filterItem.grocery_cart_id,
        sku_id: variantId,
        purchase_item_id: purchase_item_id,
        Varient_type: Varient_type,
      });
      console.log(response);

      if (response && response.data.groceryItems) {
        dispatch(importCartItems(response.data.groceryItems));
        toast.success(response.data.message);
      } else {
        dispatch(addCart({ variant_sku_id: filterItem.variant_sku_id }));
        
        console.error(response.data.message || response.data.error);
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      console.error("Error decreasing item quantity:", error);
      dispatch(addCart({ variant_sku_id: filterItem.variant_sku_id }));
      

      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/");
    }
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
      <div className="max-h-screen">
        <LoadingModal />
      </div>
    );

  return (
    <div className="flex  mt-14 xl:mt-0 ">
      {/* Sidebar */}
      <div className="py-4">
        <ItemsSidebar
          brands={selectedBrand}
          onBrandChange={handleBrandChange}
        />
      </div>

      {/* Main Content */}
      <div className=" flex flex-col gap-4 border p-4 w-full">
        <div className="bg-white px-4">
          {/* <Breadcrumb /> */}
          <h1 className="font-semibold border-b pb-4 mb-4 mt-4">
            {categoryName || "Grocery"}
          </h1>

          {/* Sort By */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-inter text-sm">
              Showing {filteredProducts.length} products
            </span>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="font-medium">
                Sort By:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={handleSortChange}
                className="p-2 border border-gray-300 rounded-md focus:outline-none"
              >
                <option value="Popularity">Popularity</option>
                <option value="PriceLowToHigh">Price -- Low to High</option>
                <option value="PriceHighToLow">Price -- High to Low</option>
                <option value="Discount">Discount</option>
              </select>
            </div>
          </div>

          {emptyItem && (
            <EmptyState className="mb-28">
              "We're sorry, but it looks like there are no items available in
              this category at the moment. Please check back later or try
              browsing through other categories for more options. If you believe
              this is an error, feel free to refresh the page or contact our
              support team for assistance. Thank you for your understanding!"
            </EmptyState>
          )}

          {/* listing */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
            {!emptyItem &&
              filteredProducts.map((product) => {

                const discountedPrice = (
                  product.mrp -
                  (product.mrp * product.discount_percentage_in_mrp) /
                    100
                ).toFixed(2);

                return (
                  <div
                    // onClick={() => handleProductClick(product)}
                    key={`${product.sku_id}${product.variantName}`}

                    className="bg-white border rounded-md p-3 hover:shadow-sm transition-shadow cursor-pointer"
                  >
                  {console.log(product)}
                  
                    <Link
                      to={`/grocery/${product?.category?.categoryName}/${product?.category?.subCategoryName}/${product?.category?.subSubCategoryName}/${product.Modal_Item_id}/${product.variant_id}`}
                      state={{
                        
                        Variantid: product.variant_id,
                        Varient_type: product.Varient_type,
                        purchase_item_id : product.purchase_item_id,
                        stock_id : product.stock_id,

                      }}
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden rounded-md">
                        <img
                          src={product.images[0] || "placeholder-image-url"}
                          alt={product.variantName || "No title"}
                          className="mx-auto h-44 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          {product.stock_type}
                        </div>
                      </div>

                      {/* Product Details */}
                      <h2 className="text-[14px] mt-2 line-clamp-2">
                        {product.brand} {product.variantName}
                      </h2>

                      {/* Price Details in Single Line */}
                      <div className="flex items-center text-sm mt-1">
                        <div className="text-gray-800 font-semibold flex items-center">
                          <FaIndianRupeeSign />
                          {discountedPrice}
                        </div>

                       {product.discount_percentage_in_mrp > 0 && <div className="line-through text-gray-500 ml-2">
                          ₹{product.mrp}
                        </div>}

                       {product.discount_percentage_in_mrp > 0 && <div className="text-green-600 ml-2">
                          { Math.round(product.discount_percentage_in_mrp)}% Off
                        </div>}
                      </div>
                    </Link>

                    {/* Buttons */}
                    <div className="flex mt-2">
                      <button
                        className={`flex-1 text-xs border rounded px-1 py-1 text-gray-700 hover:bg-gray-100 ${product.Variants.length > 1 ? "cursor-pointer" : "cursor-not-allowed"}`}
                        onClick={() =>
                          product.Variants.length > 1  &&   handleVarientPopup(
                            product.Variants,
                            product.ItemName,
                            product.sku_id
                          )
                        }
                      >
                        {product.Variants.length > 1 ? (
                    <div >
                         <span className="text-[14px] font-semibold">{product['quantity/pct']}</span>
                            <MdKeyboardArrowDown className="inline-block ml-1 text-xs" />
                    </div>
                          
                        ) : <div >     <span className="text-[14px] font-semibold">{product['quantity/pct']}</span>  </div>}
                      </button>

                      {isInCart(product.sku_id) ? (
                        <div className="flex flex-1 items-center justify-between bg-gray-200 rounded ml-2">
                          <button
                            className="px-2 py-1 text-xs hover:bg-gray-300 rounded-l"
                            onClick={() =>
                              decreaseQuantity(
                                product.sku_id,
                                product.purchase_item_id,
                                product.Varient_type
                              )
                            }
                          >
                            -
                          </button>
                          <span className="px-2">
                            {getQuantityByVariantId(product.sku_id)}
                          </span>
                          <button
                            className="px-2 py-1 text-xs hover:bg-gray-300 rounded-r"
                            onClick={() =>
                              increaseQuantity(
                                product.sku_id,
                                product.purchase_item_id,
                                product.Varient_type
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="flex-1 bg-blue-500 text-white text-xs rounded p-1 py-2 ml-2 hover:bg-blue-600"
                          onClick={() =>
                          localStorage.getItem("token") ?  addItemToCart(
                              product.sku_id,
                              product.purchase_item_id,
                              product.Varient_type,
                              product.stock_type,
                              product.stock_id
                            ) : dispatch(activePages({ login: true }))
                          }
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Popup Modal */}
          {showPopup && (
            <div className="popup-overlay fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50">
              <div className="popup-content bg-white rounded-xl shadow-2xl p-6 max-w-full sm:max-w-md md:max-w-lg lg:max-w-3xl max-h-[80vh] overflow-y-auto relative transition-transform transform scale-95 ">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {variants.ItemName && variants.ItemName}
                </h2>
                <h3 className="text-md text-gray-500 mb-4">
                  {variants.stock_type}
                </h3>

                {variants.variants &&
                  variants.variants.map((ele, index) => (
                    <div
                      key={index}
                      className="variant-card mb-4 p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row items-center bg-gray-50 hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Image */}
                      <img
                        src={ele.images[0]}
                        alt={ele.ItemName || "No title"}
                        className="w-20 h-20 object-cover mb-4 md:mb-0 md:mr-6 rounded-md shadow-sm"
                      />

                      <div className="variant-details flex-1">
                        {/* Item name */}
                        <h3 className="text-lg font-semibold text-gray-800">
                          {`${ele["variantName"]}`}
                        </h3>

                        {/* Quantity */}
                        {/* <p className="text-sm text-gray-600 mt-1">
                      {`${ele["quantity/pct"]}`}
                      </p> */}

                        {/* Final price and MRP */}
                        <div className="flex items-center space-x-4 mt-2">
                          {/* Selling price */}
                          <div className="flex items-center text-lg font-semibold text-gray-700">
                            <FaIndianRupeeSign className="mr-1 text-gray-700" />
                            {console.log(
                              ele?.mrp,
                              ele?.discount_percentage_in_mrp
                            )}
                            <span>
                              {ele.mrp -
                                ele.discount_percentage_in_mrp / 100 || "N/A"}
                            </span>
                          </div>

                          {/* MRP (Cutted price) */}
                          {ele.mrp ? (
                            <div className="flex items-center text-sm text-gray-500">
                              <FaIndianRupeeSign className="mr-1 text-gray-500" />
                              <span className="line-through">
                                {ele.mrp || "N/A"}
                              </span>
                            </div>
                          ) : null}
                        </div>

                        {/* Price per unit */}
                        {/* <p className="text-sm text-gray-500 mt-1">
                        @
                        {ele.unit
                          ? `${ele.packet_varient_price_per_unit} / ${ele.packet_varient_sell_unit}`
                          : ele.loose_price_per_unit && ele.loose_product_unit
                          ? `${ele.loose_price_per_unit} / ${ele.loose_product_unit}`
                          : "N/A"}
                      </p> */}
                      </div>

                      {/* Add to Cart / Quantity control */}
                      <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-center justify-center">
                        {console.log(isInCart(ele.sku_id))}
                        {isInCart(ele.sku_id) ? (
                          <div className="flex items-center">
                            <button
                              className="bg-gray-200 px-3 py-1 rounded-l-md hover:bg-gray-300 transition-colors duration-200"
                              onClick={() => decreaseQuantity(   ele.sku_id,
                                ele.purchase_item_id,
                                ele.Varient_type)}
                            >
                              -
                            </button>
                            <span className="px-4 py-1 text-gray-700">
                              {getQuantityByVariantId(ele.sku_id)}
                            </span>
                            <button
                              className="bg-gray-200 px-3 py-1 rounded-r-md hover:bg-gray-300 transition-colors duration-200"
                              onClick={() => increaseQuantity(
                                ele.sku_id,
                                ele.purchase_item_id,
                                ele.Varient_type
                              )}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            className="py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                            onClick={() => addItemToCart(


                              ele.sku_id,
                              ele.purchase_item_id,
                              ele.Varient_type,
                              ele.stock_type,
                              ele.stock_id



                            )}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                <button
                  className="absolute top-2 right-2 bg-gray-300 text-gray-700 p-2 rounded-full hover:bg-gray-400 transition duration-200"
                  onClick={handleClosePopup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductListingPage;
