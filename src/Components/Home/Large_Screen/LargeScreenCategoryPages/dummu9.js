import { useEffect, useRef, useState } from "react";
import useTruncateSentance from "../../../UseFullHooks/useTruncateSentance";
import LoadingModal from "../../../LoadingModal";
import { getDesktopHomeManagementCategoryListingsInCustomerUI } from "../../../CrudOperations/GetOperation";
import { useDispatch, useSelector } from "react-redux";
import { savePageState } from "../../../ReduxStore/Slices/pageStateSlice";
import { useLocation, useNavigate } from "react-router-dom";

const CategoryListings = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { truncateText } = useTruncateSentance();
  const scrollRefs = useRef([]);
  const [isHovered, setIsHovered] = useState([]);
  const [activeDots, setActiveDots] = useState([]);
  const [GroupId, setGroupID] = useState("");
  const [GroupName, setGroupName] = useState("");
  const navigate = useNavigate();

  const locationData = useLocation();
  const savedState =
    useSelector((state) => state.pageStateSlice[locationData.pathname]) || null;
  const dispatch = useDispatch();

  const itemsPerView = 5;

  useEffect(() => {
    if (savedState?.groupid && savedState?.groupname) {
      setGroupID(savedState.groupid);
      setGroupName(savedState.groupname);
    } else if (locationData.state) {
      const { groupid, groupname } = locationData.state;
      setGroupID(groupid);
      setGroupName(groupname);
      dispatch(
        savePageState({
          path: locationData.pathname,
          componentState: { groupid, groupname },
        })
      );
    }
  }, [locationData, savedState, dispatch]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!GroupId) return;
      setLoading(true);
      try {
        const response =
          await getDesktopHomeManagementCategoryListingsInCustomerUI(GroupId);
        if (
          response?.data?.message ===
          "Desktop Home Management Categories List retrieved successfully."
        ) {
          const fetched = response.data.Home_Management || [];
          setCategories(fetched);
          setIsHovered(new Array(fetched.length).fill(false));
          setActiveDots(new Array(fetched.length).fill(0));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [GroupId]);

  const smoothScroll = (container, itemWidth, idx, totalPages) => {
    if (isHovered[idx]) return;

    let scrollStepCounter = 0;
    const scrollSpeed = 10;
    const scrollSteps = itemsPerView * itemWidth;

    const scroll = () => {
      if (scrollStepCounter >= scrollSteps) return;

      container.scrollLeft += scrollSpeed;
      scrollStepCounter += scrollSpeed;
      requestAnimationFrame(scroll);
    };

    scroll();

    const currentPage = Math.floor(
      container.scrollLeft / (itemWidth * itemsPerView)
    );
    setActiveDots((prev) => {
      const copy = [...prev];
      copy[idx] = currentPage % totalPages;
      return copy;
    });
  };

  useEffect(() => {
    const intervals = [];

    categories.forEach((category, idx) => {
      const container = scrollRefs.current[idx];
      if (!container) return;

      // Clone for infinite effect
      if (container.children.length === category.subcat.length) {
        const clones = Array.from(container.children).map((child) =>
          child.cloneNode(true)
        );
        clones.forEach((clone) => container.appendChild(clone));
      }

      const itemElement = container.querySelector("div > div");
      if (!itemElement) return;

      const itemWidth = itemElement.offsetWidth + 16;
      const totalItems = category.subcat.length;
      const totalPages = Math.ceil(totalItems / itemsPerView);

      const interval = setInterval(() => {
        smoothScroll(container, itemWidth, idx, totalPages);
      }, 7000);

      intervals.push(interval);
    });

    return () => intervals.forEach(clearInterval);
  }, [categories, isHovered]);

  const onDotClick = (catIdx, pageIdx) => {
    const container = scrollRefs.current[catIdx];
    if (!container) return;

    const itemElement = container.querySelector("div > div");
    if (!itemElement) return;

    const itemWidth = itemElement.offsetWidth + 16;
    const scrollPosition = pageIdx * itemsPerView * itemWidth;

    container.scrollTo({ left: scrollPosition, behavior: "smooth" });

    setActiveDots((prev) => {
      const copy = [...prev];
      copy[catIdx] = pageIdx;
      return copy;
    });
  };

  const handleCat_product = (item, category) => {
    navigate(
      `/product/${GroupName}/${GroupId}/${category.categoryName}/${category.categoryID}/${item.Subcat_name}/${item.Subcat_id}`,
      {
        state: {
          type: "SubCategory",
          title: item.Subcat_name,
          id: item.Subcat_id,
        },
      }
    );
  };

  if (loading) return <LoadingModal />;

  return (
    <div className="max-w-full bg-gray-100 border rounded-md">
      {categories.length > 0 ? (
        categories.map((category, index) => {
          const totalItems = category.subcat.length;
          const totalPages = Math.ceil(totalItems / itemsPerView);
          const scrollable = totalItems > itemsPerView;

          return (
            <div key={index} className="mb-10 p-4">
              <h2 className="text-lg text-gray-800 font-semibold mb-4">
                {category.categoryName}
              </h2>

              <div
                className="relative"
                onMouseEnter={() =>
                  setIsHovered((prev) => {
                    const copy = [...prev];
                    copy[index] = true;
                    return copy;
                  })
                }
                onMouseLeave={() =>
                  setIsHovered((prev) => {
                    const copy = [...prev];
                    copy[index] = false;
                    return copy;
                  })
                }
              >
                <div
                  ref={(el) => (scrollRefs.current[index] = el)}
                  className="flex overflow-x-auto space-x-4 scrollbar-hide px-8 scroll-smooth"
                  style={{ scrollBehavior: "smooth" }}
                >
                  {category.subcat.map((item, itemIndex) => (
                    <div
                      onClick={() => handleCat_product(item, category)}
                      key={`original-${itemIndex}`}
                      className="flex-shrink-0 p-2 min-w-[20%] cursor-pointer"
                    >
                      <div className="bg-white rounded-xl shadow-md border flex flex-col items-center justify-center space-y-2 h-52 hover:shadow-lg transition-all duration-300">
                        <img
                          src={item.Subcat_image}
                          alt={item.Subcat_name}
                          className="w-20 h-20 rounded-sm object-contain"
                        />
                        <h4 className="font-medium text-center text-sm line-clamp-2">
                          {truncateText(item.Subcat_name, 40)}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dots */}
                {scrollable && (
                  <div className="flex justify-center space-x-2 mt-4">
                    {Array.from({ length: totalPages }).map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => onDotClick(index, dotIdx)}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          activeDots[index] === dotIdx
                            ? "bg-blue-600"
                            : "bg-gray-400"
                        }`}
                        aria-label={`Go to page ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                )}

                
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No categories available.</p>
      )}
    </div>
  );
};

export default CategoryListings;
