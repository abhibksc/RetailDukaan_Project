import { useEffect, useRef, useState } from "react";
import useTruncateSentance from "../../../UseFullHooks/useTruncateSentance";
import LoadingModal from "../../../LoadingModal";
import {
  getDesktopHomeManagementCategoryListingsInCustomerUI,
  getDesktopHomeManagementGroupInCustomerUI,
} from "../../../CrudOperations/GetOperation";
import { useDispatch, useSelector } from "react-redux";
import { savePageState } from "../../../ReduxStore/Slices/pageStateSlice";
import { useLocation } from "react-router-dom";

const SubCatListing = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { truncateText } = useTruncateSentance();
  const scrollRefs = useRef([]);
  const [isHovered, setIsHovered] = useState([]);
  const [currentIndexes, setCurrentIndexes] = useState([]);
  const [GroupId, setGroupID] = useState("");
  const [GroupName, setGroupName] = useState("");

  const locationData = useLocation();
     (locationData);

  // Get saved state for this page if exists
  const savedState =
    useSelector((state) => state.pageStateSlice[locationData.pathname]) || null;
  const dispatch = useDispatch();
     (savedState);
     (locationData);
  

  useEffect(() => {
       (savePageState);

    if (savedState?.groupid && savedState?.groupname) {
         (savedState);

      setGroupID(savedState?.groupid);
      setGroupName(savedState?.groupname);
    } else {
      if (locationData.state) {
        setGroupID(locationData.state.groupid);
        setGroupName(locationData.state.groupname);

        dispatch(
          savePageState({
            path: locationData.pathname,
            componentState: {
              groupid: locationData.state.groupid,
              groupname: locationData.state.groupname,
            },
          })
        );
      }
    }
  }, [locationData.pathname, locationData.state, savedState, dispatch]);

  useEffect(() => {
    if (GroupId) {
      const fetchHomeManagementCategory = async () => {
        // try {
        //   const response =
        //     await getDesktopHomeManagementCategoryListingsInCustomerUI(GroupId);
        //      (response);

        //   if (
        //     response?.data?.message ===
        //     "Desktop Home Management Categories List retrieved successfully."
        //   ) {
        //        (response);

        //     setCategories(response.data.Home_Management || []);
        //     setIsHovered(
        //       new Array(response.data.Home_Management.length).fill(false)
        //     );
        //     setCurrentIndexes(
        //       new Array(response.data.Home_Management.length).fill(0)
        //     );
        //   }
        // } catch (error) {
        //   console.error("Error fetching data:", error);
        // }
      };
      fetchHomeManagementCategory();
    }
  }, [GroupId]);

  // Auto scroll every 5 seconds, pause on hover, infinite loop
  useEffect(() => {
    const interval = setInterval(() => {
      categories.forEach((category, idx) => {
        if (!isHovered[idx]) {
          const container = scrollRefs.current[idx];
          if (container) {
            const scrollAmount = container.clientWidth; // scroll by full container width (view)
            // Check if we've scrolled near the end
            if (
              container.scrollLeft + scrollAmount >=
              container.scrollWidth - container.clientWidth / 2
            ) {
              // Scroll back to start for infinite loop effect
              container.scrollTo({ left: 0, behavior: "smooth" });
              setCurrentIndexes((prev) => {
                const copy = [...prev];
                copy[idx] = 0;
                return copy;
              });
            } else {
              // Scroll next "page"
              container.scrollBy({ left: scrollAmount, behavior: "smooth" });
              setCurrentIndexes((prev) => {
                const copy = [...prev];
                copy[idx] = copy[idx] + 1;
                return copy;
              });
            }
          }
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [categories, isHovered]);

  if (loading) {
    return (
      <div className="max-h-screen">
        <LoadingModal />
      </div>
    );
  }

  // Calculate how many items fit in view for dots count (based on min-width of items)
  // Here approximate 5 items per screen on large screens
  const itemsPerView = {
    default: 1, // mobile (min-w 80%)
    sm: 2, // sm:min-w 40%
    md: 4, // md:min-w 25%
    lg: 5, // lg:min-w 20%
    xl: 6, // xl:min-w 16.66%
  };

  // Helper function for dots count per category
  const getDotsCount = (categoryLength) => {
    // We'll assume largest viewport for dot count since scroll width = container width
    const perView = itemsPerView.lg;
    return Math.ceil(categoryLength / perView);
  };

  return (
    <div className="max-w-full bg-gray-100 border rounded-md">
      {   (categories)}
      {categories.length > 0 ? (
        categories.map((category, index) => (
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
              {/* Scrollable Container */}
              <div
                ref={(el) => (scrollRefs.current[index] = el)}
                className="flex overflow-x-auto space-x-4 scrollbar-hide px-8 scroll-smooth"
              >
                {category.subcat.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="
                      flex-shrink-0 p-2
                      min-w-[80%] sm:min-w-[40%] md:min-w-[25%]
                      lg:min-w-[20%] xl:min-w-[16.66%]
                    "
                  >
                    <div className="bg-white rounded-xl shadow-md border flex flex-col items-center justify-center space-y-2 h-52 hover:shadow-lg transition-all duration-300">
                      <img
                        src={item.Subcat_image}
                        alt={item.Subcat_name}
                        className="w-20 h-20 rounded-sm  object-contain"
                      />
                      <h4 className="font-medium text-center text-sm line-clamp-2">
                        {truncateText(item.Subcat_name, 40)}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots indicators */}
              {/* <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: getDotsCount(category.Categories.length) }).map(
                  (_, dotIndex) => (
                    <button
                      key={dotIndex}
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        currentIndexes[index] === dotIndex
                          ? "bg-gray-800"
                          : "bg-gray-400"
                      }`}
                      onClick={() => {
                        const container = scrollRefs.current[index];
                        if (container) {
                          const scrollAmount = container.clientWidth;
                          container.scrollTo({
                            left: dotIndex * scrollAmount,
                            behavior: "smooth",
                          });
                          setCurrentIndexes((prev) => {
                            const copy = [...prev];
                            copy[index] = dotIndex;
                            return copy;
                          });
                        }
                      }}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                    />
                  )
                )}
              </div> */}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No categories available.</p>
      )}
    </div>
  );
};

export default SubCatListing;
