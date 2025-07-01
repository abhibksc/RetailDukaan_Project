import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import LoadingModal from "../LoadingModal";
import ItemsSidebar from "./ItemsSidebar";
import EmptyState from "../Animation/Empty";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductListing/ProductCard";
import baseurl from "../CrudOperations/customURl";
import { ChevronRight } from "lucide-react";

function ProductListingPage() {
  const Customer_userId = useSelector((state) => state.auth.Customer_userId);
  const AreaPin = useSelector((state) => state.auth.AreaPin);

  const [emptyItem, setEmptyItem] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category_Name, setCategoryName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [items, setItems] = useState([]);
  const [variants, setVariants] = useState([]);
  const [title, setTitle] = useState("");
  const [sortOption, setSortOption] = useState("Popularity");
  const [loading, setLoading] = useState(false);
  const [hunt, setHunt] = useState("");

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
    VariantId,
    pincode,
  } = useParams();

  console.log(subSubCategoryName);
  console.log(subSubCategory_id);
  console.log();

  const [groupedItems, setGroupedItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      let type = "";
      let id = "";

      if (subSubCategory_id) {
        type = "subsubcat";
        id = subSubCategory_id;
      } else if (subCategory_id) {
        type = "subcat";
        id = subCategory_id;
      } else if (category_id) {
        type = "cat";
        id = category_id;
      } else if (group_id) {
        type = "group";
        id = group_id;
      }

      if (!type || !id || !pincode) return;

      const res = await fetch(
        `${baseurl}/api/getVariants/${id}/${type}/${pincode}`
      );
      const data = await res.json();
      console.log(data);

      setItemCount(data?.variants?.length)
      

      const grouped = {};
      data.variants.forEach((variant) => {
        if (!grouped[variant.item_id]) {
          grouped[variant.item_id] = {
            ItemName: variant.ItemName,
            GroupId: variant.GroupId,
            variants: [],
          };
        }
        grouped[variant.item_id].variants.push(variant);
      });

      setGroupedItems(Object.values(grouped));
      setFilteredProducts(Object.values(grouped));
    };

    fetchData();
  }, [group_id, category_id, subCategory_id, subSubCategory_id, pincode]);

  const handleSortChange = (e) => {
    if (emptyItem) return;

    const sortBy = e.target.value;
    setSortOption(sortBy);

    let sortedProducts = [...filteredProducts];

    switch (sortBy) {
      case "PriceLowToHigh":
        sortedProducts.sort((a, b) => {
          const priceA = a.mrp - (a.mrp * a.discount) / 100;
          const priceB = b.mrp - (b.mrp * b.discount) / 100;
          return priceA - priceB;
        });
        break;

      case "PriceHighToLow":
        sortedProducts.sort((a, b) => {
          const priceA = a.mrp - (a.mrp * a.discount) / 100;
          const priceB = b.mrp - (b.mrp * b.discount) / 100;
          return priceB - priceA;
        });
        break;

      case "Discount":
        sortedProducts.sort((a, b) => b.discount - a.discount);
        break;

      case "Popularity":
      default:
        sortedProducts = [...filteredProducts];
        break;
    }

    setFilteredProducts(sortedProducts);
    setLoading(false);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  if (loading)
    return (
      <div className="min-h-screen">
        <LoadingModal />
      </div>
    );

  return (
    <div className="flex mt-14 xl:mt-0 min-h-screen">
      {/* Sidebar */}
      <div className="py-4 border h-screen">
        <ItemsSidebar
          brands={selectedBrand}
          onBrandChange={handleBrandChange}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4 border p-4 w-full">
        <div className="bg-white px-4">
          {/* 🧭 Modern Breadcrumb */}
          <div className="mt-4 mb-6 overflow-x-auto whitespace-nowrap text-sm text-gray-700">
            <div className="flex items-center space-x-1">
              <Link
                to="/"
                className="text-blue-600 hover:underline transition font-medium"
              >
                Home
              </Link>

              {groupName && group_id && pincode && (
                <>
                  <ChevronRight size={16} className="text-gray-400" />
                  <Link
                    to={`/product/${groupName}/${group_id}/${pincode}`}
                    className={`      ${
                      categoryName && category_id
                        ? "text-blue-600"
                        : "text-gray-900"
                    }        hover:underline transition font-medium truncate max-w-[150px]`}
                    title={groupName}
                  >
                    {groupName}
                  </Link>
                </>
              )}

              {categoryName && category_id && (
                <>
                  <ChevronRight size={16} className="text-gray-400" />
                  <Link
                    to={`/product/${groupName}/${group_id}/${categoryName}/${category_id}/${pincode}`}
                    className={`      ${
                      subCategoryName && subCategory_id
                        ? "text-blue-600"
                        : "text-gray-900"
                    }        hover:underline transition font-medium truncate max-w-[150px]`}
                    title={categoryName}
                  >
                    {categoryName}
                  </Link>
                </>
              )}

              {subCategoryName && subCategory_id && (
                <>
                  <ChevronRight size={16} className="text-gray-400" />
                  <Link
                    to={`/product/${groupName}/${group_id}/${categoryName}/${category_id}/${subCategoryName}/${subCategory_id}/${pincode}`}
                    className={`      ${
                      subSubCategoryName && subSubCategory_id
                        ? "text-blue-600"
                        : "text-gray-900"
                    }        hover:underline transition font-medium truncate max-w-[150px]`}
                    title={subCategoryName}
                  >
                    {subCategoryName}
                  </Link>
                </>
              )}

              {subSubCategoryName && subSubCategory_id && (
                <>
                  <ChevronRight size={16} className="text-gray-400" />
                  <span
                    className="text-gray-900 font-semibold truncate max-w-[150px]"
                    title={subSubCategoryName}
                  >
                    {subSubCategoryName}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-semibold border-b pb-4 mb-4">
            {category_Name || categoryName || "Grocery"}
          </h1>

          {/* Sort By */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-inter text-sm">
              Showing {itemCount} products
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

          {/* Empty Message */}
          {emptyItem && (
            <EmptyState className="mb-28">
              "We're sorry, but it looks like there are no items available in
              this category at the moment. Please check back later or try
              browsing through other categories for more options. If you believe
              this is an error, feel free to refresh the page or contact our
              support team for assistance. Thank you for your understanding!"
            </EmptyState>
          )}

          {/* Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {groupedItems.map((item, idx) => {
  const bestVariant = item.variants.find(
    (v) => v.is_deliveryable && v.is_Stock_Available
  );

  return (
    <React.Fragment key={idx}>
      {/* ✅ Main Card with full item & modal */}
      {bestVariant && (
        <ProductCard
          item={item}
          variant={bestVariant}
          showAllVariants={false}
        />
      )}

      {/* ✅ Other Variants: no modal, only flat cards */}
      {item.variants
        .filter((v) => v.sku_id !== bestVariant?.sku_id)
        .map((variant, subIdx) => (
          <ProductCard
            key={`${item.ItemName}-${subIdx}`}
            item={{ ...item, variants: [] }} // Clear variants intentionally
            variant={variant}
            showAllVariants={true}
          />
        ))}
    </React.Fragment>
  );
})}

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductListingPage;
