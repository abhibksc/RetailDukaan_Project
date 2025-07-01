import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { getDesktopHomeManagementCategoryInCustomerUI } from "../CrudOperations/GetOperation";
import { MdKeyboardArrowDown } from "react-icons/md";
import { DecreaseItemQuantityToCart, IncreaseItemQuantityToCart, StoreItemToCart } from "../CrudOperations/PostOperation";
import { useDispatch, useSelector } from "react-redux";
import { decreaseCart, importCartItems, increaseCart } from "../ReduxStore/Slices/cartSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { activePages, logout } from "../ReduxStore/Slices/auth";
import LoadingModal from "../LoadingModal";
import useTruncateSentance from "../UseFullHooks/useTruncateSentance";

const HomeManagementCategory = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);
  const Customer_userId = useSelector((state) => state.auth.Customer_userId); 
  const [loading, setLoading] = useState(false);


      const categories = useSelector( (state) => state.homeSlice_reducer.desktop_homeManagement_category);
     (categories);

  const {truncateText} =  useTruncateSentance()


  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true, // Enable automatic sliding
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 6, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 560, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    ],
  };

  const addItemToCart = async (
    variantId,
    purchase_item_id,
    Varient_type,
    stock_type,
    stock_id,
    Items
  ) => {
    const login = localStorage.getItem("token");

    if (login) {

      const filterItem = Items.find((ele) => ele.sku_id == variantId);
         (filterItem);

      if (filterItem) {

        const response = await StoreItemToCart(
          Customer_userId,
          purchase_item_id,
          Varient_type,
          variantId,
          stock_type,
          stock_id
        );

        if (
          response &&
          response.data.message === "Item added to cart successfully."
        ) {
          dispatch(importCartItems(response.data.groceryItems));

          toast.success("Item added to cart successfully.");
        } else if (response && response?.data?.message === "Address not found") {
          toast.warn("Please Set Address");

          navigate("/profile/addresses");
        } else if (response && response.data.message == "Out Of Stock") {
          toast.warn("Out Of Stock");
        } 
        
        else {

          toast.warn(response.data.message || response.data.error);

          localStorage.removeItem("token");
          dispatch(logout());
          navigate("/");
        }
      }
    } else if (!login) {
      toast.warn("please login");
         ("not Login");
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
         ("Item not found");
      toast.warn("Item not found");
      return;
    }

       (filterItem);

       (reduxcartItems);

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

           (response);

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
               ("out OF LIMIT ...... ");
               (response);
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

            console.error(response.data.message || response.data.error);

            toast.error(response.data.message || response.data.error);

            localStorage.removeItem("token");
            dispatch(logout());
            navigate("/");
          }
        }
      } catch (error) {
        setLoading(false);
        console.error("Error increasing item quantity:", error);
        dispatch(decreaseCart({ variant_sku_id: filterItem.variant_sku_id }));

        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/");
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
       (variantId);
       (purchase_item_id);
       (Varient_type);

    const login = localStorage.getItem("token");

    if (!login) {
         ("User not logged in");
      return;
    }

    const filterItem = reduxcartItems.data.find(
      (ele) => ele.variant_sku_id == variantId
    );
    if (!filterItem) {
         ("Item not found");
      return;
    }
       (filterItem);

    dispatch(decreaseCart({ variant_sku_id: filterItem.variant_sku_id }));

    try {
      const response = await DecreaseItemQuantityToCart({
        grocery_cart_Item_id: filterItem.grocery_cart_Item_id,
        grocery_cart_id: filterItem.grocery_cart_id,
        sku_id: variantId,
        purchase_item_id: purchase_item_id,
        Varient_type: Varient_type,
      });
         (response);

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
      dispatch(increaseCart({ variant_sku_id: filterItem.variant_sku_id }));

      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/");
    }
  };

  const isInCart = (itemId) => {

    if (reduxcartItems && reduxcartItems.data.length > 0) {

      return reduxcartItems.data.some((ele) => ele.variant_sku_id == itemId);
    }
  };

  const getQuantityByVariantId = (variantId) => {
    const item = reduxcartItems.data.find(
      (item) => item.variant_sku_id == variantId
    );

    return item ? item.quantity : 0; // Return quantity or default to 0
  };

  const itemTemplate = (item , CategoriesItem) => (
    <div className="p-2">
      <div className="rounded-xl shadow-lg p-3 border bg-white flex flex-col items-center">
        <Link
                      to={`/grocery/${item.category.categoryName}/${item.category.subCategoryName}/${item.category.subSubCategoryName}/${item.Modal_Item_id}/${item.variant_id}`}
                      state={{
                        Variantid: item.variant_id,
                        Varient_type: item.Varient_type || item.varient_type,
                        purchase_item_id: item.purchase_item_id,
                        stock_id: item.stock_id,
                      }}>
        <img
          src={item.images?.[0]}
          alt={item.variantName}
          className="w-32 h-32 object-contain mb-3"
        />

        <h4 className="font-medium text-sm text-center">{truncateText(item.variantName,2)}</h4>
        <p className="text-xs text-gray-500 mb-2 text-center">{item.brand}</p>
        <p className="font-semibold text-lg text-green-600 text-center">
          ₹{item.sellingPrice}
        </p>

        </Link>
        <div className="flex  w-full">
          {/* Buttons */}
          <div className="flex w-full mt-2">
            <button
              className={`flex-1 text-xs border rounded px-1 py-1 text-gray-700 ${
                "cursor-not-allowed"
              }`}
            >
              <div>
                {" "}
                <span className="text-[14px] font-semibold ">
                  {item["quantity/pct"]}
                </span>{" "}
              </div>
            </button>

            

            {isInCart(item.sku_id) ? (
              <div className="flex flex-1 items-center justify-between bg-gray-200 rounded ml-2">
                <button
                  className="px-2 py-1 text-xs hover:bg-gray-300 rounded-l"
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
                <span className="px-2">
                  {getQuantityByVariantId(item.sku_id)}
                </span>
                <button
                  className="px-2 py-1 text-xs hover:bg-gray-300 rounded-r"
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
            ) : (
              <button
                className="flex-1 bg-blue-500 text-white text-xs rounded p-1 py-2 ml-2 hover:bg-blue-600"
                onClick={() =>
                  localStorage.getItem("token")
                  ?  addItemToCart(
                    item.sku_id,
                    item.purchase_item_id,
                    item.Varient_type,
                    item.stock_type,
                    item.stock_id,
                    CategoriesItem
                  ) : dispatch(activePages({ login: true }))
                }
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );


  if (loading)
    return (
      <div className="max-h-screen">
        <LoadingModal />
      </div>
    );

  return (
    <div className="p-5 bg-gray-100">
      {categories?.length > 0 ? (
        categories?.map((category, index) => (
          <div key={index} className="mb-8  p-3">
            <h2 className="text-xl font-bold mb-4">{category?.CategoryTitle}</h2>
            <Slider {...settings}>
              {category?.Items?.map((item, itemIndex) => (
                <div key={itemIndex}>{itemTemplate(item,category?.Items)}</div>
              ))}
            </Slider>
          </div>
        ))
      ) : (
        <p className="text-center bg-green-500"></p>
      )}
    </div>
  );
};

export default HomeManagementCategory;
